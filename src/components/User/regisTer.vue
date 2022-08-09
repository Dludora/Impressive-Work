<template>
  <div class="back-g">
    <div class="mask"/>
    <div class="loginwindow">
      <div class="post">
        <div class="brand">
          <div class="logo"/>
          Impress Work · 印迹
        </div>
        <div>
          长风破浪会有时，直挂云帆济沧海
        </div>
      </div>

      <div class="loginpanel">
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
                  <n-form-item-row label-style="color:#C4C9D4" label="电子邮箱" :rule="ruleEmail"
                                  :render-feedback="formatFeedback">
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
                  <n-form-item label-style="color:#C4C9D4" label="电子邮箱" :rule="ruleEmail"
                              :render-feedback="formatFeedback">
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
                  <n-form-item-row label-style="color:#C4C9D4" label="确认密码" :rule="rulePass2"
                                  :render-feedback="formatFeedback">
                    <n-input placeholder="再次输入密码" type="password" v-model:value="password2"/>
                  </n-form-item-row>

                </n-form>
                <n-button class="logbutton" v-if="password1===password2 " type="success" text-color="white"
                          @click="register" block strong>
                  注 册
                </n-button>
                <n-button class="logbutton" v-if="password1!=password2 " disabled="true" type="success" text-color="white"
                          @click="register"
                          block strong> 注 册
                </n-button>
              </n-config-provider>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {darkTheme, useMessage} from "naive-ui"
import {gsap} from "gsap";
import axios from 'axios';
import {h, ref} from 'vue'
import {useRouter} from 'vue-router'
import utils from "@/Utils";
const theme = darkTheme
const router = useRouter();
let email = ref('')
let name = ref('');
let password1 = ref('');
let password2 = ref('');
let nick = ref('');
const message = useMessage();
const colorList=[
  '#2350A9',
  '#55DD6C',
  '#DDB055',
  '#AA2293',
  '#55DDD1',
  '#8ED42B',
  '#D42B39',
  '#5A22AA',
]
const nextColor=()=>{
  let max=colorList.length
  let idx=max+2
  while(idx>=max)
    idx=Math.floor(Math.random() * max)
  return colorList[idx]
}


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
  // 注册成功
  axios.post('/auth/register',
      {
        'email': email.value,
        'nick': nick.value,
        'name': name.value,
        'passwd': password1.value,
      }
  ).then(res => {
    message.info(res.data.msg);
    // 登录拿到token -> 利用token调用创建团队api -> 得到团队ID后创建示例项目
    axios.post('/auth/token', {
          'email': email.value,
          'passwd': password1.value
        }
    ).then(res2 => {
      if (res2.data.msg === "成功") {
        axios.defaults.headers.common['Authorization'] = res2.data.data;
        utils.setCookie('Authorization', res2.data.data)
        // 利用token获取个人信息
        const headers = {
          Authorization: utils.getCookie('Authorization')
        }
        axios.get('/user/info').then(res3 => {
          if (res3.data.msg === "成功") {
            // 利用token调用创建团队api
            axios.post('/team', {
              'name': '示例团队',
              'src': nextColor(),
              'introduction': '示例团队'
            }).then(res4 => {
              // 得到团队ID后创建示例项目
              let teamID = res4.data.data
              axios.post('/program', {
                'teamID': teamID,
                'src': "what the fuck photos",
                'name': "示例项目"
              }, {headers: headers}).then(res5 => {
                message.info("欢迎 " + res3.data.data.nickname)
                router.push('/teamchoose')
              })
            })
          }
        })
      }
    })
  })
}

const login = () => {

  if (email.value.length === 0 || password1.value.length === 0) {
    message.warning("用户邮箱或密码不能为空！")
    return;
  }
  let a = 0;
  axios.get('/user/info', {headers: headers}).then(res => {
        let teamIDTemp;
        if (res.data.msg === "成功") {
          message.info("用户" + res.data.data.nickname + "已登录")
                                router.push('/teamchoose')
        } else {
          axios.post('/auth/token', {
                'email': email.value,
                'passwd': password1.value
              }
          ).then(res => {
            if (res.data.msg === "成功") {
                    axios.defaults.headers.common['Authorization'] = res.data.data;
                    utils.setCookie('Authorization', res.data.data)
                    axios.get('/user/info').then(res2 => {
                              
                              if (res2.data.msg === "成功")
                                message.info("欢迎 " + res2.data.data.nickname)
                                utils.setCookie('UserName',res2.data.data.nickname)
                                
                                router.push('/teamchoose')
                            })
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
  background-image: url("@/assets/titlefigure.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left;

  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

span {
  color: white;
}

.custom-tabs {
  color: white;
}

#regis-card {
  /*position: absolute;
  left: calc(50% - 480px / 2);
  top: calc(40% - 430px / 2);*/
  width: 360px;
  height: 340px;
  /*color: white;*/
  background: rgba(43, 48, 59, 1);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  border: none;
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

.n-tabs-tab__label {
  font-weight: 700;
  font-size: 20px;
}

.logbutton {
  font-size: 16px;
}
.loginpanel{
  z-index: 1;
  width: 360px;
  height: 520px;
  overflow:hidden;
  display: flex;
  background-color: #16181De0;
  align-items: center;
  align-content: center;
}
.loginwindow{
  z-index: 1;
  background-image: url("@/assets/loginfigure.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  border:2px solid #E2E4E9;
  border-radius: 3px;
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.35);
}
.logo{
  height:60px;
  width:60px;
  background-image: url("@/assets/logoBordered1024.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left;
  margin-right:16px;
}
.brand{
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  font-size:48px;
  font-weight: 100;
  white-space: nowrap;
  margin-bottom: 8px;

  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}
.post{
  padding:200px 84px 18px 36px;
  z-index: 1;
  background: linear-gradient(to top, #16181Dff, 37%, #16181D00);
}
.mask{
  width: 100%;
  position: absolute;
  z-index: 0;
  height: 100%;
  background-color: #000000ea;
}
</style>


