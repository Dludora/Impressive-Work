<template>
    <div class="card" @click="gotoTeam">
        <div class="img" :style="'background-color:'+color+';'">
          {{name[0]+name[1]}}
        </div>
        <div class="bottom">
            <div class="name">
                {{name}}
            </div>
            
            <div class="desc">
                {{date}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {CloseRound} from '@vicons/material'
import {EditTwotone, EditOutlined} from '@vicons/antd'
import {Edit16Regular} from '@vicons/fluent'

import {Icon} from '@vicons/utils'
import {defineComponent} from 'vue'
import router from '@/router';
import {useRoute} from 'vue-router'
import utils from '../../Utils'


export default defineComponent({
  name: 'PageCard',
  props: {
    name: String,
    img: Image,
    date: String,
    color:String,
    id: {
      default: 0
    },
  },
  components: {

    // Icon,
    // Edit16Regular,

  },
  setup(props, {emit}) {
    const route = useRoute()
    const gotoTeam = () => {
      console.log("teamchoose go"+props.id )
      let url = '/team/teamprojects?teamID='+props.id
      router.push(url)
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
      gotoTeam,
      renameThis,
      delThis,
      copyThis,
      route
    }
  },
})
</script>

<style scoped>
* {
  transition: 0.2s;
}
.card{
    display: flex;
    width: 270px;
    height: 70px;
    padding: 36px;
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
  display: inline-block;
}
.img{
    /*width: 40%;
    vertical-align: top;
    margin-top: 15px;*/
    margin-right:36px;
    height: 70px;
    width: 70px;
    display: flex;

    color:#FFFFFF;
    font-size:24px;

    background-color: #A7AFBE;
    box-shadow: inset 0px -2px 4px rgb(0 0 0 / 25%);
    border-radius: 4px;
    /* display: inline-block; */
    justify-content: center;
    align-items: center;
}
  .bottom{
    /*margin-left: 20px;
    margin-top: 10px;
    display: inline-block;
     justify-content: flex-start; */
    /* flex-direction: row;
    flex-wrap: nowrap; */
    /*padding: 0 40px;
    width:50%;
    height: 100%;
     align-items: center; */
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
  display: inline-block;
}

.desc {
  display: inline-block;
  /* text-overflow: ellipsis; */
  overflow: hidden;
  /* white-space: nowrap; */
    max-width: 140px;
    color:#A7AFBE;
    font-size: 12px;
    height: auto;
    max-height: 45px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /*padding: 0 40px;*/
    
    /* justify-content: space-between;
    flex-wrap: nowrap;
    flex-direction: row; */
}
</style>