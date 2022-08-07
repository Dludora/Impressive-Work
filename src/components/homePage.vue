<template>
  <div class="mainframe">
    <div class="figure"/>
    <div class="gradient"/>
    <headNav/>
    <n-scrollbar ref="scroller" style="max-height:100%">
      <!-- <div class="wide vastitle">
        <div class="describe">
          <div class="brand">
          </div>
          <a>筹备人马</a>，主导软件开发<br/>
          参与到其他创作者的<a>项目</a>中去<br/>
          尝试<a>原型设计工具</a>以及协作文档编辑器<br/>
          提升工作效率<br/>
          在浪潮中留下你的<a>印迹</a><br/>
        </div>
        <div @click="teamMain" class="startnow">
          马上开始
          <div class="rightarrow"/>
        </div>
      </div> -->
      <div class="homepage">
        <div class="wide vastitle">
          <div class="describe">
            <div class="brand">
            </div>
            <a>筹备人马</a>，主导软件开发<br/>
            参与其他优秀开发者的<a>项目</a>也是一种乐趣<br/>
            尝试<a>原型设计工具</a>以及协作文档编辑器<br/>
            提升工作效率<br/>
            在浪潮中留下你的<a>印迹</a><br/>
          </div>
          <div @click="teamMain" class="startnow">
            马上开始
            <div class="rightarrow"/>
          </div>
        </div>
        <div class="wide feature">
          <div class="pic team"/>
          <div class="essay">
            <div class="describe">
              <!-- <div class="brand"> -->
              <!-- </div> -->
              <a>筹备人马</a>，主导软件开发<br/>
              参与到其他创作者的<a>项目</a>中去<br/>
              尝试<a>原型设计工具</a>以及协作文档编辑器<br/>
              提升工作效率<br/>
              在浪潮中留下你的<a>印迹</a><br/>
            </div>
            <div @click="teamMain" class="startnow">
              现在尝试
              <div class="rightarrow"/>
            </div>
          </div>
        </div>
        <div class="wide feature">
          <div class="essay">
            <div class="describe">
              <!-- <div class="brand"> -->
              <!-- </div> -->
              <a>筹备人马</a>，主导软件开发<br/>
              参与到其他创作者的<a>项目</a>中去<br/>
              尝试<a>原型设计工具</a>以及协作文档编辑器<br/>
              提升工作效率<br/>
              在浪潮中留下你的<a>印迹</a><br/>
            </div>
            <div @click="teamMain" class="startnow">
              现在尝试
              <div class="rightarrow"/>
            </div>
          </div>
          <div class="pic editor"/>
        </div>
      </div>
    </n-scrollbar>
  </div>
  <!-- <n-space>
    <n-button @click="regisRouter">登录/注册</n-button>
    <n-button @click="logout">登出</n-button>

    <n-button @click="teamMain">团队主页</n-button>

    <n-button @click="programView">项目大页面</n-button>

    <n-button @click="UML">UML</n-button>

  </n-space> -->
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import axios from 'axios';
import {useMessage} from "naive-ui"
import headNav from "@/components/headNav.vue"
import utils from "@/Utils";
const router = useRouter();
const message = useMessage();

const headers = {
  Authorization: utils.getCookie('Authorization')
}
const regisRouter = () => {
  router.push('/regisTer');
}
const logout = () => {
  console.log()
  axios.delete('/auth/token',{headers:headers}
  ).then(res=>{
    console.log(res.data)
    if(res.data.msg==="成功")
    {
      utils.clearCookie('Authorization')
      axios.defaults.headers.common['Authorization'] = '';
      message.info("注销成功")
    }
    else{
      utils.clearCookie('Authorization')
      axios.defaults.headers.common['Authorization'] = '';
      message.error("用户未登录")
    }
  })
}
const teamMain= () =>{
  router.push('/team');
}

const programView = () => {
  router.push('/project');
}

const UML = () => {
  router.push('/UML');
}

</script>

<style scoped>
*{
  transition-duration:0.5s;
  transition-timing-function: ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
.figure{
  width:100%;
  height:556px;
  background-image: url("@/assets/titlefigure.jpg");
  background-size: cover;
  position: absolute;
  z-index: -1;
  background-repeat: no-repeat;
  background-position: center;
}
.gradient{
  width:100%;
  height:556px;
  position: absolute;
  z-index: -1;
  background: linear-gradient(to top, #16181Dff, 37%, #16181D00);
}
.width{
  width:100%;
}
.homepage{
  margin:0 100px;
  /*width:100%;
  height:1084px;*/
}
.describe{
  color:#fff;
  font-size:18px;
  line-height: 36px;
  font-weight: 100;
}
.describe a{
  color:#D42B39;
  font-weight: 400;
}
.brand{
  width:100%;
  height:84px;
  margin-bottom: 30px;
  background-image: url("@/assets/brand1685x256.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left;
}
.mainframe{
    width: 100%;
    height: 100%;
    /* max-height: 100%; */
    /* overflow: auto; */
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}
.vastitle{
  margin:210px 8px 0;
  display:flex;
  align-items: flex-end;
  justify-content: space-between;
}
.feature{
  margin:160px 8px 0;
  display:flex;
  align-items: stretch;
  justify-content: space-between;
}
.feature .essay,.feature .pic{
  margin:30px;
}
.pic{
  height:360px;
  width:400px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.35);
}
.startnow{
  padding:4px 24px;
  display:flex;
  color:#fff;
  font-weight: 100;
  font-size:22px;
  align-items: center;
  border: 1px solid #FFFFFF00;
}
.startnow:hover{
  cursor:pointer;
  border: 1px solid #FFFFFFFF;
  color:#D42B39;
  text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.3);
}
.startnow:hover .rightarrow{
  border-right: 1.4px solid #D42B39;
  border-bottom: 1.4px solid #D42B39;
}
.rightarrow{
  height:16px;
  width:16px;
  margin:6px;
  border-right: 1.4px solid #fff;
  border-bottom: 1.4px solid #fff;
  transform: rotate(-45deg);
}
.essay{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.team{
  background-image: url("@/assets/teamup.jpg");
}
.editor{
  background-image: url("@/assets/creation.jpg");
}
</style>
