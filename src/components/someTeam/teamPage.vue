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
      </div>
      <router-view/>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import TeamHead from "../Team/TeamHead.vue"
import {darkTheme, MenuOption, NIcon} from "naive-ui";
import {Component, h, defineComponent, onMounted, ref} from "vue";
import {RouterLink, useRouter, useRoute} from "vue-router";
import {ProjectOutlined as Project} from "@vicons/antd";
import {PersonOutline as PersonIcon} from "@vicons/ionicons5";
import {IosSettings as Settings} from "@vicons/ionicons4";
import utils from "@/Utils";

const route = useRoute()
let menuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                path: 'teamProjects',
                query: {
                  teamID: route.query.teamID
                }
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
                path: 'teamMembers',
                query: {
                  teamID: route.query.teamID
                }
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
                path: 'teamSettings',
                query: {
                  teamID: route.query.teamID
                }
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

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
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