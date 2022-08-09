<template>
  <div class="Team">
    <div class="logo"/>
    <div class="name">
      <h2>{{ introduct.name }}</h2>
      <!-- <span>{{introduct.introduction}}</span> -->
      <div class="intro">{{ introduct.introduction }}</div>
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
let introduct = ref({
  ID: null,
  name: '选择你的团队',
  src: '',
  introduction: '此刻开始，留下你的印迹'
})
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const myID = ref(utils.getCookie('userID'))
const myIdentify = ref(0)

const getMessage = () => {
  // axios.get('/team/' + route.query.teamID + '/info', {headers: headers}).then(res => {
  //   if (res.data.msg === "成功") {
  //     introduct.value = res.data.data
  //     if (res.data.data.introduction.length === 0) {
  //       introduct.value.introduction = "队长很懒，什么都没写喔～"
  //     }
  //   }
  // })
  // let url = '/team/' + route.query.teamID + '/member/' + myID.value + '/info'
  // axios.get(url, {headers: headers}).then(res => {
  //   if(res.data.msg === "成功")
  //     myIdentify.value = res.data.data.identify
  // })
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
  // getMessage();
}, {immediate: true, deep: true})

onMounted(() => {
  // getMessage()
})
defineExpose({
  introduct
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
  align-items: center;
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
  height: 24px;
  line-height: 24px;
}

.name div {
  position: relative;
  top: 6px;
  height: 24px;
  line-height: 24px;
}

.name {
  height: 100%;
  /*display: inline-block;*/
  color: #A7AFBE;
  vertical-align: top;
   /*margin-left: 16px;
  margin-top: 5px;*/
  font-size: 18px;
}

.name h2 {
  color: #FFFFFF;
  vertical-align: top;
  font-size: 28px;
  /*line-height: 22px;*/
}
.logo{
  height:90px;
  width:90px;
  background-image: url("@/assets/logoBordered1024.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left;
  margin:36px;
}
</style>