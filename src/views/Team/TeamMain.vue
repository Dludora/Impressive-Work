<template>
    <div class="out">
        <div class="left">
            <LeftNav></LeftNav>
        </div>
        <div class="top">
            <TopHead></TopHead>
        </div>
    </div>
</template>

<script setup lang="ts">
import LeftNav from '@/components/Team/LeftNav.vue'
import TopHead from '@/components/Team/TeamHead.vue'
</script>

<style scoped>

.left{
    width: 240px;
    height: 97%;
    display: inline-block;
/*     
    position: absolute;
    left: 0px; top: 0px; */
}
.out{
    position: absolute;
    left:0px;
    top: 0px;
    bottom: 0px;
    width: 100%;

    background-color:rgba(22, 24, 29, 1);
    display: flex;
}
.top{
    /* position: absolute;
    left:240px;
    top: 0px; */

    vertical-align: top;
    height: 200px;
    /* border: 1px greenyellow solid; */
    display: inline-block;
    flex-grow: 1;
}
</style>