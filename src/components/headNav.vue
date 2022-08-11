<template>
    <div class="headnav">
        <div class="options">
            <div class="left">
                <router-link to="/">Impress Work · 印迹</router-link>
            </div>
            <div :key="navRenewTag" class="right">
                <a id="userintro" v-if="isLogin">欢迎回来，{{ profile.nickname }} 
                <div :style="'background-color:'+profile.src+';'" class="mini-avatar">{{ profile.nickname[0] }} </div>
                </a>
                <a @click="regisRouter" v-if="!isLogin">登录</a>
                <a @click="logout" v-if="isLogin">注销</a>
                <a @click="teamMain">我的团队</a>
                <!-- <a @click="tipTap">tipTap</a> -->
                <!-- <a @click="UML">编写文档</a> -->
                <!-- <a @click="UML">UML</a> -->
            </div>
        </div>
        <div class="divline"/>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { useRouter } from "vue-router";
import axios from 'axios';
import {useMessage} from "naive-ui"
import utils from "@/Utils";

const router = useRouter();
const isLogin = ref(false)
const message = useMessage();
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const profile = ref({
  ID: null,
  email: "",
  id: null,
  name: "",
  nickname: "",
  src: ""
})
let navRenewTag=ref(1);
const load = () => {
  axios.get('/user/info', {headers: headers}).then(res => {
    if(res.data.msg==="成功")
    {
      isLogin.value=true;
      profile.value = res.data.data
    // console.log(profile.value)
      utils.setCookie("userID", profile.value.ID)
    }
    
  })
}

const token = ref(utils.getCookie('Authorization'))
const nickname = ref(utils.getCookie('UserName'))

const regisRouter = () => {
  router.push('/regisTer');
}
const logout = () => {
  profile.value={
    ID: null,
    email: "",
    id: null,
    name: "",
    nickname: "",
    src: ""
  }
  navRenewTag.value=new Date().getTime()
  // console.log(navRenewTag.value)
  console.log(new Date().getTime())
  axios.delete('/auth/token', {headers: headers}
  ).then(res => {
    console.log(res.data)
    if (res.data.msg === "成功") {
      utils.clearCookie('Authorization')
      utils.clearCookie('UserName')
      headers.Authorization=null;
      axios.defaults.headers.common['Authorization'] = '';
      message.info("注销成功")
      isLogin.value=false
      // profile.value={
      //   ID: null,
      //   email: "",
      //   id: null,
      //   name: "",
      //   nickname: "",
      //   src: ""
      // }
      // navRenewTag=1-navRenewTag
      token.value = utils.getCookie('Authorization')
    } else {
      utils.clearCookie('Authorization')
      utils.clearCookie('UserName')
      axios.defaults.headers.common['Authorization'] = '';
      message.error("用户未登录")
    }
  })
  router.replace('/');
}
const teamMain = () => {
  router.push('/teamchoose');
}

const programView = () => {
  router.push('/teamchoose');
}

const UML = () => {
  router.push('/UML');
}
const tipTap = () => {
  router.push('/tipTap');
}
onMounted(() => {
  load()
})
</script>

<script lang="ts">
import {defineComponent, h, Component} from 'vue'

export default defineComponent({
  return: {},
})
</script>

<style scoped>
* {
  transition: 0.2s;
}

a {
  color: currentColor;
  text-decoration: none;
}
.headnav{
    width:100%;
    /*background-color:#16181D;*/
}
.options{
    padding:0 100px;
    display:flex;
    color:#E2E4E9;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
}
.options *{
    user-select:none;
    white-space: nowrap;
}
.options a{
    font-size:12px;
    line-height:42px;
}
.left a{
    margin-right:30px;
    margin-left:8px;
}
.right{
  display:flex;
}
.right a{
    margin-left:30px;
    margin-right:8px;
}
.options a:hover{
    cursor:pointer;
    color:#fff;
}
.divline{
    margin:0 100px;
    height:1px;
    border-bottom: 1px solid #fff;
}
#userintro{
  display:flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-right:0;
}
#userintro:hover{
  cursor:auto;
}
.mini-avatar{
  height:24px;
  width:24px;
  margin-left: 12px;
  border-radius: 50%;
  border:1px solid #fff;
  background-color: #A7AFBE;

  display:flex;
  align-items: center;
  justify-content: center;
}
</style>