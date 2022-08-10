<template>
  <div class="mainframe">
    <div class="figure"/>
    <div class="gradient"/>
    <headNav/>
    <n-scrollbar @scroll="scroll" ref="scroller" style="max-height:100%">
      <div class="homepage">
        <div class="wide vastitle">
          <div class="describe">
            <div class="brand">
            </div>
            <a>筹备人马</a>，主导软件设计<br/>
            参与其他优秀开发者的<a>项目</a>也是一种乐趣<br/>
            尝试<a>原型设计工具</a>、协作文档编辑器<br/>
            提升工作效率<br/>
            在浪潮中留下你的<a>印迹</a><br/>
          </div>
          <div @click="teamMain" class="startnow">
            马上开始
            <div class="rightarrow"/>
          </div>
        </div>
        <div class="wide feature">
          <!-- <div class="pic teampic"/> -->
          <div class="steps">
            <div class="astep teampic1">
              <div class="step-introduce">
                在选择团队界面<br/>
                或团队和项目侧边栏找到“新建团队”按钮<br/>
                按下它，开始你的开发之旅<br/>
              </div>
            </div>
            <div class="astep teampic2">
              <div class="step-introduce">
                在团队的“成员”选项卡<br/>
                点击“生成邀请链接”<br/>
                把得到的链接发给你的合作者<br/>
              </div>
            </div>
            <div class="astep teampic3">
              <div class="step-introduce">
                在团队的“项目”选项卡<br/>
                找到“新建项目”按钮<br/>
                你的宏图伟业从这里开始<br/>
              </div>
            </div>
          </div>
          <div class="essay">
            <div class="describe">
              <!-- <div class="brand"> -->
              <!-- </div> -->
              组建<a>团队</a>、邀请其他开发者加入<br/>
              共同构建一个或多个<a>项目</a><br/>
              <br/>
              将光标放在图片上以查看指引<br/>
            </div>
            <div @click="programView" class="startnow">
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
              使用Impress Work的页面编辑器<br/>
              帮助完成<a>原型设计</a><br/>
              配合内嵌的diagram.net绘图工具<br/>
              <a>绘制UML图</a>也不是难题<br/>
              我们还内嵌了tipTap文档编辑器<br/>
              让你更轻松地进行<a>文档管理</a><br/>
            </div>
            <div @click="programView" class="startnow">
              现在尝试
              <div class="rightarrow"/>
            </div>
          </div>
          <!-- <div class="pic editorpic"/> -->
          
          <div class="steps">
            <div class="astep editpic1">
              <div class="step-introduce">
                使用Impress Work原型设计工具<br/>
                利用多种多样的模板和组件<br/>
                搭建属于你的精彩页面<br/>
              </div>
            </div>
            <div class="astep editpic2">
              <div class="step-introduce">
                团队沟通受阻？<br/>
                尝试用绘图来表达！<br/>
                Impress内嵌了diagram.net编辑器<br/>
                你可以绘制各式各样的UML图<br/>
              </div>
            </div>
            <div class="astep editpic3">
              <div class="step-introduce">
                正式的团队与项目当然少不了文档<br/>
                尝试Impress内嵌的tipTap编辑器<br/>
                与其他开发者一同编辑文档<br/>
              </div>
            </div>
          </div>
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
import { onMounted, ref } from "vue";
import { useRouter,useRoute } from "vue-router";
import axios from 'axios';
import {useMessage} from "naive-ui"
import headNav from "@/components/headNav.vue"
import utils from "@/Utils";
import { verify } from "crypto";
const router = useRouter();
const message = useMessage();
const route = useRoute();

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
  router.push('/teamchoose');
}
const viewVerify = () => {
  if(typeof(route.query.viewUrl)!="undefined"){
    if(utils.getCookie('Authorization')==='')
    {
      message.warning('请登录后预览项目')
      return;
    }
    // TODO: Go to view
    message.success('预览成功')
  }
}
const programView = () => {
  router.push('/teamchoose');
}

const UML = () => {
  router.push('/UML');
}

const tipTap = () => {
  router.push('/tipTap');
}
const scroller=ref()
const scroll =(e:Event)=>{
  let offsetY=document.getElementsByClassName('brand')[0].getBoundingClientRect().y
  let figure=document.getElementsByClassName('figure')[0] as HTMLIFrameElement
  console.log(offsetY)
  if(offsetY<0){
    // figure.setAttribute('opacity',(100-offsetY)/100);
    let alpha=(100+offsetY)/100
    if(alpha>0.2)
      figure.style.opacity=alpha.toString()
    else figure.style.opacity='0.2'
  }else figure.style.opacity='1'
}
onMounted(()=>{
  viewVerify()
})
</script>

<style scoped>
*{
  transition-duration:0.5s;
  transition-timing-function: ease;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
}
.figure{
  transition-duration:1.2s;
  width:100%;
  height:100%;
  background-image: url("@/assets/titlefigure.jpg");
  background-size: cover;
  position: absolute;
  z-index: -1;
  background-repeat: no-repeat;
  background-position: center;
}
.gradient{
  width:100%;
  height:100%;
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
.feature .essay,.feature .pic,.feature .steps{
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
.steps{
  height:360px;
  /*width:400px;*/
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.35);
  
  display: flex;
}
.astep{
  height:360px;
  width:140px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.35);

  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px 0 30px 0;
  margin:0 6px;
  border:1px solid #fff;
}
.astep:hover{
  width:300px;
}
.astep:hover .step-introduce{
  opacity:1;
}
.step-introduce{
  opacity:0;
  width:160px;
  display:flex;
  color:#22AA9E;
  font-weight: 100;
  font-size:18px;
  padding:24px;
  background-color:#FFFFFFe0;
  text-shadow: none;
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
.teampic{
  background-image: url("@/assets/teamup.jpg");
}
.teampic1{
  background-image: url("@/assets/teamstep1.jpg");
}
.teampic2{
  background-image: url("@/assets/teamstep2.jpg");
}
.teampic3{
  background-image: url("@/assets/teamstep3.jpg");
}
.editpic1{
  background-image: url("@/assets/editstep1.jpg");
}
.editpic2{
  background-image: url("@/assets/editstep2.jpg");
}
.editpic3{
  background-image: url("@/assets/editstep3.jpg");
}
.editorpic{
  background-image: url("@/assets/creation.jpg");
}
</style>
