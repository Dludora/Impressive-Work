<template>
  <div class="board" @mousedown="ShutBoard">
    <div class="layoutHeader"></div>
    <div class="canvasBoard">
      <layout-canvas
        class="canvas"
        ref="canvas"
        @updateProps="updateProps"
        :elementProps="property"
      ></layout-canvas>
      <div>
        <div class="ui porpertyBar">
          <div id="xPorperty" class="porpertyBarInpUnit">
            <span class="porpertyText">X</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.x"
              :allow-input="onlyAllowNumber"
            ></n-input>
          </div>
          <div id="yPorperty" class="porpertyBarInpUnit">
            <span class="porpertyText">Y</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.y"
              :allow-input="onlyAllowNumber"
            ></n-input>
          </div>
          <div id="wPorperty" class="porpertyBarInpUnit">
            <span class="porpertyText">宽</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.width"
              :allow-input="onlyAllowNumber"
            ></n-input>
          </div>
          <div id="hPorperty" class="porpertyBarInpUnit">
            <span class="porpertyText">高</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.height"
              :allow-input="onlyAllowNumber"
            ></n-input>
          </div>
          <div id="fillColor" class="porpertyBarIconUnit" @click="showPalette = true">
            <div class="porpertyIcon fillIcon"></div>
            <div class="porpertyExtension">
              <n-icon size="16" color="#E2E4E9">
                <keyboard-arrow-up-round />
              </n-icon>
            </div>
            <div class="porpertyExtensionBoard paletteBoard" v-show="showPalette" @mousedown.stop>
              <div
                v-for="(color, index) in palette"
                :key="index"
                :style="'background-color:' + palette[index]"
                @click="updateColor(index)"
                class="paletteColor"
              ></div>
            </div>
          </div>
          <div id="fillColor" class="porpertyBarIconUnit">
            <div class="porpertyIcon borderIcon"></div>
            <div class="porpertyExtension">
              <n-icon size="16" color="#E2E4E9">
                <keyboard-arrow-up-round />
              </n-icon>
            </div>
          </div>
        </div>
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
  </div>
</template>

<script lang="ts" setup>
import layoutCanvas from "../../components/DesignPage/layoutCanvas.vue";
import { Cursor24Regular, TextAddT24Regular } from "@vicons/fluent";
import { FrontHandOutlined, KeyboardArrowUpRound } from "@vicons/material";

import { ref, reactive } from "vue";

const canvas = ref<layoutCanvas>(null);
const PrepareElement = (elementType: string) => {
  canvas.value?.PrepareElement(elementType);
};

const palette = reactive<string[]>([
  "#F2F2F2",
  "#AAC1EE",
  "#AAEEB5",
  "#F9EFD2",
  "#EDD7AB",
  "#DD55C6",
  "#CCCCCC",
  "#2350A9",
  "#55DD6C",
  "#DFAF20",
  "#DDB055",
  "#AA2293",
  "#999999",
  "#112855",
  "#1A7F2B",
  "#59460D",
  "#7F5E1A",
  "#55114A",
  "#666666",
  "#AAEEE8",
  "#A5DD55",
  "#E58088",
  "#DD6C55",
  "#AA80E5",
  "#333333",
  "#55DDD1",
  "#8ED42B",
  "#D42B39",
  "#AA222E",
  "#5A22AA",
  "transparent",
  "#22AA9E",
  "#557F1A",
  "#7F1A22",
  "#551117",
  "#2D1155",
]);
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const showPalette = ref<boolean>();

let elementType: string = "";

type Property = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  color: string;
  borderColor: string;
  src: string;
  fontSize: number;
  locked: boolean;
};

const property = reactive<Property>({
  id: -1,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  type: "Rect",
  locked: false,
  fontSize: 0,
  src: "",
  color: "red",
  borderColor: "blue",
});

const updateProps = (data: Property) => {
  property.id = data.id;
  property.x = data.x;
  property.y = data.y;
  property.width = data.width;
  property.height = data.height;
  property.type = data.type;
  property.color = data.color;
  property.borderColor = data.borderColor;
  property.src = data.src;
  property.fontSize = data.fontSize;
  property.locked = data.locked;
};

const updateColor = (colorId: number) => {
  console.log(colorId);
  property.color = palette[colorId];
};

const ShutBoard = ()=>{
  showPalette.value = false;
}
</script>

<style scoped>
.canvas {
  position: absolute;
  top: 0;
  bottom: 0;
}
.board {
  height: 100vh;
  width: 100vw;
}
.canvasBoard {
  text-align: center;
  position: absolute;
  top: 48px;
  bottom: 0px;
  width: 100%;
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
.porpertyBar {
  background-color: #2b303b;
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 150px;
  border-radius: 12px;
}
.porpertyBarInpUnit {
  height: 48px;
  line-height: 48px;
  padding-left: 16px;
  padding-right: 16px;
  color: #e2e4e9;
  float: left;
}
.porpertyText {
  float: left;
}
.porpertyInput {
  width: 56px;
  height: 28px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 16px;
}
.porpertyBarIconUnit {
  height: 48px;
  float: left;
  position: relative;
}
.porpertyIcon {
  width: 36px;
  height: 36px;
  margin: 6px;
  margin-right: 3px;
  float: left;
}
.porpertyExtension {
  float: left;
  margin-top: 16px;
  margin-bottom: 16px;
  margin-right: 2px;
}
.porpertyExtensionBoard {
  position: absolute;
  bottom: 65px;
  left: 30px;
  transform: translate(-50%, 0);
  background-color: #2b303b;
  border-radius: 12px;
}
.paletteBoard {
  width: 288px;
  padding: 16px;
}
.paletteColor {
  margin: 6px;
  float: left;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.25);
}
.fillIcon {
  border-radius: 50%;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.25);
  background-color: #ddb055;
}
.borderIcon {
  border-radius: 50%;
  border: 5px solid #8ed42b;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
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