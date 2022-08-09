<template>
  <div class="main">
    <div class="layout">
      <div class="discribe">
        管理你的{{ length }}个文件夹
        <div class="buttons" v-if="crumbs[crumbs.length-1].isPro === 0">
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
            <n-breadcrumb-item class="breadcrumb" separator=">" v-for="(item, i) in crumbs" :key="i" @click="dblClickCrumb(item, i)"
                               @drop="onDrop2($event, item, i)" @dragover.prevent @dragenter.prevent>
              {{item.name}}
            </n-breadcrumb-item>
          </n-breadcrumb>
        </n-config-provider>
      </div>
      <div class="prolist">
        <docu-item v-for="(item, i) in list" :key="i" :dir="item.dir" :name="item.name" :md-time="item.mdTime" :revisable="revisable(i)"
                   @dblclick="dblClick(item, true)" @modifyName="listRename(i)" @del="del(i)"
                  @dragstart="startDragDoc($event, item)" @drop="onDrop($event, item)" @dragover.prevent @dragenter.prevent/>
      </div>
    </div>
  </div>
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModalRef"
        :mask-closable="false"
        preset="dialog"
        title="重命名文件夹/文档"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
      <n-form :model="modelRef">
        <n-form-item label="文件夹/文档名称" :rule="listRenameRule" :render-feedback="formatFeedback">
          <n-input v-model:value="modelRef.name" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>
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
        <n-form-item label="文档模版选择" :rule="modelRule">
          <n-select   v-model:value="addModelRef.model"
                      placeholder="请选择文档模版"
                      :options="modeloptions"
          />
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
        确定删除文档/文件夹
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
    isPro: 0,
    doc: null
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
  isPro: 1,
  doc: null
}


const revisable = (index) => {
  return list.value[index].isPro === 0
}
// 获取
let timer = null
const dblClickCrumb = (item, index) => {
  crumbs.value.splice(index+1, crumbs.value.length-index+1)
  dblClick(item, false)
}
const dblClick = (item, add) => {
  if (!item.dir) {
    console.log('是文件')
    let urlOP = '/document/'+item.doc.ID
    axios.get(urlOP, {headers: headers}).then(res => {
      console.log("获取文档内容成功");
      let opContent;
      console.log(item)
      if(res.data.data.copy===true){
        opContent = res.data.data.content;
        console.log("获取文档内容成功2");
        console.log(opContent);
        utils.setCookie('DocContent', opContent);

        axios.put(urlOP,
            {
              'title': res.data.data.title,
              'src': null,
              'programID': res.data.data.programID,
              'copy': false,
            },{headers:headers}
        )
      }else{
        console.log("获取文档内容成功3");
        opContent = "";
        console.log(opContent);
        utils.setCookie('DocContent', opContent);
      }
      let opTitle = res.data.data.title;
      utils.setCookie('editDocID', item.doc.ID);
      utils.setCookie('DocTitle', opTitle);
      router.push({path: '/teamDocView', query: {teamID: route.query.teamID}});
    })


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
            isPro: 0,
            doc: array[i].doc
          },
      )
    }
  })
}

onMounted(() => {
  getDoc(null)
})

