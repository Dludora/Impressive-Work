<template>
    <n-config-provider  :theme="darkTheme">
  <div class="big-contain">
    <div class="loadingscreen">
      <svg class="loading recting" width="40" height="40" viewbox="0 0 40 40">
        <polygon points="0 0 0 40 40 40 40 0" class="polygon"></polygon>
      </svg>
    </div>
    <div class="side">

        <div class="backnav">
          <Icon class="hoverorange" @click="routerBack" size="18" style="margin:6px 6px 6px 9px;">
            <ArrowBackOutline/>
          </Icon>
          回到<a @click="programView">项目</a>/<a @click="teamMain">团队</a>
        </div>

        <div class="projectname">
          来自<br/>
          <a @click="programView">{{projectname}}</a><br/>
          的Drawio绘图<br/>
        </div>

        <n-scrollbar>
          <div class="diagramlist">
            <div class="diagramitem" v-for="item in diagrams" :key="item.id" :diagramid="item.id" @click="open(item)">
              <div class="left">
                <Icon style="margin-right:8px;" size="20">
                  <ProjectDiagram/>
                </Icon>
                <div style="overflow:hidden;max-height:70px;">{{item.name}}</div>
              </div>
              <div class="right">
                <Icon style="margin-left:4px;" size="20" @click="renameDiagram(item)">
                  <Edit16Regular/>
                </Icon>
                <Icon style="margin-left:4px;" size="20" @click="deleteDiagram(item)">
                  <Delete48Regular/>
                </Icon>
              </div>
            </div>
            <div @click="newDiagram" class="diagramitem">
              <div class="left">
              <Icon style="margin-right:8px;" size="20">
                <Add12Filled/>
              </Icon>
              新建绘图
              </div>
            </div>
          </div>
        </n-scrollbar>
      </div>
      
      <div class="main">
        <iframe name="umleditor" id="umleditor" src="https://embed.diagrams.net?embed=1&ui=atlas&modified=unsavedChanges&proto=json&ui=dark&noSaveBtn=1&spin=1"/>
      </div>
  </div>
      <n-modal
          v-model:show="showModalRef"
          :mask-closable="false"
          preset="dialog"
          title="新建Drawio绘图"
          positive-text="新建"
          negative-text="取消"
          @positive-click="onPositiveClick"
          @negative-click="onNegativeClick"
      >
        <n-form :model="modelAddRef">
          <n-form-item label="名称" :rule="ruleAdd" :render-feedback="formatFeedback">
            <n-input v-model:value="modelAddRef.name" @keydown.enter.prevent/>
          </n-form-item>
        </n-form>
      </n-modal>

      <n-modal
          v-model:show="showModalRenameRef"
          :mask-closable="false"
          preset="dialog"
          title="重命名Drawio绘图"
          positive-text="确认"
          negative-text="取消"
          @positive-click="onPositiveRenameClick"
          @negative-click="onNegativeRenameClick"
      >
        <n-form :model="modelRenameRef">
          <n-form-item label="新的名称" :rule="ruleRename" :render-feedback="formatFeedback">
            <n-input v-model:value="modelRenameRef.name" @keydown.enter.prevent/>
          </n-form-item>
        </n-form>
      </n-modal>
    </n-config-provider>
</template>

<script lang="ts">
import {darkTheme} from "naive-ui";
import { ref, defineComponent,h} from 'vue'
import { useRouter } from "vue-router";
import axios from 'axios';
import {useMessage} from "naive-ui"
import utils from "@/Utils";
import { Icon } from '@vicons/utils'
import {ArrowBackOutline} from '@vicons/ionicons5'
import { Add12Filled } from '@vicons/fluent'
import { ProjectDiagram } from '@vicons/fa'
import {Edit16Regular} from '@vicons/fluent'
import { provideCarouselContext } from "naive-ui/es/carousel/src/CarouselContext";
import {Delete48Regular} from "@vicons/fluent";

