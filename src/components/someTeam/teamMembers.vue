<template>
  <div class="list">
  <div v-for="member in members" :key="member" class="member-card">
    <div style="display:flex;align-items: center;">
      <!-- <div class="member-avatar">
        <n-avatar round class="avatar"/>
      </div> -->
      <div class="avatar">{{member.nickname[0]}}</div>
      <div class="member-message">
        <p id="name">{{member.nickname}}({{member.name}})</p>
        <p id="email">{{member.email}}</p>
      </div>
    </div>
    <div class="member-operate">
      <Icon style="margin-right:4px" class="star" size="24" color="#FFFFFF"><UserCertification /></Icon>
      <Icon id="close" size="32" color="#FFFFFF"><CloseOutline /></Icon>
    </div>
  </div>
  <div class="member-add ">
    <div class="add-icon">
      <Icon size="36" id="add"> <PlusOutlined/></Icon>
    </div>
    <a href="#" id="invite">邀请成员</a>
  </div>
  </div>
</template>

<script setup lang="ts">
import {PlusOutlined} from "@vicons/antd";
import {UserCertification} from "@vicons/carbon";
import {IosStarOutline, IosStar} from "@vicons/ionicons4"
import {CloseOutline} from "@vicons/ionicons5"
import {Icon} from "@vicons/utils";

const members = [
    {
      nickname: 'Dludora',
      name: '寇书瑞',
      email: 'koushurui@outlook.com',
    },
    {
      nickname: 'Dludora',
      name: '寇书瑞',
      email: 'koushurui@outlook.com',
    },
    {
      nickname: 'Dludora',
      name: '寇书瑞',
      email: 'koushurui@outlook.com',
    },
]
</script>

<style scoped>
*{
  transition: 0.2s;
}
a{
  color:currentColor;
}
.member-card{
  /*margin-left: 60px;*/
  position: relative;
  /*width: 100%;
  height: 70px;*/
  padding: 15px 60px;
  display: flex;
  justify-content: space-between;
  background: #16181D;
}
.member-add{
  /*height: 70px;*/
  padding: 15px 60px;
  display: flex;
  background: #16181D;
  color: #A7AFBE;
}
.member-add:hover{
  color:#FFFFFF;
}
.member-card:hover, .member-add:hover {
  /*width: 100%;*/
  display: flex;
  background: #414958;
}
.avatar {
  /*position: absolute;
  top: calc(50% - 56px / 2);
  left: calc(50% - 56px / 2);*/
  width: 50px;
  height: 50px;
  background-color: #55DDD1;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  margin-right: 10px;
  font-size:24px;
  color:#FFFFFF;
}
.member-avatar, .add-icon {
  position: relative;
  width: 50px;
  margin-right: 10px;
}
.member-message {
  /*flex: 2;*/
}
#name {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin:0 10px 10px;
  color: #FFFFFF;
}
#email {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  display: flex;
  align-items: flex-end;
  margin: 0 10px;
  color: #A7AFBE;
}
.member-operate {
  /*position: relative;
  flex: 2;*/
  align-items: center;
  flex-direction: row;
  display: flex;
}
.star {
  /*position: absolute;
  top: calc(50% - 36px / 2);*/
  left: 300px;
  cursor: pointer;
}
#close {
  /*position: absolute;
  top: calc(50% - 36px / 2);*/
  left: 400px;
  cursor: pointer;
}
#add {
  position: absolute;
  top: calc(50% - 36px / 2);
  left: calc(50% - 36px / 2);
  cursor: pointer;
}
#invite {
  /*position: absolute;
  left: 100px;
  line-height: 70px;
  height: 70px;*/
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  text-decoration: none;
  margin-left: 10px;

}
#invite:hover {
  
  /*color: pink;*/
}
.list{

}
</style>