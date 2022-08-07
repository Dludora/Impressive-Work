<template>
  <div
    class="innerboard"
    @mouseup="ProduceElement"
    @mousemove="dragCanvas"
    @updateParams="updateSelects"
    @changeUpdate="changeUpdate"
    @mousedown="startDrag"
    id="board"
  >
    <div class="innercanvas" id="canvas">
      <layout-element
        v-for="(params, index) in layoutElementParams"
        :key="index"
        :elementParams="params"
        :update="update"
        :index="index"
        :data-index="index"
        @updateParams="updateSelect"
        ref="layoutElements"
        name="elements"
      >
      </layout-element>
    </div>
    <div id="blank" class="blank"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import layoutElement from "./layoutElement.vue";
import html2canvas from "html2canvas";
import axios from "axios";
import utils from "@/Utils";
import { useMessage } from "naive-ui";

import Selecto from "selecto";
import Moveable from "moveable";

const headers = {
  Authorization: utils.getCookie("Authorization"),
};

const message = useMessage();

const selected = ref<any[]>([]);
const selectedId = ref<number[]>([]);
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
let locked: boolean = false;

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
};

type Prop = {
  layoutId: number;
  tool: string;
  update: boolean;
  elementProps: elementParams;
  canvasWidth: number;
  canvasHeight: number;
};

const props = defineProps<Prop>();

const emits = defineEmits(["updateProps", "changeUpdate"]);

const layoutElementParams: (elementParams | null)[] = reactive([]);
const paramsDic: { [key: number]: elementParams } = {};
const layoutElements = ref<any>([]);
let updates: elementParams[] = [];

let moveable: Moveable;

const initMoveable = () => {
  moveable = new Moveable(document.getElementById("canvas"), {
    target: [].slice.call(document.getElementsByName("elements")),
    // If the container is null, the position is fixed. (default: parentElement(document.body))
    container: document.getElementById("canvas"),
    renderDirections: ["n", "nw", "ne", "s", "se", "sw", "e", "w"],
    defaultGroupOrigin: "50% 50%",
    defaultGroupRotate: 0,
    draggable: true,
    resizable: true,
    scalable: false,
    rotatable: true,
    warpable: false,
    origin: true,
    originDraggable: true,
    keepRatio: false,
    // Resize, Scale Events at edges.
    edge: true,
    throttleDrag: 0,
    throttleResize: 0,
    throttleScale: 0,
    throttleRotate: 0,
  });
  /* draggable */
  moveable
    .on("clickGroup", (e) => {
      selecto.clickTarget(e.inputEvent, e.inputTarget);
    })
    .on("drag", ({ target, translate, transform }) => {
      target!.style.transform = transform;
      layoutElementParams[selectedId.value[0]].x = translate[0];
      layoutElementParams[selectedId.value[0]].y = translate[1];
      updateProps();
    })
    .on("dragGroup", ({ targets, events }) => {
      if (!locked) {
        var i = 0;
        for (i = 0; i < targets.length; ++i) {
          moveable.target[i]!.style.transform = events[i].transform;
          layoutElementParams[selectedId.value[i]].x = events[i].translate[0];
          layoutElementParams[selectedId.value[i]].y = events[i].translate[1];
        }
      }
    });

  /* resizable */
  moveable
    .on("resizeStart", (e) => {
      e.setOrigin(["%", "%"]);
      e.dragStart && e.dragStart.set([0, 0]);
    })
    .on("resize", ({ target, delta, width, height, transform, drag }) => {
      target!.style.width = `${width}px`;
      target!.style.height = `${height}px`;
      target.style.transform = transform; //`translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
      layoutElementParams[selectedId.value[0]].width = width;
      layoutElementParams[selectedId.value[0]].height = height;
      layoutElementParams[selectedId.value[0]].x = drag.translate[0];
      layoutElementParams[selectedId.value[0]].y = drag.translate[1];
      updateProps();
    })
    .on("resizeGroupStart", ({ events }) => {
      events.forEach((ev, i) => {
        ev.dragStart && ev.dragStart.set([
            layoutElementParams[selectedId.value[i]].x,
            layoutElementParams[selectedId.value[i]].y,
          ]);
      });
    })
    .on("resizeGroup", ({ events }) => {
      events.forEach((ev, i) => {
        layoutElementParams[selectedId.value[i]].x = ev.drag.translate[0];
        layoutElementParams[selectedId.value[i]].y = ev.drag.translate[1];
        layoutElementParams[selectedId.value[i]].width = ev.width;
        layoutElementParams[selectedId.value[i]].height = ev.height;
        updateTransform(
          selected.value[i],
          layoutElementParams[selectedId.value[i]]
        );
      });
    });

  /* scalable */
  moveable
    .on("scaleStart", ({ target, clientX, clientY }) => {
      console.log("onScaleStart", target);
    })
    .on("scale", ({ target, transform }) => {
      console.log("onScale scale", scale);
      target!.style.transform = transform;
    });

  /* rotatable */
  moveable
    .on("rotate", ({ target, rotation, transform }) => {
      target!.style.transform = transform;
      layoutElementParams[selectedId.value[0]].rotation = rotation;
    })
    .on("rotateGroupStart", ({ events }) => {
      events.forEach((ev, i) => {
        ev.set(layoutElementParams[selectedId.value[i]].rotation);
        ev.dragStart &&
          ev.dragStart.set([
            layoutElementParams[selectedId.value[i]].x,
            layoutElementParams[selectedId.value[i]].y,
          ]);
      });
    })
    .on("rotateGroup", ({ events }) => {
      events.forEach((ev, i) => {
        layoutElementParams[selectedId.value[i]].x = ev.drag.translate[0];
        layoutElementParams[selectedId.value[i]].y = ev.drag.translate[1];
        layoutElementParams[selectedId.value[i]].rotation = ev.rotation;

        updateTransform(
          selected.value[i],
          layoutElementParams[selectedId.value[i]]
        );
      });
    });

  /* warpable */
  let matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  moveable.on(
    "warp",
    ({ target, clientX, clientY, delta, dist, multiply, transform }) => {
      // target.style.transform = transform;
      matrix = multiply(matrix, delta);
      target.style.transform = `matrix3d(${matrix.join(",")})`;
    }
  );
};

