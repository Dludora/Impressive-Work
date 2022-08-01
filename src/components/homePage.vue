<template>
  <n-space>
    <n-button @click="regisRouter">注册</n-button>
    <n-button @click="teamRouter">团队</n-button>
  </n-space>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();

const regisRouter = () => {
  router.push('/regisTer');
}

const teamRouter = () => {
  router.push('/someTeam');
}
</script>

<style>

</style>
