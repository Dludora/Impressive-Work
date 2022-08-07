<template>
  <div class="board" @mousedown="ShutBoard">
    <div class="layoutHeader home ui">
      <n-icon size="18" color="#A7AFBE" class="backArrow" @click="exit">
        <arrow-back-ios-round />
      </n-icon>
      {{ layoutName }}
      <n-icon size="21" color="#A7AFBE" class="downloadIcon" @click="download">
        <file-download-filled />
      </n-icon>
      <n-icon size="21" color="#A7AFBE" class="downloadIcon" @click="download">
        <save16-regular />
      </n-icon>
    </div>
    <div class="canvasBoard">
      <layout-canvas
        class="canvas"
        ref="canvas"
        :update="update"
        @updateProps="updateProps"
        @changeUpdate="changeUpdate"
        :elementProps="property"
        :tool="tool"
        :layoutId="layoutId"
        :canvasWidth="canvasWidth"
        :canvasHeight="canvasHeight"
      ></layout-canvas>
      <div>
        <div class="toolBar">
          <n-icon
            size="27"
            color="#A7AFBE"
            class="toolIcon toolIconTop"
            id="toolpointer"
            @click="switchTool('pointer')"
          >
            <cursor24-regular />
          </n-icon>
          <n-icon
            size="27"
            color="#A7AFBE"
            class="toolIcon"
            id="tooldrag"
            @click="switchTool('drag')"
          >
            <md-move />
          </n-icon>
          <n-icon
            size="27"
            color="#A7AFBE"
            class="toolIcon"
            id="toolresize"
            @click="switchTool('resize')"
          >
            <resize-large20-regular />
          </n-icon>
          <n-icon
            size="27"
            color="#50555e"
            class="toolIcon"
            id="toolscale"
            @click="switchTool('scale')"
          >
            <scale-fill24-regular />
          </n-icon>
          <n-icon
            size="27"
            color="#A7AFBE"
            class="toolIcon"
            id="toolrotate"
            @click="switchTool('rotate')"
          >
            <arrow-rotate-clockwise16-regular />
          </n-icon>
          <n-icon
            size="27"
            color="#50555e"
            class="toolIcon"
            id="toolwrap"
            @click="switchTool('wrap')"
          >
            <format-shapes-outlined />
          </n-icon>
          <n-icon
            size="27"
            color="#50555e"
            class="toolIcon"
            id="toolclip"
            @click="switchTool('clip')"
          >
            <crop20-filled />
          </n-icon>
          <n-icon
            size="27"
            color="#50555e"
            class="toolIcon toolIconBottom"
            id="toolround"
            @click="switchTool('round')"
          >
            <rounded-corner-round />
          </n-icon>
        </div>

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
          <div class="porpertyBarIconUnit" v-show="property.type != 'text'">
            <n-icon
              size="30"
              color="#E2E4E9"
              class="porpertyIcon"
              style="marginright: 9px"
            >
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
              <n-icon size="18" color="#E2E4E9">
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
              <n-icon size="18" color="#E2E4E9">
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
        <div class="ui elementBar">
          <!-- <div
            class="ui elementBarUnit elementLeftUnit"
            @mousedown="PrepareElement('rect')"
          >
            <n-icon
              size="42"
              class="ui elementUnit elementPointer"
              color="#ffffff"
            >
              <cursor24-regular />
            </n-icon>
          </div> -->
          <div
            class="ui elementBarUnit elementLeftUnit"
            @mousedown="PrepareElement('rect')"
          >
            <div class="ui elementUnit elementRectangle"></div>
          </div>
          <div class="ui elementBarUnit" @mousedown="PrepareElement('circle')">
            <div class="ui elementUnit elementCircle"></div>
          </div>
          <div
            class="ui elementBarUnit elementRightUnit"
            @mousedown="PrepareElement('text')"
          >
            <n-icon
              size="48"
              class="ui elementUnit elementPointer"
              color="#ffffff"
            >
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
import {
  Cursor24Regular,
  TextAddT24Regular,
  Image24Regular,
  Save16Regular,
  ResizeLarge20Regular,
  ScaleFill24Regular,
  ArrowRotateClockwise16Regular,
  Crop20Filled,
} from "@vicons/fluent";
import {
  FrontHandOutlined,
  KeyboardArrowUpRound,
  ArrowBackIosRound,
  FileDownloadFilled,
  FormatShapesOutlined,
  RoundedCornerRound,
} from "@vicons/material";
import { MdMove } from "@vicons/ionicons4";
import { useMessage } from "naive-ui";

import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

import utils from "@/Utils";

const message = useMessage();
const route = useRoute();
const router = useRouter();

const headers = {
  Authorization: utils.getCookie("Authorization"),
};

const canvas = ref<layoutCanvas>(null);
const PrepareElement = (elementType: string) => {
  canvas.value?.PrepareElement(elementType);
};

