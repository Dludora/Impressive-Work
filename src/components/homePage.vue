<template>
  <n-space>
    <n-button @click="regisRouter">注册</n-button>
    <n-button @click="testVditor">文档编辑</n-button>
  </n-space>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const regisRouter = () => {
  router.push('/regisTer');
}

const testVditor = () => {
  router.push('/testVditor');
}

</script>

<style>

</style>
