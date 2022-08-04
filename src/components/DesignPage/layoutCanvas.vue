<template>
  <div
    class="innerboard"
    @mouseup="ProduceElement"
    @click="cancelSelect"
    @mousemove="dragCanvas"
    @mousedown="startDrag"
    id="board"
  >
    <div class="innercanvas" id="canvas">
      <layout-element
        v-for="(params, index) in layoutElementParams"
        :key="index"
        :elementParams="params"
        :update="update"
        @select="select"
        @destroy="destroy"
        @updateParams="updateParams"
        @updateServer="updateUpdates"
        ref="layoutElements"
      >
      </layout-element>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import layoutElement from "./layoutElement.vue";
import html2canvas from "html2canvas";
import axios from "axios"
import utils from "@/Utils";
import {useMessage} from "naive-ui"

const headers ={
   Authorization: utils.getCookie('Authorization')
}

const message = useMessage();

const selected: any = ref(null);
const selectedId = ref<number>(-1);
let selectEns = false;
let preparedType: string = "";
let dragging: boolean = false;
let spacing: boolean = false;
let dragFromX: number = 0;
let dragFromY: number = 0;
let transDragFromX: number = 0;
let transDragFromY: number = 0;
let version: number = 0;
let update = ref<boolean>(true);

const layoutId = ref<number>(2);
const layoutName = ref<string>("")
const canvasWidth = ref<number>(1920);
const canvasHeight = ref<number>(1080);

const canvasTrans = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

type elementParams = {
  id:number,
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  borderWidth:number,
  borderRadius:number,
  type: string;
  color: string;
  borderColor: string;
  src: string;
  text: string,
  fontSize: number;
  locked: boolean;
};

type Prop = {
  layoutId:number;
  update:boolean,
  elementProps: elementParams;
};

const props = defineProps<Prop>();

const emits = defineEmits(["updateProps"]);

const layoutElementParams: (elementParams | null)[] = reactive([]);
const layoutElements = ref<any>([]);
let updates:elementParams[]=[]

const updateUpdates = (index:number)=>{
  if(index>=0&&index<layoutElementParams.length)
  {
    updates.push(layoutElementParams[index]);
  }
}

const updateServer = ()=>{
  axios.put(`/layout/${props.layoutId}/element`,{
    'version':version,
    'elements':updates
  },{headers:headers}).then(res=>{
    console.log(res.data);
    if(res.data.msg=="成功")
    {
      version = res.data.data.version;
      for(var i=0;i<res.data.data.elements.length;++i)
      {
        updateParams(res.data.data.elements[i]);
        update.value = true;
      }
    }
  })
  updates = []
}

const updateParams = (data: elementParams) => {
  //layoutElementParams[data.index]!.update = false;
  if(data.index>=layoutElementParams.length)
  {
    layoutElementParams.push(data);
    return;
  }
  layoutElementParams[data.index]!.id = data.id;
  layoutElementParams[data.index]!.index = data.index;
  layoutElementParams[data.index]!.x = data.x;
  layoutElementParams[data.index]!.y = data.y;
  layoutElementParams[data.index]!.width = data.width;
  layoutElementParams[data.index]!.height = data.height;
  layoutElementParams[data.index]!.borderWidth = data.borderWidth;
  layoutElementParams[data.index]!.borderRadius = data.borderRadius;
  layoutElementParams[data.index]!.type = data.type;
  layoutElementParams[data.index]!.color = data.color;
  layoutElementParams[data.index]!.borderColor = data.borderColor;
  layoutElementParams[data.index]!.src = data.src;
  layoutElementParams[data.index]!.text = data.text;
  layoutElementParams[data.index]!.fontSize = data.fontSize;
  layoutElementParams[data.index]!.locked = data.locked;
  update.value = false;
  // setTimeout(() => {
  //   update.value = true;
  // }, 100);
  updateProps();
};

const updateProps = () => {
  if(selectedId.value<0)
  {
    emits("updateProps",null);
  }
  emits("updateProps", layoutElementParams[selectedId.value]);
};

