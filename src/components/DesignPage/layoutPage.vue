<template>
  <div @click="cancelSelect" class="board" @mouseup="ProduceElement">
    <n-button @mousedown="PrepareElement('rect')">生成</n-button>
    <layout-element v-for="(params,index) in layoutElementParams" :key="index" :elementParams="params" @select="select" ref="layoutElements">
    <template #content>
      <div></div>
    </template>
  </layout-element>
  </div>
</template>

<script setup lang="ts">
import {ref,reactive} from "vue"
import layoutElement from "./layoutElement.vue"

const selected:any = ref(null);
let preparedType:string = "";

const layoutElementParams:any[] = reactive([]);
const layoutElements = ref<any>([])

const select = (id:number)=>{
  if(selected.value!=null&&selected.value!=layoutElements.value[id])
  {
    selected.value.UnSelect();
  }
  selected.value = layoutElements.value[id];
}

const cancelSelect = ()=>{
  if(selected.value!=null)
  {
    selected.value.UnSelect();
  }
  selected.value = null;
}

const PrepareElement = (elementType:string,e:MouseEvent)=>{
  preparedType = elementType;
}

const ProduceElement = (e:MouseEvent)=>{
  if(preparedType!="")
  {
    layoutElementParams.push({
    id:layoutElementParams.length,
    x:e.offsetX,
    y:e.offsetY,
    width:200,
    height:200,
    typeOrSrc: preparedType
  })
    preparedType = "";
  }
}
</script>

<style scoped>
.board{
  height: 100vh;
  width: 100vw;
}
</style>