let selecto: Selecto;
const initSelecto = () => {
  selecto = new Selecto({
    container: document.getElementById("board"),
    // dragContainer: document.getElementById("board"),
    boundContainer: document.getElementById("board"),
    selectableTargets: [].slice.call(document.getElementsByName("elements")),
    selectByClick: true,
    selectFromInside: false,
    continueSelect: false,
    toggleContinueSelect: "shift",
    keyContainer: window,
    hitRate: 0,
  });

  selecto
    .on("dragStart", (e) => {
      const target = e.inputEvent.target;
      if (
        moveable.isMoveableElement(target) ||
        selected.value.some((t) => t === target || t.contains(target))
      ) {
        e.stop();
      }
    })
    .on("selectEnd", (e) => {
      e.removed.forEach((el) => {
        layoutElements.value[el.getAttribute("data-index")].UnSelect();
      });

      selected.value = e.selected;
      moveable.target = null;
      moveable.target = e.selected;

      selectedId.value.splice(0);
      e.selected.forEach((el) => {
        selectedId.value.push(parseInt(el.getAttribute("data-index")));
        //selected.value.push(layoutElements.value[el.getAttribute("data-index")]);
        layoutElements.value[el.getAttribute("data-index")].Select();
      });

      if (e.isDragStart) {
        e.inputEvent.preventDefault();

        setTimeout(() => {
          moveable.dragStart(e.inputEvent);
        });
      }
      updateProps();
    });
};

const changeUpdate = () => {
  update.value = true;
  emits("changeUpdate");
};

const updateUpdates = (modifyed: elementParams) => {
  var updateIndex = updates.findIndex((cv, ci) => {
    if (cv.id == modifyed.id) {
      return true;
    }
  });
  if (updateIndex == -1) {
    updates.push(modifyed);
  } else {
    updates[updateIndex] = modifyed;
  }
};

const updateServer = () => {
  axios
    .put(
      `/layout/${props.layoutId}/element`,
      {
        version: version,
        elements: updates,
      },
      { headers: headers }
    )
    .then((res) => {
      console.log(res.data);
      if (res.data.msg == "成功") {
        version = res.data.data.version;
        var i = 0;
        for (i = 0; i < res.data.data.elements.length; ++i) {
          updateParams(res.data.data.elements[i]);
          update.value = true;
        }
        for (; i < layoutElementParams.length; ++i) {
          if (layoutElementParams[i].id != 0) {
            layoutElementParams.splice(i, 1);
          }
        }
      }
    });
  updates = [];
};

