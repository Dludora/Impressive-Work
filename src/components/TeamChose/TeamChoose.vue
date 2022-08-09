<template>
    <div class="out">
        <div class="backimage"/>
        <div class="mask"/>

        <headNav style="z-index:1;"/>
        <div class="head">
            <teamHead></teamHead>
        </div>
        
        <n-scrollbar style="margin:0 97px;width:auto;padding:0 3px;">
        <div class="info">

            <projectList></projectList>

        </div>
        </n-scrollbar>
    </div>
</template>

<script setup lang="ts">
import projectList from './ChooseList.vue'
import teamHead from './ChooseHead.vue'
import headNav from "@/components/headNav.vue"

</script>

<style scoped>
.backimage{
    width: 100%;
    height: 100%;
    position:absolute;

  z-index: -1;
  background-image: url("@/assets/teamfigure.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left;

}
.out{
    display:flex;
    flex-direction: column;

    width:100%;
    height: 100%;
}
.mask{
  z-index: -1;
  width: 100%;
  position: absolute;
  height: 100%;
  background-color: #16181Df0;
}
.head{
  z-index: 1;
    margin: 0 100px;
    /*width: 70%;*/
    border-bottom: 1px solid #414958;
}
.info{
  z-index: 1;
    /*height: 500px;
    width: 90%;
    margin:auto;
    margin-top: 30px;*/
    margin:20px 0;
}
</style>