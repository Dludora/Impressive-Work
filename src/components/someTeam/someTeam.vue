<template>
<div class="out">
  <div class="frame">
    <div class="side">
        <LeftNav @ID="getID" @judgechild="judge='teamprojects'" @addTeam="showModal=true" ref="getChildList"/>
    </div>
    <div class="main">
      <TeamHead style="padding:25px 60px 23px"/>
      <div class="three-cls">
        <div class="clsL">
        <n-config-provider :theme="theme">
          <n-menu mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" default-value="" :value="judge"/>
        </n-config-provider>
        </div>
        <div class="clsR">
          <div class="search">
        <n-input v-model:value="searchText" round placeholder="搜索项目" >
        <template #suffix>
            <n-button quaternary size="tiny" @click="clear" >
            <Icon size="16">
              <Backspace24Filled/>
            </Icon>
          </n-button>
      </template></n-input>
          </div>
          <div class="search">
        <n-button quaternary @click="search" >搜索</n-button>
          </div>
        </div>
      </div>
      <div class="divline"/>
      <div class="view">
        <n-scrollbar style="max-height:100%">
            <router-view/>
        </n-scrollbar>
      </div>
    </div>
  </div>

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
</div>
</template>

<script lang="ts">
import axios from 'axios';
import LeftNav from "../Team/LeftNav.vue"
import TeamHead from "../Team/TeamHead.vue"
import {Icon} from "@vicons/utils";
import {Document} from "@vicons/carbon"
import {Backspace24Filled} from "@vicons/fluent"
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
    TeamHead,
    Icon,
    Backspace24Filled
  },
  setup() {
    let judge = ref('');
    const router = useRouter();
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
        key: 'teamprojects',
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
        key: 'teammembers',
        icon: renderIcon(PersonIcon)
      },
      {
        label: () =>
            h(
                RouterLink,
                {
                  to:
                      '/team/teamDocuments?teamID=' + teamID.value
                },
                {default: () => '文档'}
            ),
        key: 'teamDocuments',
        icon: renderIcon(Document)
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
        key: 'teamsettings',
        icon: renderIcon(Settings)
      },
    ]

    const route = useRoute()
    let searchText = ref('')
    let teamID = ref('')
    const com = ref(null)
    const showModalRef = ref(false)
    const headers = {
      Authorization: utils.getCookie('Authorization')
    }
    const clear= () => {
      searchText.value = ''
      search()
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
    const search = () =>{
    router.push({
      path:"/team/teamprojects",
      query:{teamID:route.query.teamID,
            searchText:searchText.value}
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
     if(typeof(route.query.teamID)!="undefined")
     teamID.value=(route.query.teamID).toString();
     judge.value=router.currentRoute.value.fullPath.toString().split("/")[2].split("?")[0]
     console.log('judge change to '+judge.value)
    })
    return {
       handleUpdateValue(key: string, item: MenuOption) {
        judge.value=key
        console.log('judge change to '+judge.value)
      },
      judge,

      clear,
      searchText,
      route,
      search,
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

.search{
  display: inline-block;
}
.clsL,.clsR{
  display: inline-block;
}

.clsR{
  width: 450px;
  margin-left: 50px;
  vertical-align: top;
}
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
.out{
  height:100%;
}
</style>
