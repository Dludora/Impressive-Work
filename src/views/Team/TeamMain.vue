<template>
    <div class="out">
        <div class="left">
            <LeftNav></LeftNav>
        </div>
        <div class="right">
        <div class="top">
            <TopHead></TopHead>
        </div>
        <div class="info">
            <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
            <router-view/>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import LeftNav from '@/components/Team/LeftNav.vue'
import TopHead from '@/components/Team/TeamHead.vue'
import {ref, h, Component, defineComponent} from 'vue'
import {MentionOption, MenuOption, NIcon, useMessage} from "naive-ui";
import {RouterLink} from "vue-router";


function renderIcon (icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}
const menuOptions: MentionOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/team'
              }
            },
            { default: () => '项目' }
        ),
    key: 'go-to-members',
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'teamMembers',
                path: 'teamMembers'
              }
            },
            { default: () => '成员' }
        ),
      key: 'go-to-members',
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'teamSettings',
              }
            },
            { default: () => '设置' }
        ),
    key: 'go-to-members',
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

.left{
    width: 240px;
    height: 97%;
    display: inline-block;
/*     
    position: absolute;
    left: 0px; top: 0px; */
}
.info{

    min-width: 100px;
    /* border: green 1px solid; */

}
.right{
    display: inline-block;
    vertical-align: top;

}
.info{
    margin-left: 10%;
}
.out{
    position: absolute;
    left:0px;
    top: 0px;
    bottom: 0px;
    width: 100%;
    height: auto;
    background-color:rgba(22, 24, 29, 1);

}
.top{
    /* position: absolute;
    left:240px;
    top: 0px; */
    min-width: 100%;
    vertical-align: top;
    height: 200px;
    margin-top: 36px;
    /* border: 1px greenyellow solid; */

}


.n-layout {
  height: 100%;
}

.n-layout-header,
.n-layout-footer {
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}

.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
}
</style>