class Diagram{
  id:string;
  name:string;
}
let umleditor=null;
let diagrams=ref([] as Diagram[]);
let showModalRef=ref(false);
let showModalRenameRef=ref(false);
let renamingId=ref('')
let projectname=ref('')
const modelAddRef = ref({
  name: ""
})
const modelRenameRef = ref({
  name: ""
})
const formatFeedback = (raw: string | undefined) => {
  h('div', {style: 'color: green'}, [raw + '而且是绿的'])
}

const emptyxml='<mxfile etag=\"jnyZEe7rajkKXGbV0i7T\" agent=\"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\" modified=\"2022-08-08T15:15:33.812Z\" host=\"embed.diagrams.net\" version=\"20.2.3\" type=\"embed\"><diagram name=\"第 1 页\" id=\"5_veikS2vmQ50BY-FqDE\">dZHBDsIgDIafhjuCmfM8p1487eCZjDpI2LowzKZP7xaYSNRL0379258Uwot2OlnRqwtKMIRRORF+IIxlNJ/jAh4ebHnmQWO19GgTQaWfECAN9K4lDInQIRqn+xTW2HVQu4QJa3FMZTc0qWsvmuBII6hqYeBLdtXSKU9ztov8DLpRq/Mm2/tOK1ZxWDwoIXH8QLwkvLCIzmftVIBZbrfexc8d/3TfD7PQuR8DcxJ3z0XyQbx8AQ==</diagram></mxfile>'

