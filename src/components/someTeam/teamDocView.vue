<template>
  <n-config-provider :theme="darkTheme">
    <div class="big-bg">
      <div class="leftDoc">
        <div class="teamlist">
          <div class="teamsHead">
            文档中心
          </div>
          <div class="divline"/>
          <n-scrollbar>
            <div class="teams">
              <n-tree
                  :block-line="true"
                  :data="data"
                  :checked-keys="checkedKeys"
                  :on-load="handleLoad"
                  expand-on-click
              />
            </div>
          </n-scrollbar>
        </div>
      </div>
      <div class="main">
<!--        <tip-tap :key="timer"></tip-tap>-->
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
import TipTap from "../tipTap/tipTap.vue";

const route = useRoute()
const router = useRouter()
const teamID = ref(route.query.teamID)
const headers = {
  Authorization: utils.getCookie('Authorization')
}

// 树形组件
const checkedKeys = ref<string[]>([])
const data = ref([] as TreeOption[])

const proDoc = {
  fileID: 1,
  dir: true,
  parentID: null,
  isPro: 1,
  doc: null,

  // 组件需要
  label: '项目文件夹',
  isLeaf: false,         // 需不需要
  key: 1,           // 可以视为key(fileID)
  // children: []
}

const handleLoad =  (node: TreeOption) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // node.children = []
      // node.children.push(
      //     {
      //       label: '项目2',
      //       isLeaf: true,         // 需不需要
      //       key: 2,           // 可以视为key(fileID)
      //     }
      // )
      // console.log(node)
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




// const proName=ref("");
// const proID=ref(0)
// const documents=ref([]);
// const timer=null;

// proName.value = utils.getCookie('proNAME');
// //获取文档ID
// const getDocuID = () => {
//   return utils.getCookie('editDocID');
// }
// const UserName = () =>{
//   return utils.getCookie("UserName");
// }
//
// //获取文档列表
// const getDocuAbl = () => {
//
//   axios.get('/document/list', {
//         headers: headers,
//         params:
//             {
//               programID: proID.value, // proID.value,
//             }
//       }
//   ).then(res => {
//     if (res.data.msg === '成功') {
//
//       console.log("获取文档列表成功");
//
//       documents.value = res.data.data.items;
//
//       console.log(documents.value);
//     }
//   })
// }
// let opdocuID = ref();
// function openDocu(index) {
//   //获取文档内容
//   opdocuID.value = index;
//
//   let urlOP = "/document/" + opdocuID.value;
//   console.log(urlOP);
//
//   axios.get(urlOP, {headers: headers}
//   ).then(res => {
//     if (res.data.msg === '成功') {
//
//       console.log("获取文档内容成功");
//       let opContent;
//
//       utils.setCookie('DocTitle',res.data.data.title)
//
//       console.log(res.data.data.title)
//
//       if(res.data.data.copy===true){
//         opContent = res.data.data.content;
//         console.log("获取文档内容成功2");
//         console.log(opContent);
//         utils.setCookie('DocContent', opContent);
//
//         axios.put(urlOP,
//             {
//               'title': res.data.data.title,
//               'src': null,
//               'programID': res.data.data.programID,
//               'copy': false,
//             },{headers:headers}
//         )
//       }else{
//         console.log("获取文档内容成功3");
//         opContent = "";
//         console.log(opContent);
//         utils.setCookie('DocContent', opContent);
//       }
//
//
//       let opTitle = res.data.data.title;
//
//       utils.setCookie('editDocID', index);
//
//       console.log(index);
//
//
//
//       utils.setCookie('DocTitle', opTitle);
//
//       this.timer = new Date().getTime();
//     }
//   })
// }
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
}

.teamlist:hover .divline{
  border-bottom: 1px solid #2B303B;
}

.teamlist:hover .teamsHead{
  color:#fff;
}

.leftDoc{
  display: flex;
  flex-direction: column;
  /*box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);*/
  background-color: #16181D;
  border-right: 1px solid #414958;
  /*padding-top: 20px;*/
  padding-left: 8px;
  width: 192px;
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
  background-color: #414958;
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
}

.teamsHead {
  margin: 23px 16px 0 4px;
  color: #E2E4E9;
  font-size: 12px;
  line-height: 42px;
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  /*font-weight:700;*/
  /*border-bottom: 1px solid #414958;*/
}
</style>