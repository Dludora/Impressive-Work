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
        @select="select"
        @destroy="destroy"
        @updateParams="updateParams"
        ref="layoutElements"
      >
      </layout-element>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import layoutElement from "./layoutElement.vue";

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

const canvasTrans = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

type elementParams = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  typeOrSrc: string;
  update: boolean;
  locked: boolean;
};

type transParam = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const layoutElementParams: (elementParams | null)[] = reactive([]);
const layoutElements = ref<any>([]);

const updateParams = (data: transParam) => {
  layoutElementParams[data.id]!.update = false;
  layoutElementParams[data.id]!.x = data.x;
  layoutElementParams[data.id]!.y = data.y;
  layoutElementParams[data.id]!.width = data.width;
  layoutElementParams[data.id]!.height = data.height;
};

const select = (id: number) => {
  if (selected.value != null && selected.value != layoutElements.value[id]) {
    cancelSelect();
  }
  selected.value = layoutElements.value[id];
  selectedId.value = id;
  selectEns = true;
  setTimeout(() => {
    selectEns = false;
  }, 100);
};

const cancelSelect = () => {
  if (!selectEns) {
    if (selected.value != null) {
      selected.value.UnSelect();
    }
    selected.value = null;
    selectedId.value = -1;
  }
};

const destroy = (id: number) => {
  layoutElementParams[id] = null;
  if (selectedId.value == id) {
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
    layoutElementParams.push({
      id: layoutElementParams.length,
      x: e.clientX - canvasTrans.x,
      y: e.clientY - canvasTrans.y,
      width: 200,
      height: 200,
      typeOrSrc: preparedType,
      update: true,
      locked: false,
    });
    preparedType = "";
  }
};

defineExpose({
  PrepareElement,
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
    document.getElementById("canvas")!.style.top = `${canvasTrans.y - 48}px`;
  }
};

onMounted(() => {
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
  canvasTrans.width = document.getElementById("canvas")!.clientWidth;
  canvasTrans.height = document.getElementById("canvas")!.clientHeight;
  canvasTrans.x = document.body.clientWidth / 2 - canvasTrans.width / 2;
  canvasTrans.y = 148;
  document.getElementById("canvas")!.style.left = `${canvasTrans.x}px`;
  document.getElementById("canvas")!.style.top = `${canvasTrans.y - 48}px`;
  document.getElementById("canvas")!.style.width = `${canvasTrans.width}px`;
  document.getElementById("canvas")!.style.height = `${canvasTrans.height}px`;
  wheelScale();
});

let scale = 1;
const maxScale = 3;
const minScale = 0.5;
const wheelScale = () => {
  console.log(canvasTrans);
  document.getElementById("board")!.onwheel = (e) => {
    let scope: number;
    console.log(e.clientX);
    if (e.deltaY > 0) {
      scope = 1 / 1.25;
    } else {
      scope = 1.25;
    }

    for (var i = 0; i < layoutElementParams.length; ++i) {
      if (layoutElementParams[i] == null) {
        continue;
      }
      layoutElementParams[i]!.update = true;
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
    }
    canvasTrans.x = (canvasTrans.x - e.clientX) * scope + e.clientX;
    canvasTrans.y = (canvasTrans.y - e.clientY) * scope + e.clientY;
    canvasTrans.width *= scope;
    canvasTrans.height *= scope;
    console.log(canvasTrans);
    document.getElementById("canvas")!.style.left = `${canvasTrans.x}px`;
    document.getElementById("canvas")!.style.top = `${canvasTrans.y - 48}px`;
    document.getElementById("canvas")!.style.width = `${canvasTrans.width}px`;
    document.getElementById("canvas")!.style.height = `${canvasTrans.height}px`;
  };
};
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