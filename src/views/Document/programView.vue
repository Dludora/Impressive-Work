<template>
  <div class="big-bg">
    <div class="left">
      <LeftNav></LeftNav>
    </div>
    <div>
      <up-bar></up-bar>
    </div>
  </div>

</template>

<script  setup lang="ts">
import LeftNav from '@/components/Team/LeftNav.vue';
import UpBar from "@/components/Document/upBar.vue";
</script>

<style scoped>
.big-bg{
  position: absolute;
  left:0px;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background-color: #16181D;
}
.left{
  width: 240px;
  height: 97%;
  display: inline-block;
  /*
      position: absolute;
      left: 0px; top: 0px; */
}
</style>