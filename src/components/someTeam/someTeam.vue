<template>
  <div class="frame">
    <div class="side">
        <LeftNav @ID="getID" @addTeam="showModal=true" ref="getChildList"/>
    </div>
    <div class="main">
      <TeamHead style="padding:25px 60px 23px"/>
      <div class="three-cls">
        <n-config-provider :theme="theme">
          <n-menu mode="horizontal" :options="menuOptions" default-value="go-to-projects"/>
        </n-config-provider>
      </div>
      <div class="divline"/>
      <div class="view">
        <n-scrollbar style="max-height:100%">
            <router-view/>
        </n-scrollbar>
      </div>
    </div>
  </div>
  <!-- <n-layout has-sider>
    <n-layout-sider>
      <LeftNav @ID="getID" @addTeam="showModal=true" ref="getChildList"/>
    </n-layout-sider>
    <n-layout :native-scrollbar="false">
      <n-layout-header>
        <TeamHead style="margin-left: 30px"/>
      </n-layout-header>
      <n-layout-content>
        <div class="menu">
          <n-config-provider :theme="theme">
            <n-menu mode="horizontal" :options="menuOptions" default-value="go-to-projects"/>
          </n-config-provider>
        </div>
        <router-view/>
      </n-layout-content>
    </n-layout>
  </n-layout> -->

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
      <n-form>
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


import {ref, h, Component, defineComponent, onMounted} from 'vue'
import {NIcon} from "naive-ui";
import type {MenuOption} from "naive-ui";
import {darkTheme} from "naive-ui";

import {RouterLink, useRouter, useRoute} from "vue-router";

import {PersonOutline as PersonIcon} from "@vicons/ionicons5"
import {ProjectOutlined as Project} from "@vicons/antd"
import {IosSettings as Settings} from "@vicons/ionicons4"
import {PeopleTeam16Filled as Team} from "@vicons/fluent"

import utils from "@/Utils";

const myID = ref(utils.getCookie('userID'))
const myIdentify = ref(0)

const route = useRoute()

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


export default defineComponent({
  components: {
    LeftNav,
    TeamHead
  },
  setup() {
    let menuOptions: MenuOption[] = [
      {
        label: () =>
            h(
                RouterLink,
                {
                  to:
                      '/team/teamprojects?teamID=' + teamID.value
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
                  to:
                  // name: 'teamMembers',
                      '/team/teammembers?teamID=' + teamID.value
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
                  to:
                      '/team/teamsettings?teamID=' + teamID.value
                },
                {default: () => '设置'}
            ),
        key: 'go-to-settings',
        icon: renderIcon(Settings)
      },
    ]
    const router = useRouter()
    let teamID = ref('')
    const com = ref(null)
    const showModalRef = ref(false)
    const headers = {
      Authorization: utils.getCookie('Authorization')
    }
    const modelRef = ref({
      name: "",
      description: "",
    })
    const getID = (msg: any) => {
      teamID.value = msg
      let tID = teamID.value
      router.push({path:'/team/teamProjects',
        query:{teamID:tID}
      })
    }
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
    const getChildList = ref()
    const onNegativeClick = () => {
      showModalRef.value = false
    }
    const onPositiveClick = () => {
      console.log(modelRef.value)
      showModalRef.value = false
      axios.post('/team', {
        'name': modelRef.value.name,
        'src': profile.src,
        'introduction': modelRef.value.description
      }, {headers: headers}).then(res => {
        // console.log(res)
        getChildList.value.getAllTeams(0, 8)
        modelRef.value.name = ""
        modelRef.value.description = ""
      })
    }
    onMounted(() => {
    })
    return {
      theme: darkTheme,
      menuOptions,
      getChildList,
      com,
      router,
      // 横态框
      showModal: showModalRef,
      onNegativeClick,
      onPositiveClick,
      getID,
      // 表单验证
      ruleDescription,
      ruleName,
      modelRef,
      teamID,
      formatFeedback(raw: string | undefined) {
        h('div', {style: 'color: green'}, [raw + '而且是绿的'])
      },
    }
  },
  // methods: {
  //   load() {
  //
  //   },
  // },
  // created() {
  //   this.load()
  // },
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

.main {
  height: 100%;
  /* max-height: 100%; */
  /* overflow: auto; */
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
}

.view {
  overflow: auto;
}

.frame {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;
}

.side {
  height: 100%;
  z-index: 2;
}

.three-cls {
  /*background: #16181D;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  position: absolute;*/
  min-width: 100%;
  /*top:0%;*/
  padding: 0px 50px;
  z-index: 1;
}
.divline{
    height:1px;
    margin:0 60px;
    /* background: #414958; */
    border-bottom: 1px solid #414958;
}
</style>
