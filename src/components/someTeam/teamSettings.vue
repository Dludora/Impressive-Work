<template>
  <div class="out">
    <n-config-provider :theme="theme">
      <div class="settings">
        <n-form
            ref="formRef"
            :model="model"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{
      maxWidth: '640px'
    }"
        >
          <n-form-item label="团队名称" path="inputValue" :rule="ruleName">
            <n-input class="input" style="backgroud:green;" v-model:value="model.inputValue" placeholder="Input"/>
          </n-form-item>
          <n-form-item label="团队简介" path="textareaValue">
            <n-input
                class="input"
                v-model:value="model.textareaValue"
                placeholder="请输入团队简介(非必须)"
                type="textarea"
                :autosize="{
          minRows: 3,
          maxRows: 5
        }"
            />
          </n-form-item>
        </n-form>
        <n-button @click="change" style="margin-left:200px" size="large" type="primary" v-if="myIdentify>=1">
          保存修改
        </n-button>
        <n-button @click="cancel" style="margin-left:50px" size="large" type="tertiary" v-if="myIdentify>=1">
          取消修改
        </n-button>
      </div>
      <div class="dismiss">
        <div class="message">
          <span> > 项目数量 : {{ proNum }}</span> <br/>
          <span> > 成员数量 : {{ memNum }} </span> <br/>
          <span> > 创立时间 : 2022.8.9 </span>
        </div>
        <div class="button">
          <n-button @click="showModalDissolve=true" style="padding-left: 40px;padding-right: 40px;font-size: 14px;"
                    dashed
                    v-if="myIdentify===2">解 散 团 队
          </n-button>
          <n-button @click="showModalExit=true" style="padding-left: 40px;padding-right: 40px;font-size: 14px;" dashed
                    v-else>退 出
            团 队
          </n-button>
        </div>
      </div>

      <n-modal
          v-model:show="showModalDissolve"
          preset="dialog"
          title="解散团队"
          positive-text="确认"
          negative-text="取消"
          @positive-click="posDissolve"
          @negative-click="negDissolve"
      >
        <p style="font-size: 15px">
          确认解散团队
        </p>
      </n-modal>

      <n-modal
          v-model:show="showModalExit"
          preset="dialog"
          title="解散团队"
          positive-text="确认"
          negative-text="取消"
          @positive-click="posExitTeam"
          @negative-click="negExitTeam"
      >
        <p style="font-size: 15px">
          确认退出团队
        </p>
      </n-modal>
    </n-config-provider>

  </div>
</template>

<script setup tang="ts">
import {onMounted, ref, watch, computed} from 'vue'
import {darkTheme, useMessage} from 'naive-ui'
import axios from "axios";
import {useRouter, useRoute} from "vue-router";
import utils from '../../Utils'


const myID = ref(utils.getCookie('userID'))
const myIdentify = ref(0)

const theme = darkTheme
const router = useRouter()
const route = useRoute()
const message = useMessage()
const proNum = ref()
const memNum = ref()
const model = ref({
  inputValue: '',
  textareaValue: '',
  src: '',
  switchValue: false
})
const headers = {
  Authorization: utils.getCookie('Authorization')
}

const showModalDissolve = ref(false)
const dissolve = () => {
  axios.delete('/team/' + route.query.teamID, {headers: headers}).then(res => {
    if (res.data.msg === "成功") {
      message.success("团队已解散")
      router.push('/teamchoose')
    } else {
      message.info("你不是创建者,无法解散")
    }
  })
}
const posDissolve = () => {
  showModalDissolve.value = false
  dissolve()
}
const negDissolve = () => {
  showModalDissolve.value = false
}

const showModalExit = ref(false)
const exitTeam = () => {
  axios.post(
      '/team/' + route.query.teamID + '/quit',
      {},
      {headers: headers}
  ).then(res => {
    if (res.data.msg === '成功') {
      message.success("已退出团队")
      router.push('/teamchoose')
    }
  })
}
const posExitTeam = () => {
  showModalExit.value = false
  exitTeam()
}
const negExitTeam = () => {
  showModalExit.value = false
}


const getNum = () => {
  const url = '/program/list?' + 'teamID=' + route.query.teamID + '&page=0&size=100&sort=0'
      + '&direction=0' + '&keyword=';
  axios.get(url, {headers: headers}).then(res => {
    proNum.value = res.data.data.items.length
  })
  const url2 = '/team/' + route.query.teamID + '/members?page=0&size=100'
  axios.get(url2, {headers: headers}).then(res => {

    memNum.value = res.data.data.items.length

  })
}
const cancel = () => {
  getTeamInfo()
  message.success("取消修改")
}
const ruleName = {
  required: true,
  validator() {
    if (model.value.inputValue.length === 0) {
      return new Error("新团队名不能为空!")
    } else {
      if (model.value.inputValue.length >= 8) {
        return new Error("新团队名长度不能大于8!")
      }
    }
  },
  trigger: ['input', 'blur']
}
const change = () => {
  axios.put('/team', {
    "ID": route.query.teamID,
    "name": model.value.inputValue,
    "src": model.value.src,
    "introduction": model.value.textareaValue
  }, {headers: headers}).then(res => {
    console.log(res.data)
    if (res.data.msg === "成功") {
      message.info("修改成功!")
      router.go(0)

    } else {
      message.info("权限不足，无法修改")
    }
  })
}
const getTeamInfo = () => {
  console.log(route.query.teamID)
  axios.get('/team/' + route.query.teamID + '/info', {headers: headers}).then(res => {
    if (res.data.msg === '成功') {
      model.value.inputValue = res.data.data.name
      model.value.textareaValue = res.data.data.introduction
      model.value.src = res.data.data.src
    }
  })
}
const getGlobal = computed(() => {
  return route.query.teamID
})

const getIdentify = () => {
  let url = '/team/' + route.query.teamID + '/member/' + myID.value + '/info'
  axios.get(url, {headers: headers}).then(res => {
    myIdentify.value = res.data.data.identify
  })
}

watch(getGlobal, (newVal, oldVal) => {
  console.log("value change" + newVal)
  getTeamInfo();
}, {immediate: true, deep: true})
onMounted(() => {
  getTeamInfo()
  getNum()
  getIdentify()
})
</script>

<style scoped>
.input {
  background-color: transparent;
  border: #414958 1px solid;
}

.button {
  margin-top: 20px;
  width: 100%;
}

.settings {
  width: 50%;
  display: inline-block;
  padding-right: 8%;
  border-right: 1px solid #414958;
}

.dismiss {
  margin-left: 6%;
  font-size: larger;
  line-height: 45px;
  vertical-align: top;
  color: white;
  width: 30%;
  display: inline-block;
}

.out {

  margin-top: 30px;
  margin-left: 80px;
}

</style>