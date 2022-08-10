
<template>
  <div class="board" @mousedown="ShutBoard">
    <div class="layoutHeader home ui" @mousedown.stop>
      <n-icon size="18" color="#A7AFBE" class="backArrow" @click.stop="exit">
        <arrow-back-ios-round />
      </n-icon>
      {{ layoutName }}
      <n-icon
        size="21"
        color="#A7AFBE"
        class="downloadIcon"
        @click.stop="displaySetting"
      >
        <settings28-regular />
      </n-icon>
      <n-icon
        size="21"
        color="#A7AFBE"
        class="downloadIcon"
        @mouseenter="hoverDownload"
      >
        <file-download-filled />
      </n-icon>
      <n-icon size="21" color="#A7AFBE" class="downloadIcon" @click.stop="save">
        <save16-regular />
      </n-icon>
    </div>
    <div class="downloadSelector ui" id="downloadSelector" @mousedown.stop>
      <div
        v-for="(value, index) in downloadType"
        :key="index"
        class="downloadAlternative"
        @click.stop="download(value)"
      >
        {{ value }}
      </div>
    </div>
    <div class="canvasBoard">
      <layout-canvas
        class="canvas"
        ref="canvas"
        :update="update"
        @updateProps="updateProps"
        @changeUpdate="changeUpdate"
        @initPageImgs="initPageImgs"
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
            @click.stop="switchTool('pointer')"
          >
            <cursor24-regular />
          </n-icon>
          <n-icon
            size="27"
            color="#A7AFBE"
            class="toolIcon"
            id="tooldrag"
            @click.stop="switchTool('drag')"
          >
            <md-move />
          </n-icon>
          <n-icon
            size="27"
            color="#A7AFBE"
            class="toolIcon"
            id="toolresize"
            @click.stop="switchTool('resize')"
          >
            <resize-large20-regular />
          </n-icon>
          <n-icon
            size="27"
            color="#50555e"
            class="toolIcon"
            id="toolscale"
            @click.stop="switchTool('scale')"
          >
            <scale-fill24-regular />
          </n-icon>
          <n-icon
            size="27"
            color="#A7AFBE"
            class="toolIcon"
            id="toolrotate"
            @click.stop="switchTool('rotate')"
          >
            <arrow-rotate-clockwise16-regular />
          </n-icon>
          <n-icon
            size="27"
            color="#50555e"
            class="toolIcon"
            id="toolwrap"
            @click.stop="switchTool('wrap')"
          >
            <format-shapes-outlined />
          </n-icon>
          <n-icon
            size="27"
            color="#50555e"
            class="toolIcon"
            id="toolclip"
            @click.stop="switchTool('clip')"
          >
            <crop20-filled />
          </n-icon>
          <n-icon
            size="27"
            color="#50555e"
            class="toolIcon toolIconBottom"
            id="toolround"
            @click.stop="switchTool('round')"
          >
            <rounded-corner-round />
          </n-icon>
        </div>

        <div class="ui settingBar" id="settingBoard" @mousedown.stop>
          <div class="settingMenu" @click.stop="switchSettingMenu('device')">
            设备
          </div>
          <div class="settingMenu" @click.stop="switchSettingMenu('model')">
            模板
          </div>
          <div class="settingLine"></div>
          <n-scrollbar content-style="paddingRight:10px;">
            <div id="settingDeviceContent" class="settingContent">
              <div :key="outkey" v-for="(outvalue, outkey) in resolutionModel">
                <div class="settingDevice">{{ outkey }}</div>
                <div
                  :key="inkey"
                  v-for="(value, inkey) in outvalue"
                  class="settingDeviceModel"
                  @click.stop="
                    canvasWidth = value[0];
                    canvasHeight = value[1];
                  "
                >
                  <div class="settingDeviceModelName">
                    {{ inkey }}
                  </div>
                  <div class="settingDeviceResolution">
                    {{ value[0] }}*{{ value[1] }}
                  </div>
                  <div class="clear"></div>
                </div>
              </div>
            </div>
            <div
              id="settingModelContent"
              class="settingContent"
              style="transform: translate(110%, 0)"
            >
              <div
                v-for="(value, index) in models"
                :key="value.name"
                class="settingModel"
                @click.stop="switchModel(index)"
              ></div>
            </div>
          </n-scrollbar>
        </div>

        <div class="ui pageBoardBox" id="pageBoardBox">
          <n-scrollbar
            style="
              width: 279px;
              height: 100%;
              transform: translate(-100%, 0);
              position: absolute;
              background-color: #2b303b;
              border-right:2px solid #151515;
            "
            id="pageScrollBar"
          >
            <div class="pageBoard" id="pageBoard">
              <div
                v-for="(value, index) in pageImgs"
                :class="
                  value.id != layoutId ? pageImageClass : pageImageSelectedClass
                "
                :key="index"
                :style="{ backgroundImage: 'url(' + value.src + ')' }"
                @click.stop="switchPage(value.id)"
              ></div>
            </div>
          </n-scrollbar>

          <div
            class="ui elementRightUnit elementBrowser pageBrowser"
            @click.stop="displayPageBoard"
            id="pageBrowser"
          >
            <n-icon
              size="18"
              color="#A7AFBE"
              class="elementArrow"
              v-show="pageOn"
            >
              <arrow-back-ios-round />
            </n-icon>
            <n-icon
              size="18"
              color="#A7AFBE"
              class="elementArrow"
              v-show="!pageOn"
            >
              <arrow-forward-ios-round />
            </n-icon>
          </div>
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
            id="wPorperty"
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
            id="tPorperty"
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
            @click.stop="displayPalette"
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
                @click.stop="updateColor(index)"
                class="paletteColor"
                ref="colorCircles"
              ></div>
            </div>
          </div>
          <div
            id="borderColor"
            class="porpertyBarIconUnit porpertyRightUnit"
            @click.stop="displayBorderPalette"
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
                @click.stop="updateBorder(index)"
                class="paletteColor"
                ref="borderCircles"
              ></div>
            </div>
          </div>
        </div>

        <div class="ui elementBar">
          <div class="ui elementSubBar" v-show="modelAt >= 0">
            <div class="elementLeftUnit elementBrowser" @click.stop="switchElement(-1)">
              <n-icon size="18" color="#A7AFBE" class="elementArrow">
                <arrow-back-ios-round />
              </n-icon>
              <div class="elementVerticalLine" style="right: 0px"></div>
            </div>

            <!-- <div
              class="ui elementBarUnit"
              @mousedown="PrepareElement('circle')"
            >
              <div class="ui elementUnit elementCircle"></div>
            </div> -->
            <div
              class="ui elementBarUnit"
              v-for="(value, index) in elementSrcs"
              :key="index"
              @mousedown="PrepareElement(value)"
            >
              <div
                class="ui elementUnit"
                :style="{ backgroundImage: 'url(' + value + ')' }"
              ></div>
            </div>
            <div class="elementRightUnit elementBrowser" @click.stop="switchElement(1)">
              <div class="elementVerticalLine" style="left: 0px"></div>
              <n-icon size="18" color="#A7AFBE" class="elementArrow">
                <arrow-forward-ios-round />
              </n-icon>
            </div>
          </div>
          <div class="ui elementSubBar">
            <div
              class="ui elementBarUnit elementLeftUnit"
              @mousedown="PrepareElement('rect')"
            >
              <div class="ui elementUnit elementRectangle"></div>
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
  Settings28Regular,
} from "@vicons/fluent";
import {
  FrontHandOutlined,
  KeyboardArrowUpRound,
  ArrowBackIosRound,
  ArrowForwardIosRound,
  FileDownloadFilled,
  FormatShapesOutlined,
  RoundedCornerRound,
} from "@vicons/material";
import { MdMove } from "@vicons/ionicons4";
import { useMessage } from "naive-ui";

