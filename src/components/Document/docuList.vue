<template>

    <div class="big-contain">
      <n-config-provider  :theme="darkTheme">
      <div>
        <p class="docu-all">
          管理你的 {{ documents.length }} 个文档
        </p>
        <n-button icon-placement="right" class="docu-add" @click="viewAddDocu">
          新 建 文 档
          <template #icon>
            <n-icon ><Add /></n-icon>
          </template>
        </n-button>
      </div>
      </n-config-provider>
      <div id="docuITEMS" class="items"  :key="docuitemKey">
        <n-grid :x-gap="35" :y-gap="0" cols="6" responsive="screen" >
          <n-grid-item v-for="(document,ind) in documents" :key="document">
            <div class="docu-item">
              <div class="docu-cover">
                <div class="docu-cover-word">文档简介</div>
                <Icon id="edi" size="24" @click="viewEdiDocu(ind)"><Edit /></Icon>
                <Icon id="del" size="24" @click="viewDelDocu(ind)"><Delete48Regular /></Icon>
              </div>
              <div class="docu-title" @click="openDocu(ind)" style="cursor: pointer">
                {{document.title}}
              </div>
            </div>
          </n-grid-item>
        </n-grid>

        <n-config-provider  :theme="darkTheme">
        <n-pagination
            v-model:page="page"
            :page-count="100"
            size="small"
            show-quick-jumper
            show-size-picker
        />
        </n-config-provider>
      </div>
    </div>

  <n-config-provider  :theme="darkTheme">
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
        <n-form-item label="项目名称" :rule="addRule" >
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
        <n-form-item label="项目名称 · 新" :rule="ediRule" >
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
          确定删除文档 {{utils.getCookie(docIndex)}}
        </p>

      </n-modal>

  </n-config-provider>


</template>

<script setup lang="ts">
import axios from 'axios';
import {Add} from "@vicons/ionicons5";
import {Edit} from "@vicons/tabler";
import {Delete48Regular} from "@vicons/fluent";
import {Icon} from "@vicons/utils";

import {darkTheme, NIcon, useMessage} from "naive-ui";

import VueRouter from 'vue-router';

import {ref} from "vue";
import utils from "@/Utils";
import router from "@/router";

let page = ref(2);

//强制刷新页面
let docuitemKey = 0;

let index = 0;
let proID = ref(0);

//文档项目

let documents=[
  {
    ID: 9,
    title: '文档1',
    creatTime: '2022/8/2',
    content: '内容',
    src: null,
    mdTime: '2022/8/3',
    programID:1,
  },
]


//获取项目id
proID.value=parseInt(utils.getCookie('proID')) ;

const headers = {
  Authorization: utils.getCookie('Authorization')
}

//获取文档列表

const getDocuAbl = (page:number, size:number) =>{

  axios.get('/document/list',{headers:headers,
      params:
      {
        programID: 1, // proID.value,
        page: page,
        size: size,
      }}
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(addModelRef.value.addName);
      console.log("获取文档列表成功");

      documents = res.data.data.items;

      //强制渲染
    }
  })
}

// 添加文档功能

const addDocuAbl = () =>{
  if(addModelRef.value.addName === '')
  {
    alert("文档名不可为空！")
    return;
  }

  axios.post('/document',
      {
        'content': "",
        'title': addModelRef.value.addName,
        'src': null,
        'programID': 1,//proID.value
      }
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(addModelRef.value.addName);
      console.log("创建文档成功");

      //刷新 获取文档列表

    }
  })
}

// 重命名文档功能

const ediDocuAbl = () =>{
  if(ediModelRef.value.ediName === '')
  {
    alert("文档名不可为空！")
    return;
  }

  axios.post('/document/title',
      {
        'ID': utils.getCookie('docIndex'),
        'title': ediModelRef.value.ediName,
      }
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(ediModelRef.value.ediName);
      console.log("重命名文档成功");

      //刷新 获取文档列表

    }
  })
}

// 删除文档功能