export default defineComponent({
  components:{
    ArrowBackOutline,
    Icon,
    Add12Filled,
    ProjectDiagram,
    Delete48Regular,
    Edit16Regular,
  },
  
  setup () {
    const message=useMessage();

    let selectid=utils.getCookie('UMLid')
    projectname.value=utils.getCookie('proNAME')

    const headers = {
      Authorization: utils.getCookie('Authorization')
    }
    let proid=parseInt(utils.getCookie('proID'))

    const getDiagrams=()=>{//TODO:动态获取UML图
      axios.get('/uml/list', {headers: headers,params:{programID:proid,}})
      .then(res=>{
        // console.log('获取图列表')
        // console.log(res)
        const array = ref(res.data.data.items)
        diagrams.value.splice(0,diagrams.value.length)
        for (let i = 0; i < array.value.length; i++) {
          let idd = array.value[i].ID
          diagrams.value.push({
            name:array.value[i].name,
            id:array.value[i].id.toString()
          })
        }
      })
    }
    getDiagrams()

    const router = useRouter()

    const routerBack= () =>{
      router.back()
    }

    const newDiagram=()=>{
      showModalRef.value = true
    }
    const deleteDiagram=(item:Diagram)=>{
      event.stopPropagation();
      
      axios.delete('/uml/'+item.id,{headers: headers})
      .then(res=>{
        if(res.data.msg=='成功'){
          message.info('已删除')
          for(let i=0;i < diagrams.value.length;i++){
            if(item.id==diagrams.value[i].id){
              diagrams.value.splice(i,1)
            }
          }
          if(selectid==item.id)
            open(diagrams.value[0])
        }else{
          console.log(res.data.msg)
        }
      })
    }

    const renameDiagram=(item:Diagram)=>{
      event.stopPropagation();
      renamingId.value=item.id;
      showModalRenameRef.value=true;
    }
    const ruleAdd = {
      required: true,
      validator() {
        if (modelAddRef.value.name.length === 0) {
          return new Error("名称不能为空")
        }else if (modelAddRef.value.name.length > 24) {
          return new Error("名称太长了")
        }
      },
      trigger: ['input', 'blur']
    }
    const ruleRename = {
      required: true,
      validator() {
        if (modelRenameRef.value.name.length === 0) {
          return new Error("名称不能为空")
        }else if (modelRenameRef.value.name.length > 24) {
          return new Error("名称太长了")
        }
      },
      trigger: ['input', 'blur']
    }
    const onPositiveClick = () => {
      if (modelAddRef.value.name.length === 0) {
        message.warning("名称不能为空")
        return
      }else if (modelAddRef.value.name.length > 24) {
          message.warning("名称太长了")
        return
      }
      axios.post('/uml', {
        'name': modelAddRef.value.name,
        "content": emptyxml,
        "programID": proid,
      }, {headers: headers}).then(res => {
        if (res.data.msg === "成功") {
          // console.log("添加绘图成功！")
          let t = new Date();
          let item = {
            "name": modelAddRef.value.name,
            "id":(res.data.data).toString(),
          }
          diagrams.value.push(item)
          open(item as Diagram)
          message.info("已添加")
          router.push({name:'UML'})
        } else {
          message.error("添加失败")
        }
      })
      showModalRef.value = false
      // modelAddRef.value.name = ""
    }
    const onPositiveRenameClick = () => {
      if (modelRenameRef.value.name.length === 0) {
        message.warning("名称不能为空")
        return
      }else if (modelRenameRef.value.name.length > 24) {
          message.warning("名称太长了")
        return
      }
      axios.put('/uml', {
        id:parseInt(renamingId.value),
        name: modelRenameRef.value.name,
      }, {headers: headers}).then(res => {
        if (res.data.msg === "成功") {
          for(var i in diagrams.value){
            if(diagrams.value[i].id==renamingId.value)
              diagrams.value[i].name=modelRenameRef.value.name
          }
          // message.info("重命名")
          router.push({name:'UML'})
        } else {
          message.error("重命名失败")
        }
      })
      showModalRef.value = false
      // modelAddRef.value.name = ""
    }
    const onNegativeClick = () => {
      modelAddRef.value.name = ""
      showModalRef.value = false
    }
    const onNegativeRenameClick = () => {
      modelRenameRef.value.name = ""
      showModalRenameRef.value = false
    }
    const teamMain= () =>{
      router.push('/team')
    }

    const programView = () => {
      router.push('/project')
    }
    const loaddiagram =() =>{
      umleditor.contentWindow.postMessage(JSON.stringify({action: 'spinner', message: '加载文件中', show: true, enabled: true}),'*')
      let loaded=false;
      let menuitems=document.getElementsByClassName('diagramitem') as HTMLCollectionOf<HTMLElement>
      for(var i in diagrams.value){
        let item=diagrams.value[i]
        if(item.id==selectid){
          axios.get('/uml/'+item.id,{headers: headers})
          .then(res=>{
            // console.log('获取内容')
            // console.log(res)
            if(res.data.msg === "成功"){
              let loadxml=res.data.data.content
              umleditor.contentWindow.postMessage(JSON.stringify({action:'load',xml:loadxml,autosave:1}),'*')
            }else{

            }
          })
          loaded=true
          break
        }
      }
      for(var elementitem of menuitems){
        console.log('target:'+selectid)
        console.log('searching:'+elementitem.attributes['diagramid'].value)
        if(elementitem.attributes['diagramid'].value==selectid)
          elementitem.style['background']='#000'
        else
          elementitem.style['background']='none'
      }
      if(loaded==false)
        umleditor.contentWindow.postMessage(JSON.stringify({action:'load',xml:emptyxml,autosave:1}),'*')
    }
    const open =(diagram:Diagram) =>{
      console.log('openning:')
      console.log(diagram)
      utils.setCookie('UMLid', diagram.id)
      selectid=diagram.id
      utils.setCookie('UMLname', diagram.name)
      router.push({name:'UML'})
      loaddiagram()
    }
    window.addEventListener("message", function(event) {
      // console.log(event)
      console.log( "received:(" + event.data +')from('+event.origin +')');
      if (event.origin == 'https://embed.diagrams.net') {
        let msg = JSON.parse(event.data);
        if(msg.event=='init'){
          //drawio加载完成
          umleditor=document.getElementById("umleditor") as HTMLIFrameElement

          let loadingscreen=document.getElementsByClassName("loadingscreen")[0] as HTMLIFrameElement

          loadingscreen.style.opacity = '0'
          setTimeout(function() {
              loadingscreen.parentNode.removeChild(loadingscreen);
          }, 800);

          loaddiagram()
        }else if(msg.event=='exit'){
          //drawio退出
          router.back()
        }else if(msg.event=='save' || msg.event=='autosave'){
          let savexml=msg.xml
          console.log('saving'+selectid)
          axios.put('/uml/content',{id:selectid,content:savexml},{headers:headers}).then(res=>{
            console.log(res.data)
          })
          if(msg.exit==true)
            routerBack()
        }else if(msg.event=='load'){
          //已载入文件
          umleditor.contentWindow.postMessage(JSON.stringify({action: 'spinner', message: '加载文件中', show: false, enabled: false}),'*')
        }
      }
    });
    return {
      show: ref(false),
      programView,
      teamMain,
      routerBack,
      open,
      diagrams,
      showModalRef,
      onPositiveClick,
      onNegativeClick,
      newDiagram,
      ruleAdd,
      formatFeedback,
      modelAddRef,
      darkTheme,
      deleteDiagram,
      renameDiagram,
      showModalRenameRef,
      onPositiveRenameClick,
      onNegativeRenameClick,
      modelRenameRef,
      ruleRename,
      projectname,
    }
  }
})

