<template>
  <div class="docu-item">
    <div class="docu-cover">

    </div>
    <div class="docu-title">
      <p @click="openDocu(document.ID)" style="cursor: pointer;width: 80px;position: relative;display: flex">
        {{ document.title }}</p>
      <n-space justify="end" style="gap: 0; flex-wrap: nowrap;">
        <Icon id="edi" size="24" @click="viewEdiDocu(document.ID)">
          <Edit/>
        </Icon>
        <Icon id="del" size="24" @click="viewDelDocu(document.ID)">
          <Delete48Regular/>
        </Icon>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import {Add} from "@vicons/ionicons5";
import {Edit} from "@vicons/tabler";
import {Delete48Regular} from "@vicons/fluent";
import {Icon} from "@vicons/utils";
import {darkTheme, NIcon, useMessage} from "naive-ui";
import {onMounted, ref} from "vue";
import utils from "@/Utils";
import router from "@/router";

const headers = {
  Authorization: utils.getCookie('Authorization')
}

</script>

<style scoped>

.docu-item {
  height: 240px;
  width: 140px;
}

.docu-cover {

  width: 100px;
  border-radius: 0 5px;
  height: 132px;
  display: flex;
  background: #E2E4E9;
  border-right: 8px solid #414958;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}

.docu-cover:hover {
  background-color: #FFFFFF;
}

</style>