import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { gsap } from "gsap";
import { useRoute, useRouter } from "vue-router";

import utils from "@/Utils";

const message = useMessage();
const route = useRoute();
const router = useRouter();

const headers = {
  Authorization: utils.getCookie("Authorization"),
};

const canvas = ref<any>(null);
const PrepareElement = (elementType: string) => {
  canvas.value?.PrepareElement(elementType);
};

const download = (type: string) => {
  console.log(type);
  canvas.value?.download(true, type);
};

const save = () => {
  console.log(canvas.value);
  canvas.value?.updateServer();
};

const layoutId = ref<number>(2);
const layoutName = ref<string>("Home");
const canvasWidth = ref<number>(0);
const canvasHeight = ref<number>(0);

const settingAt = ref<string>("device");

const resolutionModel: { [key: string]: { [key: string]: number[] } } =
  reactive({
    Phone: {
      "iPhone 13 Pro Max": [428, 926],
      "iPhone 13 / 13 Pro": [390, 844],
      "iPhone 13 mini": [375, 812],
      "iPhone 11 Pro Max": [414, 896],
      "iPhone 11 Pro / X": [375, 812],
      "iPhone SE": [320, 568],
      "iPhone 8 Plus": [414, 736],
      "iPhone 8": [375, 667],
      "Android small": [360, 640],
      "Android large": [360, 800],
    },
    Tablet: {
      "Surface Pro 8": [1440, 960],
      "iPad mini 8.3": [774, 1133],
      "iPad Pro 11''": [834, 1194],
      "iPad Pro 12.9''": [1024, 1366],
    },
    Desktop: {
      "Mac Pro 14''": [1512, 982],
      "Mac Pro 16''": [1728, 1117],
      Desktop: [1440, 1024],
      iMac: [1280, 720],
    },
    Presentation: {
      "Slide 16:9": [1920, 1080],
      "Slide 4:3": [1024, 768],
    },
    Paper: {
      A4: [595, 842],
      A5: [420, 595],
      Letter: [612, 792],
      Tabloid: [792, 1224],
    },
  });
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
const downloadType = reactive<string[]>(["jpg", "png", "jpeg"]);
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const showPalette = ref<boolean>(false);
const showBorderPalette = ref<boolean>(false);
const pageOn = ref<boolean>(false);
const settingOn = ref<boolean>(false);

