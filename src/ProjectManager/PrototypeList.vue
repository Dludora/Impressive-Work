<template>
    <div class="main">
        <div class="discribe">
            管理你的{{shortcuts.length}}个页面
            <div class="buttons">
                <n-button class="newpage" size="tiny" @click="viewAddDocu">
                    新 建 页 面&nbsp;
                    <Icon size="14">
                        <Add28Regular/>
                    </Icon>
                </n-button>
                <n-button size="tiny" @click="exportLayout">
                    导 出 页 面&nbsp;
                    <Icon size="14">
                        <Export/>
                    </Icon>
                </n-button>
            </div>
        </div>
        <div class="pagelist">
          <PageCard v-for="(item,ind) in shortcuts" :key="item.ID" :name="item.name" :img="item.img" class="card"
                    @delCard="delCard(ind)" @openCard="openCard(ind)"/>
        </div>
    </div>


  <n-config-provider  :theme="darkTheme">
    <n-modal
        v-model:show="showAdd"
        preset="dialog"
        title="新建布局"
        positive-text="确认"
        negative-text="取消"
        @positive-click="posAdd"
        @negative-click="negAdd"
    >
      <n-form ref="addFormRef" :model="addModelRef">
        <n-form-item label="布局名称" :rule="addRule" >
          <n-input v-model:value="addModelRef.addName" @keydown.enter.prevent/>
        </n-form-item>
        <n-form-item label="布局宽度" :rule="widthRule" >
          <n-input v-model:value="addModelRef.addWidth" @keydown.enter.prevent/>
        </n-form-item>
        <n-form-item label="布局高度" :rule="heightRule" >
          <n-input v-model:value="addModelRef.addHeight" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>

    </n-modal>

    <n-modal
          v-model:show="showDelModal"
          :mask-closable="false"
          preset="dialog"
          title="删除布局"
          positive-text="确认"
          negative-text="取消"
          @positive-click="onPositiveClick"
          @negative-click="onNegativeClick"
    >
    </n-modal>
    </n-config-provider>
</template>
<!-- <script lang="ts">
export default {
    components: {
        PageCard,
    }
}
</script> -->
<script setup lang="ts">
import {
    Export
} from '@vicons/carbon'
import {
  Add28Regular
} from '@vicons/fluent'
import { Icon } from '@vicons/utils'
import PageCard from "@/ProjectManager/pageCard.vue"
import axios from "axios";
import utils from "@/Utils";
import {onMounted, ref} from "vue";

import {darkTheme, NIcon, useMessage} from "naive-ui";

let proID = ref(0);

let page = ref(2);

//原型项目

let shortcuts=ref([]);

const headers = {
  Authorization: utils.getCookie('Authorization')
}


onMounted(()=>{
  proID.value=parseInt(utils.getCookie('proID')) ;
  console.log("成功获取项目ID:"+proID.value);
  getList();
})

const getList = () =>{ //TODO 前后端对接：获取页面列表

  axios.get('/layout/list',{headers:headers,
    params:
        {
          programID: proID.value, // proID.value,
        }}
  ).then(res=>{
    if(res.data.msg==='成功'){

      console.log("获取布局列表成功");

      shortcuts.value = res.data.data.items;

      console.log(shortcuts.value);
    }
  })
}

//删除布局
const delID = ref(0)
const theme = darkTheme
// 删除区域
const showDelModal = ref(false)

const delCard =(item) => {
  console.log(shortcuts.value[item].ID)
  delID.value = shortcuts.value[item].ID
  showDelModal.value = true
}

const onNegativeClick = () => {
  showDelModal.value = false
}

// 点击确定后刷新列表
const onPositiveClick = () => {
  let urldel = "/layout/" + delID.value ;
  console.log("/layout/" + delID.value);
  axios.delete(urldel,{headers:headers}
  ).then(res => {
    if(res.data.msg==='成功'){
      console.log("删除布局成功");
      getList()
    }
  })
  showDelModal.value = false

}

// 添加布局

const showAdd= ref (false);
const addFormRef = ref<FormData | null>(null)
const addModelRef = ref({ addName: "",addWidth: "",addHeight: ""})

const viewAddDocu = () => {
  showAdd.value = true;
}

const posAdd = () => {

  console.log("确定添加布局");

  //成功添加文档

  if(addModelRef.value.addName === '')
  {
    alert("文档名不可为空！")
    return;
  }

  axios.post('/layout',
      {
        'name': addModelRef.value.addName,
        'src': null,
        'width': addModelRef.value.addWidth,
        'height': addModelRef.value.addHeight,
        'programID': proID.value,
      },{headers:headers}
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(addModelRef.value.addName);
      console.log("创建布局成功");

      //刷新 获取文档列表
      getList();
      //documents.value.push(newdoc);
      console.log("添加布局成功");
    }
  })

  showAdd.value = false
}

const negAdd = () => {
  addModelRef.value.addName = "";
  showAdd.value = false;
};

const r = /^\+?[1-9][0-9]*$/;

const addRule = {
  required: true,
  validator() {
    if (addModelRef.value.addName.length === 0 ) {
      return new Error("布局名称不可为空")
    } else {
      if (addModelRef.value.addName.length >= 12) {
        return new Error("布局名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}

const widthRule = {
  required: true,
  validator() {
    if (!r.test(addModelRef.value.addWidth)) {
      return new Error("布局宽度必须为正整数")
    }
  },
  trigger: ['input', 'blur']
}

const heightRule = {
  required: true,
  validator() {
    if (!r.test(addModelRef.value.addHeight)) {
      return new Error("布局高度必须为正整数")
    }
  },
  trigger: ['input', 'blur']
}

//to do for zf  打开布局

let openID= ref(0); //要打开的布局ID

const openCard =(indx) => {
  console.log(shortcuts.value[indx].ID)
  openID.value = shortcuts.value[indx].ID  //已成功获取要打开的布局ID

  // todo for zf

}

//to do for zf 导出布局
const exportLayout =() => {

}

</script>

<style scoped>
.main{
    width:fit-content;
    margin:39px 43px 0 61px;
}
.card {
    margin:0 10px 20px 0;
}
.pagelist{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}
.discribe{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 29px;
    align-items: center;
    margin-bottom: 12px;

    display:flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;

    color: #414958;
}
.buttons{
    margin-right: 10px;
}
.newpage{
    margin-right: 10px;
}
</style>