const download = () => {
  canvas.value?.download(true);
};

const layoutId = ref<number>(2);
const layoutName = ref<string>("Home");
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
const toolAvailable: { [key: string]: boolean } = {
  pointer: true,
  drag: true,
  resize: true,
  scale: false,
  rotate: true,
  wrap: true,
  clip: false,
  round: false,
};
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const showPalette = ref<boolean>(false);
const showBorderPalette = ref<boolean>(false);

const colorCircles = ref<any>([]);
const borderCircles = ref<any>([]);
const update = ref<boolean>(true);

const tool = ref<string>("pointer");

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
  scaleX: number;
  scaleY: number;
  rotation: number;
  borderWidth: number;
  borderRadius: number;
  type: string;
  color: string;
  borderColor: string;
  src: string;
  text: string;
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
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  borderWidth: 0,
  borderRadius: 0,
  type: "none",
  locked: false,
  text: "",
  fontSize: 0,
  src: "",
  color: "#D42B39",
  borderColor: "transparent",
});

const changeUpdate = () => {
  update.value = true;
};

const updateProps = (data: Property) => {
  if (data == null) {
    switchType(null);
    property.type = "none";
    return;
  }
  update.value = false;
  // setTimeout(() => {
  //   update.value = true;
  // }, 100);
  if (property.color != data.color) {
    colorCircles.value[selectedColor].style.borderWidth = "0px";
    colorCircles.value[selectedColor].style.margin = "4.5px";
  }
  if (property.borderColor != data.borderColor) {
    borderCircles.value[selectedBorderColor].style.borderWidth = "0px";
    borderCircles.value[selectedBorderColor].style.margin = "4.5px";
  }
  if(property.type != data.type) {
    switchType(data.type);
  }
  property.id = data.id;
  property.x = data.x;
  property.y = data.y;
  property.width = data.width;
  property.height = data.height;
  property.rotation = data.rotation;
  property.borderWidth = data.borderWidth;
  property.borderRadius = data.borderRadius;
  property.type = data.type;
  property.color = data.color;
  property.borderColor = data.borderColor;
  property.src = data.src;
  property.fontSize = data.fontSize;
  property.text = data.text;

  for (var i = 0; i < palette.length; ++i) {
    if (property.color == palette[i]) {
      selectedColor = i;
    }
    if (property.borderColor == palette[i]) {
      selectedBorderColor = i;
    }
  }
};

const switchType = (etype: string) => {
  switch (etype) {
    case null: {
      toolAvailable["scale"] = false;
      toolAvailable["wrap"] = false;
      toolAvailable["clip"] = false;
      toolAvailable["round"] = false;
      document.getElementById("toolscale").style.color="#50555e"
      document.getElementById("toolwrap").style.color="#50555e"
      document.getElementById("toolclip").style.color="#50555e"
      document.getElementById("toolround").style.color="#50555e"
      break;
    }
    case "text": {
      toolAvailable["scale"] = true;
      toolAvailable["wrap"] = false;
      toolAvailable["clip"] = false;
      toolAvailable["round"] = false;
      document.getElementById("toolscale").style.color="#A7AFBE"
      document.getElementById("toolwrap").style.color="#50555e"
      document.getElementById("toolclip").style.color="#50555e"
      document.getElementById("toolround").style.color="#50555e"
      break;
    }
    default: {
      toolAvailable["pointer"] = true;
      toolAvailable["drag"] = true;
      toolAvailable["resize"] = true;
      toolAvailable["scale"] = false;
      toolAvailable["rotate"] = true;
      toolAvailable["wrap"] = false;
      toolAvailable["clip"] = false;
      toolAvailable["round"] = false;
      document.getElementById("toolscale").style.color="#50555e"
      document.getElementById("toolwrap").style.color="#50555e"
      document.getElementById("toolclip").style.color="#50555e"
      document.getElementById("toolround").style.color="#50555e"
      break;
    }
  }
}

const switchTool = (toTool: string) => {
  if (toolAvailable[toTool]) {
    document.getElementById("tool" + tool.value)!.style.backgroundColor = "";
    tool.value = toTool;
    document.getElementById("tool" + toTool)!.style.backgroundColor = "#464b56";
  }
};

const updateColor = (colorId: number) => {
  update.value = true;
  property.color = palette[colorId];
  colorCircles.value[selectedColor].style.borderWidth = "0px";
  colorCircles.value[selectedColor].style.margin = "4.5px";
  selectedColor = colorId;
  colorCircles.value[selectedColor].style.borderWidth = "2px";
  colorCircles.value[selectedColor].style.margin = "2.5px";
};

