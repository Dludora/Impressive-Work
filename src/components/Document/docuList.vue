<template>

    <div class="big-contain">
      <n-config-provider  :theme="darkTheme">
      <div>
        <p class="docu-all">
          管理你的 {{ documents.length }} 个文档
        </p>
        <n-button icon-placement="right" class="docu-add" @click="viewAddDocu" size="tiny">
          新 建 文 档
          <template #icon>
            <n-icon ><Add /></n-icon>
          </template>
        </n-button>
      </div>
      </n-config-provider>
      <div id="docuITEMS" class="items"  :key="docuitemKey">
        <n-grid :x-gap="70" :y-gap="12" cols="5" responsive="screen" >
          <n-grid-item v-for="document in documents" :key="document">
            <div class="docu-item">
              <div class="docu-cover">

              </div>
              <div class="docu-title" >


                <p @click="openDocu(document.ID)" style="cursor: pointer;width: 80px;position: relative;display: flex">{{document.title}}</p>
                <n-space justify="end">
                  <Icon id="edi" size="24" @click="viewEdiDocu(document.ID)"><Edit /></Icon>
                  <Icon id="del" size="24" @click="viewDelDocu(document.ID)"><Delete48Regular /></Icon>
                </n-space>
              </div>
            </div>
          </n-grid-item>
        </n-grid>


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
          确定删除文档
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

import {onMounted, ref} from "vue";
import utils from "@/Utils";
import router from "@/router";

const headers = {
  Authorization: utils.getCookie('Authorization')
}

let proID = ref(0);

let page = ref(2);

//强制刷新页面
let docuitemKey = 0;

//文档项目

let documents =ref( [

])

//自己设置项目id


//获取项目id
proID.value=parseInt(utils.getCookie('proID')) ;
/*
const load = () => {
  proID.value=parseInt(utils.getCookie('proID')) ;
  console.log("成功获取项目ID:"+proID.value);
}
*/
onMounted(()=>{
  proID.value=parseInt(utils.getCookie('proID')) ;
  console.log("成功获取项目ID:"+proID.value);
  getDocuAbl();
})


//获取文档列表

const getDocuAbl = () =>{

  axios.get('/document/list',{headers:headers,
      params:
      {
        programID: proID.value, // proID.value,
      }}
  ).then(res=>{
    if(res.data.msg==='成功'){

      console.log("获取文档列表成功");

      documents.value = res.data.data.items;

      console.log(documents.value);
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
        'content': "默认内容",
        'title': addModelRef.value.addName,
        'src': null,
        'programID': proID.value,//proID.value
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

  console.log("确定添加文档");

  //成功添加文档

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
        'programID': proID.value,//proID.value
      },{headers:headers}
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(addModelRef.value.addName);
      console.log("创建文档成功");

      //刷新 获取文档列表
      getDocuAbl();
      //documents.value.push(newdoc);
      console.log("添加文档成功");
    }
  })

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
let editID =ref();

function viewEdiDocu(ind) {
  editID.value=ind;
  showEdi.value = true;
}

const posEdi = () => {

  //成功重命名文档

  console.log(editID.value);

  if(ediModelRef.value.ediName === '')
  {
    alert("文档名不可为空！")
    return;
  }

  axios.put('/document/title',
      {
        'ID': editID.value,
        'title': ediModelRef.value.ediName,
      },{headers:headers}
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(ediModelRef.value.ediName);
      console.log("重命名文档成功");

      //刷新 获取文档列表
      getDocuAbl();
    }
  })



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

let delID = ref();

function viewDelDocu(ind) {
  delID.value = ind;
  showDel.value = true;
}

const posDel = () => {

  //成功删除文档 序号: ind

  let urldel = "/document/" + delID.value ;
  console.log("/document/" + delID.value);

  axios.delete(urldel,{headers:headers}
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(urldel);
      console.log("删除文档成功");

      //刷新 获取文档列表

      getDocuAbl();
    }
  })

  console.log(utils.getCookie(docIndex));

  showDel.value = false;
}

const negDel = () => {
  showDel.value = false;
};

// 打开文档

let opdocuID = ref();

function openDocu(index){

  //获取文档内容

  opdocuID.value=index;

  let urlOP="/document/" + opdocuID.value;
  console.log(urlOP);

  axios.get(urlOP,{headers:headers}
  ).then(res=>{
    if(res.data.msg==='成功'){

      console.log("获取文档内容成功");

      let opContent = res.data.data.content;
      let opTitle = res.data.data.title;

      utils.setCookie('editDocID',index);
      utils.setCookie('DocTitle',opTitle);
      utils.setCookie('DocContent',opContent);

      console.log(opContent);

      router.push("/docuEdit");
    }
  })

}



</script>

<style scoped>

.big-contain{
  width:fit-content;
  margin:39px 43px 0 61px;
}

.docu-all{

  position: relative;

  width: 357px;
  height: 40px;
  left: 0px;
  top: -26px;

  display: inline-block;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 29px;

  align-items: center;

  color: #414958;
}

.docu-add{

  box-sizing: border-box;


  position: relative;
  /* width: 150px;
  height: 32px; */
  left: 500px;
  top: -32px;

  /*border: 1px solid #A7AFBE;
  border-radius: 2px;*/
}

.items{
  position: relative;
  left: 0px;
  top:-15px;
}

.docu-item{
  height: 240px;
  width: 140px;
}

.docu-cover{

  width: 150px;
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
  min-width: border-box;

  width: 150px;
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
  position: relative;
  margin-top: 160px;
  margin-right: 37%;
}
#del {
  position: relative;
  margin-top: 160px;
  margin-left: 37%;
  alignment: right;
}

</style>