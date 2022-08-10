<template>
  <div class="docu-item" tabindex="-1">
    <div class="docu-name" >
      <!--    <div class="docu-icon">-->
      <Icon size="20" class="icons"><Document /></Icon>
      <!--    </div>-->
      <p @click="op" style="cursor: pointer">{{name}}</p>
    </div>
    <div class="docu-time">{{createTime}}</div>
    <div class="docu-operate">
      <Icon size="20" style="margin-right:8px; cursor: pointer"><Edit16Regular @click="modifyName"/> </Icon>
      <Icon size="20" style="margin-right:20px; cursor: pointer"><CloseOutline @click="del"/> </Icon>
    </div>
  </div>
</template>

<script setup lang="ts">

import { defineProps, defineEmits} from "vue";
import {Icon} from "@vicons/utils"
import {Document} from "@vicons/carbon"
import {CloseOutline} from '@vicons/ionicons5'
import {Edit16Regular} from '@vicons/fluent'

const props = defineProps({
  name: String,
  createTime: Date || null,
})

const emit = defineEmits(['op', 'modifyName', 'del'])

const op = () => {
  emit('op')
}

const modifyName = () => {
  emit('modifyName')
}
const del = () => {
  emit('del')
}
</script>

<style scoped>
.docu-item {
  user-select: none;
  
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;

  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  align-content: center;

  border-radius: 3px;
  color: #FFFFFF;
  position: relative;
}
.docu-item:hover {
  background: #414958;
}
.docu-item:focus {
  background: #343b46;
}
.docu-icon {
  width: 20%;
  height: 100%;
  /*position: relative;*/
}
.docu-name {
  flex: 3;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.docu-time {
  flex: 2;
}
.docu-type {
  flex: 1;
}
.docu-operate {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.icons {
  margin-right:5px;
  /*position: absolute;
  top: calc(50% - 24px / 2);*/
  margin-left: 20px;
}
</style>