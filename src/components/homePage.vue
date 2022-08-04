<template>
  <n-space>
    <n-button @click="regisRouter">登录/注册</n-button>
    <n-button @click="logout">登出</n-button>

    <n-button @click="vDitor">文档编辑</n-button>
    <n-button @click="testVditor">测试文档组件</n-button>

    <n-button @click="teamMain">团队主页</n-button>

    <n-button @click="programView">项目大页面</n-button>

    <n-button @click="docuEdit">文档编辑页面</n-button>
    <img src="https://soft2-1251130379.cos.ap-beijing.myqcloud.com/exampleobject.jpg"/>
  </n-space>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import axios from 'axios';
import utils from "@/Utils";
const router = useRouter();

const regisRouter = () => {
  router.push('/regisTer');
}
const logout = () => {
  console.log()
  axios.delete('/auth/token',
  ).then(res=>{
    console.log(res.data)
    if(res.data.msg==="成功")
    {
      utils.clearCookie('Authorization')
      axios.defaults.headers.common['Authorization'] = '';
      alert("注销成功")
    }
    else{
      utils.clearCookie('Authorization')
      axios.defaults.headers.common['Authorization'] = '';
      alert("用户未登录")
    }
  })
}
const teamMain= () =>{
  router.push('/profile');
}

const vDitor = () => {
  router.push('/vDitor');
}

const testVditor = () => {
  router.push('/testVditor');
}

const programView = () => {
  router.push('/programView');
}

const docuEdit = () => {
  router.push('/docuEdit');
}

</script>

<style>

</style>
