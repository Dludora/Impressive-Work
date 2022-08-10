<template>
  <div class="docu-item" tabindex="-1">
    <div class="docu-name" >
      <!--    <div class="docu-icon">-->
      <Icon size="20" class="icons"><Document /></Icon>
      <!--    </div>-->
      <div class="nametext" @click="op" style="cursor: pointer">{{name}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { defineProps, defineEmits} from "vue";
import {Icon} from "@vicons/utils"
import {Document} from "@vicons/carbon"

const props = defineProps({
  name: String,
})

const emit = defineEmits(['op'])

const op = () => {
  emit('op')
}
</script>

<style scoped>
.docu-item {
  width: 100%;
  height: 42px;
  line-height: 42px;
  text-align: center;
  display: flex;
  border-radius: 3px;
  color: #FFFFFF;
  position: relative;
}
.docu-item:hover {
  background: #444444;
}
.docu-item:focus {
  background: #333333;
}
.docu-icon {
  width: 20%;
  height: 100%;
  position: relative;
}
.docu-name {
  flex: 1;
  align-items: center;
  align-content: center;
  display: flex;
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
  /*position: absolute;
  top: calc(50% - 24px / 2);*/
  margin-left: 8px;
}
.nametext{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  font-size:12px;
}
</style>