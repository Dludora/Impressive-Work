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

        <div class="diagramlist">
          <div class="diagramitem" v-for="item in diagrams" :key="item.id" @click="open(item)">
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="main">
        <iframe name="umleditor" id="umleditor" src="https://embed.diagrams.net?embed=1&ui=atlas&modified=unsavedChanges&proto=json%27&ui=dark"/>
      </div>
  </div>
    </n-config-provider>
</template>

<script lang="ts">
import {darkTheme} from "naive-ui";
import { ref, defineComponent } from 'vue'
import { useRouter } from "vue-router";
import axios from 'axios';
import {useMessage} from "naive-ui"
import utils from "@/Utils";
import { Icon } from '@vicons/utils'
import {ArrowBackOutline} from '@vicons/ionicons5'
class Diagram{
  id:number;
  name:string;
  xml:string;
}
let diagrams=ref([] as Diagram[]);
const emptydiagram='<?xml version="1.0" encoding="UTF-8"?><mxfile type="device" version="20.2.3" etag="IdYTzGgZfuDRI7LhJS4q" agent="5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36" modified="2022-08-08T05:15:14.143Z" host="app.diagrams.net"><diagram name="第 1 页" id="5_veikS2vmQ50BY-FqDE">ddHBEoIgEADQr+GuYFZns7p08tCZcTdhBl0HabS+Ph00Y6oT8HYXdhYmsno4WdmqCwEaxiMYmDgwzmOepOMyycPLJok9VFaDp2iFQj9xrlz0rgG72Tw5IuN0G2JJTYOlC0xaS32YdiMDAbSywqCNCYpSGvxKu2pwyuuOb1c/o67U8nKc7n2klkvyfHGnJFD/QSJnIrNEzu/qIUMzDS+cy/FP9N2Yxcb9KBg3693jIfghkb8A</diagram></mxfile>'

export default defineComponent({
  components:{
    ArrowBackOutline,
    Icon,
  },
  
  setup () {
    const router = useRouter()

    const routerBack= () =>{
      router.back()
    }

    const teamMain= () =>{
      router.push('/team')
    }

    const programView = () => {
      router.push('/project')
    }
    
    const open =(diagram:Diagram) =>{
      utils.setCookie('UMLid', diagram.id)
      utils.setCookie('UMLname', diagram.name)
      utils.setCookie('UMLxml', diagram.xml)
      router.push({name:'UML'})
    }
    window.addEventListener("message", function(event) {
      console.log(event)
      console.log( "received:(" + event.data +')from('+event.origin +')');
      if (event.origin == 'https://embed.diagrams.net') {
        if(event.data=='ready'){
          //drawio加载完成
          let umleditor=document.getElementById("umleditor") as HTMLIFrameElement

          let loadingscreen=document.getElementsByClassName("loadingscreen")[0] as HTMLIFrameElement

          loadingscreen.style.opacity = '0'
          setTimeout(function() {
              loadingscreen.parentNode.removeChild(loadingscreen);
          }, 800);

          umleditor.contentWindow.postMessage({action:'load',xml:emptydiagram,autosave:1},'*')
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
  height: 100%;
  width: 200px;
  background-color:#2A2A2A;
  border-right:1px solid #4E5456;
}
.backnav{
  margin: 0 9px;
  color:#CCCCCC;
  font-size: 14px;
  line-height: 30px;
  flex-direction: row;
  display: flex;
  align-items: stretch;
  flex-wrap: nowrap;
  border-bottom: 1px solid #4E5456;
}
.backnav a:hover,.hoverorange:hover{
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
</style>