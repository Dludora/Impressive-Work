<template>
  <n-config-provider :theme="tttheme">
    <div class="bigbg">
      <n-space class="head-bg" justify="space-between">

          <n-button text style="position: relative; font-size: 30px;display: inline;top: 4px;left: 8px" @click="exitEdit">
            <n-icon>
              <exitIcon />
            </n-icon>
          </n-button>

        <h style="position: relative; top: 0; left: 0; bottom: 0; right: 0;color: #FFFFFF; display: inline">
          {{title}}
        </h>
        <n-space justify="end">
          <n-button text style="position: relative;font-size: 25px;display: inline;top:4px;right: 8px" @click="saveContent">
            <n-icon>
              <saveIcon />
            </n-icon>
          </n-button>
        </n-space>

      </n-space>

      <n-space style="background-color: #16181D;min-width: 100%;display: inline-block;">  </n-space>

      <n-space style="min-height: 100%;min-width: 100%;display: inline-block;">
            <n-space style="alignment: center;" class="maineditor">
              <div id="vditor" name="description"></div>
            </n-space>

      </n-space>

    </div>
  </n-config-provider>
</template>

<script>

import { ArrowBack as exitIcon } from '@vicons/ionicons5';
import {SaveOutline as saveIcon} from '@vicons/ionicons5';
import { defineComponent } from 'vue';
import {darkTheme, useMessage} from "naive-ui";
import utils from "@/Utils";
import Vditor from "vditor";  //1.import一下vditor组件
import 'vditor/dist/index.css'
import axios from "axios"; //1.import一下vditor组件样式
import router from "@/router";

const message = useMessage();

export default defineComponent({
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
          window.$message.success("保存成功");
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
      window.$message = useMessage()
        return {
          tttheme: darkTheme,
        }
    },

    mounted() {

      this.content = utils.getCookie('DocContent');

      this.contentEditor = new Vditor('vditor', { //4.刚刚声明的变量contentEditor被赋值为一个Vditor实例,
        height: 600,
        width: 1050, //1438
        // placeholder: '此处为话题内容……',
        theme: 'classic',
        value: this.content,

/*
        fullscreen:{
          index:100,
        },
*/
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
          'outline',
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
.bigbg{
  background-color: #414958;
  width: 100%;
  height: 100%;
}


.head-bg{
  background-color: #2B303B;
  min-width: 100%;
  height: 60px;
  display: inline-block;
  vertical-align: center;
  font-size: 25px;
  line-height: 60px;
}

.maineditor{
  position: relative;
  top:50px;
  left:194px;
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