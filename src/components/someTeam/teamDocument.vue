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
      <div class="prolist">
        <FolderCard v-for="(item, i) in folders" :key="i" :name="item.name" :id="item.ID" :date="item.createTime"
                    class="card" @rename="folderRename(i)" @del="delRef=true" @dragstart="startDragFolder($event, item, i)" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent/>
        <docCard v-for="(item, i) in documents" :key="i" @edit="docuEdit(i)" @del="showDel = true"
                 :title="item.title" :ID="item.ID"/>
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
        <n-form-item label="项目名称" :rule="addRule">
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
  Export
} from '@vicons/carbon'
import {
  Add28Regular
} from '@vicons/fluent'
import {darkTheme, useMessage} from "naive-ui";
import {defineComponent, computed, watch, h, onMounted, reactive, ref} from "vue";
import {useRoute} from 'vue-router'
import {Close} from "@vicons/ionicons5"
import {PlusOutlined} from "@vicons/antd";
import utils from '../../Utils'
import axios from "axios";
import FolderCard from "@/components/Document/folderCard.vue";
import docCard from './documentCard.vue'

let length = 0

const router = useRoute();
const message = useMessage();

const headers = {
  Authorization: utils.getCookie('Authorization')
}
const teamID = ref(0)
const theme = darkTheme

// 文件夹
let folders = ref([
  {
    ID: 1,
    name: '项目文件夹',
    createTime: '2022/08/08',
    folders: [
      {
        ID: 1,
        name: '项目文件夹',
        createTime: '2022/08/08',
        folders: []
      },
    ]
  },
  {
    ID: 2,
    name: '文件夹一',
    createTime: '2022/08/08',
    folders: [
      {
        ID: 1,
        name: '项目文件夹',
        createTime: '2022/08/08',
        folders: []
      },
    ]
  }
])
// 重命名文件夹
// 决定重命名弹窗是否出现
const showModalRef = ref(false)
const modelRef = ref({
  name: ""
})
const folderRename = (index) => {
  modelRef.value.name = folders.value[index].name
  showModalRef.value = true
}
const folderRenameRule = {
  required: true,
  validator() {
    if (modelRef.value.name.length === 0) {
      return new Error("文件夹名称不可为空")
    } else {
      if (modelRef.value.name.length >= 12) {
        return new Error("文件夹名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}
const onPositiveClick = () => {
  showModalRef.value = true
}
const onNegativeClick = () => {
  showModalRef.value = true
}
// 新建文件夹弹窗
const delRef = ref(false)
const onPositiveClickDel = () => {
  delRef.value = false
}
const onNegativeClickDel = () => {
  delRef.value = false
}
// 增加文件夹
const showModalAddRef = ref(false)
const modelAddRef = ref({
  name: ""
})
const onPositiveAddClick = () => {
  showModalAddRef.value = false
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
// 文档
let documents = [
  {
    ID: 1,
    title: '文件一',
  }
]
const showEdi = ref(false)
// 编辑文档名称
const ediModelRef = ref({
  ediName: ""
})
const docuEdit = (i) => {
  ediModelRef.value.ediName = documents[i].title
  showEdi.value = true
}
const negEdi = () => {
  showEdi.value = false
}
const posEdi = () => {
  showEdi.value = false
}
const ediRule = {
  required: true,
  validator() {
    if (ediModelRef.value.ediName.length === 0) {
      return new Error("文档名称不可为空")
    } else {
      if (ediModelRef.value.ediName.length >= 12) {
        return new Error("文档名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}
// 删除文档
const showDel = ref(false)
const posDel = () => {
  showDel.value = false
}
// 创建文档
const showAdd = ref(false)
const addModelRef = ref({
  addName: ""
})
const posAdd = () => {
  addModelRef.value.addName = "";
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
const startDragFolder = (event, item, index) => {
  // console.log(item)
  // console.log(item.ID)
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('itemID', item.ID)
}
const startDragDocument = (event, item, index) => {


}
const onDrop = (event) => {
  const itemID = event.dataTransfer.getData('itemID')
  console.log(itemID)
}
</script>

<style scoped>
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

.newpage {
  /*margin-right: 10px;*/
}

.layout {
  margin: 20px 50px 0 60px;
}
</style>