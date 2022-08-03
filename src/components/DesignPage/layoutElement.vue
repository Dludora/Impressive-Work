<template>
  <div
    :id="'content' + elementParams.id"
    class="content"
    @mouseenter="Highlight"
    @mouseleave="UnHighlight"
    @mousedown="select"
    @click.stop="selectContent"
    ref="content"
    v-if="exist"
  >
    <div :id="'textDiv' + elementParams.id">
      <n-input
        :id="'textInputer' + elementParams.id"
        ref="inputer"
        v-if="textModifying"
        v-model:value="text"
        placeholder=""
        type="textarea"
        :autosize="{
          minRows: 0,
        }"
      ></n-input>
      <div v-show="!textModifying">{{ text }}</div>
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
import { onMounted, ref, watch } from "vue";
import interact from "interactjs";
import { gsap } from "gsap";
import { InputInst } from "naive-ui";

type Params = {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
  type: string;
  locked: boolean;
  color: string;
  borderColor: string;
  src: string;
  fontSize: number;
};

type Props = {
  elementParams?: Params;
};

const props = withDefaults(defineProps<Props>(), {
  elementParams: () => {
    return {
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
    };
  },
});

const exist = ref<boolean>(true);
const selected = ref<boolean>(false);
const textModifying = ref<boolean>(false);
const text = ref<string>("");
const inputer = ref<InputInst | null>(null);

const snapGrid = interact.snappers.grid({
  x: 10,
  y: 10,
});

const transform = {
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
};

interact(`#content${props.elementParams.id}`).draggable({
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
      relativePoints: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
    }),
  ],
});

interact(`#content${props.elementParams.id}`).resizable({
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
          transform: `translate(${x}px, ${y}px)`,
        });

        Object.assign(transform, { x, y });
        transform.width = event.target.clientWidth;
        transform.height = event.target.clientHeight;
        updateParams();
      }
    },
  },
});

const emits = defineEmits(["select", "destroy", "updateParams"]);

const updateParams = () => {
  console.log(transform);
  emits("updateParams", transform);
};

const Highlight = () => {
  if (!props.elementParams.locked) {
    if (!selected.value && props.elementParams.type != "text") {
      gsap.to(`#content${props.elementParams.id}`, {
        duration: 0.15,
        borderWidth: "4px",
      });
    }
  }
};

const UnHighlight = () => {
  if (!selected.value && props.elementParams.type != "text") {
    gsap.to(`#content${props.elementParams.id}`, {
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
      gsap.to(`#content${props.elementParams.id}`, {
        duration: 0.15,
        borderWidth: "6px",
      });
    }

    selectEns = true;
    emits("select", props.elementParams.id);
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
      console.log(text.value == "");
      if (text.value == "") {
        console.log(text.value);
        emits("destroy", props.elementParams.id);
      }
      textModifying.value = false;
      break;
    }
    default: {
      gsap.to(`#content${props.elementParams.id}`, {
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
  ResetTrans(props.elementParams)
  switch (props.elementParams.type) {
    case "circle": {
      document.getElementById(
        `content${props.elementParams.id}`
      )!.style.borderRadius = "50% 50%";
      break;
    }
    case "text": {
      Object.assign(
        document.getElementById(`content${props.elementParams.id}`)!.style,
        {
          width: `auto`,
          height: `auto`,
          backgroundColor: `transparent`,
          borderColor: `transparent`,
        }
      );
      document.getElementById(
        `textDiv${props.elementParams.id}`
      )!.style.padding = "20px";
      textModifying.value = true;
    }
  }
  select();
});

watch(
  () => props.elementParams,
  (newVal) => {
    if (newVal == null) {
      exist.value = false;
      return;
    }
    if (document.getElementById(`content${newVal.id}`) == null) {
      return;
    }
    ResetTrans(newVal);
  },
  {
    deep: true,
    immediate: true,
  }
);

const ResetTrans = (newVal:Params) => {
  document.getElementById(
      `content${newVal.id}`
    )!.style.transform = `translate(${newVal.x}px, ${newVal.y}px)`;
    transform.x = newVal.x;
    transform.y = newVal.y;
    transform.width = newVal.width;
    transform.height = newVal.height;
    document.getElementById(
      `content${newVal.id}`
    )!.style.width = `${newVal.width}px`;
    document.getElementById(
      `content${newVal.id}`
    )!.style.height = `${newVal.height}px`;
    transform.id = newVal.id;
    transform.type = newVal.type;
    transform.color = newVal.color;
    document.getElementById(`content${newVal.id}`)!.style.backgroundColor = newVal.color;
    transform.borderColor = newVal.borderColor;
    document.getElementById(`content${newVal.id}`)!.style.borderColor =
      newVal.borderColor;
    transform.src = newVal.src;
    if (newVal.src == "" || newVal.src == "none") {
      document.getElementById(`content${newVal.id}`)!.style.backgroundColor =
        "none";
    } else {
      document.getElementById(
        `content${newVal.id}`
      )!.style.backgroundColor = `url(\"${newVal.src}\")`;
    }
    transform.fontSize = newVal.fontSize;
    document.getElementById(
      `content${newVal.id}`
    )!.style.fontSize = `${newVal.fontSize}px`;
    transform.locked = newVal.locked;
};
</script>

<style scoped>
.content {
  display: block;
  position: absolute;
  background-color: red;
  border-color: blue;
  border-style: solid;
  border-width: 0px;
  width: 200px;
  height: 200px;
  box-sizing: border-box;
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