const updateSelects = (data: elementParams) => {
  layoutElementParams[selectedId.value[0]].text = data.text;
};

const updateTransform = (element: HTMLElement, data: elementParams) => {
  element!.style.width = data.width * scale + "px";
  element!.style.height = data.height * scale + "px";
  console.log(data);

  element!.style.transform =
    `translate(${data.x * scale}px,${data.y * scale}px)` +
    ` scale(${data.scaleX},${data.scaleY})` +
    ` rotate(${data.rotation}deg)`;
};

const updateParams = (data: elementParams) => {
  if (paramsDic[data.id] == null) {
    layoutElementParams.push(data);
    paramsDic[data.id] = data;
    return;
  }

  paramsDic[data.id]!.id = data.id;
  paramsDic[data.id]!.x = data.x;
  paramsDic[data.id]!.y = data.y;
  paramsDic[data.id]!.width = data.width;
  paramsDic[data.id]!.height = data.height;
  paramsDic[data.id]!.rotation = data.rotation;
  paramsDic[data.id]!.borderWidth = data.borderWidth;
  paramsDic[data.id]!.borderRadius = data.borderRadius;
  paramsDic[data.id]!.type = data.type;
  paramsDic[data.id]!.color = data.color;
  paramsDic[data.id]!.borderColor = data.borderColor;
  paramsDic[data.id]!.src = data.src;
  paramsDic[data.id]!.text = data.text;
  paramsDic[data.id]!.fontSize = data.fontSize;
  update.value = false;
  // setTimeout(() => {
  //   update.value = true;
  // }, 100);
  updateProps();
};

const updateProps = () => {
  if (selected.value.length > 1) {
    emits("updateProps", null);
    return;
  }
  if (selected.value.length == 0 || selectedId.value[0] < 0) {
    emits("updateProps", null);
    return;
  }
  emits("updateProps", layoutElementParams[selectedId.value[0]]);
};

const cancelSelect = () => {
  if (!selectEns) {
    for (var i = 0; i < selected.value.length; ++i) {
      if (selected.value[i] != null) {
        selected.value[i].UnSelect();
      }
    }
    selected.value.splice(0);
    selectedId.value.splice(0);
    updateProps();
  }
};

const destroy = () => {
  selectedId.value.forEach((el) => {
    axios.delete(
      `/layout/${props.layoutId}/element/${layoutElementParams[el].id}`,
      { headers: headers }
    );
  });
  selectedId.value.sort();
  for(var i=selectedId.value.length-1;i>=0;--i)
  {
    layoutElementParams.splice(selectedId.value[i],1);
  }
  selected.value.splice(0);
  selectedId.value.splice(0);
  moveable.target = null;
  updateProps();
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
      id: 0,
      x: e.clientX - canvasTrans.x,
      y: e.clientY - canvasTrans.y,
      width: 200 * scale,
      height: 200 * scale,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      borderWidth: 0,
      borderRadius: 0,
      type: preparedType,
      color: "#D42B39",
      borderColor: "transparent",
      src: "",
      text: "",
      fontSize: 20 * scale,
      //update: true,
    });
    preparedType = "";

    setTimeout(() => {
      //let el: HTMLElement[] = [];
      //el.push(

      //);
      selecto.selectableTargets = [].slice.call(
        document.getElementsByName("elements")
      );
      var el =
        document.getElementsByName("elements")[layoutElementParams.length - 1];
      updateTransform(el, layoutElementParams[layoutElementParams.length - 1]);
      selecto.clickTarget(e, el);
    });

    // axios.post(
    //   `/layout/${props.layoutId}/element`,
    //   layoutElementParams[layoutElementParams.length - 1],
    //   { headers: headers }
    // );
  }
  //updateServer(layoutElementParams.length-1);
};

// let canvas2: any;
let imgUri: string;
const download = (isDownload: boolean) => {
  // canvas2 = document.createElement("canvas");

  // var w = canvasTrans.width;
  // var h = canvasTrans.height;

  // canvas2.width = w * 4;
  // canvas2.height = h * 4;
  // canvas2.style.width = w + "px";
  // canvas2.style.height = h + "px";

  // var context = canvas2.getContext("2d");
  // context.scale(4, 4);
  html2canvas(document.getElementById("canvas")!).then(function (canvas) {
    imgUri = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    if (isDownload) {
      window.location.href = imgUri;
    }
    axios
      .put(
        `/layout/${props.layoutId}/img`,
        {
          src: imgUri,
        },
        { headers: headers }
      )
      .then((res) => {
        console.log(res.data);
      });
  });
};

