<template>
  <div class="list">
    <div v-for="member in members" :key="member" class="member-card">
      <div style="display:flex;align-items: center;flex: 1;">
        <!-- <div class="member-avatar">
          <n-avatar round class="avatar"/>
        </div> -->
        <div class="avatar">{{ member.nickname[0] }}</div>
        <div class="member-message">
          <p id="name">{{ member.nickname }}({{ member.name }})</p>
          <p id="email">{{ member.email }}</p>
        </div>
      </div>
      <div class="tag" style="flex: 2; line-height: 50px; text-align: center;">
        <n-config-provider :theme="theme">
          <n-tag type="success" size="large" round v-if="member.identify===2">
            群主
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
        <Icon style="margin-right:4px" class="star"
              size="24" color="#FFFFFF" v-if="showAdmin(member.identify)">
          <UserCertification @click="admin(member.ID, member.identify)"/>
        </Icon>
        <Icon v-if="showRemove(member.identify)" @click="remove(member.ID)" id="close" size="32" color="#FFFFFF">
          <CloseOutline/>
        </Icon>
      </div>
    </div>
    <div class="member-add ">
      <div class="add-icon">
        <Icon size="36" id="add">
          <PlusOutlined/>
        </Icon>
      </div>
      <a @click="displayMedal" id="invite">邀请成员</a>
    </div>
  </div>
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModalRef"
        :mask-closable="false"
        preset="dialog"
        title="邀请成员"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
      <n-form>
        <n-form-item label="邀请用户的邮箱" :rule="rule" :render-feedback="formatFeedback">
          <n-input v-model:value="Email" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>
    </n-modal>
  </n-config-provider>
</template>

<script setup lang="ts">
import {PlusOutlined} from "@vicons/antd";
import {UserCertification} from "@vicons/carbon";
import {IosStarOutline, IosStar} from "@vicons/ionicons4"
import {CloseOutline} from "@vicons/ionicons5"
import {Icon} from "@vicons/utils";
import axios from 'axios'
import {onMounted, ref, computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import utils from '../../Utils'
import {darkTheme} from "naive-ui"

// 寇书瑞改动的部分
const myID = ref(utils.getCookie('userID'))
const myIdentify = ref(0)
const theme = darkTheme
// 在这里结束
const route = useRoute();
let showModalRef = ref(false)
let teamID = ref()
let Email = ref('')
let email = ref('')
let opUserID = ref()
let isAdmin = ref(0)
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const displayMedal = () => {
  showModalRef.value = true
}
const onPositiveClick = () => {
  console.log("Identity:" + utils.getCookie('Authorization'))
  let url = '/team/' + route.query.teamID + '/invite?email=' + Email.value
  axios.put(url, {}, {headers: headers}).then(res => {
    console.log(res.data)
    alert(res.data.msg)
  })
  showModalRef.value = false
}
const onNegativeClick = () => {
  showModalRef.value = false
};

const members = ref([
  {
    ID: 0,
    nickname: '获取成员列表中...',
    name: '',
    email: '宝贝,正在加载中 请稍后~',
    identity: 0
  },

])

const getList = () => {
  let url = '/team/' + route.query.teamID + '/members?page=0&size=20'
  axios.get(url, {headers: headers}).then(res => {
    console.log(res.data)
    members.value = res.data.data.items
    console.log(members.value)
  })
  url = '/team/' + route.query.teamID + '/member/' + myID.value + '/info'
  axios.get(url, {headers: headers}).then(res => {
    myIdentify.value = res.data.data.identify
  })
}
const invite = () => {
  console.log("身份验证 " + utils.getCookie('Authorization'))
  let url = '/team/' + route.query.teamID + '/invite?email=' + email.value
  axios.put(url, {}, {headers: headers}).then(res => {
    console.log(res.data)
    alert(res.data.msg)
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
  axios.put(url, {headers: headers}).then(res => {
    console.log(res.data)
    if (res.data.msg === "成功") {
      for (let i = 0; i < members.value.length; i++) {
        if (members.value[i].ID) {
          members.value.splice(i, 1)
          break
        }
      }
    }
    alert(res.data.msg)
  })
}
const showAdmin = (identify) => {
  if (myIdentify.value === 2 && identify === 0) {
    return true;
  } else {
    return false
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
  axios.put(url, {headers: headers}).then(res => {
    console.log(res.data)
    if (res.data.msg === "成功") {
      for (let i = 0; i < members.value.length; i++) {
        if (members.value[i].ID === opUserID.value) {
          members.value[i].identity = isAdmin.value
          break
        }
      }
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
* {
  transition: 0.2s;
}

a {
  color: currentColor;
}

.member-card {
  /*margin-left: 60px;*/
  position: relative;
  /*width: 100%;
  height: 70px;*/
  height: 50px;
  padding: 15px 60px;
  display: flex;
  justify-content: space-between;
  background: #16181D;
}

.member-add {
  /*height: 70px;*/
  padding: 15px 60px;
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

/* .member-message {
  /*flex: 2;*/

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