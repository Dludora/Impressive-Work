<template>

    <div class="big-contain">
      <n-config-provider  :theme="darkTheme">
      <div>
        <p class="docu-all">
          管理你的 {{ documents.length }} 个文档
        </p>
        <n-button icon-placement="right" class="docu-add">
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
                <Icon id="edi" size="24"><Edit /></Icon>
                <Icon id="del" size="24"><Delete48Regular /></Icon>
              </div>
              <div class="docu-title" @click="openDocu(ind)">
                {{document.title}}
              </div>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
    </div>



</template>

<script setup lang="ts">
import {Add} from "@vicons/ionicons5";
import {Edit} from "@vicons/tabler";
import {Delete48Regular} from "@vicons/fluent";
import {Icon} from "@vicons/utils";

import {darkTheme, NIcon} from "naive-ui";

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