defineExpose({
  PrepareElement,
  download,
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
  initMoveable();
  initSelecto();
  //updateServer();
  //setInterval(updateServer, 5000);
  document.onkeyup = (e) => {
    if (e.key == "Delete") {
      destroy();
    }
    if (e.key == " ") {
      selecto.dragCondition = () => {
        return true;
      };
      moveable.draggable = true;
      console.log("space");
      spacing = false;
      dragging = false;
      locked = false;
    }
  };
  document.onkeydown = (e) => {
    if (e.key == " ") {
      selecto.dragCondition = () => {
        return false;
      };
      moveable.draggable = false;
      spacing = true;
      locked = true;
    }
  };
  // canvasTrans.width = document.getElementById("canvas")!.clientWidth;
  // canvasTrans.height = document.getElementById("canvas")!.clientHeight;
  // canvasTrans.x = document.body.clientWidth / 2 - canvasTrans.width / 2;
  // canvasTrans.y = 148;
  // document.getElementById("canvas")!.style.left = `${canvasTrans.x}px`;
  // document.getElementById("canvas")!.style.top = `${canvasTrans.y - 36}px`;
  wheelScale();
});

const initScale = () => {
  document.getElementById("canvas")!.style.width =
    props.canvasWidth / 2.4 + "px";
  document.getElementById("canvas")!.style.height =
    props.canvasHeight / 2.4 + "px";
  canvasTrans.width = document.getElementById("canvas")!.clientWidth;
  canvasTrans.height = document.getElementById("canvas")!.clientHeight;
  canvasTrans.x = document.body.clientWidth / 2 - canvasTrans.width / 2;
  canvasTrans.y = 148;
  document.getElementById("canvas")!.style.left = `${canvasTrans.x}px`;
  document.getElementById("canvas")!.style.top = `${canvasTrans.y - 36}px`;
};

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

    if (scale * scope > maxScale || scale * scope < minScale) {
      return;
    }
    scale *= scope;
    update.value = true;

    for (var i = 0; i < layoutElementParams.length; ++i) {
      if (layoutElementParams[i] == null) {
        continue;
      }
      // layoutElementParams[i]!.update = true;
      // layoutElementParams[i]!.x *= scope;
      // (layoutElementParams[i]!.x - e.clientX + canvasTrans.x) * scope +
      // e.clientX -
      // canvasTrans.x;
      // layoutElementParams[i]!.y *= scope;
      // (layoutElementParams[i]!.y - e.clientY + canvasTrans.y) * scope +
      // e.clientY -
      // canvasTrans.y;
      // layoutElementParams[i]!.width *= scope;
      // layoutElementParams[i]!.height *= scope;
      layoutElementParams[i]!.fontSize *= scope;
      updateTransform(
        document.getElementsByName("elements")[i],
        layoutElementParams[i]
      );
    }
    canvasTrans.x = (canvasTrans.x - e.clientX) * scope + e.clientX;
    canvasTrans.y = (canvasTrans.y - e.clientY) * scope + e.clientY;
    canvasTrans.width *= scope;
    canvasTrans.height *= scope;
    document.getElementById("canvas")!.style.left = `${canvasTrans.x}px`;
    document.getElementById("canvas")!.style.top = `${canvasTrans.y - 48}px`;
    document.getElementById("canvas")!.style.width = `${canvasTrans.width}px`;
    document.getElementById("canvas")!.style.height = `${canvasTrans.height}px`;
    moveable.target = null;
    setTimeout(() => {
      moveable.target = selected.value;
    });

    updateProps();
  };
};

