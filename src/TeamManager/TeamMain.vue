<template>
    <div class="main">
      <TeamHead ref="com" style="z-index:1;padding:25px 60px 22px"/>
      <!-- <UpBar style="z-index:1;padding:25px 60px 22px"/> -->
      <div class="three-cls">
        <n-config-provider :theme="theme">
          <n-menu mode="horizontal" :options="menuOptions"/>
        </n-config-provider>
      </div>

      <div class="view">
        <n-scrollbar style="max-height:100%">
            <router-view/>
        </n-scrollbar>
      </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
// import LeftNav from "../Team/LeftNav.vue"
import * as TeamHead from "../components/Team/TeamHead.vue"

import {useRoute} from "vue-router";
import {ref, h, Component, defineComponent, onMounted} from 'vue'
import {NIcon} from "naive-ui";
import type {MenuOption} from "naive-ui";
import {darkTheme} from "naive-ui";

import {RouterLink,useRouter} from "vue-router";

import {PersonOutline as PersonIcon} from "@vicons/ionicons5"
import {ProjectOutlined as Project} from "@vicons/antd"
import {IosSettings as Settings} from "@vicons/ionicons4"
import {PeopleTeam16Filled as Team} from "@vicons/fluent"
import utils from "@/Utils";
const route = useRoute()

const headers = {
  Authorization: utils.getCookie('Authorization')
}

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
    // LeftNav,
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
                '/team/projects?teamID='+teamID.value           
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
              '/team/members?teamID='+teamID.value
               
              
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
                 '/team/setting?teamID='+teamID.value
            
            },
            {default: () => '设置'}
        ),
    key: 'go-to-settings',
    icon: renderIcon(Settings)
  },
]
    const router = useRouter()
    let teamID = ref(-1)
    const com = ref(null)
    const showModalRef = ref(false)
    const formRef = ref<FormData | null>(null)
    const modelRef = ref({
      name: "",
      description: "",
    })
    const getID = (msg:any) =>{
        console.log("father get:"+msg)
        teamID.value = parseInt(msg)

        console.log("father push"+teamID.value)
        let tID=(teamID.value)
        // router.push({path:'/team/projects',
        //   query:{teamID1:tID}
        // })
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
      showModalRef.value = false
      axios.post('/team', {
        'name': modelRef.value.name,
        'src': profile.src,
        'introduction': modelRef.value.description
      }, {headers: headers}).then(res => {
        console.log(res)
        getChildList.value.getAllTeams(0, 8)
        modelRef.value.name = ""
        modelRef.value.description = ""
      })
      onMounted(()=>{
      })
    }
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
      formRef,
      teamID,
      formatFeedback(raw: string | undefined) {
        h('div', {style: 'color: green'}, [raw + '而且是绿的'])
      },
    }
  },
  methods: {
    load() {
      axios.get('user/info', {headers: headers}).then(res => {
        profile = res.data.data
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
.main{
    height: 100%;
    /* max-height: 100%; */
    /* overflow: auto; */
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 100%;
}
.view{
    overflow: auto;
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
.three-cls{
  background: #16181D;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  /*position: absolute;*/
  min-width: 100%;
  /*top:0%;*/
  padding: 0px 50px;
  z-index:1;
}
</style>
