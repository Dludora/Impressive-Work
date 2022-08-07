<template>
    <div class="headnav">
        <div class="options">
            <div class="left">
                <router-link to="/">Impress Work · 印迹</router-link>
            </div>
            <div class="right">
                <a @click="regisRouter">登录</a>
                <a @click="logout">注销</a>
                <a @click="teamMain">我的团队</a>
                <a @click="programView">我的项目</a>
                <a @click="tipTap">tipTap</a>
                <!-- <a @click="UML">编写文档</a> -->
                <a @click="UML">UML</a>
            </div>
        </div>
        <div class="divline"/>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import axios from 'axios';
import {useMessage} from "naive-ui"
import utils from "@/Utils";
const router = useRouter();
const message = useMessage();

const headers = {
  Authorization: utils.getCookie('Authorization')
}
const regisRouter = () => {
  router.push('/regisTer');
}
const logout = () => {
  console.log()
  axios.delete('/auth/token',{headers:headers}
  ).then(res=>{
    console.log(res.data)
    if(res.data.msg==="成功")
    {
      utils.clearCookie('Authorization')
      axios.defaults.headers.common['Authorization'] = '';
      message.info("注销成功")
    }
    else{
      utils.clearCookie('Authorization')
      axios.defaults.headers.common['Authorization'] = '';
      message.error("用户未登录")
    }
  })
}
const teamMain= () =>{
  router.push('/team');
}

const programView = () => {
  router.push('/project');
}

const UML = () => {
  router.push('/UML');
}
const tipTap = () => {
  router.push('/tipTap');
}
</script>

<script lang="ts">
import {defineComponent, h, Component} from 'vue'
export default defineComponent({
    return:{

    },
})
</script>

<style scoped>
*{
    transition:0.2s;
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
</style>