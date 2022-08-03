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
      <div class="items">
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
import {Add} from "@vicons/ionicons5";
import {Edit} from "@vicons/tabler";
import {Delete48Regular} from "@vicons/fluent";
import {Icon} from "@vicons/utils";

import {darkTheme, NIcon, useMessage} from "naive-ui";

import {ref} from "vue";
import utils from "@/Utils";

let index = 0;

// 添加文档

const showAdd= ref (false);
const addFormRef = ref<FormData | null>(null)
const addModelRef = ref({ addName: ""})

const viewAddDocu = () => {
  showAdd.value = true;
}

const posAdd = () => {

  //成功添加文档

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

// 删除文档

let docIndex: string;

const showDel= ref (false);

function viewDelDocu(ind: number) {
  utils.setCookie(docIndex,ind);
  showDel.value = true;
}

const posDel = () => {

  //成功删除文档 序号: ind

  console.log(utils.getCookie(docIndex));

  showDel.value = false
}

const negDel = () => {
  showDel.value = false;
};

// 重命名文档

const showEdi= ref (false);
const ediFormRef = ref<FormData | null>(null)
const ediModelRef = ref({ ediName: ""})

function viewEdiDocu(ind: number) {
  utils.setCookie(docIndex,ind);
  showEdi.value = true;
}

const posEdi = () => {

  //成功重命名文档

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

// 打开文档

function openDocu(index: any){
  console.log(index);
}

let documents=[
  {
    title: '文档1',
    creatTime: '2022/8/2',
  },
  {
    title: '文档2',
    creatTime: '2022/8/2',
  },
  {
    title: '文档3',
    creatTime: '2022/8/2',
  },
  {
    title: '文档4',
    creatTime: '2022/8/2',
  },
  {
    title: '文档5',
    creatTime: '2022/8/2',
  },
  {
    title: '文档6',
    creatTime: '2022/8/2',
  },
  {
    title: '文档7',
    creatTime: '2022/8/2',
  },
  {
    title: '文档8',
    creatTime: '2022/8/2',
  },
  {
    title: '文档9',
    creatTime: '2022/8/2',
  },
  {
    title: '文档10',
    creatTime: '2022/8/2',
  },
  {
    title: '文档11',
    creatTime: '2022/8/2',
  },
  {
    title: '文档12',
    creatTime: '2022/8/2',
  },
]

</script>

<style scoped>

.big-contain{
  position: relative;
  top: 10px;
  width: fit-content;
  min-height: 100%;
  left: 2%;
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