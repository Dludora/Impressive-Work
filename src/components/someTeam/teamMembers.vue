<template>
<div class="out">
  <div class="list">
    <div class="top">
      共有 {{members.length}} 名成员
    </div>
    <div v-for="member in members" :key="member.ID" class="member-card">
      <div class="left" style="display:flex;align-items: center;flex: 1;">
        <div class="avatar" :style="'background-color:'+member.src+';'">{{ member.nickname[0] }}</div>
        <div class="member-message">
          <p id="name">{{ member.nickname }}({{ member.name }})</p>
          <p id="email">{{ member.email }}</p>
        </div>
      </div>
      <div class="tag" style="flex: 2; line-height: 50px; text-align: center;">
        <n-config-provider :theme="theme">
          <n-tag type="success" size="large" round v-if="member.identify===2">
            创建者
          </n-tag>
          <n-tag type="warning" round v-else-if="member.identify===1">
            管理员
          </n-tag>
          <n-tag type="error" round v-else>
            成员
          </n-tag>
        </n-config-provider>
      </div>
      <div class="member-operate" style="flex: 3">
        <Icon style="margin-right:8px" class="star"
              size="24" color="#FFFFFF" v-if="showAdmin(member.identify) === 1">
          <UserAdmin @click="admin(member.ID, member.identify)"/>
        </Icon>
        <Icon style="margin-right:8px" class="star"
              size="24" color="#FFFFFF" v-if="showAdmin(member.identify) === 2">
          <UserX @click="admin(member.ID, member.identify)"/>
        </Icon>
        <Icon v-if="showRemove(member.identify)" @click="displayDel(member.ID,member.nickname)" id="close" size="32" color="#FFFFFF">
          <CloseOutline/>
        </Icon>
      </div>
    </div>
    <div class="member-add " @click="displayMedal">
      <div class="add-icon">
        <Icon size="36" id="add">
          <PlusOutlined/>
        </Icon>
      </div>
      <a  id="invite">生成邀请链接</a>
    </div>
  </div>
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModalRef"
        :mask-closable="false"
        preset="dialog"
        title="邀请链接"

        negative-text="确认"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
      <n-form>
        <n-form-item label="链接24h内有效"  :render-feedback="formatFeedback">
            
          <n-input ref="inputInstRef" id="url" v-model:value="inviteUrl" type="textarea" autosize @keydown.enter.prevent placeholder="正在生成链接...">
          <template #suffix>
              <div class="copyButton">
                <Icon size="20" class="rename">
                <Copy16Filled @click="copyUrl"/>
            </Icon>
              </div>
          </template>
          </n-input>
        </n-form-item>
      </n-form>
    </n-modal>
    <n-modal
        v-model:show="showModalRefDel"
        :mask-closable="false"
        preset="dialog"
        :title="'是否确认删除 '+nickDel"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClickDel"
        @negative-click="onNegativeClickDel"
    >

    </n-modal>
  </n-config-provider>
</div>
</template>

<script setup lang="ts">
import {PlusOutlined} from "@vicons/antd";
import {UserCertification} from "@vicons/carbon";
import {UserAdmin} from "@vicons/carbon"
import {UserX} from "@vicons/tabler"
import {CloseOutline} from "@vicons/ionicons5"
import {Icon} from "@vicons/utils";
import axios from 'axios'
import {onMounted, ref, computed, watch, h} from 'vue'
import {useRoute} from 'vue-router'
import utils from '../../Utils'
import {darkTheme,useMessage,InputInst} from "naive-ui"
import {Copy16Filled} from '@vicons/fluent'


// 寇书瑞改动的部分
const myID = ref(utils.getCookie('userID'))
const myIdentify = ref(0)
const theme = darkTheme
// 在这里结束
const route = useRoute();
const message = useMessage();
let showModalRef = ref(false)
let showModalRefDel = ref(false)
let teamID = ref()
let Email = ref('')
let email = ref('')
let opUserID = ref()
let isAdmin = ref(0)
let inviteUrl = ref('')
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const displayMedal = () => {

  getUrl()
  showModalRef.value = true
}
const onPositiveClick = () => {
  console.log("Identity:" + utils.getCookie('Authorization'))
  let url = '/team/' + route.query.teamID + '/invite?email=' + Email.value
  axios.put(url, {}, {headers: headers}).then(res => {
    message.info(res.data.msg)
    getList()
  })
  showModalRef.value = false
}
let IDdel = ref(null)
let nickDel = ref('')
const inputInstRef = ref<InputInst | null>(null);