const delDocuAbl = () =>{

  let ID = utils.getCookie('docIndex');
  let urlll = "/document/" + ID ;
  console.log("/document/" + ID);

  axios.delete('/document/' + ID,{headers:headers}
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(urlll);
      console.log("删除文档成功");

      //刷新 获取文档列表

    }
  })
}

// 添加文档

const showAdd= ref (false);
const addFormRef = ref<FormData | null>(null)
const addModelRef = ref({ addName: ""})

const viewAddDocu = () => {
  showAdd.value = true;
}

const posAdd = () => {

  //成功添加文档

  addDocuAbl();

  console.log("成功添加文档");

  addModelRef.value.addName = "";

  showAdd.value = false
}

const negAdd = () => {
  addModelRef.value.addName = "";
  showAdd.value = false;
};

const addRule = {
  required: true,
  validator() {
    if (addModelRef.value.addName.length === 0 ) {
      return new Error("文档名称不可为空")
    } else {
      if (addModelRef.value.addName.length >= 12) {
        return new Error("文档名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}


// 重命名文档

const showEdi= ref (false);
const ediFormRef = ref<FormData | null>(null)
const ediModelRef = ref({ ediName: ""})

function viewEdiDocu(ind: number) {
  utils.setCookie('docIndex',documents[ind].ID);
  showEdi.value = true;
}

const posEdi = () => {

  //成功重命名文档

  ediDocuAbl();

  console.log(utils.getCookie(docIndex));
  ediModelRef.value.ediName = "";

  showEdi.value = false
}

const negEdi = () => {
  ediModelRef.value.ediName = "";
  showEdi.value = false;
};

const ediRule = {
  required: true,
  validator() {
    if (ediModelRef.value.ediName.length === 0 ) {
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

let docIndex: string;

const showDel= ref (false);

function viewDelDocu(ind: number) {
  utils.setCookie('docIndex',documents[ind].ID);
  showDel.value = true;
}

const posDel = () => {

  //成功删除文档 序号: ind

  delDocuAbl();

  let ID = utils.getCookie('docIndex');

  console.log("/document/" + ID);

  console.log(utils.getCookie(docIndex));

  showDel.value = false
}

const negDel = () => {
  showDel.value = false;
};

// 打开文档

function openDocu(index: any){

  //获取文档内容

  utils.setCookie('editDocID',documents[index].ID);
  utils.setCookie('DocTitle',"测试标题！");
  utils.setCookie('DocContent',"测试你！");

  router.push("/docuEdit");
  console.log(documents[index].ID);
  console.log(index);
}



</script>

<style scoped>

.big-contain{
  position: relative;
  top: 3%;
  width: fit-content;
  min-height: min-content;
  left: 0%;
}

.docu-all{

  position: relative;

  width: 357px;
  height: 40px;
  left: 50px;
  top: 10px;

  display: inline-block;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 29px;

  align-items: center;

  color: #414958;
}

.docu-add{
  box-sizing: border-box;

  position: absolute;
  width: 150px;
  height: 32px;
  left: 925px;
  top: 5px;

  /*border: 1px solid #A7AFBE;
  border-radius: 2px;*/
}

.items{
  position: relative;
  left: 50px;
  top:30px;
}

.docu-item{
  height: 240px;
  width: 140px;
}

.docu-cover{

  width: 100%;
  height: 192px;

  display: flex;

  background: #E2E4E9;
  border-right: 16px solid #414958;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}

.docu-cover:hover {
  background-color: #FFFFFF;
}

.docu-cover-word{
  width: 100%;
  height: 192px;

  display: flex;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 29px;

  alignment: center;

  color: #16181D;
}

.docu-title{

  width: 100%;
  height: 30px;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  display: flex;
  align-items: flex-end;
  text-align: center;

  color: #E2E4E9;
}

.docu-title:hover{
  color: #FFFFFF;
}

#edi, #del {
  display: flex;
  cursor: pointer;
}
#edi {
  position: absolute;
  margin-top: 160px;
}
#del {
  position: relative;
  margin-top: 160px;
  alignment: right;
}

</style>