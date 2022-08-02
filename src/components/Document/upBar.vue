<template>
  <div class="up">
    <div class="pro-name">
      {{programname}}
    </div>
    <div class="pro-des">
      <h2>由 {{teamname}} 创建于 {{programtime}}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref } from "vue"

  let programname=ref<String>('项目一');
  let teamname=ref<String>('团队一');
  let programtime=ref<String>('2022.8.2');


</script>

<style scoped>
.up{
  position: relative;
  height: 100%;
  top: 0px;

  background: #16181D;
}

.pro-name{
  position: relative;
  height: 40px;
  top: 0px;

  display: inline-block;

  vertical-align: center;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 44px;

  color: #FFFFFF;

  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.pro-des{
  position: relative;
  height: 40px;
  top: 10px;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  display: flex;
  align-items: flex-end;

  color: #414958;
}
</style>