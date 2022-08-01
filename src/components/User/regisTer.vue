<template>
  <n-space class="back-g">
    <n-card id="regis-card">
      <n-tabs
        class="card-tabs"
        default-value="signin"
        size="large"
        animated
        style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        :on-update:value="SwitchState"
      >
        <n-tab-pane name="signin" tab="登录">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input />
            </n-form-item-row>
          </n-form>
          <n-button class="logon-button" @click="login" type="primary" block secondary strong>
            登录
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <n-form>
            <n-form-item-row label="用户ID" >
              <n-input v-model:value="username" />
            </n-form-item-row>
            <n-form-item-row label="密码" >
              <n-input v-model:value="password1" />
            </n-form-item-row>
            <n-form-item-row label="昵称">
              <n-input v-model:value="nick" />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" @click="register" block secondary strong> 注册 </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import axios from 'axios';
import {ref} from 'vue'
import { colorPickerLight } from "naive-ui/es/color-picker/styles";

let username = ref('');
let password1 = ref('');
let nick = ref('');

const register = () =>{
  axios.post('/auth/register',
  {
    'uid': username.value,
    'passwd': password1.value,
    'nick': nick.value
  }
  ).then(res=>{
    alert(res.data.msg);
  })
}
const login = () =>{
  axios.post('/auth/token',{
    'uid':username.value,
    'passwd':password1.value
  }).then(res=>{
    console.log(res.data)
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
        duration: 0.5,
        height: "430px",
      });
      break;
    }
  }
};
</script>

<style scoped>

.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
#regis-card {
  position: absolute;
  width: 480px;
  height: 340px;
  left: calc(50% - 480px / 2);
  top: calc(50% - 430px / 2);

  background: #ffe6d6;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}

logon-button {
  width: 300px;
  height: 42px;
  left: 570px;
  top: calc(50% - 42px / 2 + 89px);

  background: #ff9671;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
}
</style>