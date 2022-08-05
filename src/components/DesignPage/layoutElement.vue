<template>
  <div
    :id="'contentBox' + elementParams.index"
    class="contentBox"
    v-if="exist"
    @mouseenter="Highlight"
    @mouseleave="UnHighlight"
    @mousedown="select"
    @click.stop
    @dblclick="selectContent"
  >
    <div
      :id="'content' + elementParams.index"
      class="content"
      v-if="showContent"
      ref="content"
    ></div>
    <div :id="'textDiv' + elementParams.index">
      <n-input
        :id="'textInputer' + elementParams.index"
        ref="inputer"
        v-if="textModifying"
        v-model:value="transform.text"
        placeholder=""
        type="textarea"
        :autosize="{
          minRows: 0,
        }"
      ></n-input>
      <div v-else>{{ transform.text }}</div>
    </div>

    <div
      v-if="selected"
      id="upleft"
      class="resizer cornerResizer upResizer leftResizer"
    ></div>
    <div
      v-if="selected"
      id="up"
      class="resizer upResizer tbCenterResizer"
    ></div>
    <div
      v-if="selected"
      id="upright"
      class="resizer cornerResizer upResizer rightResizer"
    ></div>
    <div
      v-if="selected"
      id="left"
      class="resizer leftResizer lrCenterResizer"
    ></div>
    <div
      v-if="selected"
      id="right"
      class="resizer rightResizer lrCenterResizer"
    ></div>
    <div
      v-if="selected"
      id="bottomleft"
      class="resizer cornerResizer bottomResizer leftResizer"
    ></div>
    <div
      v-if="selected"
      id="bottom"
      class="resizer bottomResizer tbCenterResizer"
    ></div>
    <div
      v-if="selected"
      id="bottomright"
      class="resizer cornerResizer bottomResizer rightResizer"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch,reactive } from "vue";
import interact from "interactjs";
import { gsap } from "gsap";
import { InputInst } from "naive-ui";
import { borderTopLeftRadius } from "html2canvas/dist/types/css/property-descriptors/border-radius";

type Params = {
  id:0,
  index: number;
  x: number;
  y: number;
  height: number;
  width: number;
  borderWidth: number;
  borderRadius: number;
  type: string;
  locked: boolean;
  color: string;
  borderColor: string;
  src: string;
  fontSize: number;
  text:string,
};

type Props = {
  update:boolean;
  elementParams?: Params;
};

const props = withDefaults(defineProps<Props>(), {
  elementParams: () => {
    return {
      id:0,
      index: -1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      borderWidth: 0,
      borderRadius: 0,
      type: "Rect",
      locked: false,
      text:"",
      fontSize: 0,
      src: "",
      color: "red",
      borderColor: "blue",
    };
  },
});

const exist = ref<boolean>(true);
const selected = ref<boolean>(false);
const textModifying = ref<boolean>(false);
const text = ref<string>("");
const showContent = ref<boolean>(true);
const inputer = ref<InputInst | null>(null);

const snapGrid = interact.snappers.grid({
  x: 10,
  y: 10,
  offset: { x: 0.5, y: 0 },
});

const transform = reactive({
  id:0,
  index: -1,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  borderWidth: 0,
  borderRadius: 0,
  type: "Rect",
  locked: false,
  text:"",
  fontSize: 0,
  src: "",
  color: "red",
  borderColor: "blue",
});

const updateServer = ()=>{
  emits("updateServer",transform.index)
}

interact(`#contentBox${props.elementParams.index}`).draggable({
  listeners: {
    move(event) {
      if (!props.elementParams.locked) {
        transform.x += event.dx;
        transform.y += event.dy;

        event.target.style.transform = `translate(${transform.x}px, ${transform.y}px)`;
        updateParams();
      }
    },
  },
  modifiers: [
    interact.modifiers.snap({
      targets: [snapGrid],
      range: Infinity,
      relativePoints: [{ x: 0, y: 0 }],
    }),
  ],
})
.on('dragend',updateServer);

