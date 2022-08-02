<template>
  <div class="back-g">
    <n-card id="regis-card"
    content-style="color:white"
    >
      <n-tabs
        class="card-tabs"
        default-value="signin"
        :size="size"
        type="bar"
        animated
        justify-content="space-around"
        bar-width="200"
        tab-style="color:white"
        pane-style="padding-left: 4px; color:white; padding-right: 4px; box-sizing: border-box;"
        :on-update:value="SwitchState"
      >
        <n-tab-pane name="signin" tab="登录">
          <n-form content-style="color:white">
            <n-form-item-row label-style="color:white" label="电子邮箱">
              <n-input v-model:value="email" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="密码">
              <n-input v-model:value="password1" />
            </n-form-item-row>
          </n-form>
          <n-button class="success" @click="login" type="primary" block secondary strong>
            登录
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <n-form >
            <n-form-item-row label-style="color:white" label="电子邮箱" >
              <n-input v-model:value="email" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="昵称">
              <n-input v-model:value="nick" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="真实姓名">
              <n-input v-model:value="name" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="密码" >
              <n-input v-model:value="password1" />
            </n-form-item-row>
            <n-form-item-row label-style="color:white" label="确认密码" >
              <n-input v-model:value="password2" />
            </n-form-item-row>
            
          </n-form>
          <n-button type="success" text-color="white" @click="register" block secondary strong> 注册 </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import axios from 'axios';
import {ref} from 'vue'
import { colorPickerLight } from "naive-ui/es/color-picker/styles";
let email = ref('')
let name = ref('');
let password1 = ref('');
let password2 = ref('');
let nick = ref('');
import utils from '../../Utils'

const register = () =>{
  axios.post('/auth/register',
  {
    'email': email.value,
    'nick': nick.value,
    'name': name.value,
    'passwd': password1.value,
    
  }
  ).then(res=>{
    alert(res.data.msg);

  })
}
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const login = () =>{
  axios.post('/auth/token',{
    'email': email.value,
    'passwd':password1.value
  },{headers:headers}
  ).then(res=>{
    console.log(headers)
    console.log(res.data)
    utils.setCookie('Authorization',res.data.data)
    console.log(utils.getCookie('Authorization'))
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


