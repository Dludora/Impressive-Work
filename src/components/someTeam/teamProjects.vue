<template>
<div>
  <n-grid cols="2 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen" :x-gap="12" :y-gap="12">
    <n-grid-item v-for="project in projects" :key="project">
      <div class="project-item" >
        <div class="pic"></div>
        <div class="info">
          <p id="team">{{project.team}}的项目
            <Icon id="edit" size="20"><Edit /></Icon>
            <Icon id="del" size="20"><Edit /></Icon>
          </p>
          <p id="time">创建于 {{project.time}}</p>
        </div>
      </div>
    </n-grid-item>
    <n-grid-item>
      <div></div>
    </n-grid-item>
  </n-grid>
</div>
</template>

<script setup lang="ts">
import {Edit} from "@vicons/tabler"
import {Icon} from "@vicons/utils";

let projects = [
  {
    team: '团队一',
    time: '2022/8/1'
  },
  {
    team: '团队一',
    time: '2022/8/1'
  },
  {
    team: '团队一',
    time: '2022/8/1'
  },
  {
    team: '团队一',
    time: '2022/8/1'
  },
  {
    team: '团队一',
    time: '2022/8/1'
  },
  {
    team: '团队一',
    time: '2022/8/1'
  },
  {
    team: '团队一',
    time: '2022/8/1'
  },
  {
    team: '团队一',
    time: '2022/8/1'
  },
]
</script>

<style scoped>
.project-item {
  height: 240px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  background: #16181D;
}
.pic {
  width: 100%;
  height: 166px;
  background-color: #414958;
}
.info {
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-top: #0f4eee 1px;
  height: 54px;
  padding: 10px 8px;
  background-color: #2B303B;
}
.info:hover {
  background-color: #414958;
}
.info:hover #del, .info:hover #edit{
  display: inline-block;
}
p {
  position: relative;
  margin-top: 0;
  margin-bottom: 5px;
}
#team {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: flex-end;

  color: #E2E4E9;
}
#time {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: flex-end;

  color: #A7AFBE;
}
#del, #edit {
  display: none;
  cursor: pointer;
}
#edit {
  margin-bottom: 5px;
}
#del {
  position: absolute;
  top: calc(50% - 20px / 2);
  left: calc(100% - 50px / 2);
}
</style>