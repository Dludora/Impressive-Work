<template>
  <!-- <n-layout has-sider style="height:100%;overflow: hidden">

    <n-layout-sider :native-scrollbar="false" content-style="padding: 0;">
      <LeftNav :menu-options="sideMenuOptions"/>
    </n-layout-sider>

    <n-layout>
      <n-layout-header>
        <UpBar style="padding:25px 60px 22px"/>
      </n-layout-header>
      <n-layout-content :native-scrollbar="false" content-style="height:100%;padding-top: 42px;">
        <div class="three-cls">
          <n-config-provider :theme="theme">
            <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
          </n-config-provider>
        </div>
        <router-view/>
      </n-layout-content>
    </n-layout>
  </n-layout> -->
  <!-- <n-layout has-sider content-style="height:100%;">

    <n-layout-sider :native-scrollbar="false" content-style="padding: 0;">
      <LeftNav :menu-options="sideMenuOptions"/>
    </n-layout-sider>

    <n-layout>
      <n-layout-header>
        <UpBar style="z-index:1;padding:25px 60px 22px"/>
        <div class="three-cls">
          <n-config-provider :theme="theme">
            <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
          </n-config-provider>
        </div>
      </n-layout-header>
      <n-layout position="absolute" content-style="top:148px;bottom:0">
        <n-layout :native-scrollbar="false" content-style="height:100%;">
          <router-view/>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-layout> -->
  <!-- <n-layout has-sider>

    <n-layout-sider :native-scrollbar="false" content-style="padding: 0;" style="min-width:0;width:240;">
      <LeftNav :menu-options="sideMenuOptions"/>
    </n-layout-sider>

    <n-layout style="height:100%">
      <n-layout-header style="height:148px">
        <UpBar style="padding:25px 60px 22px;"/>
        <UpBar style="padding:25px 60px 22px;z-index:1;"/>
      </n-layout-header>
      <n-layout-content style="padding-top=42px">
        <div class="three-cls">
          <n-config-provider :theme="theme">
            <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
          </n-config-provider>
        </div>
        <n-layout :native-scrollbar="false">
            <router-view/>
        </n-layout>
      </n-layout-content>
    </n-layout>

  </n-layout> -->
  <div class="frame">
    <div class="side">
        <LeftNav :menu-options="sideMenuOptions"/>
    </div>
    <div class="main">
      
      <UpBar style="z-index:1;padding:25px 60px 22px"/>
      <div class="three-cls">
        <n-config-provider :theme="theme">
          <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
        </n-config-provider>
      </div>

      <div class="view">
        <!-- <router-view/> -->
        <n-scrollbar style="max-height:100%">
            <router-view/>
        </n-scrollbar>
      </div>
    </div>
  </div>
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
    disabled: true,
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
  /*padding: 36px;*/
}

.n-layout-sider {
  height: calc(100%);
  background: #2B303B;
}

.n-layout-content {
  background: #16181D;
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
  background: #16181D;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  /*position: absolute;*/
  min-width: 100%;
  /*top:0%;*/
  padding: 0px 50px;
  z-index:1;
}
.solid{
  overflow: hidden;
}
.scroll{
  overflow: display;
}
.frame{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height:100%;
}
.side{
  height:100%;
  z-index:2;
}
::-webkit-scrollbar
{
    width:8px;
    height:16px;
    background-color:#F5F5F5;
}
.main{
    height: 100%;
    /* max-height: 100%; */
    /* overflow: auto; */
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}
.view{
    overflow: auto;
}
</style>