const select = (index: number) => {
  if (selected.value != null && selected.value != layoutElements.value[index]) {
    cancelSelect();
  }
  selected.value = layoutElements.value[index];
  selectedId.value = index;
  //selectEns = true;
  // setTimeout(() => {
  //   selectEns = false;
  // }, 100);
  updateProps();
};

const cancelSelect = () => {
  if (!selectEns) {
    if (selected.value != null) {
      selected.value.UnSelect();
    }
    selected.value = null;
    selectedId.value = -1;
    updateProps();
  }
};

const destroy = (index: number) => {
  layoutElementParams[index].type = "none";
  if (selectedId.value == index) {
    selected.value = null;
    selectedId.value = -1;
  }
};

const PrepareElement = (elementType: string) => {
  preparedType = elementType;
};

const ProduceElement = (e: MouseEvent) => {
  if (dragging) {
    dragging = false;
  }
  if (preparedType != "") {
    update.value = true;
    layoutElementParams.push({
      id:0,
      index: layoutElementParams.length,
      x: e.clientX - canvasTrans.x,
      y: e.clientY - canvasTrans.y,
      width: 200 * scale,
      height: 200 * scale,
      borderWidth: 0,
      borderRadius :0,
      type: preparedType,
      color: "#D42B39",
      borderColor: "transparent",
      src: "",
      text:"",
      fontSize: 20 * scale,
      //update: true,
      locked: false,
    });
    preparedType = "";
  }
  //updateServer(layoutElementParams.length-1);
};


// let canvas2: any;
let imgUri:string;
const download = (isDownload:boolean) => {
  // canvas2 = document.createElement("canvas");

  // var w = canvasTrans.width;
  // var h = canvasTrans.height;

  // canvas2.width = w * 4;
  // canvas2.height = h * 4;
  // canvas2.style.width = w + "px";
  // canvas2.style.height = h + "px";

  // var context = canvas2.getContext("2d");
  // context.scale(4, 4);
  html2canvas(document.getElementById("canvas")!).then(
    function (canvas) {
      imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      if(isDownload)
      {
        window.location.href = imgUri;
      }
      axios.put(`/layout/${layoutId.value}/img`,{
        src:imgUri,
      },{headers:headers}).then(res=>{
        console.log(res.data);
      })
    }
  );
};

defineExpose({
  PrepareElement,
  download
});

const startDrag = (e: MouseEvent) => {
  if (spacing) {
    dragFromX = e.clientX;
    dragFromY = e.clientY;

    transDragFromX = canvasTrans.x;
    transDragFromY = canvasTrans.y;

    dragging = true;
  }
};

const dragCanvas = (e: MouseEvent) => {
  if (dragging) {
    canvasTrans.x = transDragFromX + e.clientX - dragFromX;
    canvasTrans.y = transDragFromY + e.clientY - dragFromY;

    document.getElementById("canvas")!.style.left = `${canvasTrans.x}px`;
    document.getElementById("canvas")!.style.top = `${canvasTrans.y - 36}px`;
  }
};

onMounted(() => {
  updateServer();
  setInterval(updateServer,5000)
  document.onkeyup = (e) => {
    if (e.key == "Delete") {
      destroy(selectedId.value);
    }
    if (e.key == " ") {
      console.log("space");
      spacing = false;
      dragging = false;
      for (var i = 0; i < layoutElementParams.length; ++i) {
        if (layoutElementParams[i] != null) {
          layoutElementParams[i]!.locked = false;
        }
      }
    }
  };
  document.onkeydown = (e) => {
    if (e.key == " ") {
      console.log("space");
      spacing = true;
      for (var i = 0; i < layoutElementParams.length; ++i) {
        if (layoutElementParams[i] != null) {
          layoutElementParams[i]!.locked = true;
        }
      }
    }
  };
  initScale();
  canvasTrans.width = document.getElementById("canvas")!.clientWidth;
  canvasTrans.height = document.getElementById("canvas")!.clientHeight;
  canvasTrans.x = document.body.clientWidth / 2 - canvasTrans.width / 2;
  canvasTrans.y = 148;
  document.getElementById("canvas")!.style.left = `${canvasTrans.x}px`;
  document.getElementById("canvas")!.style.top = `${canvasTrans.y - 36}px`;
  document.getElementById("canvas")!.style.width = `${canvasTrans.width}px`;
  document.getElementById("canvas")!.style.height = `${canvasTrans.height}px`;
  wheelScale();
});

