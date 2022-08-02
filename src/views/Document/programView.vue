<template>
  <div class="big-bg">
    <div class="left">
      <LeftNav></LeftNav>
    </div>
    <div class="content">
      <div  class="top">
        <up-bar></up-bar>
      </div>

      <div class="three-cls">
        <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
        <router-view/>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import LeftNav from '@/components/Team/LeftNav.vue';
import UpBar from "@/components/Document/upBar.vue";

import {ref, h, Component, defineComponent} from 'vue'
import {MentionOption, MenuOption, NIcon, useMessage} from "naive-ui";
import {RouterLink} from "vue-router";

const menuOptions: MentionOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/programBig'
              }
            },
            { default: () => '原型设计' }
        ),
    key: 'toLayout',
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {

              }
            },
            { default: () => '图' }
        ),
    key: 'toUML',
    disabled: true,
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'docuList',
                path: 'docuList'
              }
            },
            { default: () => '文档' }
        ),
    key: 'toDocu',
  },
]

defineComponent({
  setup () {
    const message = useMessage()
    return {
      menuOptions,
      handleUpdateValue (key: string, item: MenuOption) {
      }
    }
  }
})
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
}
.content{
  display: inline-block;
  vertical-align: top;
}
.top{
  min-width: 100%;
  vertical-align: top;
  height: 100px;
  margin-top: 36px;
}
.three-cls{
  min-width: 100%;
  margin-left: 4%;
}
</style>