<template>
    <div class="card" >
        <div class="img" @click="gotoProject" :style="'background-image:url('+imgUrl+');'">
        <!-- <img  style="width:240px;heigth:140px;object-fit: fill;" :src="imgUrl" /> -->
        </div>
        <div class="bottom">
            <!-- <div class="name"  v-if="!change">
                <n-input class="nameInput" autosize size="small" v-model:value="Name" />
            </div> -->
            <div class="name">
              <n-input class="nameInput" @change="changeName" @click="handleFocus" autosize size="small" ref="inputInstRef" v-model:value="Name" />
            </div>
            <Icon size="20" class="rename">
                <Edit16Regular  :focusable="false" @click="handleFocus"/>
            </Icon>
            <Icon size="20" class="rename">
                <Copy16Filled @click="copyThis"/>
            </Icon>
        </div>
        <div class="desc">
            创建于&nbsp;{{date}}
            <Icon size="20" class="del">
                <CloseRound @click="delThis"/>
            </Icon>
        </div>
    </div>
</template>
<script lang="ts">
import {CloseRound} from '@vicons/material'
import {EditTwotone, EditOutlined} from '@vicons/antd'
import {Edit16Regular} from '@vicons/fluent'
import {Copy16Filled} from '@vicons/fluent'
import {Icon} from '@vicons/utils'
import {defineComponent,onMounted,ref,computed,watch} from 'vue'
import router from '@/router';
import {useRoute} from 'vue-router'
import utils from '../Utils'
import { InputInst, useMessage } from 'naive-ui'
import axios from 'axios'

export default defineComponent({
  name: 'PageCard',
  props: {
    name: String,
    img: String,
    date: String,
    id: {
      default: 0
    },
  },
  components: {
    CloseRound,
    Icon,
    Edit16Regular,
    Copy16Filled
  },
  setup(props, {emit}) {
    const imgUrl = ref('')
    const message = useMessage()
      const headers = {
        Authorization: utils.getCookie('Authorization')
      }
    let Name = ref(props.name)
    let change = ref(false)
    const route = useRoute()
    const inputInstRef = ref<InputInst | null>(null);
    const gotoProject = () => {
      console.log("我要的团队名称呢?"+Name.value)
      utils.setCookie('proNAME', Name.value)
      utils.setCookie('proID', props.id)
      
      utils.setCookie('proIMG', props.img)
      utils.setCookie('proTeam', route.query.teamID)
      console.log("我要的团队名称呢?2"+utils.getCookie('proNAME'))
      router.replace({name: 'project', query:{teamID: route.query.teamID}})
    }
    const renameThis = () => {
      event.stopPropagation();
      console.log("rename" + props.id)
      emit("rename")
    }
    const delThis = () => {
      event.stopPropagation();
      console.log("del" + props.id)
      emit("del")
    }
    const copyThis = () => {
      event.stopPropagation();
      console.log("copy"+props.id)
      emit("copy")
    }
    
    const changeName = () => {
      if(props.name!=Name.value)
      axios.put("/program", {
              "ID": props.id,
              "src": props.img,
              "name": Name.value
              }, {headers: headers}).then(res => {

              if (res.data.msg === "成功") {
                message.info("修改成功")
              } else {
                message.error("修改失败")
              }
              })
              else{
                message.info("无修改")
              }
    }
    const getGlobal = computed(() => {
      return props.name
    })
    watch(getGlobal, (newVal, oldVal) => {
        Name.value=newVal

      }, {immediate: true, deep: true})
    onMounted(()=>{
      imgUrl.value=props.img
      Name.value=props.name
      // if(imgUrl.value===''){
      //   imgUrl.value='../assets/teamfigure.jpg'
      // }

    })
    return {
      imgUrl,
      changeName,
      headers,
      message,
      Name,
      inputInstRef,
      handleFocus () {
        change.value=!change.value;
        inputInstRef.value?.select()
      },
      gotoProject,
      renameThis,
      delThis,
      copyThis,
      route,
      change
    }
  },
})
</script>

<style scoped>
.nameInput{
  min-width: 100px;background-color: #16181d;
}
* {
  transition: 0.2s;
}
.card{
    width: 240px;
    height: 190px;
    padding: 5px 30px;
    /*background-color: #2B303B;*/
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    border: 1px solid #414958;
}
.card:hover{
    background: #2B303B;
    border: 1px solid #A7AFBE;
    cursor:pointer;
}

.card:hover .del, .card:hover .rename {
  display: flex;
}
.img{
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  
    width:100%;
    height: 140px;
    overflow: hidden;
    background-color: #A7AFBE;
    box-shadow: inset 0px -2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
}
.bottom{
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: nowrap;
    /*padding: 0 40px;*/
    width:100%;
    height: 32px;
    align-items: center;
}
.name{
    display:block;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 32px;
    text-overflow:ellipsis;

  overflow: hidden;
  white-space: nowrap;

  color: #E2E4E9;
}

.del, .rename {
  color: #A7AFBE;
  display: none;
}

.desc {
  display: flex;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

    color:#A7AFBE;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    /*padding: 0 40px;*/
    
    justify-content: space-between;
    flex-wrap: nowrap;
    flex-direction: row;
}
</style>