// 重命名文件夹
// 决定重命名弹窗是否出现
const showModalRef = ref(false)
const modelRef = ref({
  name: "",
  ID: 0,
  teamID: 0,
  parentID: 0
})
const listRename = (index) => {
  modelRef.value.name = list.value[index].name
  modelRef.value.ID = list.value[index].fileID
  modelRef.value.teamID = list.value[index].teamID
  modelRef.value.parentID = list.value[index].parentID
  showModalRef.value = true
}
const listRenameRule = {
  required: true,
  validator() {
    if (modelRef.value.name.length === 0) {
      return new Error("文件夹/文档名称不可为空")
    } else {
      if (modelRef.value.name.length >= 12) {
        return new Error("文件夹/文档名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}
const onPositiveClick = () => {
  axios.put('/doccenter', modelRef.value, {headers: headers}).then(res => {
    getDoc(modelRef.value.parentID)
  })
  showModalRef.value = true

}
const onNegativeClick = () => {
  showModalRef.value = true
}
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
    getDoc(crumbs.value[crumbs.value.length-1].fileID)
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

// 删除文档/文件夹
const showDel = ref(false)
const delRef = ref(
    {
      ID: 0,
      teamID: 0,
      parentID: 0
    }
)
const del = (index) => {
  showDel.value = true
  delRef.value.ID = list.value[index].fileID
  delRef.value.teamID = list.value[index].teamID
  delRef.value.parentID = list.value[index].parentID
}
const posDel = () => {
  showDel.value = false
  axios.post('/doccenter', delRef.value,{headers: headers}).then(res => {
    getDoc(delRef.value.parentID)
  })
}
const negDel = () => {
  showDel.value = false
}
// 创建文档
const modeloptions = [
  {
    label: "无模版创建",
    value: 'model0',
  },
  {
    label: '项目计划书',
    value: 'model1'
  },
  {
    label: '会议纪要',
    value: 'model2'
  },
  {
    label: "项目管理书",
    value: 'model3',
  },
  {
    label: '工作周报',
    value: 'model4'
  },
  {
    label: '项目方案规划',
    value: 'model5'
  },
  {
    label: '需求规格说明书',
    value: 'model6'
  },
  {
    label: '项目工作汇报',
    value: 'model7',
  },
  {
    label: '待解决问题清单',
    value: 'model8',
  },
]

const showAdd = ref(false)
const addModelRef = ref({
  addName: "",
  model: '',
})
const modelRule = {
  required: true,
  validator() {
    if (addModelRef.value.model.length === 0 ) {
      return new Error("请选择相应模版")
    }
  },
  trigger: ['input', 'blur']
}
const posAdd = () => {
  const parentID = crumbs.value[crumbs.value.length-1].fileID
  let url = '/doccenter/doc' + '?name='+addModelRef.value.addName
  if(parentID !== null) {
    url += '&parentID='+parentID
  }
  console.log(addModelRef.value.model)
  axios.post(url, {title: addModelRef.value.addName, teamID: teamID.value, type: addModelRef.value.model, src: 'what fuck'}, {headers: headers}).then(res => {
    console.log(res)
    console.log('新建文档')
    addModelRef.value.addName = "";
    addModelRef.value.model = "";
    getDoc(crumbs.value[crumbs.value.length-1].fileID)
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


// 拖拽
const startDragDoc = (event, item) => {
  // console.log(item)
  // console.log(item.fileID)
  if(item.isPro === 0) {
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('fileID', item.fileID)
    event.dataTransfer.setData('teamID', item.teamID)
    event.dataTransfer.setData('name', item.name)
  }
}

const onDrop = (event, item) => {
  event.preventDefault()
  if(item.isPro === 0 && item.dir) {
    const fileID = event.dataTransfer.getData('fileID')
    const teamID = event.dataTransfer.getData('teamID')
    const name = event.dataTransfer.getData('name')
    const parentID = item.fileID
    if(parentID != fileID) {
      axios.put('/doccenter', {ID: fileID, teamID: teamID, name: name, parentID: parentID}, {headers: headers}).then(res => {
        // console.log('拖拽')
        getDoc(item.parentID)
      })
    }
  }
}
const onDrop2 = (event, item, index) => {
  event.preventDefault();
  if(item.isPro === 0 && item.dir) {
    const fileID = event.dataTransfer.getData('fileID')
    const teamID = event.dataTransfer.getData('teamID')
    const name = event.dataTransfer.getData('name')
    const parentID = item.fileID
    axios.put('/doccenter', {ID: fileID, teamID: teamID, name: name, parentID: parentID}, {headers: headers}).then(res => {
      // console.log('拖拽')
      dblClickCrumb(item, index)
    })
  }
}
const dragEnter = (event, item) => {
  // event.preventDefault();
  if(item.isPro === 0 && item.dir) {
    const fileID = event.dataTransfer.getData('fileID')
    const parentID = item.fileID
    console.log(fileID)
    if(fileID != parentID) {
      console.log(event.target)
    }
  }
}
const dragOver = () => {

}
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