const colorCircles = ref<any>([]);
const borderCircles = ref<any>([]);
const update = ref<boolean>(true);

type layoutImg = {
  id: number;
  name: string;
  src: string;
};
const pageImgs = reactive<layoutImg[]>([]);
const pageImageClass = ref<string>("pageImage");
const pageImageSelectedClass = ref<string>("pageImageSelected");

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
  borderRadius: string;
  type: string;
  color: string;
  borderColor: string;
  src: string;
  text: string;
  fontSize: number;
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
  borderRadius: "0px",
  type: "none",
  text: "",
  fontSize: 0,
  src: "",
  color: "#D42B39",
  borderColor: "transparent",
});

type Model = {
  name: string;
  elements: Property[];
  srcs: string[];
};
const models = reactive<Model[]>([]);
let modelAt = ref<number>(-1);
const elementSrcs = reactive<string[]>([]);
let firstSrc: number = 0;
const maxElementsNum = 6;
const endingLeft = ref<boolean>(true);
const endingRight = ref<boolean>(true);

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
  if (property.type != data.type) {
    switchType(data.type);
  }
  property.id = data.id;
  property.x = data.x;
  property.y = data.y;
  property.width = data.width;
  property.height = data.height;
  property.scaleX = data.scaleX;
  property.scaleY = data.scaleY;
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

const initModels = () => {
  axios.get("/layout/module/list", { headers: headers }).then((res) => {
    console.log(res.data);
    for (var i = 0; i < res.data.data.length; ++i) {
      var model = JSON.parse(res.data.data[i].content);
      models[i] = model;
      console.log(models);
    }
  });
};

const initPageImgs = () => {
  axios
    .get("/layout/list", {
      headers: headers,
      params: {
        programID: parseInt(utils.getCookie("proID")), // proID.value,
      },
    })
    .then((res) => {
      if (res.data.msg === "成功") {
        console.log(res.data);

        for (var i = 0; i < res.data.data.items.length; ++i) {
          pageImgs[i] = {
            id: res.data.data.items[i].ID,
            name: res.data.data.items[i].name,
            src: res.data.data.items[i].src,
          };
        }
      }
    });
  //console.log(pageImgs);
};

const switchModel = (id: number) => {
  var to = 0;
  modelAt.value = id;
  endingLeft.value = true;
  firstSrc = 0;
  if (models[id].srcs.length <= maxElementsNum) {
    endingRight.value = true;
    var to = models[id].srcs.length;
  }
  else
  {
    endingRight.value = false;
    to = maxElementsNum;
  }
  elementSrcs.splice(0);
  for (var i = 0; i < to; ++i) {
    elementSrcs[i] = models[id].srcs[i];
  }
  console.log(elementSrcs);
};

