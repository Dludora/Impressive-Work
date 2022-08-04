<template>
  <div class="Team">
    <div class="avator">
      {{ teamData.name[0] }}
    </div>
    <div class="name">
      <h2>{{ teamData.name }}{{ teamData.ID }}</h2>
      <div>{{ teamData.introduction }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import axios from 'axios'
import utils from '../../Utils'

let teamData = ref({
  ID: null,
  name: 'Team',
  src: '',
  introduction: 'Brief introduction~'
})
const headers = {
  Authorization: utils.getCookie('Authorization')
}
// 获取teamID对应的团队的信息
const getMessage = () => {
  axios.get('/team/' + teamData.value + '/info', {headers: headers}).then(res => {
    if (res.data.msg === "成功") {
      teamData.value = res.data.data
    }
  })
}
onMounted(() => {
  getMessage()
})
defineExpose({
  teamData
});
</script>
<style scoped>
.Team {
  /*height: 70px;*/
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  /*line-height: 70px;*/
}

.avator {
  width: 50px;
  height: 50px;
  background: rgba(228, 27, 77, 1);
  border-radius: 5px;
  font-size: 24px;
  color: whitesmoke;
  text-align: center;
  line-height: 50px;
  display: inline-block;
}

.name span {
  position: relative;
  top: 6px;
  color: rgba(65, 73, 88, 1);
  height: 24px;
  line-height: 24px;
}

.name div {
  position: relative;
  top: 6px;
  color: rgba(65, 73, 88, 1);
  height: 24px;
  line-height: 24px;
}

.name {
  height: 100%;
  /*display: inline-block;*/
  color: white;
  vertical-align: top;
  margin-left: 20px;
  /*margin-top: 5px;*/
  font-size: 14px;
}

.name h2 {
  vertical-align: top;
  font-size: 20px;
  line-height: 22px;
}
</style>