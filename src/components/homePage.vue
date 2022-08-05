<template>
  <n-space>
    <n-button @click="regisRouter">登录/注册</n-button>
    <n-button @click="logout">登出</n-button>

    <n-button @click="teamMain">团队主页</n-button>

    <n-button @click="programView">项目大页面</n-button>

    <n-button @click="UML">UML</n-button>

    <img src="https://soft2-1251130379.cos.ap-beijing.myqcloud.com/exampleobject.jpg"/>
  </n-space>
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

</script>

<style>

</style>
