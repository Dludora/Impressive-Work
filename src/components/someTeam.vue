<template>
  <n-layout has-sider>
    <n-layout-sider content-style="padding: 24px;">
      海淀桥
    </n-layout-sider>
    <n-layout>
      <n-layout-header>颐和园路</n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
        <router-view/>
      </n-layout-content>
      <n-layout-footer>成府路</n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import axios from 'axios';
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
                path: '/someTeam'
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


