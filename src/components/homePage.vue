<template>
  <n-space>
    <n-button @click="regisRouter">登录/注册</n-button>
    <n-button @click="logout">登出</n-button>

    <n-button @click="teamRouter">团队</n-button>

    <n-button @click="vDitor">文档编辑</n-button>
    <n-button @click="testVditor">测试文档组件</n-button>
    <n-button @click="teamMain">团队主页</n-button>

    <n-button @click="upBar">文档页面</n-button>

    <n-button @click="programView">项目大页面</n-button>

    <n-button @click="docuList">文档list</n-button>

  </n-space>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import axios from 'axios';
import utils from "@/Utils";
const router = useRouter();
const headers= {
  Authorization:utils.getCookie('Authorization') }
const regisRouter = () => {
  router.push('/regisTer');
}
const logout = () => {
  console.log(headers)
  axios.delete('/auth/token',
  {
    headers:headers
  }
  ).then(res=>{
    console.log(res.data)
  })
}
const teamMain= () =>{
  router.push('/team');
}
const teamRouter = () => {
  router.push('/someTeam');
}

const vDitor = () => {
  router.push('/vDitor');
}

const testVditor = () => {
  router.push('/testVditor');
}

const upBar = () => {
  router.push('/upBar');
}

const programView = () => {
  router.push('/programView');
}

const docuList = () => {
  router.push('/docuList');
}

</script>

<style>

</style>
