<template>
  <div class="Team">
    <div class="avator">
      {{ teamData.name[0] }}
    </div>
    <div class="name">
      <h2>{{ teamData.name }}</h2>
      <!-- <span>{{teamData.introduction}}</span> -->
      <div>{{ teamData.introduction }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch, computed} from 'vue'
import axios from 'axios'
import {useRoute, useRouter} from 'vue-router'
import utils from '../../Utils'
import {darkTheme} from "naive-ui"

const theme = darkTheme
const route = useRoute()
const router = useRouter()
let teamData = ref({
  ID: null,
  name: '选择团队来开启您的印迹之旅',
  src: '',
  introduction: '通过选择您的团队，然后来进行管理项目，成员等操作'
})
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const myID = ref(utils.getCookie('userID'))
const myIdentify = ref(0)

const getMessage = () => {
  axios.get('/team/' + route.query.teamID + '/info', {headers: headers}).then(res => {
    if (res.data.msg === "成功") {
      teamData.value = res.data.data
      if (res.data.data.introduction.length === 0) {
        teamData.value.introduction = "队长很懒，什么都没写喔～"
      }
    }
  })
  let url = '/team/' + route.query.teamID + '/member/' + myID.value + '/info'
  axios.get(url, {headers: headers}).then(res => {
    if(res.data.msg === "成功")
      myIdentify.value = res.data.data.identify
  })
}

// const getIdentify = () => {
//   let url = '/team/' + route.query.teamID + '/member/' + myID.value + '/info'
//   axios.get(url, {headers: headers}).then(res => {
//     myIdentify.value = res.data.data.identify
//   })
// }
const dissolve = () => {
  axios.delete('/team/' + route.query.teamID, {headers: headers}).then(res => {
    // console.log(res)
    router.push('/team/teamprojects?teamID=undefined')
  })
}
const getGlobal = computed(() => {
  return route.query.teamID
})

watch(getGlobal, (newVal, oldVal) => {
  console.log("value change" + newVal)
  getMessage();
}, {immediate: true, deep: true})

onMounted(() => {
  getMessage()
})
defineExpose({
  teamData
});
</script>
<style scoped>
.dismiss{
  margin-left: auto;
  margin-right: 200px;

}
.Team {
  /*height: 70px;*/
  width: 100%;
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