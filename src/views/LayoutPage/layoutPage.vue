<template>
  <div class="board" @mousedown="ShutBoard">
    <div class="layoutHeader home">
      <n-icon size="12" color="#A7AFBE" class="backArrow">
        <arrow-back-ios-round />
      </n-icon>
      Home
      <n-icon size="14" color="#A7AFBE" class="downloadIcon" @click="download">
        <file-download-filled />
      </n-icon>
    </div>
    <div class="canvasBoard">
      <layout-canvas
        class="canvas"
        ref="canvas"
        :update="update"
        @updateProps="updateProps"
        :elementProps="property"
        :layoutId="layoutId"
      ></layout-canvas>
      <div>
        <div class="ui porpertyBar" v-show="property.type != 'none'">
          <div id="xPorperty" class="porpertyBarInpUnit">
            <span class="porpertyText">X</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.x"
              :allow-input="onlyAllowNumber"
              style="
                --n-padding-left: 0px;
                --n-padding-right: 0px;
                --n-height: 12px;
              "
            ></n-input>
          </div>
          <div id="yPorperty" class="porpertyBarInpUnit">
            <span class="porpertyText">Y</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.y"
              :allow-input="onlyAllowNumber"
              style="
                --n-padding-left: 0px;
                --n-padding-right: 0px;
                --n-height: 12px;
              "
            ></n-input>
          </div>
          <div
            id="wPorperty"
            class="porpertyBarInpUnit"
            v-show="property.type != 'text'"
          >
            <span class="porpertyText">宽</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.width"
              :allow-input="onlyAllowNumber"
              style="
                --n-padding-left: 0px;
                --n-padding-right: 0px;
                --n-height: 12px;
              "
            ></n-input>
          </div>
          <div
            id="hPorperty"
            class="porpertyBarInpUnit"
            v-show="property.type != 'text'"
          >
            <span class="porpertyText">高</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.height"
              :allow-input="onlyAllowNumber"
              style="
                --n-padding-left: 0px;
                --n-padding-right: 0px;
                --n-height: 12px;
              "
            ></n-input>
          </div>
          <div
            id="hPorperty"
            class="porpertyBarInpUnit"
            v-show="property.type != 'text'"
          >
            <span class="porpertyText">边框宽度</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.borderWidth"
              :allow-input="onlyAllowNumber"
              style="
                --n-padding-left: 0px;
                --n-padding-right: 0px;
                --n-height: 12px;
              "
            ></n-input>
          </div>
          <div
            id="yPorperty"
            class="porpertyBarInpUnit"
            v-show="property.type == 'text'"
          >
            <span class="porpertyText">字号</span>
            <n-input
              class="porpertyInput"
              v-model:value="property.fontSize"
              :allow-input="onlyAllowNumber"
              style="
                --n-padding-left: 0px;
                --n-padding-right: 0px;
                --n-height: 12px;
              "
            ></n-input>
          </div>
          <div class="porpertyBarIconUnit">
            <n-icon size="20" color="#E2E4E9" class="porpertyIcon" style="marginRight:6px">
              <image24-regular />
            </n-icon>
            <input
              type="file"
              class="porpertyFileUploader"
              id="fileUploader"
              accept="image/*"
            />
          </div>
          <div
            id="fillColor"
            class="porpertyBarIconUnit"
            @click="displayPalette"
          >
            <div class="porpertyIcon fillIcon"></div>
            <div class="porpertyExtension">
              <n-icon size="12" color="#E2E4E9">
                <keyboard-arrow-up-round />
              </n-icon>
            </div>
            <div
              class="porpertyExtensionBoard paletteBoard"
              v-show="showPalette"
              @mousedown.stop
            >
              <div
                v-for="(color, index) in palette"
                :key="index"
                :style="'background-color:' + palette[index]"
                @click="updateColor(index)"
                class="paletteColor"
                ref="colorCircles"
              ></div>
            </div>
          </div>
          <div
            id="borderColor"
            class="porpertyBarIconUnit porpertyRightUnit"
            @click="displayBorderPalette"
            v-show="property.type != 'text'"
          >
            <div class="porpertyIcon borderIcon"></div>
            <div class="porpertyExtension">
              <n-icon size="12" color="#E2E4E9">
                <keyboard-arrow-up-round />
              </n-icon>
            </div>
            <div
              class="porpertyExtensionBoard paletteBoard"
              v-show="showBorderPalette"
              @mousedown.stop
            >
              <div
                v-for="(color, index) in palette"
                :key="index"
                :style="'background-color:' + palette[index]"
                @click="updateBorder(index)"
                class="paletteColor"
                ref="borderCircles"
              ></div>
            </div>
          </div>
        </div>
        <div class="ui toolBar">
          <div
            class="ui toolBarUnit toolLeftUnit"
            @mousedown="PrepareElement('rect')"
          >
            <n-icon size="28" class="ui toolUnit toolPointer" color="#ffffff">
              <cursor24-regular />
            </n-icon>
          </div>
          <div class="ui ui toolBarUnit" @mousedown="PrepareElement('rect')">
            <div class="ui toolUnit toolRectangle"></div>
          </div>
          <div class="ui toolBarUnit" @mousedown="PrepareElement('circle')">
            <div class="ui toolUnit toolCircle"></div>
          </div>
          <div
            class="ui toolBarUnit toolRightUnit"
            @mousedown="PrepareElement('text')"
          >
            <n-icon size="28" class="ui toolUnit toolPointer" color="#ffffff">
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
import { Cursor24Regular, TextAddT24Regular,Image24Regular } from "@vicons/fluent";
import {
  FrontHandOutlined,
  KeyboardArrowUpRound,
  ArrowBackIosRound,
  FileDownloadFilled,
} from "@vicons/material";
import {useMessage} from "naive-ui"

