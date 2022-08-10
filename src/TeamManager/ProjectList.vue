<template>
  <div class="out">
    <div class="main">
      <div class="layout">
        <div class="discribe">

          管理你的{{ projects.length }}个项目
          <div class="order">
            <span>排序方式:</span>
            <n-dropdown trigger="hover" :options="options" @select="handleSelect">
              <n-button quaternary>{{ sortMethod }}</n-button>
            </n-dropdown>
            <div class="up" v-if="ifUp===true">
              <n-button size="tiny" quaternary @click="changeUp">
                <div class="upTag">
                  <Icon size="20">
                    <CaretUp24Filled/>
                  </Icon>
                </div>
              </n-button>
            </div>
            <div class="up" v-if="ifUp===false">
              <n-button size="tiny" quaternary @click="changeUp">
                <div class="upTag">
                  <Icon size="20">
                    <CaretDown24Filled/>
                  </Icon>
                </div>
              </n-button>
            </div>
          </div>
          <div class="buttons">
            <n-button class="newpage" @click="displayAdd" size="small">
              新 建 项 目&nbsp;
              <Icon size="14">
                <Add28Regular/>
              </Icon>
            </n-button>
          </div>
        </div>
        <div class="prolist">
          <ProCard v-for="(item, i) in projects" :img="item.src" :key="i" :name="item.name" :id="item.ID" :date="item.createTime"
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
            <n-input v-model:value="modelRef.name" placeholder="请输入项目名称" @keydown.enter.prevent/>
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
    <n-config-provider :theme="theme">
      <n-modal
          v-model:show="showModalAddRef"
          :mask-closable="false"
          preset="dialog"
          title="创建项目"
          positive-text="确认"
          negative-text="取消"
          @positive-click="onPositiveAddClick"
          @negative-click="onNegativeAddClick"
      >
        <n-form :model="modelAddRef">
          <n-form-item label="项目名称" :rule="ruleAdd" :render-feedback="formatFeedback">
            <n-input v-model:value="modelAddRef.name" placeholder="请输入项目名称" @keydown.enter.prevent/>
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
import ProCard from "@/TeamManager/projectCard.vue"
import {Edit} from "@vicons/tabler"
import {Icon} from "@vicons/utils";
import {CaretUp24Filled} from "@vicons/fluent"
import {CaretDown24Filled} from "@vicons/fluent"
import {darkTheme, useMessage} from "naive-ui";
import {defineComponent, computed, watch, h, onMounted, reactive, ref} from "vue";
import {useRoute} from 'vue-router'
import {Close} from "@vicons/ionicons5"
import {PlusOutlined} from "@vicons/antd";
import utils from '../Utils'
import axios from "axios";

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
  name: ""
})
const getList = () => {
  let direction = 0;
  if (ifUp.value)
    direction = 1;

  const url = '/program/list?' + 'teamID=' + route.query.teamID + '&page=0&size=100&sort='
      + sort.value + '&direction=' + direction + '&keyword=' + keyword.value;
  console.log("keyword is " + keyword.value)
  axios.get(url, {headers: headers}).then(res => {
    projects.value = res.data.data.items
    for (let i = 0; i < projects.value.length; i++) {
      let tempDate = new Date(projects.value[i].createTime).toLocaleString().replace(/:\d{1,2}$/, ' ')
      projects.value[i].createTime = tempDate
    }
    console.log(projects.value)
  })
}
const getGlobal = computed(() => {
  return route.query.teamID + '&' + route.query.searchText
})
watch(getGlobal, (newVal, oldVal) => {
  console.log(getGlobal)
  if (typeof (route.query.searchText) != "undefined") {
    keyword.value = route.query.searchText.toString()
  }
  if (typeof (route.query.teamID) != "undefined") {
    getList()
  }
}, {immediate: true, deep: true})
onMounted(() => {
  if (typeof (route.query.teamID) != "undefined")
    teamID.value = parseInt(route.query.teamID.toString())

  if (typeof (route.query.searchText) != "undefined")
    keyword.value = route.query.searchText.toString();
  getList()

})
const ruleAdd = {
  required: true,
  validator() {
    if (modelAddRef.value.name.length === 0) {
      return new Error("新项目名不能为空!")
    } else {
      if (modelAddRef.value.name.length >= 8) {
        return new Error("新项目名长度不能大于8!")
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
  console.log("start copy " + ID)
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
    message.warning("项目名称不能为空～")
    return;
  }
  axios.put("/program", {
    "ID": opID.value,
    "src": "src",
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
  console.log(ID)
  opID.value = ID
  delRef.value = true
}

const onNegativeClickDel = () => {
  delRef.value = false
};

const onPositiveClickDel = () => {
  let deleUrl = '/program/' + opID.value

  axios.delete(deleUrl, {headers: headers}).then(res => {
    console.log(res.data)
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
  if (modelAddRef.value.name.length === 0) {
    message.warning("项目名称不能为空！")
    return
  }
  axios.post('/program', {
    'teamID': route.query.teamID,
    "src": "",
    "name": modelAddRef.value.name
  }, {headers: headers}).then(res => {
    if (res.data.msg === "成功") {
      console.log("添加项目成功！")
      let t = new Date();
      let item = {
        "name": modelAddRef.value.name,
        "src": "nope",
        "createTime": t,
        "ID": res.data.data
      }
      projects.value.push(item)
      message.info("添加成功！")
    } else {
      message.error("添加失败！")
    }
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
  margin: 0 10px 20px 0;
}

.prolist {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.discribe {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;
  align-items: center;
  margin-bottom: 6px;

  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  color: #414958;
}

.buttons {
  margin-right: 10px;
}

.layout {
  margin: 20px 50px 0 60px;
}
</style>