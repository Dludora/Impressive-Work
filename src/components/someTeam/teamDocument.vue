<template>
  <div class="main">
    <div class="layout">
      <div class="discribe">
        管理你的{{ length }}个文件夹
        <div class="buttons">
          <n-button class="newpage" @click="showModalAddRef=true" size="tiny" style="margin-right: 30px">
            新 建 文 件 夹
            <Icon size="14">
              <Add28Regular/>
            </Icon>
          </n-button>
          <n-button class="newpage" @click="showAdd=true" size="tiny">
            新 建 文 档
            <Icon size="14">
              <Add28Regular/>
            </Icon>
          </n-button>
        </div>
      </div>
      <div class="crumb">
        <n-config-provider :theme="theme">
          <n-breadcrumb>
            <n-breadcrumb-item separator=">" v-for="(item, i) in crumbs" :key="i" @click="dblClickCrumb(item, i)">
              {{item.name}}
            </n-breadcrumb-item>
          </n-breadcrumb>
        </n-config-provider>
      </div>
      <div class="prolist">
        <!--        <FolderCard v-for="(item, i) in folders" :key="i" :name="item.name" :id="item.ID" :date="item.createTime"-->
        <!--                    class="card" @rename="folderRename(i)" @del="delRef=true" @dragstart="startDragFolder($event, item, i)" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent/>-->
        <!--        <docCard v-for="(item, i) in documents" :key="i" @edit="docuEdit(i)" @del="showDel = true"-->
        <!--                 :title="item.title" :ID="item.ID"/>-->
        <docu-item v-for="(item, i) in list" :key="i" :dir="item.dir" :name="item.name" :md-time="item.mdTime"
                   @dblclick="dblClick(item, true)"/>
      </div>
    </div>
  </div>
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModalRef"
        :mask-closable="false"
        preset="dialog"
        title="重命名文件夹"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
      <n-form :model="modelRef">
        <n-form-item label="文件夹名称" :rule="folderRenameRule" :render-feedback="formatFeedback">
          <n-input v-model:value="modelRef.name" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>
    </n-modal>
    <n-modal
        v-model:show="delRef"
        :mask-closable="false"
        preset="dialog"
        title="确认要删除文件夹吗 ? "
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClickDel"
        @negative-click="onNegativeClickDel"
    >
    </n-modal>
    <n-modal
        v-model:show="showModalAddRef"
        :mask-closable="false"
        preset="dialog"
        title="创建文件夹"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveAddClick"
        @negative-click="onNegativeAddClick"
    >
      <n-form :model="modelAddRef">
        <n-form-item label="文件夹名称" :rule="ruleAdd" :render-feedback="formatFeedback">
          <n-input v-model:value="modelAddRef.name" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>
    </n-modal>
  </n-config-provider>
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showAdd"
        preset="dialog"
        title="新建文档"
        positive-text="确认"
        negative-text="取消"
        @positive-click="posAdd"
        @negative-click="negAdd"
    >
      <n-form ref="addFormRef" :model="addModelRef">
        <n-form-item label="文档名称" :rule="addRule">
          <n-input v-model:value="addModelRef.addName" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>

    </n-modal>

    <n-modal
        v-model:show="showEdi"
        preset="dialog"
        title="重命名文档"
        positive-text="确认"
        negative-text="取消"
        @positive-click="posEdi"
        @negative-click="negEdi"
    >
      <n-form ref="ediFormRef" :model="ediModelRef">
        <n-form-item label="项目名称 · 新" :rule="ediRule">
          <n-input v-model:value="ediModelRef.ediName" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>

    </n-modal>

    <n-modal
        v-model:show="showDel"
        preset="dialog"
        title="删除文档"
        positive-text="确认"
        negative-text="取消"
        @positive-click="posDel"
        @negative-click="negDel"
    >
      <p style="font-size: 15px">
        确定删除文档
      </p>
    </n-modal>
  </n-config-provider>
