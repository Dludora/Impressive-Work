<template>
  <n-config-provider :theme="darkTheme">
    <div class="big-bg">
      <div class="leftDoc">
        <div class="backnav" @click="routerBack">
          <Icon size="18" style="margin:6px 6px 6px 0;">
            <ArrowBackOutline/>
          </Icon>
          返回
        </div>
        <div class="teamlist">
          <div class="teamsHead">
            文档中心
          </div>
          <div class="divline"/>
          <n-scrollbar>
            <div class="teams">
              <n-tree
                  :block-line="true"
                  draggable
                  :data="data"
                  :checked-keys="checkedKeys"
                  :on-load="handleLoad"
                  :node-props="nodeProps"
                  expand-on-click
              />
            </div>
          </n-scrollbar>
        </div>
      </div>
      <div class="main">
        <tip-tap :key="timer"></tip-tap>
      </div>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import utils from "@/Utils";
import axios from "axios";
import { darkTheme } from 'naive-ui'
import {useRoute, useRouter} from "vue-router"
import { TreeDropInfo, TreeOption } from 'naive-ui'
import {onMounted, ref} from "vue";
import { Icon } from '@vicons/utils'
import {ArrowBackOutline} from '@vicons/ionicons5'
import TipTap from "../tipTap/tipTap.vue";

const route = useRoute()
const router = useRouter()
const teamID = ref(route.query.teamID)
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const routerBack = () => {
  router.push('/team/teamDocuments?teamID='+route.query.teamID)
}
// 树形组件
const checkedKeys = ref<string[]>([])
const data = ref([] as TreeOption[])

const proDoc = {
  fileID: 1,
  dir: true,
  parentID: null,
  isPro: 1,
  doc: {},

  // 组件需要
  label: '项目文件夹',
  isLeaf: false,         // 需不需要
  key: 1,           // 可以视为key(fileID)
}

const handleLoad =  (node: TreeOption) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      if(node.dir) {
        if(node.isPro === 1) {
          axios.get('/program/list'+'?teamID='+teamID.value,
              {headers: headers}).then(res => {
            const array = res.data.data.items
            node.children = []
            for(let i = 0; i < array.length; i++) {
              node.children.push(
                  {
                    fileID: array[i].ID,
                    dir: true,
                    parentID: null,
                    isPro: 2,
                    doc: null,

                    // 组件需要
                    label: array[i].name,
                    isLeaf: false,         // 需不需要
                    key: array[i].ID,      // 可以视为key(fileID)
                  }
              )
            }
          })
        } else if (node.isPro === 2) {
          axios.get('/document/list'+'?programID='+node.fileID, {headers: headers}).then(res => {
            const array = res.data.data.items
            node.children = []
            for(let i = 0; i < array.length; i++) {
              node.children.push(
                  {
                    fileID: array[i].ID,
                    dir: false,
                    parentID: null,
                    isPro: 2,
                    doc: null,

                    // 组件需要
                    label: array[i].title,
                    isLeaf: true,         // 需不需要
                    key: array[i].ID,      // 可以视为key(fileID)
                  }
              )
            }
          })
        } else {
          let url = '/doccenter/list'+'?teamID='+route.query.teamID+'&fileID='+node.fileID
          axios.get(url, {headers: headers}).then(res => {
            const array = res.data.data.items
            node.children = []
            for (let i = 0; i < array.length; i++) {
              node.children.push(
                  {
                    fileID: array[i].ID,
                    dir: array[i].dir,
                    parentID: array[i].parentID,
                    isPro: 0,
                    doc: array[i].doc,

                    // 组件需要
                    label: array[i].name,
                    isLeaf: !array[i].dir,         // 需不需要
                    key: array[i].ID,      // 可以视为key(fileID)
                  }
              )
            }
          })
        }
      }
      resolve()
    }, 500)
  })
}

