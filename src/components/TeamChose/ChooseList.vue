<template>
  <div class="out">
    <div class="main">
      <div class="layout">
        <div class="discribe">

          您加入了{{ projects.length }}个团队
          <div class="buttons">
            <n-button class="newpage" @click="displayAdd" size="small">
              新 建 团 队&nbsp;
              <Icon size="16">
                <Add28Regular/>
              </Icon>
            </n-button>
          </div>
        </div>
        <div class="prolist">
          <TeamCard v-for="(item, i) in projects" :key="i" :name="item.name" :color="item.src" :id="item.ID" :date="item.introduction"
                   class="card" @rename="displayMedal(item.ID)" @copy="displayCopy(item.ID)"
                   @del="displayDel(item.ID)"/>
        </div>
      </div>
    </div>
    <n-config-provider :theme="theme">
      <n-modal
          v-model:show="showModalRef"
          :mask-closable="false"
          preset="dialog"
          title="重命名"
          positive-text="确认"
          negative-text="取消"
          @positive-click="onPositiveClick"
          @negative-click="onNegativeClick"
      >
        <n-form :model="modelRef">
          <n-form-item label="项目名称" :rule="rule" :render-feedback="formatFeedback">
            <n-input v-model:value="modelRef.name" @keydown.enter.prevent placeholder="请输入项目名称"/>
          </n-form-item>
        </n-form>
      </n-modal>
      <n-modal
          v-model:show="delRef"
          :mask-closable="false"
          preset="dialog"
          title="确认要删除团队吗 ? "
          positive-text="确认"
          negative-text="取消"
          @positive-click="onPositiveClickDel"
          @negative-click="onNegativeClickDel"
      >
      </n-modal>
    </n-config-provider>
    <n-config-provider :theme="theme">
      <n-modal
          v-model:show="showModalAddRef"
          :mask-closable="false"
          preset="dialog"
          title="创建团队"
          positive-text="确认"
          negative-text="取消"
          @positive-click="onPositiveAddClick"
          @negative-click="onNegativeAddClick"
      >
        <n-form :model="modelRef">
        <n-form-item label="团队名称" :rule="ruleName" :render-feedback="formatFeedback">
          <n-input v-model:value="modelRef.name" @keydown.enter.prevent placeholder="请输入团队名称"/>
        </n-form-item>
        <n-form-item label="团队描述" :rule="ruleDescription" :render-feedback="formatFeedback">
          <n-input v-model:value="modelRef.introduction" @keydown.enter.prevent type="textarea" placeholder="请输入团队描述(非必须)"/>
        </n-form-item>
        </n-form>
      </n-modal>
      <n-modal
          v-model:show="delRef"
          :mask-closable="false"
          preset="dialog"
          title="确认要删除项目吗 ? "
          positive-text="确认"
          negative-text="取消"
          @positive-click="onPositiveClickDel"
          @negative-click="onNegativeClickDel"
      >
      </n-modal>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import {
  Export
} from '@vicons/carbon'
import {
  Add28Regular
} from '@vicons/fluent'
// import { Icon } from '@vicons/utils'
import TeamCard from "@/components/TeamChose/teamCard.vue"
import {Edit} from "@vicons/tabler"
import {Icon} from "@vicons/utils";
import {CaretUp24Filled} from "@vicons/fluent"
import {CaretDown24Filled} from "@vicons/fluent"
import {darkTheme, useMessage} from "naive-ui";
import {defineComponent, computed, watch, h, onMounted, reactive, ref} from "vue";
import {useRoute} from 'vue-router'
import {Close} from "@vicons/ionicons5"
import {PlusOutlined} from "@vicons/antd";
import utils from '../../Utils'
import axios from "axios";
const colorList=[
  '#2350A9',
  '#55DD6C',
  '#DDB055',
  '#AA2293',
  '#55DDD1',
  '#8ED42B',
  '#D42B39',
  '#5A22AA',
]
const nextColor=()=>{
  let max=colorList.length
  let idx=max+2
  while(idx>=max)
    idx=Math.floor(Math.random() * max)
  return colorList[idx]
}

let shortcuts = [
  {
    id: 0,
    name: '',
    img: null,
    date: '',
  },
]
let length = 0
const sortMethod = ref('修改时间')
const route = useRoute();
const message = useMessage();
const showDropdownRef = ref(false);
let ifUp = ref(false);
const changeUp = () => {
  ifUp.value = !ifUp.value
  getList();
}
const sort = ref(0)
const options = [
  {
    label: '创建时间',
    key: '创建时间',
  },
  {
    label: '项目名称',
    key: "项目名称"
  }
]
const handleSelect = (key: string | number) => {
  message.info(String(key))
  sortMethod.value = String(key)
  if (sortMethod.value === '创建时间')
    sort.value = 0;
  else if (sortMethod.value === "项目名称")
    sort.value = 1;
  getList();
}
const handleClick = () => {
  showDropdownRef.value = !showDropdownRef.value
}
const headers = {
  Authorization: utils.getCookie('Authorization')
}
let keyword = ref('')
const teamID = ref(0)
const theme = darkTheme
let projects = ref([])


