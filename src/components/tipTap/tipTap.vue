<template>
  <div class="item-bg">

    <n-space class="head-bg" justify="space-between">

      <div/>
      <h style="margin-left:40px;color: #FFFFFF; display: inline">
        {{title}}
      </h>

      <!-- <n-button @click="returnTO">返回</n-button>

      <n-button @click="downPDF">下载PDF</n-button>
      <n-button @click="saveWord">下载word</n-button>
      <n-button @click="saveMD">下载MD</n-button>
      <n-button @click="saveHTML">下载HTML</n-button>
      <n-button @click="saveJSON">下载JSON</n-button>
      <n-button @click="saveText">下载纯文本</n-button> -->
      <Icon class="exportbutton" size="24px">
        <Export @click="exportFile"/>
      </Icon>

    </n-space>
    <div class="editor" v-if="editor">
      <menu-bar class="editor__header" :editor="editor" />
      <editor-content id="pdfDom" class="editor__content" :editor="editor" />
      <div class="editor__footer">
        <div :class="`editor__status editor__status--${status}`">
          <template v-if="status === 'connected'">
            {{ editor.storage.collaborationCursor.users.length }} 用户 正在编辑文档： {{ title }}
          </template>
          <template v-else>
            offline
          </template>
        </div>
        <div class="editor__name">
          <p>
            {{ currentUser.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showModalRef" :mask-closable="true">
    <div class="export-panel">
      <div class="export-desc">请选择导出格式</div>
      <div class="export-list">
        <div class="export-option head" @click="downPDF">PDF 文档</div>
        <div class="export-option" @click="saveWord">Word 文档</div>
        <div class="export-option" @click="saveMD">Markdown 文件</div>
        <div class="export-option" @click="saveHTML">HTML 页面</div>
        <!-- <div class="export-option" @click="saveJSON">JSON 文件</div> -->
        <div class="export-option tail" @click="saveText">txt 文本文件</div>
      </div>
    </div>

  </n-modal>
</template>

<script>
import {
    Export
} from '@vicons/carbon'
import { Icon } from '@vicons/utils'
import {HocuspocusProvider} from '@hocuspocus/provider'
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'
import {Editor, EditorContent} from '@tiptap/vue-3'
import * as Y from 'yjs'

import MenuBar from './MenuBar.vue'
import utils from "@/Utils";
import axios from "axios";

import TurndownService from 'turndown';
import router from "@/router";

import printJS from "print-js";

import htmlDocx from 'html-docx-js/dist/html-docx';
import saveAs from 'file-saver';

const getRandomElement = list => {
  return list[Math.floor(Math.random() * list.length)]
}
/*
const getRandomRoom = () => {
  return getRandomElement([
    'rooms.33',
    'rooms.34',
    'rooms.35',
  ])
}
*/

//获取文档ID

const getDocuID = () => {
  return utils.getCookie('editDocID');
}

const UserName = () =>{
  return utils.getCookie("UserName");
}
/*
const saveContent = () => {
  const docID=parseInt(getDocuID());
  const docContent=this.editor.getHTML();
  const teamID=parseInt(utils.getCookie('proTeam'));

  axios.put('/document/content',
      {
        'ID': docID,
        'content': docContent,
        'teamID': teamID,
      }
  ).then(res=>{
    if(res.data.msg==='成功'){

      console.log("保存文档成功");

    }
  })
}

 */

export default {
  components: {
    EditorContent,
    MenuBar,
    Icon,
    Export,
  },

  data() {
    return {
      currentUser:{
        name: /*this.getRandomName(),*/UserName(),
        color: this.getRandomColor(),
      },
      showModalRef:false,
      provider: null,
      editor: null,
      status: 'connecting',
      room: getDocuID(),
      title: '',
    }
  },

  created() {
    this.title = utils.getCookie('DocTitle');
  },

  mounted() {
    this.title = utils.getCookie('DocTitle');

    const ydoc = new Y.Doc()
    this.provider = new HocuspocusProvider({
      url: 'ws://82.156.125.202:8003',
      parameters: {
        //key: 'write_bqgvQ3Zwl34V4Nxt43zR',
      },
      name: this.room,
      document: ydoc,
    })

    this.provider.on('status', event => {
      this.status = event.status
    })

    this.editor = new Editor({
      content: utils.getCookie('DocContent'),
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Highlight,
        TaskList,
        TaskItem,
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider: this.provider,
          user: this.currentUser,
        }),
        CharacterCount.configure({
          limit: 10000,
        }),
      ],
    })

    localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
  },

  methods: {

    getRandomColor() {
      return getRandomElement([
        '#958DF1',
        '#F98181',
        '#FBBC88',
        '#FAF594',
        '#70CFF8',
        '#94FADB',
        '#B9F18D',
      ])
    },

    exportFile(){
      this.showModalRef=true;
    },
    toHTML(){
      console.log(this.editor.getHTML());
    },

    toJSON(){
      console.log(this.editor.getJSON());
    },

    toMD(){
      const turndown = new TurndownService({
        emDelimiter: '_',
        linkStyle: 'inlined',
        headingStyle: 'atx'
      })

      const markdown = turndown.turndown(this.editor.getHTML());
      console.log(markdown);
    },

    toText(){
      console.log(this.editor.getText());
    },

    downPDF(){
      let iframe = document.getElementById("pdfDom");

      const el=document.getElementById("pdfDom");
      iframe=document.createElement('IFRAME');
      iframe.setAttribute("id", "print-iframe");
      iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-999em;top:-500px;');
      document.body.appendChild(iframe);
      let doc = iframe.contentWindow.document;
      doc.write("<LINK rel=\"stylesheet\" type=\"text/css\" href=\"css/print.css\">");
      doc.write('<div>' + el.innerHTML + '</div>');
      doc.close();
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      if (navigator.userAgent.indexOf("MSIE") > 0){
        document.body.removeChild(iframe);
      }
/*
      async function back() {
        return 1;
      }
      back().then(result => {
        router.go(0);
      })
      console.log('虽然在后面，但是我先执行');

      const previewEl = document.querySelector("#pdfDom").innerHTML;
      window.document.body.innerHTML=previewEl;
      window.print();

 */
    },

    saveWord(){
      let htmlStr = document.querySelector("#pdfDom").innerHTML;
      let page = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlStr}
        </body></html>`
      // console.log(page);return
      saveAs(
          htmlDocx.asBlob(page, {
            orientation: "landscape"//跨域设置
          }),
          //文件名
          this.title+".doc"
      )
    },

    saveMD(){

      const turndown = new TurndownService({
        emDelimiter: '_',
        linkStyle: 'inlined',
        headingStyle: 'atx'
      })

      const markdown = turndown.turndown(this.editor.getHTML());

      var file = new File([markdown], this.title+".md", {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },

    saveHTML(){

      var file = new File([this.editor.getHTML()], this.title+".html", {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },

    saveJSON(){

      var file = new File([this.editor.getJSON()], this.title+".json", {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },

    saveText(){

      var file = new File([this.editor.getText()], this.title+".txt", {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },

    returnTO(){
      const docID=parseInt(utils.getCookie('editDocID'));
      console.log(docID);
      const docContent=this.editor.getHTML();
      console.log(docContent);
      const TeamID=parseInt(utils.getCookie('proTeam'));
      console.log(TeamID);

      const headers = {
        Authorization: utils.getCookie('Authorization')
      }

      axios.put('/document/content',
          {
            'ID': docID,
            'content': docContent,
            'teamID': TeamID,
          },{headers:headers}
      ).then(res=>{
        if(res.data.msg==='成功'){

          console.log("保存文档成功");
          router.push('/project/documents');

        }
      })
    },

    getRandomName() {
      return getRandomElement([
        'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
      ])
    },

    getUserName() {
      console.log("尝试获取登陆用户信息")
      const headers = {
        Authorization: utils.getCookie('Authorization')
      };
      axios.get('/user/info',{headers:headers}
      ).then(res=>{
        if(res.data.msg==='成功'){
          console.log("成功获取登陆用户信息");
          console.log(res.data.data.nickname);
          this.currentUser.name=res.data.data.nickname;
        }
      })
    },
  },

  beforeUnmount() {


    const docID=parseInt(utils.getCookie('editDocID'));
    console.log(docID);
    const docContent=this.editor.getHTML();
    console.log(docContent);
    const teamID=parseInt(utils.getCookie('proTeam'));
    console.log(teamID);

    const headers = {
      Authorization: utils.getCookie('Authorization')
    }

    axios.put('/document/content',
        {
          'ID': docID,
          'content': docContent,
          'teamID': teamID,
        },{headers:headers}
    ).then(res=>{
      if(res.data.msg==='成功'){

        console.log("保存文档成功");

      }
    })

    this.editor.destroy()
    this.provider.destroy()


  },
}
</script>

<style lang="scss">

.head-bg{
  background-color: #535a75;
  min-width: 100%;
  height: 42px;
  /*display: inline-block;*/
  vertical-align: center;
  justify-content: space-between;
  font-size: 16px;
  line-height: 42px;
}

.item-bg{
  min-width: 100%;
  min-height: 100%;
  /*background-color: #414958;*/
}

.editor {
  display: flex;
  position: absolute;
  bottom: 0;
  top: 42px;
  right: 0;
  left: 168px;
  flex-direction: column;
  /*margin-left: 10rem;
  margin-top: 10rem;*/
  /*height: 30rem;
  width: 50rem;*/
  color: #0D0D0D;
  background-color: #FFF;
  border: 3px solid #0D0D0D;
  border-radius: 0.75rem;

  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 3px solid #0D0D0D;
  }

  &__content {
    padding: 1.25rem 1rem;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
  }

  &__footer {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    white-space: nowrap;
    border-top: 3px solid #0D0D0D;
    font-size: 12px;
    font-weight: 600;
    color: #0D0D0D;
    white-space: nowrap;
    padding: 0.25rem 0.75rem;
  }

  /* Some information about the status */
  &__status {
    display: flex;
    align-items: center;
    border-radius: 5px;

    &::before {
      content: ' ';
      flex: 0 0 auto;
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #B9F18D;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #0D0D0D;
      border-radius: 0.4rem;
      padding: 0.25rem 0.5rem;

      &:hover {
        color: #FFF;
        background-color: #0D0D0D;
      }
    }
  }
}
</style>

<style lang="scss">
/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #FAF594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
.exportbutton{
  color:#E2E4E9;
  margin:9px 16px 0 0;
  transition-duration: 0.3s;
}
.exportbutton:hover{
  cursor:pointer;
  color:#fff;
}
.export-panel{
  width:240px;
  padding:36px;
  background-color:#0D0D0D;
  border:2px solid #616161;
}
.export-desc{
  text-align: center;
  font-size:18px;
  margin-bottom: 12px;
}
.export-list{
  width:100%;
}
.export-list .head{
  border-top:2px solid #616161;
  border-radius: 6px 6px 0 0;
}
.export-list .tail{
  border-bottom:2px solid #616161;
  border-radius: 0 0 6px 6px;
}
.export-option{
  text-align: center;
  color:#FFF;
  font-size: 14px;
  line-height: 42px;
  border-top:1px solid #616161;
  border-left:2px solid #616161;
  border-right:2px solid #616161;
  border-bottom:1px solid #616161;
}
.export-option:hover{
  cursor:pointer;
  border-color: #FFF;
}
</style>