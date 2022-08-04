<template>
  <n-config-provider :theme="tttheme">
    <div>
      <n-space class="head-bg" justify="space-between">

        <n-button text style="position: relative; font-size: 30px;display: inline;top: 4px" @click="exitEdit">
          <n-icon>
            <exitIcon />
          </n-icon>
        </n-button>

        <h style="position: inherit; top: 0; left: 0; bottom: 0; right: 0;color: #FFFFFF; display: inline">
          {{title}}
        </h>
        <n-space justify="end">
          <n-button text style="position: relative;font-size: 25px;display: inline;top:4px" @click="saveContent">
            <n-icon>
              <saveIcon />
            </n-icon>
          </n-button>
        </n-space>

      </n-space>

      <n-space style="background-color: #16181D;min-width: 100%;display: inline-block;">  </n-space>

      <n-space style="min-height: 100%;min-width: 100%;display: inline-block;">
        <n-layout has-sider sider-placement="right" native-scrollbar="false">
          <n-layout-sider native-scrollbar="false">
            <p style="position: fixed;font-size: 30px">同时在线成员：</p>
            <p style="position: absolute;top:calc(35px + 12.5px);left:250px;right: 0"> > </p>
            <p style="position: absolute;top:calc(35px + 52.5px);left:250px;right: 0"> > </p>
            <p style="position: absolute;top:calc(35px + 92.5px);left:250px;right: 0"> > </p>
          </n-layout-sider>
          <n-layout-content>
            <n-space style="alignment: center;" >
              <div id="vditor" name="description"></div>

              <n-button @click="showContent">显示内容</n-button><br>
              <n-button @click="showPosition">显示光标位置</n-button><br>
              <n-button @click="showSelection">显示selection位置</n-button><br>
              <n-button @click="setContent">更新内容</n-button><br>
            </n-space>
          </n-layout-content>
        </n-layout>

      </n-space>

    </div>
  </n-config-provider>
</template>

<script>

import { ArrowBack as exitIcon } from '@vicons/ionicons5';
import {SaveOutline as saveIcon} from '@vicons/ionicons5';
import {defineComponent} from "vue";
import {darkTheme} from "naive-ui";
import utils from "@/Utils";
import Vditor from "vditor";  //1.import一下vditor组件
import 'vditor/dist/index.css'
import axios from "axios"; //1.import一下vditor组件样式
import router from "@/router";


export default({
  components: {
    exitIcon,
    saveIcon,
  },



  data() {
    const headers = {
      Authorization: utils.getCookie('Authorization')
    };

    return {
      contentEditor: {},//3.声明一个变量
      documentID: 0,
      content: "测试：文档内容",
      title: "测试：文档标题",
      src:null,
      programID: 0,
    }
  },

  methods: {

    showContent() {
      console.log(this.contentEditor.getValue());
    },

    showPosition() {
      console.log(this.contentEditor.getCursorPosition());

    },

    showSelection() {
      console.log(window.getSelection().getRangeAt(0));
    },

    setContent() {
      this.contentEditor.setValue("content");
    },

    settheme() {
      this.contentEditor.setTheme("dark");
      this.contentEditor.setContentTheme("dark");
    },

    exitEdit() {
      router.push("/programBig/docuList");
    },

    saveContent() {

      const headers = {
        Authorization: utils.getCookie('Authorization')
      };

      console.log(this.documentID);

      let urlSave = "/document/" + this.documentID;

      this.content=this.contentEditor.getValue();

      axios.put(urlSave,
          {
            'content': this.content,
            'title': this.title,
            'src': null,
            'programID': this.programID,//proID.value
          },{headers:headers}
      ).then(res=>{
        if(res.data.msg==='成功'){
          console.log("保存文档成功");
        }
      })
    }
  },

  created() {
    this.title = utils.getCookie('DocTitle');
    this.content = utils.getCookie('DocContent');
    this.documentID=parseInt(utils.getCookie('editDocID'));
    this.programID=parseInt(utils.getCookie('proID'));
    // this.contentEditor.setTheme("dark");
  },

  setup() {
    return {
      tttheme: darkTheme,
    }
  },

  mounted() {

    this.content = utils.getCookie('DocContent');

    this.contentEditor = new Vditor('vditor', { //4.刚刚声明的变量contentEditor被赋值为一个Vditor实例,
      height: 700,
      width: 1168,
      // placeholder: '此处为话题内容……',
      theme: 'classic',
      value: this.content,

      counter: {
        enable: true,
        type: 'markdown',
        max: 99999,
      },
      preview: {
        delay: 0,
        hljs: {
          style: 'monokai',
          lineNumber: true
        }
      },
      tab: '\t',

      typewriterMode: true,
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      mode: 'ir',
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        '|',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        '|',
        'quote',
        'line',
        'code',
        'inline-code',
        'insert-before',
        'insert-after',
        '|',
        // 'record',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        // 'edit-mode',
        // 'content-theme',
        'code-theme',
        'preview',
        'export',
        // 'fullscreen',
        /*
      {
        name: 'more',
        toolbar: [
          'fullscreen',
          'both',

          'info',
          'help',
        ],
      }*/],
    })

  },
})

</script>

<style scoped>
.head-bg{
  background-color: #2B303B;
  min-width: 100%;
  height: 40px;
  display: inline-block;
  vertical-align: center;
  font-size: 25px;
  line-height: 40px;
}

.n-layout {
  height: calc(100%);
}

.n-layout-header,
.n-layout-footer {
  background: #16181D;
  padding: 36px;
}

.n-layout-sider {
  min-height: border-box;
  background: #525c62;
}

.n-layout-content {
  background: #16181D;
}
</style>