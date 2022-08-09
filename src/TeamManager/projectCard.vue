<template>
    <div class="card" >
        <div class="img" @click="gotoProject">
        </div>
        <div class="bottom">
            <div class="name" :focusable="false" v-if="!change">
                {{name}}
            </div>
            <!-- <div class="name" v-else>
              <n-input ref="inputInstRef" v-model:value="Name" />
            </div> -->
            <Icon size="20" class="rename">
                <Edit16Regular  :focusable="false" @click="handleFocus"/>
            </Icon>
            <Icon size="20" class="rename">
                <Copy16Filled @click="copyThis"/>
            </Icon>
        </div>
        <div class="desc">
            创建于&nbsp;{{date}}
            <Icon size="20" class="del">
                <CloseRound @click="delThis"/>
            </Icon>
        </div>
    </div>
</template>
<script lang="ts">
import {CloseRound} from '@vicons/material'
import {EditTwotone, EditOutlined} from '@vicons/antd'
import {Edit16Regular} from '@vicons/fluent'
import {Copy16Filled} from '@vicons/fluent'
import {Icon} from '@vicons/utils'
import {defineComponent,onMounted,ref} from 'vue'
import router from '@/router';
import {useRoute} from 'vue-router'
import utils from '../Utils'
import { InputInst } from 'naive-ui'


export default defineComponent({
  name: 'PageCard',
  props: {
    name: String,
    img: Image,
    date: String,
    id: {
      default: 0
    },
  },
  components: {
    CloseRound,
    Icon,
    Edit16Regular,
    Copy16Filled
  },
  setup(props, {emit}) {
    let Name = ref('123')
    let change = ref(false)
    const route = useRoute()
    const inputInstRef = ref<InputInst | null>(null);
    const gotoProject = () => {
      // console.log("go")
      utils.setCookie('proID', props.id)
      utils.setCookie('proNAME', props.name)
      utils.setCookie('proTeam', route.query.teamID)

      router.replace({name: 'project'})
    }
    const renameThis = () => {
      event.stopPropagation();
      console.log("rename" + props.id)
      emit("rename")
    }
    const delThis = () => {
      event.stopPropagation();
      console.log("del" + props.id)
      emit("del")
    }
    const copyThis = () => {
      event.stopPropagation();
      console.log("copy"+props.id)
      emit("copy")
    }
    return {
      Name,
      inputInstRef,
      handleFocus () {
        change.value=!change.value;
        inputInstRef.value?.select()
      },
      gotoProject,
      renameThis,
      delThis,
      copyThis,
      route,
      change
    }
  },
})
</script>

<style scoped>
* {
  transition: 0.2s;
}
.card{
    width: 240px;
    height: 190px;
    padding: 5px 30px;
    /*background-color: #2B303B;*/
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    border: 1px solid #414958;
}
.card:hover{
    background: #2B303B;
    border: 1px solid #A7AFBE;
    cursor:pointer;
}

.card:hover .del, .card:hover .rename {
  display: flex;
}
.img{
    width:100%;
    height: 140px;
    background-color: #A7AFBE;
    box-shadow: inset 0px -2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
}
.bottom{
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: nowrap;
    /*padding: 0 40px;*/
    width:100%;
    height: 32px;
    align-items: center;
}
.name{
    display:block;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 32px;
    text-overflow:ellipsis;

  overflow: hidden;
  white-space: nowrap;

  color: #E2E4E9;
}

.del, .rename {
  color: #A7AFBE;
  display: none;
}

.desc {
  display: flex;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

    color:#A7AFBE;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    /*padding: 0 40px;*/
    
    justify-content: space-between;
    flex-wrap: nowrap;
    flex-direction: row;
}
</style>