<template>
  <n-layout has-sider native-scrollbar="false">
    <n-layout-sider content-style="padding: 0;">
      <LeftNav :menu-options="sideMenuOptions"/>
    </n-layout-sider>
    <n-layout>
      <n-layout-header>
        <TeamHead style="margin-left: 30px"/>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px 0px;">
        <div class="menu">
          <n-config-provider :theme="theme">
            <n-menu mode="horizontal" :options="menuOptions"/>
          </n-config-provider>
        </div>
        <router-view/>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import axios from 'axios';
import LeftNav from "./Team/LeftNav.vue"
import TeamHead from "./Team/TeamHead.vue"

import {ref, h, Component, defineComponent} from 'vue'
import {NIcon, useMessage, useDialog} from "naive-ui";
import type {MenuOption} from "naive-ui";
import {darkTheme} from "naive-ui";

import {RouterLink} from "vue-router";

import {PersonOutline as PersonIcon} from "@vicons/ionicons5"
import {ProjectOutlined as Project} from "@vicons/antd"
import {IosSettings as Settings} from "@vicons/ionicons4"
import {PeopleTeam16Filled as Team} from "@vicons/fluent"


function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/team'
              }
            },
            {default: () => '项目'}
        ),
    key: 'go-to-projects',
    icon: renderIcon(Project)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'teamMembers',
                path: 'teamMembers'
              },
            },
            {default: () => '成员'}
        ),
    key: 'go-to-members',
    icon: renderIcon(PersonIcon)
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
            {default: () => '设置'}
        ),
    key: 'go-to-settings',
    icon: renderIcon(Settings)
  },
]
const sideMenuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/team'
              }
            },
            {default: () => '团队一'}
        ),
    key: '1',
    icon: renderIcon(Team)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/team'
              }
            },
            {default: () => '团队二'}
        ),
    key: '2',
    icon: renderIcon(Team)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/team'
              }
            },
            {default: () => '团队三'}
        ),
    key: '3',
    icon: renderIcon(Team)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/team'
              }
            },
            {default: () => '团队四'}
        ),
    key: '4',
    icon: renderIcon(Team)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/team'
              }
            },
            {default: () => '团队五'}
        ),
    key: '5',
    icon: renderIcon(Team)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: '/team'
              }
            },
            {
              default: () => ['团队六', {}]
            }
        ),
    key: '6',
    icon: renderIcon(Team)
  },
]
export default defineComponent({
  components: {
    LeftNav,
    TeamHead
  },
  setup() {
    const showModalRef = ref(false)
    return {
      theme: darkTheme,
      menuOptions,
      sideMenuOptions,
    }
  }
})

</script>

<style scoped>
.n-layout {
  height: calc(100%);
}

.n-layout-header,
.n-layout-footer {
  background: #16181D;
  padding: 36px;
}

.n-layout-sider {
  height: calc(100%);
  background: #2B303B;
}

.n-layout-content {
  background: #16181D;
}

.menu {
  margin-left: 30px;
}

</style>