</script>

<style scoped>
*{
    transition-duration:0.07s;
}
a {
  color: currentColor;
  text-decoration: none;
}
.big-contain{
  /*width:fit-content;
  margin:39px 43px 0 61px;
  height:100%;*/
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;
  width:100%;
  background-color:#2A2A2A;
}

.n-gradient-text {
  font-size: 36px;
}

#umleditor{
  height: 100%;
  width: 100%;
  border:none;
  background-color:#2A2A2A;
}
#umleditor html{
  background-color:#2A2A2A;
}
.side{
  display: flex;
  height: 100%;
  width: 240px;
  background-color: #2A2A2A;
  border-right: 1px solid #4E5456;
  flex-direction: column;
  flex-wrap: nowrap;
}
.backnav{
  padding: 0 9px;
  color:#CCCCCC;
  font-size: 14px;
  line-height: 30px;
  flex-direction: row;
  display: flex;
  align-items: stretch;
  flex-wrap: nowrap;
  border-bottom: 1px solid #4E5456;
}
.backnav a:hover,.projectname a:hover,.hoverorange:hover{
  color:#DF6C0C;
  cursor:pointer;
}
.recting .polygon{
  fill:none;
  stroke:#DF6C0C;
  stroke-width: 2px;
  stroke-dasharray: 40;
  stroke-dashoffset: 50%;
  animation:recting 1.5s forwards infinite;
}
@keyframes recting {
  to{
    stroke-dashoffset: 250%;
  }
}
.loadingscreen{
  pointer-events: none;
  background-color: #16181D;
  position:absolute;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 10;
  justify-content: center;
  align-items: center;
  align-content: center;
  transition-duration: 0.4s;
  transition-timing-function: ease-in-out;
}
.main{
  width:100%;
  height: 100%;
}
.diagramitem{
  font-size:14px;
  color:#fff;

  max-height: 70px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: center;

  padding:6px 6px 6px 18px;
  border-top: 1px solid #2A2A2A;
  border-bottom: 1px solid #2A2A2A;
  /*width:100%;*/
}
.diagramitem .left,.diagramitem .left{
  
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: center;
  /*margin:2px;*/
}
.diagramitem:hover{
  cursor:pointer;
  /*background-color: #161616;*/
  border-top: 1px solid #4E5456;
  border-bottom: 1px solid #4E5456;
}
.diagramitem:active{
  color:#DF6C0C;
}
.projectname{
  margin:24px 0 12px 18px;
  color: #cccccc;
}
</style>