<template>
  <div class="card">
    <div class="img">
        <img style="width:192px;height:104px;" class="cover" :src="imgUrl" />
      </div>  
    <div class="bottom">
      <SvgCreate class="svg-create" size="16" border="6" bordercolor="#A7AFBE" color="none" style="margin:10px;"/>
      <div class="nameanddel">
        <div class="name" style="cursor: pointer" @click="openCard">
        {{ name }}
        </div>
        <Icon size="20" class="del" @click="delCard">
          <CloseRound/>
        </Icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  CloseRound
} from '@vicons/material'
import {Icon} from '@vicons/utils'
import SvgCreate from "@/components/svgCreate.vue"
import { onMounted ,ref} from 'vue'
export default {
  name: 'PageCard',
  props: {
    name: String,
    img: String,
  },
  components: {
    CloseRound,
    Icon,
    SvgCreate,
  },
  setup(props, {emit}) {
    let imgUrl = ref('')
    onMounted(()=>{
      console.log(props.img)
      imgUrl.value = props.img
    })
    const delCard = () => {
      emit('delCard')
    }
    const openCard = () => {
      emit('openCard')
    }
    return {
      delCard,
      openCard,
      imgUrl
    }
  }
}
</script>

<style scoped>
* {
  transition: 0.2s;
}

.card {
  width: 192px;
  height: 140px;
  background-color: #2B303B;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  padding:1px;
}

.card:hover {
  background-color: #A7AFBE;
  /*cursor:pointer;*/
}

.card:hover .del {
  display: flex;
}
.card:hover .svg-create {
  display: flex;
  transform: rotate(30deg);
  transition-timing-function: ease-out;
}

.img {
  width: 100%;
  height: 104px;
  background-color: #A7AFBE;
  box-shadow: inset 0px -2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px 3px 0px 0px;
}

.bottom {
  background-color: #16181D;
  border-radius: 0px 0px 3px 3px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  /*padding: 0 21px;*/
  width: 100%;
  height: 36px;
  /*align-items: center;*/
}
.nameanddel{
  width: 156px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
}
.name {
  display: block;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 35px;
  text-overflow: ellipsis;

  overflow: hidden;
  white-space: nowrap;

  color: #E2E4E9;
}

.del {
  color: #A7AFBE;
  display: none;
  margin: 8px;
  cursor: pointer;
}
</style>