// 重命名表单
let showModalRef = ref(false)
const modelRef = ref({
  name: "",
  introduction:""
})
const getList = () => {

  const url = '/team/list?page=0&size=100'
  axios.get(url, {headers: headers}).then(res => {

    projects.value = res.data.data.items
    for(let i =0;i<projects.value.length;i++)
    {
      if(projects.value[i].introduction.length>17)
      {
          projects.value[i].introduction= projects.value[i].introduction.slice(0,16)+'...'
      }
    }
    // console.log("getList:" + projects.value)
  })
}
const getGlobal = computed(() => {
  return route.query.teamID + '&' + route.query.searchText
})
onMounted(() => {
  getList()

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
const ruleAdd = {
  required: true,
  validator() {
    if (modelAddRef.value.name.length === 0) {
      return new Error("团队名不能为空!")
    } else {
      if (modelAddRef.value.name.length >= 8) {
        return new Error("团队名长度不能大于8!")
      }
    }
  },
  trigger: ['input', 'blur']
}

// 操作dialog
// 重命名
const displayMedal = (ID) => {
  opID.value = ID
  showModalRef.value = true
}
const displayCopy = (ID) => {
  // console.log("start copy " + ID)
  let url = '/program/copy?ID=' + ID;
  axios.put(url, {}, {headers: headers}).then(res => {
    if (res.data.msg === "成功") {
      getList();
      message.success("复制成功");
    }
  })
}
const onNegativeClick = () => {
  modelRef.value.name = ""
  showModalRef.value = false
};

const onPositiveClick = () => {

  if (modelRef.value.name.length === 0) {
    message.warning("团队名称不能为空～")
    return;
  }
  axios.put("/program", {
    "ID": opID.value,
    "src": nextColor(),
    "name": modelRef.value.name
  }, {headers: headers}).then(res => {

    if (res.data.msg === "成功") {
      message.info("修改成功")
      for (let i = 0; i < projects.value.length; i++) {
        if (projects.value[i].ID === opID.value) {
          projects.value[i].name = modelRef.value.name
          break;
        }
      }
    } else {
      message.error("修改失败")
    }
  })
  showModalRef.value = false
}

// 删除项目
let delRef = ref(false)
let opID = ref()
const displayDel = (ID) => {
  // console.log(ID)
  opID.value = ID
  delRef.value = true
}

const onNegativeClickDel = () => {
  delRef.value = false
};

const onPositiveClickDel = () => {
  let deleUrl = '/program/' + opID.value

  axios.delete(deleUrl, {headers: headers}).then(res => {
    // console.log(res.data)
    for (let i = 0; i < projects.value.length; i++) {
      if (projects.value[i].ID === opID.value) {
        projects.value.splice(i, 1)
      }
    }
    message.info("删除成功！")
  })
  delRef.value = false
}

// 添加项目表单
let showModalAddRef = ref(false)

const modelAddRef = ref({
  name: ""
})
const formatFeedback = (raw: string | undefined) => {
  h('div', {style: 'color: green'}, [raw + '而且是绿的'])
}

const rule = {
  required: true,
  validator() {
    if (modelAddRef.value.name.length === 0) {
      return new Error("项目名不能为空!")
    } else {
      if (modelAddRef.value.name.length >= 8) {
        return new Error("项目名长度不能大于8!")
      }
    }
  },
  trigger: ['input', 'blur']
}

// 操作dialog
// 重命名
const displayAdd = () => {
  showModalAddRef.value = true
}

const onNegativeAddClick = () => {
  modelRef.value.name = ""
  showModalRef.value = false
};

const onPositiveAddClick = () => {
  if (modelRef.value.name.length === 0) {
    message.warning("团队名称不能为空！")
    return
  }
   axios.post('/team', {
        'name': modelRef.value.name,
        'src': nextColor(),
        'introduction': modelRef.value.introduction
      }, {headers: headers}).then(res => {
        // console.log(res)
        message.info(res.data.msg);
        getList();
        modelRef.value.name = ""
        modelRef.value.introduction = ""
      })
  showModalRef.value = false
}
</script>

<style scoped>

.upTag {
  vertical-align: bottom;
  padding-top: 8px;
}

.up {
  padding-top: 2px;
  float: right;
  vertical-align: bottom;
}

.order {
  font-size: 13px;
  color: #A7AFBE;
  vertical-align: bottom;
  margin-left: auto;
  margin-right: 100px;
}

.main {
  width: 100%;
}

.card {
  margin: 0 8px 16px;
}

.prolist {
  overflow: auto;
  /*margin-left: 5%;
  max-height: 450px;*/
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  overflow:visible;
}

.discribe {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;
  align-items: center;
  margin-bottom: 6px;
  margin-left: 16px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  color: #A7AFBE;
}

.buttons {
  margin-right: 8px;
}

.layout {
  /*margin: 20px 50px 0 60px;*/
}
</style>