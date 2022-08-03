<template>
  <div>
    <n-space style="alignment: center" >
      <div id="vditor" name="description"></div>


      <n-button @click="showContent">显示内容</n-button><br>
      <n-button @click="showPosition">显示光标位置</n-button><br>
      <n-button @click="showSelection">显示selection位置</n-button><br>
      <n-button @click="setContent">更新内容</n-button><br>
    </n-space>

  </div>

</template>
<script>
import Vditor from "vditor";  //1.import一下vditor组件
import 'vditor/dist/index.css' //1.import一下vditor组件样式

export default {
  data() {
    return {
      contentEditor: {},//3.声明一个变量
    }
  },
  created() {

  },
  mounted() {

    this.contentEditor = new Vditor('vditor', { //4.刚刚声明的变量contentEditor被赋值为一个Vditor实例,
      height: 700,
      width: 1168,
      placeholder: '此处为话题内容……',
      theme: 'dark',

      counter: {
        enable: true,
        type: 'markdown',
        max: 99999,
      },
      preview: {
        theme: 'dark',
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
  methods: {

    showContent(){
      console.log(this.contentEditor.getValue());
    },

    showPosition(){
      console.log(this.contentEditor.getCursorPosition());

    },

    showSelection(){
      console.log(window.getSelection().getRangeAt(0));
    },

    setContent(){
      this.contentEditor.setValue("测试内容");
    },

    // 我的提交表单代码大致如下,这段代码核心是this.ruleForm.content = this.contentEditor.getValue()
    /*
          submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                      if (valid) {
                        if (
                          this.contentEditor.getValue().length === 1 ||
                          this.contentEditor.getValue() == null ||
                          this.contentEditor.getValue() === ''
                        ) {
                          alert('话题内容不可为空')
                          return false
                        }

                                           //5.通过this.contentEditor.getValue()获取编辑器内容
                        this.ruleForm.content = this.contentEditor.getValue()

                        ......//调用api把this.ruleForm传给后端
                    })
           }
      }
        }
      */
    //后续从后端传回来的数据会面临一个##标题仍然显示为##标题的问题，这篇文章后面有使用renderMarkdown()来解决的具体代码
  }
}
</script>
