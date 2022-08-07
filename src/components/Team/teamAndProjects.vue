<template>
    <div class="oplist">
        <div v-for="item in options" :key="item">
            <router-link :to="item.link">
                <div class="option">
                    <div class="colorTag" :style="'background-color:'+item.color+';'"/>
                    {{item.name}}
                </div>
            </router-link>
            <div v-for="pro in item.projects" :key="pro" class="option">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, h, Component} from 'vue'

export default defineComponent({
    props:{
        options:[],
    },
    setup(props, {emit}) {
        console.log(props.options)
    },
})
</script>
<style scoped>
a {
  color: currentColor;
  text-decoration: none;
}
.option{
    margin-right: 10px;
    height: 42px;
    font-size: 12px;
    display: flex;
    /* width: 100%; */
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    border: 1px solid #A7AFBE00;
    transition: 0.2s;
    border-radius: 2px;
}
.option:hover{
    border: 1px solid #A7AFBE;
}
.option:active{
    background-color: #2B303B;
}
.colorTag{
    height:18px;
    width:18px;
    margin:12px;
}
</style>