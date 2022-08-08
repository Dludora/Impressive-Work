<template>
<div class="docu-item" tabindex="-1">
  <div class="docu-name">
<!--    <div class="docu-icon">-->
      <Icon size="20" class="icons" v-if="dir"><Folder /></Icon>
      <Icon size="20" class="icons" v-else><Document /></Icon>
<!--    </div>-->
    {{name}}
  </div>
  <div class="docu-time">{{mdTime}}</div>
  <div class="docu-type">{{dir ? '文件夹' : '文件'}}</div>
  <div class="docu-operate">
    <Icon size="20" style="margin-right:8px"><Edit16Regular/> </Icon>
  </div>
</div>
</template>

<script setup lang="ts">
import {Edit16Regular} from '@vicons/fluent'
import {
  Add28Regular
} from '@vicons/fluent'
import {darkTheme, useMessage} from "naive-ui";
import {defineComponent, computed, watch, h, onMounted, reactive, ref, defineProps} from "vue";
import {Folder} from '@vicons/ionicons5'
import {Close} from "@vicons/ionicons5"
import {PlusOutlined} from "@vicons/antd";
import utils from '../../Utils'
import axios from "axios";
import {Icon} from "@vicons/utils"
import {Document} from "@vicons/carbon"

const props = defineProps({
  dir: Boolean,
  name: String,
  createTime: Date || null,
  mdTime: Date || null,
  parentID: Number || null
})


</script>

<style scoped>
.docu-item {
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
  flex: 1;
}
.docu-time {
  flex: 2;
}
.docu-type {
  flex: 3;
}
.docu-operate {
  flex: 4;
}
.icons {
  margin-right:5px;
  position: absolute;
  top: calc(50% - 24px / 2);
  left: 20px;
}
</style>