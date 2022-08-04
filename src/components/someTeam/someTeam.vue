<template>
  <n-layout has-sider native-scrollbar="false">
    <n-layout-sider content-style="padding: 0;">
      <LeftNav @ID="getID" @addTeam="showModal=true" ref="getChildList"/>
    </n-layout-sider>
    <router-view/>
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
import teamPage from "./teamPage.vue"
import {ref, h, defineComponent, onMounted} from 'vue'
import {darkTheme} from "naive-ui";

import {useRouter} from "vue-router";
import utils from "@/Utils";

const headers = {
  Authorization: utils.getCookie('Authorization')
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
  },
  setup() {
    const router = useRouter()
    let teamID = ref(-1)
    const com = ref(null)
    const showModalRef = ref(false)
    const formRef = ref<FormData | null>(null)
    const modelRef = ref({
      name: "",
      description: "",
    })
    const getID = (msg: any) => {
      // console.log("father get:" + msg)
      // teamID.value = parseInt(msg)
      // com.value.teamData.ID = teamID.value
      // console.log(com.value.teamData)
      // console.log("father push" + teamID.value)
      // let tID = (teamID.value)
      // router.push({
      //   path: '/team/teamProjects',
      //   query: {teamID1: tID}
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
      // onMounted(() => {
      //   router.push({
      //     path: '/team/teamProjects',
      //     query: {teamID: teamID.value}
      //   })
      // })
    }
    return {
      theme: darkTheme,
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

</style>
