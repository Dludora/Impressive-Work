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
      <Icon @click="admin(member.ID,member.identity)" style="margin-right:4px" class="star" size="24" color="#FFFFFF"><UserCertification /></Icon>
      <Icon @click="remove(member.ID)" id="close" size="32" color="#FFFFFF"><CloseOutline /></Icon>
    </div>
  </div>
  <div class="member-add ">
    <div class="add-icon">
      <Icon size="36" id="add"> <PlusOutlined/></Icon>
    </div>
    <a href="#" id="invite">邀请成员</a>
  </div>
  </div>
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModalRef"
        :mask-closable="false"
        preset="dialog"
        title="重命名"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
      <n-form  :model="modelRef">
        <n-form-item label="项目名称" :rule="rule" :render-feedback="formatFeedback">
          <n-input v-model:value="modelRef.name" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>
</n-config-provider>
</template>

<script setup lang="ts">
import {PlusOutlined} from "@vicons/antd";
import {UserCertification} from "@vicons/carbon";
import {IosStarOutline, IosStar} from "@vicons/ionicons4"
import {CloseOutline} from "@vicons/ionicons5"
import {Icon} from "@vicons/utils";
import axios from 'axios'
import {onMounted, ref,computed,watch} from 'vue'
import {useRoute} from 'vue-router'
import utils from '../../Utils'
const route = useRoute();
let showModalRef = ref(false)
let teamID  = ref()
let email = ref('')
let opUserID = ref()
let isAdmin = ref(0)
const onPositiveClick = () => {
    showModalRef.value = false
}
const onNegativeClick = () => {
  showModalRef.value = false
};
const displayMedal = () => {
  showModalRef.value = true
}
const members = ref([
    {
      ID:0,
      nickname: '获取成员列表中...',
      name: '',
      email: '宝贝,正在加载中 请稍后~',
      identity:0
    },

])
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const getList = () => {
  let url='/team/'+route.query.teamID+'/members?page=0&size=20'
  axios.get(url,{headers:headers}).then(res=>{
    console.log(res.data)
    members.value=res.data.data.items
  })
}
const invite = () =>{
  let url='/team/'+route.query.teamID+'/invite?email='+email.value
  axios.put(url,{headers:headers}).then(res=>{
    console.log(res.data)
    alert(res.data.msg)
  })
}
const remove = (ID) =>{
  opUserID.value=ID
  let url='/team/'+route.query.teamID+'/remove?userID='+opUserID.value
  axios.put(url,{headers:headers}).then(res=>{
    console.log(res.data)
    if(res.data.msg==="成功")
    {
      for (let i=0;i<members.value.length;i++)
      {
        if(members.value[i].ID)
        {
          members.value.splice(i,1)
          break
        }
      }
    }
    alert(res.data.msg)
  })
}
const admin = (id,op) => {
  opUserID.value=id;
  if(op===0)
  isAdmin.value=1;
  else{
    isAdmin.value=0;
  }
  let url='/team/'+route.query.teamID+'/admin?userID='+opUserID.value+'&isAdmin='+isAdmin.value
  axios.put(url,{headers:headers}).then(res=>{
    console.log(res.data)
    if(res.data.msg==="成功"){
      for(let i=0;i<members.value.length;i++){
        if(members.value[i].ID===opUserID.value){
          members.value[i].identity=isAdmin.value
          break
        }
      }
    }
    else{
      console.log("设置失败")
    }
  })
}
const getGlobal = computed(()=>{
  return route.query.teamID
})
watch(getGlobal, (newVal,oldVal)=>{
  console.log("value change"+newVal)
  getList()
},{immediate:true,deep:true})
onMounted(()=>{
  getList()

})

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
/* .member-message {
  /*flex: 2;*/

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

</style>