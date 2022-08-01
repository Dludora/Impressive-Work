<template>
  <div :id="'content'+elementParams.id" class="content" @mouseenter="Highlight" @mouseleave="UnHighlight" @mousedown="select" @click.stop ref="content">
    <slot name="content">

    </slot>
    <div v-if="selected" id="upleft"  class="resizer cornerResizer upResizer leftResizer"></div>
    <div v-if="selected" id="up" class="resizer upResizer tbCenterResizer"></div>
    <div v-if="selected" id="upright" class="resizer cornerResizer upResizer rightResizer"></div>
    <div v-if="selected" id="left" class="resizer leftResizer lrCenterResizer"></div>
    <div v-if="selected" id="right" class="resizer rightResizer lrCenterResizer"></div>
    <div v-if="selected" id="bottomleft" class="resizer cornerResizer bottomResizer leftResizer"></div>
    <div v-if="selected" id="bottom" class="resizer bottomResizer tbCenterResizer"></div>
    <div v-if="selected" id="bottomright" class="resizer cornerResizer bottomResizer rightResizer"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref,watch } from "vue"
import interact from "interactjs"
import {gsap} from "gsap"

type Props = {
  elementParams?:{
    id:number,
    x:number,
    y:number,
    height:number,
    width:number,
    typeOrSrc:string
  }
}

const props = withDefaults(defineProps<Props>(), {
  elementParams: () => {
    return {
      id:-1,
      x:0,
      y:0,
      width:0,
      height:0,
      typeOrSrc:"Rect"
    };
  },
});

const selected = ref<boolean>(false);

const position = { x: 0, y: 0 }

interact(`#content${props.elementParams.id}`).draggable({
  listeners: {
    start (event) {
      console.log(event.type, event.target)
    },
    move (event) {
      position.x += event.dx
      position.y += event.dy

      event.target.style.transform =
        `translate(${position.x}px, ${position.y}px)`
    },
  }
})

interact(`#content${props.elementParams.id}`)
  .resizable({
    edges: { top: true, left: true, bottom: true, right: true },
    listeners: {
      move: function (event) {
        let { x, y } = position

        x = (x || 0) + event.deltaRect.left
        y = (y || 0) + event.deltaRect.top

        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`
        })

        Object.assign(position, { x, y })
      }
    }
  })

const Highlight = ()=>{
  if(!selected.value)
  {
    gsap.to(`#content${props.elementParams.id}`,{
    duration:0.15,
    borderWidth: "4px"
  })
  }
}

const UnHighlight = ()=>{
  if(!selected.value)
  {
    gsap.to(`#content${props.elementParams.id}`,{
    duration:0.15,
    borderWidth: "0px"
  })
  }
}

const emits = defineEmits(["select"])
const select = ()=>{
  console.log(props.elementParams.id);
  selected.value = true;
  gsap.to(`#content${props.elementParams.id}`,{
    duration:0.15,
    borderWidth: "6px"
  })
  emits("select",props.elementParams.id);
}

const UnSelect = ()=>{
  selected.value = false;
  gsap.to(`#content${props.elementParams.id}`,{
    duration:0.15,
    borderWidth: "0px"
  })
}

defineExpose({
  UnSelect,
})

onMounted(()=>{
  console.log("mounted");
  console.log(document.getElementById("up"));
  document.getElementById(`content${props.elementParams.id}`)!.style.transform=`translate(${props.elementParams.x}px, ${props.elementParams.y}px)`;
  position.x = props.elementParams.x;
  position.y = props.elementParams.y;
  document.getElementById(`content${props.elementParams.id}`)!.style.width = `${props.elementParams.width}px`;
  document.getElementById(`content${props.elementParams.id}`)!.style.height = `${props.elementParams.height}px`;
  switch(props.elementParams.typeOrSrc)
  {
    case "circle":{
      document.getElementById(`content${props.elementParams.id}`)!.style.borderRadius = "50% 50%";
    }
    case "text":{
      
    }
  }
})

watch(()=>props.elementParams,(newVal)=>{
  console.log(document.getElementById("up"));
  document.getElementById(`content${newVal.id}`)!.style.transform=`translate(${newVal.x}px, ${newVal.y}px)`;
  position.x = newVal.x;
  position.y = newVal.y;
  document.getElementById(`content${newVal.id}`)!.style.width = `${newVal.width}px`;
  document.getElementById(`content${newVal.id}`)!.style.height = `${newVal.height}px`
})
</script>

<style scoped>
.content{
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
.resizer{
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
.leftResizer{
  left:-8px;
}
.rightResizer{
  right:-8px;
}
.upResizer{
  top:-8px;
}
.bottomResizer{
  bottom:-8px
}
.tbCenterResizer{
  margin: auto;
  left: 0;
  right:0;
}
.lrCenterResizer{
  top: 0;
  bottom:0;
  margin: auto;
}
.cornerBlock{
  position: absolute;
  text-align: center;
}
</style>