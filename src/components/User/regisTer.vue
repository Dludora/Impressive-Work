<template>
  <div class="back-g">
    <n-card id="regis-card"
    >
      <n-tabs
        class="card-tabs"
        default-value="signin"
        type="bar"
        animated
        justify-content="space-around"
        tab-style="color:white"
        pane-style="padding-left: 4px; color:white; padding-right: 4px; box-sizing: border-box;"
        :on-update:value="SwitchState"
      >
        <n-tab-pane name="signin" tab="登录">
          <div class="form">
          <n-form content-style="color:white;width:50%">
            <n-form-item-row label-style="color:white" label="电子邮箱">
              <n-input style="width=50%;" v-model:value="email" 
              placeholder="请输入您的邮箱..."
              />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="密码">
              <n-input type="password" placeholder="请输入密码" v-model:value="password1" />
            </n-form-item-row>
          </n-form>
          <n-button class="success" @click="login" type="primary" block  strong>
            登录
          </n-button>
          </div>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <div class="form">
          <n-form >
            <n-form-item-row label-style="color:white" label="电子邮箱" >
              <n-input placeholder="请输入正确邮箱" v-model:value="email" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="昵称">
              <n-input placeholder="请输入您的昵称"  v-model:value="nick" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="真实姓名">
              <n-input placeholder="请输入姓名"  v-model:value="name" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="密码" >
              <n-input placeholder="设置密码"  type="password" v-model:value="password1" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="确认密码" >
              <n-input placeholder="再次输入密码" type="password" v-model:value="password2" />
            </n-form-item-row>
            <span v-if="password1!=password2 && password1!=''&&password2!=''">两次输入密码不一致！</span>
            
          </n-form>
          <n-button v-if="password1===password2 " type="success" text-color="white" @click="register" block  strong> 注册 </n-button>
          <n-button v-if="password1!=password2 " disabled="true" type="success" text-color="white" @click="register" block  strong> 注册 </n-button>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import axios from 'axios';
import {ref} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();
let email = ref('')
let name = ref('');
let password1 = ref('');
let password2 = ref('');
let nick = ref('');
import utils from '../../Utils'

const register = () =>{
  if(email.value===''||nick.value===''||name.value==='')
  {
    alert("信息不可为空！")
    return;
  }
  if(password1.value===''||password2.value==='')
  {
    alert("密码不可为空！")
    return;
  }
  axios.post('/auth/register',
  {
    'email': email.value,
    'nick': nick.value,
    'name': name.value,
    'passwd': password1.value,
    
  }
  ).then(res=>{
    alert(res.data.msg);
    router.go(0)
  })
}

const headers = {
  Authorization: utils.getCookie('Authorization')
}
const login = () =>{
  
  if(email.value.length===0||password1.value.length===0){
    alert("用户邮箱或密码不能为空！")
    return;
  }

  let a=0;
    axios.get('/user/info').then(res=>{
      console.log(res.data)
      if(res.data.msg==="成功")
      {
         alert("用户"+res.data.data.nick+"已登录")
         a=1;
         return;}
         else{
            axios.post('/auth/token',{
    'email': email.value,
    'passwd':password1.value
  }
  ).then(res=>{
    console.log(headers)
    console.log(res.data)
    if(res.data.msg==="成功")
    {
      axios.defaults.headers.common['Authorization'] = res.data.data;
      axios.get('/user/info').then(res=>{
        console.log(res.data.data)
        if(res.data.msg==="成功")
         alert("欢迎 "+res.data.data.nick)
      })
      axios.defaults.headers.common['Authorization'] = res.data.data;
      utils.setCookie('Authorization',res.data.data)
    console.log(utils.getCookie('Authorization'))
    router.push('/')
    }
    else{
      alert(res.data.msg)
    }
  
    
  })
         }
      })
    
  

}
const SwitchState = (value: string | number) => {
  switch (value) {
    case "signin": {
      gsap.to("#regis-card", {
        duration: 0.5,
        height: "340px",
      });
      break;
    }
    case "signup": {
      gsap.to("#regis-card", {
        duration: 0.3,
        height: "580px",
      });
      break;
    }
  }
};
</script>

<style scoped>
.form{
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
  text-align: center;

}
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px; 
  color: aliceblue;
}
.card-tabs{
  color:white
}
.back-g{
  margin-top: 50px;
  color: white;
}
span{
  color: white;
}
.custom-tabs{
  color: white;
}
#regis-card {
  position: absolute;
  width: 480px;
  height: 340px;
  left: calc(50% - 480px / 2);
  top: calc(50% - 430px / 2);
  color: white;
  background: rgba(43, 48, 59, 1);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}

logon-button {
  width: 300px;
  height: 42px;
  left: 570px;
  top: calc(50% - 42px / 2 + 89px);

  background: rgba(66, 189, 178, 1);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
}
</style>


