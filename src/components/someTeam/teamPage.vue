<template>
  <n-layout>
    <n-layout-header>
      <TeamHead ref="com" style="margin-left: 30px"/>
    </n-layout-header>
    <n-layout-content content-style="padding: 24px 0px;">
      <div class="menu">
        <n-config-provider :theme="theme">
          <n-menu mode="horizontal" :options="menuOptions"/>
        </n-config-provider>
<!--        <router-link :to="{path: '/profile/team/teamMembers', query : {teamID: 46}}">煞笔</router-link>-->

      </div>
      <router-view/>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import TeamHead from "../Team/TeamHead.vue"
import {darkTheme, NIcon} from "naive-ui";
import type {MenuOption} from "naive-ui"
import {Component, h, defineComponent, onMounted, ref} from "vue";
import {RouterLink, useRouter, useRoute} from "vue-router";
import {ProjectOutlined as Project} from "@vicons/antd";
import {PersonOutline as PersonIcon} from "@vicons/ionicons5";
import {IosSettings as Settings} from "@vicons/ionicons4";
import utils from "@/Utils";


const route = useRoute()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

let menuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {path: '/profile/team'}
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
                path: '/profile/team/teamMembers',
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
                path: '/profile/team/teamSettings',
              }
            },
            {default: () => '设置'}
        ),
    key: 'go-to-settings',
    icon: renderIcon(Settings)
  },
]
const headers = {
  Authorization: utils.getCookie('Authorization')
}

export default defineComponent({
  components: {
    TeamHead,
  },
  setup() {
    return {
      theme: darkTheme,
      menuOptions
    }
  }
})

</script>

<style scoped>

</style>