const switchElement = (dir: number) => {
  console.log(endingRight.value)
  console.log(models[modelAt.value].srcs);
  if ((dir < 0 && endingLeft.value) || (dir > 0 && endingRight.value)) {
    return;
  }
  var from = firstSrc + dir * maxElementsNum;
  firstSrc = from;
  if (from > models[modelAt.value].srcs.length || from < 0) {
    return;
  }
  if(from > 0)
  {
    endingLeft.value = false;
  }
  else
  {
    endingLeft.value = true;
  }
  var to = from + maxElementsNum;
  if (to >= models[modelAt.value].srcs.length) {
    to = models[modelAt.value].srcs.length;
    endingRight.value = true
  }
  else
  {
    endingRight.value = false;
  }
  elementSrcs.splice(0);
  for (var i = from; i < to; ++i) {
    elementSrcs[i - from] = models[modelAt.value].srcs[i];
  }
};

const switchPage = (id: number) => {
  layoutId.value = id;
};

const switchType = (etype: string) => {
  switch (etype) {
    case null: {
      toolAvailable["scale"] = false;
      toolAvailable["wrap"] = false;
      toolAvailable["clip"] = false;
      toolAvailable["round"] = false;
      document.getElementById("toolscale").style.color = "#50555e";
      document.getElementById("toolwrap").style.color = "#50555e";
      document.getElementById("toolclip").style.color = "#50555e";
      document.getElementById("toolround").style.color = "#50555e";
      break;
    }
    case "text": {
      toolAvailable["scale"] = true;
      toolAvailable["wrap"] = false;
      toolAvailable["clip"] = false;
      toolAvailable["round"] = false;
      document.getElementById("toolscale").style.color = "#A7AFBE";
      document.getElementById("toolwrap").style.color = "#50555e";
      document.getElementById("toolclip").style.color = "#50555e";
      document.getElementById("toolround").style.color = "#50555e";
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
      toolAvailable["round"] = true;
      document.getElementById("toolscale").style.color = "#50555e";
      document.getElementById("toolwrap").style.color = "#50555e";
      document.getElementById("toolclip").style.color = "#50555e";
      document.getElementById("toolround").style.color = "#A7AFBE";
      break;
    }
  }
};

const switchTool = (toTool: string) => {
  console.log(toTool);
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

const hoverDownload = () => {
  gsap.to("#downloadSelector", {
    duration: 0.1,
    translateY: "0",
  });
};

const displayPageBoard = () => {
  if (pageOn.value) {
    gsap.to("#pageScrollBar", {
      duration: 0.2,
      translateX: "-100%",
    });
    gsap.to("#pageBrowser", {
      duration: 0.2,
      translateX: "0px",
    });
    pageOn.value = false;
  } else {
    gsap.to("#pageScrollBar", {
      duration: 0.2,
      translateX: "0%",
    });
    gsap.to("#pageBrowser", {
      duration: 0.2,
      translateX: "279px",
    });
    pageOn.value = true;
  }
};

const switchSettingMenu = (settingMenu: string) => {
  if (settingMenu == "device") {
    gsap.to("#settingDeviceContent", {
      duration: 0.2,
      translateX: "0",
    });
    gsap.to("#settingModelContent", {
      duration: 0.2,
      translateX: "110%",
    });
  } else {
    gsap.to("#settingDeviceContent", {
      duration: 0.2,
      translateX: "-110%",
    });
    gsap.to("#settingModelContent", {
      duration: 0.2,
      translateX: "0",
    });
  }
};

const displaySetting = () => {
  if (settingOn.value) {
    gsap.to("#settingBoard", {
      duration: 0.2,
      translateX: "100%",
    });
    settingOn.value = false;
  } else {
    gsap.to("#settingBoard", {
      duration: 0.2,
      translateX: "0",
    });
    settingOn.value = true;
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
  gsap.to("#downloadSelector", {
    duration: 0.1,
    translateY: "-100%",
  });
};

onMounted(() => {
  var imgInputer = document.getElementById("fileUploader");
  layoutId.value = parseInt(route.query.layoutId as string);
  layoutName.value = route.query.layoutName as string;
  canvasWidth.value = parseInt(route.query.canvasWidth as string);
  canvasHeight.value = parseInt(route.query.canvasHeight as string);
  console.log("layoutId=" + layoutId.value);
  initPageImgs();
  initModels();
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
        //property.src = res.data.data;
        var imgUrl = res.data.data;
        var canvas = document.createElement("canvas"), //获取canvas
          ctx = canvas.getContext("2d"), //对应的CanvasRenderingContext2D对象(画笔)
          img = new Image(), //创建新的图片对象
          base64 = "", //base64
          num = Math.random();
        img.src = imgUrl + "?" + num;
        console.log(num);
        img.setAttribute("crossOrigin", "Anonymous");
        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          base64 = canvas.toDataURL("image/png");
          property.src = res.data.data;
        };
      }
    });
  };
  switchTool("pointer");
});

