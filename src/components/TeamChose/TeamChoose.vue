<template>
    <div class="out">
        <div class="backimage"/>
        <div class="mask"/>

        <headNav style="z-index:1;"/>
        <div class="head">
            <teamHead></teamHead>
        </div>
        
        <n-scrollbar style="margin:0 97px;width:auto;padding:0 3px;">
        <div class="info">

            <projectList ref="getChildList"></projectList>

        </div>
         <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModalRef"
        :mask-closable="false"
        preset="dialog"
        title="收到新的邀请"
        positive-text="同意"
        negative-text="拒绝"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
      <n-form>
        <n-form-item label="邀请人:"  >
            {{name}}
        </n-form-item>
        <n-form-item label="邀请团队:"  >
            {{team}}
        </n-form-item>
      </n-form>
    </n-modal>
    </n-config-provider>
        </n-scrollbar>
    </div>
</template>

<script setup lang="ts">
import projectList from './ChooseList.vue'
import teamHead from './ChooseHead.vue'
import {ref,onMounted} from 'vue'
import { useRoute, useRouter} from 'vue-router';
import {darkTheme, useMessage} from "naive-ui"
import utils from '@/Utils'
import axios from 'axios'
import headNav from "@/components/headNav.vue"

const route= useRoute();
const message = useMessage();
const router = useRouter();
const theme = darkTheme
const headers = {
  Authorization: utils.getCookie('Authorization')
}

const  getChildList = ref<null | HTMLElement>(null);
let showModalRef = ref(false)
let code = ref('')
let name = ref('')
let team = ref('')
let teamMessage = ref()
const onPositiveClick = () =>{
    let url = '/team/invite/confirm/'+code.value
    axios.post(url,{},{headers:headers}).then(res=>{
        console.log(res.data)
        if(res.data.msg==="成功"){
            message.success("加入"+team.value+"团队成功！")
        }
        else{
            message.warning(res.data.msg)
        }
        //getChildList.value.getList()
        router.push('/')
    })
    showModalRef.value = false;
}
const onNegativeClick = () => {
    showModalRef.value = false;
}
onMounted(()=>{
    console.log(utils.getCookie('inviteCode'))
    if(utils.getCookie('Authorization')!='')
    {
        if(typeof(route.query.code)!="undefined" || utils.getCookie('inviteCode')!=null&&
        utils.getCookie('inviteCode')!=''){
            console.log("start verify code")
            if(typeof(route.query.code)!="undefined")
            code.value=route.query.code.toString();
            else{
                code.value  = utils.getCookie('inviteCode');
            }

        const url='/team/invite/info/'+code.value

        axios.get(url,{headers:headers}).then(res=>{
            if(res.data.msg==="成功"){
                team.value = res.data.data.team.name
                name.value = res.data.data.user.name
                teamMessage.value = res.data.data.team
                showModalRef.value = true;
            }
            else{
                //message.info("链接已失效")
            }
        })
        utils.clearCookie('inviteCode');
        }
    }
    else{
        utils.setCookie('inviteCode',route.query.code)
        router.push('/regisTer')
    }
    

})
</script>

<style scoped>
.backimage{
    width: 100%;
    height: 100%;
    position:absolute;

  z-index: -1;
  background-image: url("@/assets/teamfigure.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left;

}
.out{
    display:flex;
    flex-direction: column;

    width:100%;
    height: 100%;
}
.mask{
  z-index: -1;
  width: 100%;
  position: absolute;
  height: 100%;
  background-color: #16181Df0;
}
.head{
  z-index: 1;
    margin: 0 100px;
    /*width: 70%;*/
    border-bottom: 1px solid #414958;
}
.info{
  z-index: 1;
    /*height: 500px;
    width: 90%;
    margin:auto;
    margin-top: 30px;*/
    margin:20px 0;
}
</style>