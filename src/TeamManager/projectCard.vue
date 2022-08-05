<template>
    <div class="card" @click="gotoProject">
        <div class="img">
        </div>
        <div class="bottom">
            <div class="name">{{name}}</div>
            <Icon size="20" class="rename">
                <Edit16Regular @click="renameThis"/>
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
import {EditTwotone,EditOutlined} from '@vicons/antd'
import {Edit16Regular} from '@vicons/fluent'
import { Icon } from '@vicons/utils'
import { defineComponent } from 'vue'
import router from '@/router';
import utils from '../Utils'
export default defineComponent({
    name: 'PageCard',
    props: {
        name: String,
        img: Image,
        date: String,
        id: {
            default:0
        },
    },
    components: {
        CloseRound,
        Icon,
        Edit16Regular,
    },
    setup(props, {emit}) {
        const gotoProject=()=>{
            console.log("go")
            utils.setCookie('proID',props.id)
            utils.setCookie('proNAME',props.name)
            console.log("proID:"+utils.getCookie("proID"))
            router.replace({name:'project'})
        }
        const renameThis=()=>{
            event.stopPropagation();
            console.log("rename"+props.id)
            emit("rename")
        }
        const delThis=()=>{
            event.stopPropagation();
            console.log("del"+props.id)
            emit("del")
        }
        return{
            gotoProject,
            renameThis,
            delThis,
        }
    },
})
</script>

<style scoped>
*{
  transition: 0.2s;
}
.card{
    width: 300px;
    height: 220px;
    background-color: #2B303B;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
}
.card:hover{
    background-color: #414958;
    cursor:pointer;
}
.card:hover .del,.card:hover .rename{
    display: flex;
}
.img{
    width:100%;
    height: 160px;
    background-color: #A7AFBE;
    box-shadow: inset 0px -2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px 5px 0px 0px;
}
.bottom{
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 0 40px;
    width:220px;
    height: 36px;
    align-items: center;
}
.name{
    display:block;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 36px;
    text-overflow:ellipsis;

    overflow:hidden;
    white-space:nowrap;

    color: #E2E4E9;
}
.del,.rename{
    color:#A7AFBE;
    display:none;
}
.desc{
    display:flex;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;

    color:#A7AFBE;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    padding: 0 40px;
    
    justify-content: space-between;
    flex-wrap: nowrap;
    flex-direction: row;
}
</style>