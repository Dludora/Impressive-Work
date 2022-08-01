<template>
  <n-space>
    <n-button @click="regisRouter">注册</n-button>
<<<<<<< HEAD
    <n-button @click="teamRouter">团队</n-button>
=======
    <n-button @click="vDitor">文档编辑</n-button>
    <n-button @click="testVditor">测试文档组件</n-button>
>>>>>>> 3c01ea7d2ba9fae98eb1701e654747ef502f447b
  </n-space>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const regisRouter = () => {
  router.push('/regisTer');
}

<<<<<<< HEAD
const teamRouter = () => {
  router.push('/someTeam');
}
=======
const vDitor = () => {
  router.push('/vDitor');
}

const testVditor = () => {
  router.push('/testVditor');
}

>>>>>>> 3c01ea7d2ba9fae98eb1701e654747ef502f447b
</script>

<style>

</style>