const updateBorder = (colorId: number) => {
  update.value = true;
  property.borderColor = palette[colorId];
  borderCircles.value[selectedBorderColor].style.borderWidth = "0px";
  borderCircles.value[selectedBorderColor].style.margin = "4.5px";
  selectedBorderColor = colorId;
  borderCircles.value[selectedBorderColor].style.borderWidth = "2px";
  borderCircles.value[selectedBorderColor].style.margin = "2.5px";
  if (palette[colorId] != "transparent" && property.borderWidth == 0) {
    message.info("注意：边框宽度为0");
  }
};

const displayPalette = () => {
  showPalette.value = true;
  colorCircles.value[selectedColor].style.borderWidth = "2px";
  colorCircles.value[selectedColor].style.margin = "2.5px";
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
  layoutId.value = parseInt(route.query.layoutId as string);
  layoutName.value = route.query.layoutName as string;
  canvasWidth.value = parseInt(route.query.canvasWidth as string);
  canvasHeight.value = parseInt(route.query.canvasHeight as string);
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
  switchTool("pointer");
});

const exit = () => {
  router.push("/project/prototypes");
};
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
  top: 36px;
  bottom: 0px;
  width: 100%;
  z-index: 1;
}
.ui {
  z-index: 100;
  user-select: none;
  position: relative;
}
.layoutHeader {
  height: 36px;
  background-color: #2b303b;
}
.backArrow {
  float: left;
  margin-top: 9px;
  margin-left: 12px;
}
.downloadIcon {
  float: right;
  margin-top: 9px;
  margin-right: 10px;
}
.home {
  text-align: center;
  font-family: Inter;
  font-weight: 700;
  font-size: 18px;
  line-height: 36px;
  color: #e2e4e9;
}
.toolBar {
  position: absolute;
  display: inline-block;
  background-color: #2b303b;
  left: 40px;
  top: 50%;
  transform: translate(0, -50%);
  width: 42px;
  border-radius: 8px;
}
.toolIcon {
  float: left;
  padding: 8px;
}
.toolIconTop {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.toolIconBottom {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.toolIcon:hover {
  background-color: #3a404f;
}
.porpertyBar {
  background-color: #2b303b;
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 125px;
  border-radius: 9px;
}
.porpertyRightUnit {
  border-top-right-radius: 9px;
  border-bottom-right-radius: 9px;
}
.porpertyBarInpUnit {
  height: 36px;
  line-height: 36px;
  padding-left: 12px;
  padding-right: 12px;
  color: #e2e4e9;
  float: left;
}
.porpertyText {
  float: left;
}
.porpertyInput {
  width: 52px;
  height: 21px;
  margin-top: 7.5px;
  margin-bottom: 7.5px;
  margin-left: 12px;
  padding-left: 1.5px;
  padding-right: 1.5px;
  font-size: 7.5px;
}
.porpertyFileUploader {
  position: absolute;
  left: 0;
  opacity: 0;
  width: 40px;
  height: 45px;
}
.porpertyBarIconUnit {
  height: 36px;
  float: left;
  position: relative;
}
.porpertyBarIconUnit:hover {
  background-color: #3a404f;
}
.porpertyIcon {
  width: 27px;
  height: 27px;
  margin: 4.5px;
  margin-right: 3px;
  float: left;
}
.porpertyExtension {
  float: left;
  margin-top: 4.5px;
  margin-bottom: 4.5px;
  margin-right: 1.5px;
}
.porpertyExtensionBoard {
  position: absolute;
  bottom: 49px;
  left: 22.5px;
  transform: translate(-50%, 0);
  background-color: #2b303b;
  border-radius: 9px;
}
.paletteBoard {
  width: 216px;
  padding: 12px;
}
.paletteColor {
  margin: 4.5px;
  float: left;
  border-radius: 50%;
  width: 27px;
  height: 27px;
  box-shadow: inset 1.5px 1.5px 3px rgba(0, 0, 0, 0.25);
  border-color: white;
  border-width: 0px;
  border-style: solid;
}
.fillIcon {
  border-radius: 50%;
  box-shadow: inset 1.5px 1.5px 3px rgba(0, 0, 0, 0.25);
  background-color: #ddb055;
}
.borderIcon {
  border-radius: 50%;
  border: 3.75px solid #8ed42b;
  box-shadow: inset 1.5px 1.5px 3px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}
.elementBar {
  background-color: #2b303b;
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 30px;
  border-radius: 18px;
}
.elementLeftUnit {
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
}
.elementRightUnit {
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
}
.elementBarUnit {
  width: 72px;
  height: 72px;
  float: left;
  position: relative;
}
.elementBarUnit:hover {
  background-color: #3a404f;
}
.elementUnit {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.elementRectangle {
  background-color: #ddb055;
  width: 42px;
  height: 42px;
}
.elementCircle {
  background-color: #ddb055;
  width: 42px;
  height: 42px;
  border-radius: 50% 50%;
}
.elementText {
  width: 42px;
  height: 42px;
}
.sider {
  width: 240px;
}
</style>