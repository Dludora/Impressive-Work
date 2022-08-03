<template>
  <n-layout has-sider native-scrollbar="false">
    <n-layout-sider content-style="padding: 0;">
      <LeftNav :menu-options="sideMenuOptions" @addTeam="showModal=true"/>
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
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModal"
        :mask-closable="false"
        preset="dialog"
        title="创建团队"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
      <n-form :ref="formRef" :model="modelRef">
        <n-form-item label="团队名称" :rule="ruleName" :render-feedback="formatFeedback">
          <n-input v-model:value="modelRef.name" @keydown.enter.prevent/>
        </n-form-item>
        <n-form-item label="团队描述" :rule="ruleDescription" :render-feedback="formatFeedback">
          <n-input v-model:value="modelRef.description" @keydown.enter.prevent type="textarea"/>
        </n-form-item>
      </n-form>
    </n-modal>
  </n-config-provider>
</template>

<script lang="ts">
import axios from 'axios';
import LeftNav from "../Team/LeftNav.vue"
import TeamHead from "../Team/TeamHead.vue"

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

let profile = {
  ID: null,
  email: "",
  id: null,
  name: "",
  nickname: "",
  src: ""
}
let menuOptions: MenuOption[] = [
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
export default defineComponent({
  components: {
    LeftNav,
    TeamHead
  },
  setup() {
    const showModalRef = ref(false)
    const formRef = ref<FormData | null>(null)
    const modelRef = ref({
      name: "",
      description: "",
    })
    const ruleName = {
      required: true,
      validator() {
        if (modelRef.value.name.length === 0) {
          return new Error("新团队名不能为空!")
        } else {
          if (modelRef.value.name.length >= 8) {
            return new Error("新团队名长度不能大于8!")
          }
        }
      },
      trigger: ['input', 'blur']
    }
    const ruleDescription = {
      required: false,
    }
    return {
      theme: darkTheme,
      menuOptions,


      // 横态框
      showModal: showModalRef,
      onNegativeClick() {
        showModalRef.value = false
      },
      onPositiveClick() {
        showModalRef.value = false
        axios.post('/team', {
          'name': modelRef.value.name,
          'src': profile.src,
          'introduction': modelRef.value.description
        }).then(res => {
          console.log(res)
        })
      },

      // 表单验证
      ruleDescription,
      ruleName,
      modelRef,
      formRef,
      formatFeedback(raw: string | undefined) {
        h('div', {style: 'color: green'}, [raw + '而且是绿的'])
      },
    }
  },
  methods: {
    load() {
      axios.get('user/info').then(res => {
        profile = res.data.data
        console.log(profile)
      })
    },
  },
  created() {
    this.load()
  },
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
