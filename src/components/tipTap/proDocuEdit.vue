<template>
  <n-config-provider :theme="darkTheme">
  <div class="big-bg">

    <div class="leftDoc">
      <n-button @click="returnTO" style="width: 60px">返回</n-button>
      <div @click="returnTO" class="user">
        <p style="width: 100%">项目:</p>
        <p style="font-size:40px;width: 100%">{{proName}}</p>
      </div>
      <div class="teamlist">
        <div class="teamsHead">
          项目文档
        </div>
        <div class="divline"/>
        <!-- <n-scrollbar style="margin:0 0 0 -8px;width:197px;padding-right:3px;"> -->
        <n-scrollbar>
          <div class="teams">
            <LeftDocuList v-for="document in documents" :key="document" :name="document.title"
                            @op="openDocu(document.ID)" />
          </div>
        </n-scrollbar>
      </div>
    </div>

    <div class="main">
      <tip-tap></tip-tap>
    </div>
  </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import utils from "@/Utils";
import axios from "axios";

import router from "@/router";

import { darkTheme } from 'naive-ui'
import LeftDocuList from "./leftDocuList.vue";
import {ref} from "vue";
import TipTap from "./tipTap.vue";

const headers = {
  Authorization: utils.getCookie('Authorization')
}


const getProName = () => {
  return utils.getCookie('proNAME');
}

//获取文档ID

const getDocuID = () => {
  return utils.getCookie('editDocID');
}

const UserName = () =>{
  return utils.getCookie("UserName");
}


</script>

<style>

.main {
  height: 100%;
  /* max-height: 100%; */
  /* overflow: auto; */
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
}

.user {
  margin: 0 8px;
  /*height: 65px;*/
  color: #fff;
  text-overflow: ellipsis;
  /*width: 127px;*/
  overflow: hidden;
  white-space: nowrap;
  font-size: 20px ;
}

.teamlist{
  /* margin: 0 0 190px 0; */
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  align-items: stretch;
  color: #FFFFFF;
}

.teamlist:hover .divline{
  border-bottom: 1px solid #2B303B;
}

.teamlist:hover .teamsHead{
  color:#fff;
}

.leftDoc{
  display: flex;
  flex-direction: column;
  /*box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);*/
  background-color: #16181D;
  border-right: 1px solid #414958;
  /*padding-top: 20px;*/
  padding-left: 8px;
  width: 192px;
  height: 100%;
  overflow: hidden;
  color: #FFFFFF;
}

.head-bg{
  background-color: #2B303B;
  height: 50px;
  display: inline-block;
  vertical-align: center;
  font-size: 30px;
  line-height: 40px;
}

.big-bg{
  min-width: 100%;
  min-height: 100%;
  background-color: #414958;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;
}

.user-info {
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 25px;
  font-size: 30px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  color: #FFFFFF;
}
.user-info:hover{

  cursor:pointer
}
.avatar {
  width: 70px;
  height: 70px;
}

.pic {
  width: 56px;
  height: 56px;
  text-align: center;
  line-height: 56px;
  border-radius: 50%;
  background: skyblue;
  margin: 7px;
}

.user p {
  /*margin-top: 5px;*/
  overflow: hidden;
  text-overflow: ellipsis;
}

.teams {
  font-size: large;
  font-weight: 500;
  color: #E2E4E9;
}

.teamsHead {
  margin: 23px 16px 0 4px;
  color: #E2E4E9;
  font-size: 12px;
  line-height: 42px;
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  /*font-weight:700;*/
  /*border-bottom: 1px solid #414958;*/
}
</style>