<template>
  <n-space>
    <n-button @click="regisRouter">注册</n-button>

    <n-button @click="teamRouter">团队</n-button>

    <n-button @click="vDitor">文档编辑</n-button>
    <n-button @click="testVditor">测试文档组件</n-button>
    <n-button @click="teamMain">团队主页</n-button>

  </n-space>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const regisRouter = () => {
  router.push('/regisTer');
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


</script>

<style>

</style>