interact(`#content${props.elementParams.index}`).resizable({
  edges: { top: true, left: true, bottom: true, right: true },
  modifiers: [
    interact.modifiers.snap({
      targets: [snapGrid],
      range: Infinity,
      relativePoints: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
    }),
  ],
  listeners: {
    move: function (event) {
      if (!props.elementParams.locked) {
        let x = transform.x;
        let y = transform.y;
        let width = event.rect.width;
        let height = event.rect.height;

        x = (x || 0) + event.deltaRect.left;
        y = (y || 0) + event.deltaRect.top;

        Object.assign(event.target.style, {
          width: `${width}px`,
          height: `${height}px`,
        });
        event.target.parentNode.style.transform = `translate(${x}px, ${y}px)`;
        Object.assign(transform, { x, y });
        transform.width = event.target.clientWidth;
        transform.height = event.target.clientHeight;
        updateParams();
      }
    },
  },
})
.on('resizeend',updateServer);

const emits = defineEmits(["select", "destroy", "updateParams","updateServer","changeUpdate"]);

const updateParams = () => {
  emits("updateParams", transform);
};

const changeUpdate = ()=>{
  emits("changeUpdate")
}

const Highlight = () => {
  if (!props.elementParams.locked) {
    if (!selected.value && props.elementParams.type != "text") {
      gsap.to(`#contentBox${props.elementParams.index}`, {
        duration: 0.15,
        borderWidth: "4px",
      });
    }
  }
};

const UnHighlight = () => {
  if (!selected.value && props.elementParams.type != "text") {
    gsap.to(`#contentBox${props.elementParams.index}`, {
      duration: 0.15,
      borderWidth: "0px",
    });
  }
};

let selectEns = false;
const select = () => {
  if (!props.elementParams.locked) {
    selected.value = true;
    if (props.elementParams.type != "text") {
      gsap.to(`#contentBox${props.elementParams.index}`, {
        duration: 0.15,
        borderWidth: "6px",
      });
    }

    selectEns = true;
    emits("select", props.elementParams.index);
    setTimeout(() => {
      selectEns = false;
    }, 500);
  }
};

const selectContent = () => {
  if (!props.elementParams.locked) {
    if (selectEns) {
      switch (props.elementParams.type) {
        case "text": {
          textModifying.value = true;
          break;
        }
      }
    }
  }
};

const UnSelect = () => {
  selected.value = false;

  switch (props.elementParams.type) {
    case "text": {
      if (transform.text == "") {
        emits("destroy", props.elementParams.index);
      }
      else{
        updateParams();
      }
      textModifying.value = false;
      break;
    }
    default: {
      gsap.to(`#contentBox${props.elementParams.index}`, {
        duration: 0.15,
        borderWidth: "0px",
      });
    }
  }
};

defineExpose({
  UnSelect,
});

onMounted(() => {
  ResetTrans(props.elementParams);
  showContent.value = true;
  switch (props.elementParams.type) {
    case "circle": {
      document.getElementById(
        `contentBox${props.elementParams.index}`
      )!.style.borderRadius = "50% 50%";
      document.getElementById(
        `content${props.elementParams.index}`
      )!.style.borderRadius = "50% 50%";
      break;
    }
    case "text": {
      showContent.value = false;
      Object.assign(
        document.getElementById(`contentBox${props.elementParams.index}`)!.style,
        {
          width: `auto`,
          height: `auto`,
          backgroundColor: `transparent`,
          borderColor: `transparent`,
        }
      );
      // document.getElementById(
      //   `textDiv${props.elementParams.index}`
      // )!.style.padding = "20px";
      if(props.elementParams.id==0)
      {
        textModifying.value = true;
      }
    }
  }
  if(props.elementParams.id==0)
  {
    select();
  }
});

