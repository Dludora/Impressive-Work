<template>
  <div class="board">
    <div class="layoutHeader"></div>
    <layout-canvas class="canvas" ref="canvas"></layout-canvas>
    <div>
      <div class="ui toolBar">
        <div class="ui toolBarUnit" @mousedown="PrepareElement('rect')">
          <n-icon size="56" class="ui toolUnit toolPointer" color="#ffffff">
            <cursor24-regular />
          </n-icon>
        </div>
        <div class="ui ui toolBarUnit" @mousedown="PrepareElement('rect')">
          <div class="ui toolUnit toolRectangle"></div>
        </div>
        <div class="ui toolBarUnit" @mousedown="PrepareElement('circle')">
          <div class="ui toolUnit toolCircle"></div>
        </div>
        <div class="ui toolBarUnit" @mousedown="PrepareElement('text')">
          <n-icon size="56" class="ui toolUnit toolPointer" color="#ffffff">
            <text-add-t24-regular />
          </n-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import layoutCanvas from "../../components/DesignPage/layoutCanvas.vue";
import { Cursor24Regular, TextAddT24Regular } from "@vicons/fluent";
import { FrontHandOutlined } from "@vicons/material";

import { ref, reactive } from "vue";

const canvas = ref<layoutCanvas>(null);
const PrepareElement = (elementType: string) => {
  canvas.value?.PrepareElement(elementType);
};
</script>

<style scoped>
.canvas {
  position: absolute;
  top: 48px;
  bottom: 0;
}
.board {
  height: 100vh;
  width: 100vw;
}
.ui {
  z-index: 100;
  user-select: none;
}
.layoutHeader {
  height: 48px;
  background-color: #2b303b;
}
.Home {
  font-family: Inter;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
}
.toolBar {
  background-color: #2b303b;
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 40px;
  border-radius: 24px;
}
.toolBarUnit {
  width: 96px;
  height: 96px;
  float: left;
  position: relative;
}
.toolUnit {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.toolPointer {
  width: 52.4px;
  height: 56px;
}
.toolRectangle {
  background-color: #ddb055;
  width: 72px;
  height: 56px;
}
.toolCircle {
  background-color: #ddb055;
  width: 56px;
  height: 56px;
  border-radius: 50% 50%;
}
.toolText {
  width: 56px;
  height: 56px;
}
.sider {
  width: 240px;
}
</style>