<template>
    <div class="main">
        <div class="discribe">
            管理你的{{length}}个页面
            <div class="buttons">
                <n-button class="newpage" size="tiny">
                    新 建 页 面&nbsp;
                    <Icon size="14">
                        <Add28Regular/>
                    </Icon>
                </n-button>
                <n-button size="tiny">
                    导 出 页 面&nbsp;
                    <Icon size="14">
                        <Export/>
                    </Icon>
                </n-button>
            </div>
        </div>
        <div class="pagelist">
            <PageCard v-for="(item, i) in shortcuts" :key="i" :name="item.name" :img="item.img" class="card"/>
        </div>
    </div>
</template>
<!-- <script lang="ts">
export default {
    components: {
        PageCard,
    }
}
</script> -->
<script setup lang="ts">
import {
    Export
} from '@vicons/carbon'
import {
  Add28Regular
} from '@vicons/fluent'
import { Icon } from '@vicons/utils'
import PageCard from "@/ProjectManager/pageCard.vue"
let shortcuts=[
    {
        name: '',
        img: null,
    },
]
let length=0
const getList=()=>{ //TODO 前后端对接：获取页面列表

    shortcuts=[
        {
            name: 'home1',
            img: null,
        },
        {
            name: '名字很长很长很长很长2',
            img: null,
        },
        {
            name: 'home3',
            img: null,
        },
        {
            name: 'home1',
            img: null,
        },
        {
            name: '名字很长很长很长很长2',
            img: null,
        },
        {
            name: 'home3',
            img: null,
        },
        {
            name: 'home1',
            img: null,
        },
        {
            name: '名字很长很长很长很长2',
            img: null,
        },
        {
            name: 'home3',
            img: null,
        },
    ]

    length=shortcuts.length
}
getList()
</script>

<style scoped>
.main{
    width:fit-content;
    margin:39px 43px 0 61px;
}
.card {
    margin:0 10px 20px 0;
}
.pagelist{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}
.discribe{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 29px;
    align-items: center;
    margin-bottom: 12px;

    display:flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;

    color: #414958;
}
.buttons{
    margin-right: 10px;
}
.newpage{
    margin-right: 10px;
}
</style>