watch(
  () => props,
  (newVal) => {
    if (props.update == false) {
      changeUpdate();
      return;
    }
    if (selected.value.length > 1) {
      return;
    }
    if (selectedId.value.length <= 0 || selectedId.value[0] < 0) {
      return;
    }
    update.value = true;
    if (
      newVal.elementProps.borderWidth > 0 &&
      layoutElementParams[selectedId.value[0]]!.borderWidth !=
        newVal.elementProps.borderWidth &&
      newVal.elementProps.borderColor == "transparent"
    ) {
      message.info("注意：边框颜色为透明");
    }
    layoutElementParams[selectedId.value[0]]!.id = newVal.elementProps.id;
    layoutElementParams[selectedId.value[0]]!.x = newVal.elementProps.x;
    layoutElementParams[selectedId.value[0]]!.y = newVal.elementProps.y;
    layoutElementParams[selectedId.value[0]]!.width = newVal.elementProps.width;
    layoutElementParams[selectedId.value[0]]!.height =
      newVal.elementProps.height;
    layoutElementParams[selectedId.value[0]]!.scaleX =
      newVal.elementProps.scaleX;
    layoutElementParams[selectedId.value[0]]!.scaleY =
      newVal.elementProps.scaleY;
    layoutElementParams[selectedId.value[0]]!.rotation =
      newVal.elementProps.rotation;
    layoutElementParams[selectedId.value[0]]!.borderWidth =
      newVal.elementProps.borderWidth;
    layoutElementParams[selectedId.value[0]]!.borderRadius =
      newVal.elementProps.borderRadius;
    layoutElementParams[selectedId.value[0]]!.color = newVal.elementProps.color;
    layoutElementParams[selectedId.value[0]]!.borderColor =
      newVal.elementProps.borderColor;
    layoutElementParams[selectedId.value[0]]!.type = newVal.elementProps.type;
    layoutElementParams[selectedId.value[0]]!.src = newVal.elementProps.src;
    layoutElementParams[selectedId.value[0]]!.text = newVal.elementProps.text;
    layoutElementParams[selectedId.value[0]]!.fontSize =
      newVal.elementProps.fontSize;
    //updateTransform(layoutElementParams[selectedId.value[0]]);
    updateUpdates(layoutElementParams[selectedId.value[0]]);
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => props.canvasWidth,
  (newVal) => {
    initScale();
  }
);

watch(
  () => props.tool,
  (newVal) => {
    switch (newVal) {
      case "pointer": {
        moveable.draggable = true;
        moveable.resizable = true;
        moveable.scalable = false;
        moveable.rotatable = true;
        moveable.warpable = false;
        moveable.clippable = false;
        moveable.roundable = false;
        moveable.origin = true;
        moveable.originDraggable = true;
        break;
      }
      case "drag": {
        moveable.draggable = true;
        moveable.resizable = false;
        moveable.scalable = false;
        moveable.rotatable = false;
        moveable.warpable = false;
        moveable.clippable = false;
        moveable.roundable = false;
        moveable.origin = false;
        moveable.originDraggable = false;
        break;
      }
      case "resize": {
        moveable.draggable = true;
        moveable.resizable = true;
        moveable.scalable = false;
        moveable.rotatable = false;
        moveable.warpable = false;
        moveable.clippable = false;
        moveable.roundable = false;
        moveable.origin = false;
        moveable.originDraggable = false;
        break;
      }
      case "scale": {
        moveable.draggable = true;
        moveable.resizable = false;
        moveable.scalable = true;
        moveable.rotatable = false;
        moveable.warpable = false;
        moveable.clippable = false;
        moveable.roundable = false;
        moveable.origin = false;
        moveable.originDraggable = false;
        break;
      }
      case "rotate": {
        moveable.draggable = true;
        moveable.resizable = false;
        moveable.scalable = false;
        moveable.rotatable = true;
        moveable.warpable = false;
        moveable.clippable = false;
        moveable.roundable = false;
        moveable.origin = true;
        moveable.originDraggable = true;
        break;
      }
      case "wrap": {
        moveable.draggable = false;
        moveable.resizable = false;
        moveable.scalable = false;
        moveable.rotatable = false;
        moveable.warpable = true;
        moveable.clippable = false;
        moveable.roundable = false;
        moveable.origin = false;
        moveable.originDraggable = false;
      }
      case "clip": {
        moveable.draggable = false;
        moveable.resizable = false;
        moveable.scalable = false;
        moveable.rotatable = false;
        moveable.warpable = false;
        moveable.clippable = true;
        moveable.roundable = false;
        moveable.origin = false;
        moveable.originDraggable = false;
      }
      case "round": {
        moveable.draggable = true;
        moveable.resizable = false;
        moveable.scalable = false;
        moveable.rotatable = false;
        moveable.warpable = false;
        moveable.clippable = false;
        moveable.roundable = true;
        moveable.origin = false;
        moveable.originDraggable = false;
      }
    }
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
.blank {
  position: absolute;
  top: 100vw;
}
</style>