const initScale = ()=>{
  document.getElementById("canvas")!.style.width = canvasWidth.value/2.4+"px";
  document.getElementById("canvas")!.style.height = canvasHeight.value/2.4+"px";
}

let scale = 1;
const maxScale = 5;
const minScale = 0.5;
const wheelScale = () => {
  document.getElementById("board")!.onwheel = (e) => {
    let scope: number;
    if (e.deltaY > 0) {
      scope = 1 / 1.25;
    } else {
      scope = 1.25;
    }
    
    if(scale*scope>maxScale||scale*scope<minScale)
    {
      return;
    }
    scale*=scope;
    update.value = true;

    for (var i = 0; i < layoutElementParams.length; ++i) {
      if (layoutElementParams[i] == null) {
        continue;
      }
      //layoutElementParams[i]!.update = true;
      layoutElementParams[i]!.x *= scope;
      // (layoutElementParams[i]!.x - e.clientX + canvasTrans.x) * scope +
      // e.clientX -
      // canvasTrans.x;
      layoutElementParams[i]!.y *= scope;
      // (layoutElementParams[i]!.y - e.clientY + canvasTrans.y) * scope +
      // e.clientY -
      // canvasTrans.y;
      layoutElementParams[i]!.width *= scope;
      layoutElementParams[i]!.height *= scope;
      layoutElementParams[i]!.fontSize *= scope;
    }
    canvasTrans.x = (canvasTrans.x - e.clientX) * scope + e.clientX;
    canvasTrans.y = (canvasTrans.y - e.clientY) * scope + e.clientY;
    canvasTrans.width *= scope;
    canvasTrans.height *= scope;
    document.getElementById("canvas")!.style.left = `${canvasTrans.x}px`;
    document.getElementById("canvas")!.style.top = `${canvasTrans.y - 48}px`;
    document.getElementById("canvas")!.style.width = `${canvasTrans.width}px`;
    document.getElementById("canvas")!.style.height = `${canvasTrans.height}px`;
    updateProps();
  };
};

watch(
  () => props,
  (newVal) => {
    if (selectedId.value < 0||props.update==false) {
      return;
    }
    update.value = true;
    if(newVal.elementProps.borderWidth<=0 && layoutElementParams[selectedId.value]!.borderColor != newVal.elementProps.borderColor)
    {
      message.info("注意：边框颜色为透明")
    }
    layoutElementParams[selectedId.value]!.id = newVal.elementProps.id;
    layoutElementParams[selectedId.value]!.index = newVal.elementProps.index;
    layoutElementParams[selectedId.value]!.x = newVal.elementProps.x;
    layoutElementParams[selectedId.value]!.y = newVal.elementProps.y;
    layoutElementParams[selectedId.value]!.width = newVal.elementProps.width;
    layoutElementParams[selectedId.value]!.height = newVal.elementProps.height;
    layoutElementParams[selectedId.value]!.borderWidth = newVal.elementProps.borderWidth;
    layoutElementParams[selectedId.value]!.borderRadius = newVal.elementProps.borderRadius;
    layoutElementParams[selectedId.value]!.color = newVal.elementProps.color;
    layoutElementParams[selectedId.value]!.borderColor = newVal.elementProps.borderColor;
    layoutElementParams[selectedId.value]!.type = newVal.elementProps.type;
    layoutElementParams[selectedId.value]!.src = newVal.elementProps.src;
    layoutElementParams[selectedId.value]!.text = newVal.elementProps.text;
    layoutElementParams[selectedId.value]!.fontSize = newVal.elementProps.fontSize;
    layoutElementParams[selectedId.value]!.locked = newVal.elementProps.locked;
    updateUpdates(newVal.elementProps.index)
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style scoped>
.innerboard {
  width: 100%;
  background-color: #000000;
}
.innercanvas {
  width: 676px;
  height: 335px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 100px;
}
</style>