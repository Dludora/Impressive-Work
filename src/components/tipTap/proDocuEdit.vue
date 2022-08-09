<template>
  <n-config-provider :theme="darkTheme">
  <div class="big-bg">

    <div class="leftDoc">
      <n-button @click="returnTO" style="width: 60px">返回</n-button>
      <div @click="returnTO" class="user">
        <p style="width: 100%">项目:</p>
        <p style="font-size:40px;width: 100%">{{proName}}</p>
      </div>
      <div class="teamlist">
        <div class="teamsHead">
          项目文档
        </div>
        <div class="divline"/>
        <!-- <n-scrollbar style="margin:0 0 0 -8px;width:197px;padding-right:3px;"> -->
        <n-scrollbar>
          <div class="teams">
            <left-docu-list v-for="document in documents" :key="document" :name="document.title"
                            @op="openDocu(document.ID)" />
          </div>
        </n-scrollbar>
      </div>
    </div>

    <div class="main">
      <n-space class="head-bg" justify="center">

        <h style="position: relative; top: 5px;color: #FFFFFF; display: inline">
          文档: {{title}}
        </h>

      </n-space>

      <n-space style="width: 50px">
        <n-button @click="downPDF">下载PDF</n-button>
        <n-button @click="saveWord">下载word</n-button>
        <n-button @click="saveMD">下载MD</n-button>
        <n-button @click="saveHTML">下载HTML</n-button>
        <n-button @click="saveJSON">下载JSON</n-button>
        <n-button @click="saveText">下载纯文本</n-button>
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
  </div>
  </n-config-provider>
</template>

<script>
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

import { darkTheme } from 'naive-ui'
import LeftDocuList from "@/components/tipTap/leftDocuList";
import {ref} from "vue";

const headers = {
  Authorization: utils.getCookie('Authorization')
}

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

let documents = ref([]);

const getProName = () => {
  return utils.getCookie('proNAME');
}

//获取文档ID

const getDocuID = () => {
  return utils.getCookie('editDocID');
}

const UserName = () =>{
  return utils.getCookie("UserName");
}

const getDocuAbl = () => {

  axios.get('/document/list', {
        headers: headers,
        params:
            {
              programID: parseInt(utils.getCookie('proID')), // proID.value,
            }
      }
  ).then(res => {
    if (res.data.msg === '成功') {

      console.log("获取文档列表成功");

      documents.value = res.data.data.items;

      console.log(documents.value);
    }
  })
}

function openDocu(index) {
  //获取文档内容
  opdocuID.value = index;

  let urlOP = "/document/" + opdocuID.value;
  console.log(urlOP);

  axios.get(urlOP, {headers: headers}
  ).then(res => {
    if (res.data.msg === '成功') {

      console.log("获取文档内容成功");
      let opContent;

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
      utils.setCookie('DocTitle', opTitle);




      router.push("/proDocuEdit");
    }
  })

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
    LeftDocuList,
    EditorContent,
    MenuBar,
  },

  data() {
    return {
      currentUser:{
        name: /*this.getRandomName(),*/UserName(),
        color: this.getRandomColor(),
      },
      provider: null,
      editor: null,
      status: 'connecting',
      room: getDocuID(),
      title: '',
      proName: getProName()
    }
  },

  setup() {
    return {
      darkTheme,
    };
  },

  created() {
    this.title = utils.getCookie('DocTitle');
    getDocuAbl();
  },

  mounted() {
    this.title = utils.getCookie('DocTitle');

    const ydoc = new Y.Doc()
    this.provider = new HocuspocusProvider({
      url: 'ws://127.0.0.1:80',
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
    },

    billPrintClick(){
      const style = '@page {margin:0 10mm};'//打印时去掉眉页眉尾
      //打印为什么要去掉眉页眉尾？因为眉页title时打印当前页面的title，相当于是获取html中title标签里面的内容，但是比如我打印的内容只是一个弹框里面的内容，是没有title的，这时候就会出现undefined，为了避免出现这种情况，就可以隐藏眉页眉尾
      printJS({
        printable: 'pdfDom',// 标签元素id
        type: 'html',
        header: '',
        targetStyles: ['*'],
        width:
        style
      });
      //各个配置项
      //printable:要打印的id。
      //type:可以是 html 、pdf、 json 等。
      //properties:是打印json时所需要的数据属性。
      //gridHeaderStyle和gridStyle都是打印json时可选的样式。
      //repeatTableHeader:在打印JSON数据时使用。设置为时false，数据表标题将仅在第一页显示。
      //scanStyles:设置为false时，库将不处理应用于正在打印的html的样式。使用css参数时很有用，此时自己设置的原来想要打印的样式就会失效，在打印预览时可以看到效果
      //targetStyles: [’*’],这样设置继承了页面要打印元素原有的css属性。
      //style:传入自定义样式的字符串，使用在要打印的html页面 也就是纸上的样子。
      //ignoreElements：传入要打印的div中的子元素id，使其不打印。非常好用
    },

    openPrint(){
//判断iframe是否存在，不存在则创建iframe
      let iframe = document.getElementById("pdfDom");
      console.log("test")

      if(!iframe){
        const el = document.getElementById("pdfDom");
        iframe = document.createElement('IFRAME');
        let doc = null;
        iframe.setAttribute("id", "print-iframe");
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-999em;top:-500px;');
//left负值不会出现横向滚动条
        document.body.appendChild(iframe);
        doc = iframe.contentWindow.document;
        //这里可以自定义样式
        doc.write("<LINK rel=\"stylesheet\" type=\"text/css\" href=\"css/print.css\">");
        doc.write('<div>' + el.innerHTML + '</div>');
        doc.close();
        iframe.contentWindow.focus();
      }

      iframe.contentWindow.print();
      if (navigator.userAgent.indexOf("MSIE") > 0){
        document.body.removeChild(iframe);
      }
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
          "1"+".doc"
      )
    },

    saveMD(){

      const turndown = new TurndownService({
        emDelimiter: '_',
        linkStyle: 'inlined',
        headingStyle: 'atx'
      })

      const markdown = turndown.turndown(this.editor.getHTML());

      var file = new File([markdown], "1.md", {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },

    saveHTML(){

      var file = new File([this.editor.getHTML()], "1.html", {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },

    saveJSON(){

      var file = new File([this.editor.getJSON()], "1.json", {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },

    saveText(){

      var file = new File([this.editor.getText()], "1.txt", {type: "text/plain;charset=utf-8"});
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

.editor {
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-left: 21rem;
  margin-top: 5rem;
  height: 30rem;
  width: 50rem;
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
</style>