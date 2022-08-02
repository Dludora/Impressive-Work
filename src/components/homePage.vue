<template>
  <n-space>
    <n-button @click="regisRouter">注册</n-button>

    <n-button @click="vDitor">文档编辑</n-button>
    <n-button @click="testVditor">测试文档组件</n-button>

    <n-button @click="teamMain">团队主页</n-button>

    <n-button @click="upBar">文档页面</n-button>

    <n-button @click="programView">项目大页面</n-button>

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

</script>

<style>

</style>