const timer = ref(null);
const opdocuID = ref(0);
const openDocu = (index) => {
  //获取文档内容
  opdocuID.value = index;

  let urlOP = "/document/" + opdocuID.value;
  console.log(urlOP);

  axios.get(urlOP, {headers: headers}
  ).then(res => {
    if (res.data.msg === '成功') {

      console.log("获取文档内容成功");
      let opContent;

      utils.setCookie('DocTitle',res.data.data.title)

      console.log(res.data.data.title)

      if(res.data.data.copy===true){
        opContent = res.data.data.content;
        console.log("获取文档内容成功2");
        console.log(opContent);
        utils.setCookie('DocContent', opContent);

        axios.put(urlOP,
            {
              'title': res.data.data.title,
              'src': null,
              'programID': res.data.data.programID,
              'copy': false,
            },{headers:headers}
        )
      }else{
        console.log("获取文档内容成功3");
        opContent = "";
        console.log(opContent);
        utils.setCookie('DocContent', opContent);
      }


      let opTitle = res.data.data.title;

      utils.setCookie('editDocID', index);

      console.log(index);



      utils.setCookie('DocTitle', opTitle);

      timer.value = new Date().getTime();
    }
  })
}


const nodeProps = ({option}:{option: TreeOption}) => {
  return {
    onClick () {
      if(!option.dir) {
        if(option.isPro==0) {
          if(option.doc.ID !== utils.getCookie('editDocID')) {
            openDocu(option.doc.ID)
          }
        } else {
          if(option.fileID !== utils.getCookie('editDocID')) {
            openDocu(option.fileID)
          }
        }
      }
    }
  }
}

onMounted(() => {
  data.value.push(proDoc)

  let url = '/doccenter/list'+'?teamID='+route.query.teamID
  axios.get(url, {headers: headers}).then(res => {
    const array = res.data.data.items
    for (let i = 0; i < array.length; i++) {
      data.value.push(
          {
            fileID: array[i].ID,
            dir: array[i].dir,
            parentID: array[i].parentID,
            isPro: 0,
            doc: array[i].doc,

            // 组件需要
            label: array[i].name,
            isLeaf: !array[i].dir,         // 需不需要
            key: array[i].ID,      // 可以视为key(fileID)
          }
      )
    }
  })
})


</script>

<style scoped>

.main {
  height: 100%;
  /* max-height: 100%; */
  /* overflow: auto; */
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
}

.user {
  margin: 0 8px;
  /*height: 65px;*/
  color: #fff;
  text-overflow: ellipsis;
  /*width: 127px;*/
  overflow: hidden;
  white-space: nowrap;
  font-size: 20px ;
}

.teamlist{
  /* margin: 0 0 190px 0; */
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  align-items: stretch;
  color: #FFFFFF;
  border-bottom: 1px solid ;
}

.divline{
  margin-right: 12px;
  border-bottom: 2px solid #FFFFFF00;
}
.teamlist:hover .divline{
  border-bottom: 2px solid #222222;
}

.teamlist:hover .teamsHead{
  color:#fff;
}

.leftDoc{
  display: flex;
  flex-direction: column;
  /*box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
  background-color: #16181D;
  border-right: 1px solid #414958;*/
  /*padding-top: 20px;*/
  padding-left: 8px;
  width: 160px;
  min-width: 160px;
  height: 100%;
  overflow: hidden;
  color: #FFFFFF;
}

.head-bg{
  background-color: #2B303B;
  height: 50px;
  display: inline-block;
  vertical-align: center;
  font-size: 30px;
  line-height: 40px;
}

.big-bg{
  min-width: 100%;
  min-height: 100%;
  background-color: #0d0d0d;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;
}

.user-info {
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 25px;
  font-size: 30px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  color: #FFFFFF;
}
.user-info:hover{

  cursor:pointer
}
.avatar {
  width: 70px;
  height: 70px;
}

.pic {
  width: 56px;
  height: 56px;
  text-align: center;
  line-height: 56px;
  border-radius: 50%;
  background: skyblue;
  margin: 7px;
}

.user p {
  /*margin-top: 5px;*/
  overflow: hidden;
  text-overflow: ellipsis;
}

.teams {
  font-size: large;
  font-weight: 500;
  color: #E2E4E9;
  max-width: 148px;
  overflow: hidden;
}

.teamsHead {
  margin: 8px 16px 0 4px;
  color: #E2E4E9;
  font-size: 16px;
  line-height: 28px;
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.backnav{
  /*padding: 0 9px;*/
  color:#E2E4E9;
  font-size: 16px;
  line-height: 42px;
  flex-direction: row;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.backnav:hover{
  cursor:pointer;
  color:#fff;
}
</style>