const exit = () => {
  save();
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
.downloadSelector {
  position: absolute;
  right: 51px;
  transform: translate(50%, -100%);
  top: 36px;
  z-index: 2;
  background-color: #2b303b;
  color:#d4d4d4;
}
.downloadAlternative {
  display: block;
  text-align: center;
  width: 60px;
  line-height: 35px;
  height: 35px;
}
.downloadAlternative:hover {
  background-color: #3a404f;
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
.settingBar {
  position: absolute;
  display: inline-block;
  background-color: #2b303b;
  right: 0px;
  top: 0px;
  bottom: 0px;
  transform: translate(100%, 0);
  width: 270px;
  text-align: left;
  padding: 20px;
  padding-right: 0px;
  overflow: hidden;
}
.settingMenu {
  display: inline-block;
  cursor: pointer;
  color: #fff;
  font-size: 12px;
  line-height: 42px;
  margin-right: 20px;
}
.settingLine {
  margin-right: 10px;
  height: 1px;
  border-bottom: 1px solid #fff;
}
.settingContent {
  width:260px;
  position: absolute;
}
.settingDevice {
  font-weight: bold;
  font-family: "Microsoft Yahei";
  color: #fff;
  margin-top: 15px;
}
.settingDeviceModel {
  line-height: 30px;
}
.settingDeviceModel:hover {
  background-color: #4c5263;
}
.settingDeviceModelName {
  float: left;
  margin-left: 10px;
  color: #fff;
}
.settingDeviceResolution {
  float: right;
  color: #ccc;
}
.settingModel {
  width: 250px;
  height: 140px;
  border-style: solid;
  border-width: 3px;
  margin-top: 25px;
  background-size: cover;
}
.pageBoardBox {
  position: absolute;
  height: 100%;
}
.pageBoard {
  /* position: absolute; */
  display: inline-block;
  /*background-color: #2b303b;
  opacity: 70%;
  border-width: 0px;
  border-style: solid;
  border-right-width: 3px;
  border-color: #151515;*/
  left: 0px;
  top: 0px;
  bottom: 0px;
  /* transform: translate(-100%, 0); */
  text-align: left;
  padding: 15px;
}
.pageImage,.pageImageSelected {
  width: 240px;
  height: 140px;
  border-style: solid;
  border-width: 2px;
  margin-bottom: 25px;
  border-radius:6px;
  background-size: 100% 100%;
}
.pageImage{
  border-color:#2b303b;

}
.pageImageSelected {
  border-color: #D42B39;
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
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 30px;
}
.elementSubBar {
  margin-right: 30px;
  float: left;
}
.elementBrowser {
  width: 18px;
  height: 72px;
  background-color: #2b303b;
  float: left;
  position: relative;
}
.elementLeftUnit {
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
}
.elementArrow {
  position: absolute;
  left: 1px;
  top: 0;
  bottom: 0;
  margin: auto;
}
.elementBrowser:hover {
  background-color: #3a404f;
}
.elementBrowser:active {
  background-color: #515868;
}
.elementRightUnit {
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
}
.elementVerticalLine {
  position: absolute;
  background: #4a4a4a;
  width: 1px;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 64px;
}
.elementBarUnit {
  width: 72px;
  height: 72px;
  float: left;
  position: relative;
  background-color: #2b303b;
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
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 42px;
  height: 42px;
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
.pageBrowser {
  position: absolute;
  top: 0;
  bottom: 0;
  left:2px;
  margin: auto;
}
.sider {
  width: 240px;
}
.clear {
  clear: both;
}
</style>