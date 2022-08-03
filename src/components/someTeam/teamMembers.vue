<template>
  <div v-for="member in members" :key="member" class="member-card">
    <div class="member-avatar">
      <n-avatar round class="avatar"/>
    </div>
    <div class="member-message">
      <p id="name">{{member.nickname}}({{member.name}})</p>
      <p id="email">{{member.email}}</p>
    </div>
    <div class="member-operate">
      <Icon class="star" size="36" color="#FFFFFF"><IosStarOutline /></Icon>
      <Icon id="close" size="40" color="#FFFFFF"><Close /></Icon>
    </div>
  </div>
  <div class="member-add ">
    <div class="add-icon">
      <Icon size="36" color="#FFFFFF" id="add"> <PlusOutlined/></Icon>
    </div>
    <a href="#" id="invite">邀请成员</a>
  </div>
</template>

<script setup lang="ts">
import {PlusOutlined} from "@vicons/antd";
import {IosStarOutline, IosStar} from "@vicons/ionicons4"
import {Close} from "@vicons/ionicons5"
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
.member-card, .member-add {
  position: relative;
  width: 100%;
  height: 70px;
  padding: 10px 24px;
  display: flex;
  background: #16181D;
}
.member-card:hover, .member-add:hover {
  width: 100%;
  display: flex;
  background: #414958;
}
.avatar {
  position: absolute;
  top: calc(50% - 56px / 2);
  left: calc(50% - 56px / 2);
  width: 56px;
  height: 56px;
}
.member-avatar, .add-icon {
  position: relative;
  width: 70px;
  margin-right: 5px;
}
.member-message {
  flex: 2;
}
#name {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  margin: 10px;
  color: #FFFFFF;
}
#email {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: flex-end;
  margin: 10px;
  color: #A7AFBE;
}
.member-operate {
  position: relative;
  flex: 2;
}
.star {
  position: absolute;
  top: calc(50% - 36px / 2);
  left: 300px;
  cursor: pointer;
}
#close {
  position: absolute;
  top: calc(50% - 36px / 2);
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
  position: absolute;
  left: 100px;
  line-height: 70px;
  height: 70px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  text-decoration: none;

  color: #A7AFBE;
}
#invite:hover {
  color: pink;
}
</style>