import { ref, reactive, onMounted } from "vue";
import axios from "axios";

import utils from "@/Utils";

const message = useMessage();

const headers = {
  Authorization: utils.getCookie("Authorization"),
};

const canvas = ref<layoutCanvas>(null);
const PrepareElement = (elementType: string) => {
  canvas.value?.PrepareElement(elementType);
};

const download = () => {
  canvas.value?.download();
};

const layoutId = ref<number>(0);
const layoutName = ref<string>("")
const canvasWidth = ref<number>(0);
const canvasHeight = ref<number>(0);

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

const showPalette = ref<boolean>(false);
const showBorderPalette = ref<boolean>(false);

const colorCircles = ref<any>([]);
const borderCircles = ref<any>([]);
const update = ref<boolean>(true);

let selectedColor: number = 27;
let selectedBorderColor: number = 30;

let elementType: string = "";

type Property = {
  id: number;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  borderWidth: number;
  borderRadius: number;
  type: string;
  color: string;
  borderColor: string;
  src: string;
  fontSize: number;
  locked: boolean;
};

const property = reactive<Property>({
  id: 0,
  index: -1,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  borderWidth: 0,
  borderRadius: 0,
  type: "none",
  locked: false,
  fontSize: 0,
  src: "",
  color: "#D42B39",
  borderColor: "transparent",
});

const initPage = ()=>{

}

const updateProps = (data: Property) => {
  if (data == null) {
    property.type = "none";
    return;
  }
  update.value = false;
  // setTimeout(() => {
  //   update.value = true;
  // }, 100);
  property.index = data.index;
  property.x = data.x;
  property.y = data.y;
  property.width = data.width;
  property.height = data.height;
  property.borderWidth = data.borderWidth;
  property.borderRadius = data.borderRadius;
  property.type = data.type;
  property.color = data.color;
  property.borderColor = data.borderColor;
  property.src = data.src;
  property.fontSize = data.fontSize;
  property.locked = data.locked;

  colorCircles.value[selectedColor].style.borderWidth = "0px";
  borderCircles.value[selectedBorderColor].style.borderWidth = "0px";
  colorCircles.value[selectedColor].style.margin = "3px";
  borderCircles.value[selectedBorderColor].style.margin = "3px";
  for (var i = 0; i < palette.length; ++i) {
    if (property.color == palette[i]) {
      selectedColor = i;
    }
    if (property.borderColor == palette[i]) {
      selectedBorderColor = i;
    }
  }
};

const updateColor = (colorId: number) => {
  update.value = true;
  property.color = palette[colorId];
  colorCircles.value[selectedColor].style.borderWidth = "0px";
  colorCircles.value[selectedColor].style.margin = "3px";
  selectedColor = colorId;
  colorCircles.value[selectedColor].style.borderWidth = "2px";
  colorCircles.value[selectedColor].style.margin = "1px";
};

const updateBorder = (colorId: number) => {
  update.value = true;
  property.borderColor = palette[colorId];
  borderCircles.value[selectedBorderColor].style.borderWidth = "0px";
  borderCircles.value[selectedBorderColor].style.margin = "3px";
  selectedBorderColor = colorId;
  borderCircles.value[selectedBorderColor].style.borderWidth = "2px";
  borderCircles.value[selectedBorderColor].style.margin = "1px";
  if(palette[colorId]!="transparent")
  {
    message.info("注意：边框宽度为0");
  }
};