</template>
<script setup lang="ts">
import {
  Add28Regular
} from '@vicons/fluent'
import axios from "axios"
import {darkTheme, useMessage} from "naive-ui";
import {defineComponent, computed, watch, h, onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from 'vue-router'
import {Close} from "@vicons/ionicons5"
import {PlusOutlined} from "@vicons/antd"
import {Icon} from '@vicons/utils'
import utils from '../../Utils';
import DocuItem from "@/components/someTeam/docuItem.vue";


// import FolderCard from "@/components/Document/folderCard.vue";
// import docCard from './documentCard.vue'

const theme = darkTheme
const length = ref(0)
const route = useRoute()
const router = useRouter()
const message = useMessage()

const headers = {
  Authorization: utils.getCookie('Authorization')
}
const teamID = ref(route.query.teamID)

const crumbs = ref([
  {
    fileID: null,
    teamID: teamID.value,
    dir: true,
    name: '文档中心',
    parentID: null,
    createTime: null,
    mdTime: null,
    isPro: 0
  },
])

const list = ref([])

const proDoc = {
  fileID: -1,
  teamID: teamID.value,
  dir: true,
  name: '项目文件夹',
  parentID: null,
  createTime: null,
  mdTime: null,
  isPro: 1
}

// 获取
let timer = null
const dblClickCrumb = (item, index) => {
  crumbs.value.splice(index+1, crumbs.value.length-index+1)
  console.log(list.value)
  dblClick(item, false)
}
const dblClick = (item, add) => {
  if (!item.dir) {
    console.log('是文件')
  } else {
    console.log('是文件夹')
    if(item.isPro === 0) {
      console.log('不是项目的文件夹')
      if(add) {
        crumbs.value.push(item)
      }
      getDoc(item.fileID)
    } else if(item.isPro === 1) {
      if(add) {
        crumbs.value.push(item)
      }
      axios.get('/program/list'+'?teamID='+route.query.teamID, {headers: headers}).then(res => {
        console.log(res.data)
        const array = res.data.data.items
        list.value.splice(0, list.value.length)
        for(let i = 0; i < array.length; i++) {
          list.value.push(
              {
                fileID: array[i].ID,
                teamID: array[i].teamID,
                dir: true,
                name: array[i].name,
                parentID: null,
                createTime: null,
                mdTime: null,
                isPro: 2
              }
          )
        }
      })
    } else {
      if(add) {
        crumbs.value.push(item)
      }
      axios.get('/document/list'+'?programID='+item.fileID, {headers: headers}).then(res => {
        console.log(res)
        const array = res.data.data.items
        list.value.splice(0, list.value.length)
        for(let i = 0; i < array.length; i++) {
          list.value.push(
              {
                fileID: array[i].ID,
                teamID: array[i].teamID,
                dir: false,
                name: array[i].title,
                parentID: null,
                createTime: null,
                mdTime: null,
                isPro: 2
              }
          )
        }
      })
    }
  }

  console.log(item)
}
const getDoc = (fileID) => {
  let url;
  list.value.splice(0, list.value.length)
  if(fileID !== null) {
    url = '/doccenter/list'+'?teamID='+route.query.teamID+'&fileID='+fileID
  } else {
    list.value.push(proDoc)
    url = '/doccenter/list'+'?teamID='+route.query.teamID
  }
  console.log(url)
  axios.get(url, {headers: headers}).then(res => {
    console.log(res.data.data.items)
    const array = res.data.data.items
    for (let i = 0; i < array.length; i++) {
      list.value.push(
          {
            fileID: array[i].ID,
            teamID: array[i].teamID,
            dir: array[i].dir,
            name: array[i].name,
            parentID: array[i].parentID,
            createTime: array[i].createTime,
            mdTime: null,
            isPro: 0
          },
      )
    }
  })
}

onMounted(() => {
  getDoc(null)
})
//
// // 文件夹
// let folders = ref([
//   {
//     ID: 1,
//     name: '项目文件夹',
//     createTime: '2022/08/08',
//     folders: [
//       {
//         ID: 1,
//         name: '项目文件夹',
//         createTime: '2022/08/08',
//         folders: []
//       },
//     ]
//   },
//   {
//     ID: 2,
//     name: '文件夹一',
//     createTime: '2022/08/08',
//     folders: [
//       {
//         ID: 1,
//         name: '项目文件夹',
//         createTime: '2022/08/08',
//         folders: []
//       },
//     ]
//   }
// ])
// // 重命名文件夹
// // 决定重命名弹窗是否出现
// const showModalRef = ref(false)
// const modelRef = ref({
//   name: ""
// })
// const folderRename = (index) => {
//   modelRef.value.name = folders.value[index].name
//   showModalRef.value = true
// }
// const folderRenameRule = {
//   required: true,
//   validator() {
//     if (modelRef.value.name.length === 0) {
//       return new Error("文件夹名称不可为空")
//     } else {
//       if (modelRef.value.name.length >= 12) {
//         return new Error("文件夹名称长度不能大于8")
//       }
//     }
//   },
//   trigger: ['input', 'blur']
// }
// const onPositiveClick = () => {
//   showModalRef.value = true
// }
// const onNegativeClick = () => {
//   showModalRef.value = true
// }
// 新建文件夹弹窗
// const delRef = ref(false)
// const onPositiveClickDel = () => {
//   delRef.value = false
// }
// const onNegativeClickDel = () => {
//   delRef.value = false
// }
// 增加文件夹
const showModalAddRef = ref(false)
const modelAddRef = ref({
  name: ""
})
const onPositiveAddClick = () => {
  showModalAddRef.value = false
  console.log(crumbs.value[crumbs.value.length-1])
  axios.post('/doccenter/dir', {teamID: teamID.value, name: modelAddRef.value.name, parentID: crumbs.value[crumbs.value.length-1].fileID}, {headers: headers}).then(res => {
    modelAddRef.value.name = ""
    dblClick(crumbs.value[crumbs.value.length-1], false)
  })
}
const onNegativeAddClick = () => {
  showModalAddRef.value = false
}
const ruleAdd = {
  required: true,
  validator() {
    if (modelAddRef.value.name.length === 0) {
      return new Error("文件夹名称不可为空")
    } else {
      if (modelAddRef.value.name.length >= 12) {
        return new Error("文件夹名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}
// // 文档
// let documents = [
//   {
//     ID: 1,
//     title: '文件一',
//   }
// ]
// const showEdi = ref(false)
// // 编辑文档名称
// const ediModelRef = ref({
//   ediName: ""
// })
// const docuEdit = (i) => {
//   ediModelRef.value.ediName = documents[i].title
//   showEdi.value = true
// }
// const negEdi = () => {
//   showEdi.value = false
// }
// const posEdi = () => {
//   showEdi.value = false
// }
// const ediRule = {
//   required: true,
//   validator() {
//     if (ediModelRef.value.ediName.length === 0) {
//       return new Error("文档名称不可为空")
//     } else {
//       if (ediModelRef.value.ediName.length >= 12) {
//         return new Error("文档名称长度不能大于8")
//       }
//     }
//   },
//   trigger: ['input', 'blur']
// }
// // 删除文档
// const showDel = ref(false)
// const posDel = () => {
//   showDel.value = false
// }
// 创建文档
const showAdd = ref(false)
const addModelRef = ref({
  addName: ""
})
const posAdd = () => {
  const parentID = crumbs.value[crumbs.value.length-1].fileID
  let url = '/doccenter/doc' + '?name='+addModelRef.value.addName
  if(parentID !== null) {
    url += '&parentID='+parentID
  }
  axios.post(url, {title: addModelRef.value.addName, teamID: teamID.value, type: 'model1', src: 'what fuck'}, {headers: headers}).then(res => {
    addModelRef.value.addName = "";
    console.log(res.data)
    console.log('创建文档')
    getDoc(crumbs.value[crumbs.value.length-1], false)
  })
  showAdd.value = false;
};
const negAdd = () => {
  addModelRef.value.addName = "";
  showAdd.value = false;
};
const addRule = {
  required: true,
  validator() {
    if (addModelRef.value.addName.length === 0) {
      return new Error("文档名称不可为空")
    } else {
      if (addModelRef.value.addName.length >= 12) {
        return new Error("文档名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}


// // 拖拽
// const startDragFolder = (event, item, index) => {
//   // console.log(item)
//   // console.log(item.ID)
//   event.dataTransfer.dropEffect = 'move'
//   event.dataTransfer.effectAllowed = 'move'
//   event.dataTransfer.setData('itemID', item.ID)
// }
// const startDragDocument = (event, item, index) => {
//
//
// }
// const onDrop = (event) => {
//   const itemID = event.dataTransfer.getData('itemID')
//   console.log(itemID)
// }

</script>

<style scoped>
.main {
  width: 100%;
}

.card {
  margin: 0 10px 20px 0;
}

.crumb {
  margin: 10px 0;
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

.newpage {
  /*margin-right: 10px;*/
}

.layout {
  margin: 20px 50px 0 60px;
}
</style>