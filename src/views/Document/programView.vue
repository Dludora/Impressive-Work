<template>
  <n-layout has-sider native-scrollbar="false" style="overflow: hidden">

    <n-layout-sider content-style="padding: 0;">
      <LeftNav :menu-options="sideMenuOptions"/>
    </n-layout-sider>

    <n-layout>
      <n-layout-header>
        <UpBar style="margin-left: 30px"/>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px 0px;">
        <div class="three-cls">
          <n-config-provider :theme="theme">
            <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
          </n-config-provider>
        </div>
        <router-view/>
      </n-layout-content>
    </n-layout>
  </n-layout>

</template>

<script lang="ts">
import LeftNav from "@/components/Team/LeftNav.vue";
import UpBar from "@/components/Document/upBar.vue"

import {h, Component, defineComponent} from 'vue'
import {darkTheme,MentionOption, MenuOption, NIcon, useMessage} from "naive-ui";
import {RouterLink} from "vue-router";

import {PeopleTeam16Filled as Team} from "@vicons/fluent";
import {Brush} from "@vicons/ionicons5";
import {Analytics} from "@vicons/ionicons5";
import {DocumentText} from "@vicons/ionicons5";

export default defineComponent(
    {
      components: {
        LeftNav,
        UpBar
      },
      setup(){
        return{
          theme: darkTheme,
          menuOptions,
          sideMenuOptions,
        }
      },

    }
)

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
                path: '/programBig'
              }
            },
            { default: () => '原型设计' }
        ),
    key: 'toLayout',
    icon: renderIcon(Brush),
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
    icon: renderIcon(Analytics),
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
    icon: renderIcon(DocumentText)
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
            { default: () => '团队一' }
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
            { default: () => '团队二' }
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
            { default: () => '团队三' }
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
            { default: () => '团队四' }
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
            { default: () => '团队五' }
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
            { default: () => ['团队六', {

              } ]}
        ),
    key: '6',
    icon: renderIcon(Team)
  },
]
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
  height: calc(100%);
}
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
  position: absolute;
  min-width: 100%;
  top:0%;
  padding: 0px 50px;
}
</style>