const displayPalette = () => {
  showPalette.value = true;
  colorCircles.value[selectedColor].style.borderWidth = "2px";
  colorCircles.value[selectedColor].style.margin = "1px";
  document.getElementById("fillColor")!.style.backgroundColor = "#464b56";
};

const displayBorderPalette = () => {
  showBorderPalette.value = true;
  borderCircles.value[selectedBorderColor].style.borderWidth = "2px";
  borderCircles.value[selectedBorderColor].style.margin = "1px";
  document.getElementById("borderColor")!.style.backgroundColor = "#464b56";
};

const ShutBoard = () => {
  showPalette.value = false;
  showBorderPalette.value = false;
  document.getElementById("fillColor")!.style.backgroundColor = "";
  document.getElementById("borderColor")!.style.backgroundColor = "";
};

onMounted(() => {
  var imgInputer = document.getElementById("fileUploader");
  imgInputer!.onchange = () => {
    var form = new FormData();
    form.append("file", imgInputer.files[0]);
    axios({
      url: "/resource/img",
      method: "post",
      headers: headers,
      data: form,
    }).then((res) => {
      console.log(res.data);
      if (res.data.msg == "成功") {
        update.value = true;
        property.src = res.data.data;
      }
    });
  };
});
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
  top: 24px;
  bottom: 0px;
  width: 100%;
}
.ui {
  z-index: 100;
  user-select: none;
}
.layoutHeader {
  height: 24px;
  background-color: #2b303b;
}
.backArrow {
  float: left;
  margin-top: 6px;
  margin-left: 12px;
}
.downloadIcon {
  float: right;
  margin-top: 6px;
  margin-right: 10px;
}
.home {
  text-align: center;
  font-family: Inter;
  font-weight: 700;
  font-size: 12px;
  line-height: 24px;
  color: #e2e4e9;
}
.porpertyBar {
  background-color: #2b303b;
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 75px;
  border-radius: 6px;
}
.porpertyRightUnit {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.porpertyBarInpUnit {
  height: 24px;
  line-height: 24px;
  padding-left: 8px;
  padding-right: 8px;
  color: #e2e4e9;
  float: left;
}
.porpertyText {
  float: left;
}
.porpertyInput {
  width: 28px;
  height: 14px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 8px;
  padding-left: 1px;
  padding-right: 1px;
  font-size: 5px;
}
.porpertyFileUploader {
  position:absolute;
  left:0;
  opacity: 0;
}
.porpertyBarIconUnit {
  height: 24px;
  float: left;
  position: relative;
}
.porpertyBarIconUnit:hover {
  background-color: #3a404f;
}
.porpertyIcon {
  width: 18px;
  height: 18px;
  margin: 3px;
  margin-right: 1.5px;
  float: left;
}
.porpertyExtension {
  float: left;
  margin-top: 3px;
  margin-bottom: 3px;
  margin-right: 1px;
}
.porpertyExtensionBoard {
  position: absolute;
  bottom: 32.5px;
  left: 15px;
  transform: translate(-50%, 0);
  background-color: #2b303b;
  border-radius: 6px;
}
.paletteBoard {
  width: 144px;
  padding: 8px;
}
.paletteColor {
  margin: 3px;
  float: left;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.25);
  border-color: white;
  border-width: 0px;
  border-style: solid;
}
.fillIcon {
  border-radius: 50%;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.25);
  background-color: #ddb055;
}
.borderIcon {
  border-radius: 50%;
  border: 2.5px solid #8ed42b;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}
.toolBar {
  background-color: #2b303b;
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 20px;
  border-radius: 12px;
}
.toolLeftUnit {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
.toolRightUnit {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}
.toolBarUnit {
  width: 48px;
  height: 48px;
  float: left;
  position: relative;
}
.toolBarUnit:hover {
  background-color: #3a404f;
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
  width: 26px;
  height: 28px;
}
.toolRectangle {
  background-color: #ddb055;
  width: 36px;
  height: 28px;
}
.toolCircle {
  background-color: #ddb055;
  width: 28px;
  height: 28px;
  border-radius: 50% 50%;
}
.toolText {
  width: 28px;
  height: 28px;
}
.sider {
  width: 240px;
}
</style>