const onPositiveClickDel = () => {
  remove(IDdel.value);
  showModalRefDel.value = false
}
const onNegativeClick = () => {
  showModalRef.value = false
};
const onNegativeClickDel = () => {
  showModalRefDel.value = false
};
const displayDel = (ID,nick) => {
  nickDel.value = nick;
  showModalRefDel.value = true;
  IDdel.value = ID;
}
const copyUrl = () => {
  const input = document.getElementById('url')! as any
  inputInstRef.value?.select()
  document.execCommand('copy')
message.success("复制成功")

}
const getUrl = () => {
    let url = '/team/invite/code?teamID='+route.query.teamID+'&maxNum=5'
    let base = 'http://selmiss.xyz/teamchoose?code='
    axios.get(url,{headers:headers}).then(res=>{
      if(res.data.msg==='成功'){
        console.log(res.data)
         inviteUrl.value=base+res.data.data
      }
      else{
        message.warning("获取链接失败,请重试")
      }
    })
}
const members = ref([
  {
    ID: 0,
    nickname: '加载成员中...',
    name: '',
    email: '请宝贝耐心等待~',
    identify: 0,
    src:'',
  },

])
const formatFeedback = (raw: string | undefined) => {
  h('div', {style: 'color: green'}, [raw + '而且是绿的'])
}
const ruleEmail = {
  required: true,
  validator() {
    if (email.value.length === 0) {
      return new Error("邮箱不能为空")
    } else {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(email.value)) {
        return new Error('请输入有效的邮箱')
      }
    }
  },
  trigger: ['input', 'blur']
}
const getList = () => {
  let url = '/team/' + route.query.teamID + '/members?page=0&size=20'
  axios.get(url, {headers: headers}).then(res => {
    console.log(res.data)
    members.value = res.data.data.items
    console.log(members.value)
  })
  url = '/team/' + route.query.teamID + '/member/' + myID.value + '/info'
  console.log(url)
  console.log('url')
  axios.get(url, {headers: headers}).then(res => {
    myIdentify.value = res.data.data.identify
  })
}
const invite = () => {
  console.log("身份验证 " + utils.getCookie('Authorization'))
  let url = '/team/' + route.query.teamID + '/invite?email=' + email.value
  axios.put(url, {}, {headers: headers}).then(res => {
    console.log(res.data)
    message.info(res.data.msg)
  })
}
// 改动的地方
const showRemove = (identify) => {
  if (myIdentify.value === 2 && identify <= 1) {
    return true;
  } else if (myIdentify.value === 1 && identify <= 0) {
    return true;
  } else {
    return false;
  }
}
const remove = (ID) => {
  opUserID.value = ID
  let url = '/team/' + route.query.teamID + '/remove?userID=' + opUserID.value
  axios.put(url, {}, {headers: headers}).then(res => {
    console.log(res.data)
    if (res.data.msg === "成功") {
      for (let i = 0; i < members.value.length; i++) {
        if (members.value[i].ID) {
          members.value.splice(i, 1)
          break
        }
      }
      getList()
    }
    message.info(res.data.msg)
  })
}
const showAdmin = (identify) => {
  if (myIdentify.value === 2 && identify === 0) {
    return 1;
  } else if (myIdentify.value === 2 && identify === 1) {
    return 2;
  } else {
    return 3;
  }
}

const admin = (id, op) => {
  opUserID.value = id;
  if (op === 0)
    isAdmin.value = 1;
  else {
    isAdmin.value = 0;
  }
  let url = '/team/' + route.query.teamID + '/admin?userID=' + opUserID.value + '&isAdmin=' + isAdmin.value
  axios.put(url, {}, {headers: headers}).then(res => {
    console.log(res.data)
    if (res.data.msg === "成功") {
      for (let i = 0; i < members.value.length; i++) {
        if (members.value[i].ID === opUserID.value) {
          members.value[i].identify = isAdmin.value
          break
        }
      }
      getList()
    } else {
      console.log("设置失败")
    }
  })
}
const getGlobal = computed(() => {
  return route.query.teamID
})

watch(getGlobal, (newVal, oldVal) => {
  console.log("value change" + newVal)
  getList()
}, {immediate: true, deep: true})

onMounted(() => {
  getList()
})

</script>

<style scoped>
.copyButton:hover{
    cursor:pointer;
}
.out{
  /*margin-left: 20px;*/
}
.top{
  color:#414958;
  margin-left:60px;
  font-size: 12px;
  line-height:28px;
  margin-top: 20px;

}
.left{
  width: 300px;
}
* {
  transition: 0.2s;
}

a {
  color: currentColor;
}

.member-card {
  margin-left: 20px;
  /*margin-left: 60px;*/
  position: relative;
  /*width: 100%;
  height: 70px;*/
  height: 50px;
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  background: #16181D;
}

.member-add {
  margin-left: 20px;
  /*height: 70px;*/
  padding: 15px 40px;
  display: flex;
  background: #16181D;
  color: #A7AFBE;
}

.member-add:hover {
  color: #FFFFFF;
}

.member-card:hover, .member-add:hover {
  /*width: 100%;*/
  display: flex;
  background: #414958;
}

.avatar {
  /*position: absolute;
  top: calc(50% - 56px / 2);
  left: calc(50% - 56px / 2);*/
  width: 50px;
  height: 50px;
  background-color: #55DDD1;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  margin-right: 10px;
  font-size: 24px;
  color: #FFFFFF;
}

.member-avatar, .add-icon {
  position: relative;
  width: 50px;
  margin-right: 10px;
}

.member-message {
  flex: 2;
  width: 200px;
}
#name {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin: 0 10px 10px;
  color: #FFFFFF;
}

#email {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  display: flex;
  align-items: flex-end;
  margin: 0 10px;
  color: #A7AFBE;
}

.member-operate {
  /*position: relative;
  flex: 2;*/
  align-items: center;
  flex-direction: row;
  display: flex;
}

.star {
  /*position: absolute;
  top: calc(50% - 36px / 2);*/
  left: 300px;
  cursor: pointer;
}

#close {
  /*position: absolute;
  top: calc(50% - 36px / 2);*/
  left: 400px;
  cursor: pointer;
}

#add {
  position: absolute;
  top: calc(50% - 36px / 2);
  left: calc(50% - 36px / 2);
  cursor: pointer;
}

#invite {
  /*position: absolute;
  left: 100px;
  line-height: 70px;
  height: 70px;*/
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  text-decoration: none;
  margin-left: 10px;

}

</style>