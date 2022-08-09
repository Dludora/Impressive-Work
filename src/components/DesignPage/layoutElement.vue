<template>
  <div :id="'contentBox' + index" class="contentBox" v-if="exist">
    <!-- <div
      :id="'content' + index"
      class="content"
      v-if="showContent"
      ref="content"
    ></div> -->
    <div :id="'textDiv' + index">
      <n-input
        :id="'textInputer' + index"
        ref="inputer"
        v-if="textModifying"
        v-model:value="transform.text"
        placeholder=""
        type="textarea"
        class="textWrap"
        :autosize="{
          minRows: 0,
        }"
      ></n-input>
      <div class="textWrap" v-else>{{ transform.text }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from "vue";
import interact from "interactjs";
import { gsap } from "gsap";
import { InputInst } from "naive-ui";

import Moveable from "moveable";
import { borderTopLeftRadius } from "html2canvas/dist/types/css/property-descriptors/border-radius";

type Params = {
  id: 0;
  x: number;
  y: number;
  height: number;
  width: number;
  borderWidth: number;
  borderRadius: number;
  type: string;
  color: string;
  borderColor: string;
  src: string;
  fontSize: number;
  text: string;
};

type Props = {
  update: boolean;
  index: number;
  elementParams?: Params;
};

const props = withDefaults(defineProps<Props>(), {
  elementParams: () => {
    return {
      id: 0,
      index: -1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      borderWidth: 0,
      borderRadius: 0,
      type: "Rect",
      text: "",
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

const transform = reactive({
  id: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  borderWidth: 0,
  borderRadius: 0,
  type: "Rect",
  text: "",
  fontSize: 0,
  src: "",
  color: "red",
  borderColor: "blue",
});

const emits = defineEmits(["updateSelects", "changeUpdate"]);

const updateParams = () => {
  emits("updateSelects", transform);
};

const changeUpdate = () => {
  emits("changeUpdate");
};

const Highlight = () => {
  if (!selected.value && props.elementParams.type != "text") {
    gsap.to(`#contentBox${props.index}`, {
      duration: 0.15,
      borderWidth: "4px",
    });
  }
};

const UnHighlight = () => {
  if (!selected.value && props.elementParams.type != "text") {
    gsap.to(`#contentBox${props.index}`, {
      duration: 0.15,
      borderWidth: "0px",
    });
  }
};

let selectEns = false;
const Select = () => {
  selected.value = true;
};

const selectContent = () => {
  console.log("editContent");
  switch (props.elementParams.type) {
    case "text": {
      textModifying.value = true;
      break;
    }
  }
};

const UnSelect = () => {
  selected.value = false;

  switch (props.elementParams.type) {
    case "text": {
      updateParams();

      textModifying.value = false;
      break;
    }
    // default: {
    //   gsap.to(`#contentBox${props.index}`, {
    //     duration: 0.15,
    //     borderWidth: "0px",
    //   });
    // }
  }
};

defineExpose({
  UnSelect,
  Select,
  selectContent,
});

onMounted(() => {
  ResetTrans(props.elementParams);
  showContent.value = true;
  switch (props.elementParams.type) {
    case "circle": {
      document.getElementById(`contentBox${props.index}`)!.style.borderRadius =
        "50% 50%";
      // document.getElementById(`content${props.index}`)!.style.borderRadius =
      //   "50% 50%";
      break;
    }
    case "text": {
      showContent.value = false;
      Object.assign(
        document.getElementById(`contentBox${props.index}`)!.style,
        {
          width: `auto`,
          height: `auto`,
          backgroundColor: `transparent`,
          borderColor: `transparent`,
        }
      );
      // document.getElementById(
      //   `textDiv${props.index}`
      // )!.style.padding = "20px";
      if (props.elementParams.id == 0) {
        textModifying.value = true;
      }
    }
  }
});

watch(
  () => props,
  (newVal) => {
    if (!newVal.update) {
      changeUpdate();
      return;
    }
    if (newVal.elementParams == null || newVal.elementParams.type == "none") {
      exist.value = false;
      return;
    }
    if (document.getElementById(`contentBox${props.index}`) == null) {
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
  // document.getElementById(
  //   `contentBox${props.index}`
  // )!.style.transform = `translate(${newVal.x}px,${newVal.y}px)`;
  transform.id = newVal.id;
  transform.borderWidth = newVal.borderWidth;
  transform.borderRadius = newVal.borderRadius;
  transform.type = newVal.type;
  transform.color = newVal.color;
  transform.borderColor = newVal.borderColor;
  transform.src = newVal.src;
  transform.text = newVal.text;
  transform.fontSize = newVal.fontSize;
  switch (newVal.type) {
    case "text": {
      document.getElementById(
        `textDiv${props.index}`
      )!.style.fontSize = `${newVal.fontSize}px`;
      document.getElementById(`textDiv${props.index}`)!.style.color =
        newVal.color;
      break;
    }
    default: {
      // document.getElementById(`content${props.index}`)!.style.width =
      //   newVal.width + "px";
      // document.getElementById(`content${props.index}`)!.style.height =
      //   newVal.height + "px";
      document.getElementById(`contentBox${props.index}`)!.style.borderColor =
        newVal.borderColor;
      document.getElementById(
        `contentBox${props.index}`
      )!.style.borderWidth = `${newVal.borderWidth}px`;
      document.getElementById(
        `contentBox${props.index}`
      )!.style.backgroundColor = newVal.color;
      if (newVal.src == "" || newVal.src == "none" || newVal.src == null) {
        document.getElementById(
          `contentBox${props.index}`
        )!.style.backgroundImage = "none";
      } else {
        document.getElementById(
          `contentBox${props.index}`
        )!.style.backgroundImage = `url(\"${newVal.src}\")`;
        document.getElementById(
          `contentBox${props.index}`
        )!.style.backgroundColor = newVal.color;
      }
    }
  }
};
</script>

<style scoped>
.contentBox {
  display: block;
  position: absolute;
  background-size: 100% 100%;
  border-style: solid;
  box-sizing: border-box;
  /* border-color: blue;
  border-width: 0px;
  */
}
/* .content {
  box-sizing: border-box;
  border-style: solid;
  border-width: 0px;
  background-size: 100% 100%;
} */
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
  word-wrap: break-word;
}
.textWrap {
  word-wrap: break-word;
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