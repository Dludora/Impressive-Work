<template>
<div class="docu-item" tabindex="-1" :draggable="revisable">
  <!-- <div class="left"> -->
  <div class="docu-name">
<!--    <div class="docu-icon">-->
      <Icon size="20" class="icons" v-if="dir"><Folder /></Icon>
      <Icon size="20" class="icons" v-else><Document /></Icon>
<!--    </div>-->
    <div>{{name}}</div>
  </div>
  <div class="docu-time">{{mdTime}}</div>
  <div class="docu-type">{{dir ? '文件夹' : '文件'}}</div>
  <!-- </div> -->
  <div class="docu-operate">
    <Icon size="20" style="margin-right:8px; cursor: pointer" v-if="revisable">
    <Edit16Regular @click="modifyName"/> </Icon>
    <Icon size="20" style="margin-right:20px; cursor: pointer" v-if="revisable">
    <CloseOutline @click="del"/> </Icon>
  </div>
</div>
</template>

<script setup lang="ts">
import {Edit16Regular} from '@vicons/fluent'
import {
  Add28Regular
} from '@vicons/fluent'
import {darkTheme, useMessage} from "naive-ui";
import {defineComponent, computed, watch, h, onMounted, reactive, ref, defineProps, defineEmits} from "vue";
import {Folder} from '@vicons/ionicons5'
import {Close} from "@vicons/ionicons5"
import {PlusOutlined} from "@vicons/antd";
import utils from '../../Utils'
import axios from "axios";
import {Icon} from "@vicons/utils"
import {Document} from "@vicons/carbon"
import {CloseOutline} from '@vicons/ionicons5'


const props = defineProps({
  dir: Boolean,
  name: String,
  createTime: Date || null,
  mdTime: Date || null,
  parentID: Number || null,
  revisable: Boolean
})

const emit = defineEmits(['modifyName', 'del'])

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
  position: relative;
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.docu-type {
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
.left{
  display: flex;
  align-items: center;
}
</style>