watch(
  ()=>props,
  (newVal) => {
    if(!newVal.update)
    {
      changeUpdate();
      return;
    }
    if (newVal.elementParams == null||newVal.elementParams.type == "none") {
      exist.value = false;
      return;
    }
    if (document.getElementById(`contentBox${newVal.elementParams.index}`) == null) {
      return;
    }
    ResetTrans(newVal.elementParams);
  },
  {
    deep: true,
    immediate: true,
  }
);

const ResetTrans = (newVal: Params) => {
  document.getElementById(
    `contentBox${newVal.index}`
  )!.style.transform = `translate(${newVal.x}px, ${newVal.y}px)`;
  transform.x = newVal.x;
  transform.y = newVal.y;
  transform.id = newVal.id;
  transform.index = newVal.index;
  transform.width = newVal.width;
  transform.height = newVal.height;
  transform.borderWidth = newVal.borderWidth;
  transform.borderRadius = newVal.borderRadius;
  transform.index = newVal.index;
  transform.type = newVal.type;
  transform.color = newVal.color;
  transform.borderColor = newVal.borderColor;
  transform.src = newVal.src;
  transform.locked = newVal.locked;
  transform.text = newVal.text;
  transform.fontSize = newVal.fontSize;
  switch (newVal.type) {
    case "text": {
      document.getElementById(
        `textDiv${newVal.index}`
      )!.style.fontSize = `${newVal.fontSize}px`;
      document.getElementById(`textDiv${newVal.index}`)!.style.color =
        newVal.color;
      break;
    }
    case "rect": {
      // var maxR = Math.max(
      //   document.getElementById(`content${newVal.index}`)!.clientHeight,
      //   document.getElementById(`content${newVal.index}`)!.clientWidth
      // );
      // if (newVal.borderRadius > maxR) {
      //   transform.borderRadius = maxR;
      //   updateParams();
      // } else {
      //   document.getElementById(
      //     `content${newVal.index}`
      //   )!.style.borderRadius = `${newVal.borderRadius}px`;
      // }
    }
    default: {
      document.getElementById(
        `content${newVal.index}`
      )!.style.width = `${newVal.width}px`;
      document.getElementById(
        `content${newVal.index}`
      )!.style.height = `${newVal.height}px`;
      document.getElementById(`content${newVal.index}`)!.style.borderColor =
        newVal.borderColor;
      document.getElementById(
        `content${newVal.index}`
      )!.style.borderWidth = `${newVal.borderWidth}px`;
      document.getElementById(`content${newVal.index}`)!.style.backgroundColor =
        newVal.color;
        console.log(newVal.src);
      if (newVal.src == "" || newVal.src == "none" || newVal.src == null) {
        document.getElementById(`content${newVal.index}`)!.style.backgroundImage =
          "none";
      } else {
        document.getElementById(
          `content${newVal.index}`
        )!.style.backgroundImage = `url(\"${newVal.src}\")`;
        document.getElementById(`content${newVal.index}`)!.style.backgroundColor =
          newVal.color;
      }
    }
  }
};
</script>

<style scoped>
.contentBox {
  display: block;
  position: absolute;
  border-color: blue;
  border-style: solid;
  border-width: 0px;
  box-sizing: border-box;
}
.content {
  box-sizing: border-box;
  border-style: solid;
  border-width: 0px;
  background-size: 100% 100%;
  width: 200px;
  height: 200px;
}
.resizer {
  display: block;
  position: absolute;
  z-index: 10000;
  background-color: white;
  border-color: dimgray;
  border-style: solid;
  border-width: 1px;
  width: 6px;
  height: 6px;
}
.leftResizer {
  left: -8px;
}
.rightResizer {
  right: -8px;
}
.upResizer {
  top: -8px;
}
.bottomResizer {
  bottom: -8px;
}
.tbCenterResizer {
  margin: auto;
  left: 0;
  right: 0;
}
.lrCenterResizer {
  top: 0;
  bottom: 0;
  margin: auto;
}
.cornerBlock {
  position: absolute;
  text-align: center;
}
</style>