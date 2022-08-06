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
            <n-config-provider :theme="theme">
              <n-form content-style="width:50%">
                <n-form-item-row label-style="color:#C4C9D4" label="电子邮箱" :rule="ruleEmail" :render-feedback="formatFeedback">
                  <n-input v-model:value="email"
                           placeholder="请输入您的邮箱..."
                  />
                </n-form-item-row>
                <n-form-item-row label-style="color:#C4C9D4" label="密码">
                  <n-input type="password" placeholder="请输入密码" v-model:value="password1"/>
                </n-form-item-row>
              </n-form>
              <n-button type="error" class="logbutton" @click="login" block strong>
                登 录
              </n-button>
            </n-config-provider>
          </div>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <div class="form">
            <n-config-provider :theme="theme">
              <n-form>
                <n-form-item label-style="color:#C4C9D4" label="电子邮箱" :rule="ruleEmail" :render-feedback="formatFeedback">
                  <n-input placeholder="请输入正确邮箱" v-model:value="email"/>
                </n-form-item>
                <n-form-item label-style="color:#C4C9D4" label="昵称">
                  <n-input placeholder="请输入您的昵称" v-model:value="nick"/>
                </n-form-item>
                <n-form-item label-style="color:#C4C9D4" label="真实姓名">
                  <n-input placeholder="请输入姓名" v-model:value="name"/>
                </n-form-item>
                <n-form-item label-style="color:#C4C9D4" label="密码" :rule="rulePass" :render-feedback="formatFeedback">
                  <n-input placeholder="设置密码" type="password" v-model:value="password1"/>
                </n-form-item>
                <n-form-item-row label-style="color:#C4C9D4" label="确认密码" :rule="rulePass2" :render-feedback="formatFeedback">
                  <n-input placeholder="再次输入密码" type="password" v-model:value="password2"/>
                </n-form-item-row>

              </n-form>
              <n-button class="logbutton" v-if="password1===password2 " type="success" text-color="white" @click="register" block strong>
                注 册
              </n-button>
              <n-button class="logbutton" v-if="password1!=password2 " disabled="true" type="success" text-color="white" @click="register"
                        block strong> 注 册
              </n-button>
            </n-config-provider>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {darkTheme,useMessage} from "naive-ui"
import {gsap} from "gsap";
import axios from 'axios';
import {h, ref} from 'vue'
import {useRouter} from 'vue-router'

const theme = darkTheme
const router = useRouter();
let email = ref('')
let name = ref('');
let password1 = ref('');
let password2 = ref('');
let nick = ref('');
const message = useMessage();
import utils from '../../Utils'

const headers = {
  Authorization: utils.getCookie('Authorization')
}

const formatFeedback = (raw: string | undefined) => {
  h('div', {style: 'color: green'}, [raw + '而且是绿的'])
}
const ruleEmail = {
  required: true,
  validator() {
    if (email.value.length === 0) {
      return new Error("邮箱不能为空")
    } else {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(email.value)) {
        return new Error('请输入有效的邮箱')
      }
    }
  },
  trigger: ['input', 'blur']
}

const rulePass = {
  required: true,
  validator() {
    if (password1.value.length === 0) {
      return new Error("请输入密码")
    } else {
      const reg_pwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
      if (!reg_pwd.test(password1.value)) {
        return new Error('密码至少同时包含字母和数字，且长度为8-18')
      }
    }
  },
  trigger: ['input', 'blur']
}

const rulePass2 = {
  required: true,
  validator() {
    if (password2.value.length === 0) {
      return new Error('请再次输入密码')
    } else if (password2.value !== password1.value) {
      return new Error('两次输入密码不一致!')
    }
  },
  trigger: ['input', 'blur']

};
const register = () => {
  if (email.value === '' || nick.value === '' || name.value === '') {
    message.error("用户名不可为空")
    return;
  }
  if (password1.value === '' || password2.value === '') {
    message.warning("密码不可为空！")
    return;
  }
  axios.post('/auth/register',
      {
        'email': email.value,
        'nick': nick.value,
        'name': name.value,
        'passwd': password1.value,

      }
  ).then(res => {
    message.info(res.data.msg);
    router.go(0)
  })
}

const login = () => {

  if (email.value.length === 0 || password1.value.length === 0) {
    message.warning("用户邮箱或密码不能为空！")
    return;
  }

  console.log("head:" + axios.defaults.headers.common['Authorization'])
  console.log("cookie:" + utils.getCookie("Authorization"))
  let a = 0;
  axios.get('/user/info', {headers: headers}).then(res => {
        console.log(res.data)
        if (res.data.msg === "成功") {
          message.info("用户" + res.data.data.nickname + "已登录")
          a = 1;
          router.push('/team')
        } else {
          axios.post('/auth/token', {
                'email': email.value,
                'passwd': password1.value
              }
          ).then(res => {
            console.log(headers)
            console.log(res.data)
            if (res.data.msg === "成功") {
              console.log("登录成功->")
              axios.defaults.headers.common['Authorization'] = res.data.data;
              axios.get('/user/info').then(res2 => {
                console.log(res2.data.data)
                console.log("登录成功=>")
                if (res2.data.msg === "成功")
                  message.info("欢迎 " + res2.data.data.nickname)
                  utils.setCookie('UserName',res2.data.data.nickname)
              })
              axios.defaults.headers.common['Authorization'] = res.data.data;
              utils.setCookie('Authorization', res.data.data)
              console.log(utils.getCookie('Authorization'))
              router.push('/team')
            }
          })
        }
      }
  )
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
.form {
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
  text-align: center;

}

.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
  color: aliceblue;
}

.card-tabs {
  color: white
}

.back-g {
  color: white;
  width: 100%;
  height: 100%;
}

span {
  color: white;
}

.custom-tabs {
  color: white;
}

#regis-card {
  position: absolute;
  width: 480px;
  height: 340px;
  left: calc(50% - 480px / 2);
  top: calc(40% - 430px / 2);
  /*color: white;*/
  background: rgba(43, 48, 59, 1);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  border:none;
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
.n-tabs-tab__label{
  font-weight: 700;
  font-size: 20px;
}
.logbutton{
  font-size: 16px;
}
</style>


