<template>
  <div class="board" @mouseup="ProduceElement" @click="cancelSelect">
    <n-button @mousedown.stop="PrepareElement('rect')" @click.stop
      >生成矩形</n-button
    >
    <n-button @mousedown.stop="PrepareElement('circle')" @click.stop
      >生成椭圆</n-button
    >
    <n-button @mousedown.stop="PrepareElement('text')" @click.stop
      >生成文本</n-button
    >
    <layout-element
      v-for="(params, index) in layoutElementParams"
      :key="index"
      :elementParams="params"
      @select="select"
      @destroy="destroy"
      ref="layoutElements"
    >
    </layout-element>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import layoutElement from "./layoutElement.vue";

const selected: any = ref(null);
const selectedId = ref<number>(-1)
let selectEns = false;
let preparedType: string = "";

const layoutElementParams: any[] = reactive([]);
const layoutElements = ref<any>([]);

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
    selectedId.value = -1
  }
};

const destroy = (id: number) => {
  if(selectedId.value==id)
  {
    cancelSelect();
  }
  layoutElementParams[id] = null;
};

const PrepareElement = (elementType: string, e: MouseEvent) => {
  preparedType = elementType;
};

const ProduceElement = (e: MouseEvent) => {
  if (preparedType != "") {
    layoutElementParams.push({
      id: layoutElementParams.length,
      x: e.offsetX,
      y: e.offsetY,
      width: 200,
      height: 200,
      typeOrSrc: preparedType,
    });
    preparedType = "";
  }
};

onMounted(() => {
  document.onkeyup = (e) => {
    if(e.key=="Delete")
    {
      destroy(selectedId.value);
    }
  };
});
</script>

<style scoped>
.board {
  height: 100vh;
  width: 100vw;
}
</style>