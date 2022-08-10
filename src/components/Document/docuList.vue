<template>

  <div class="main">
    <div class="big-contain">
      <n-config-provider :theme="darkTheme">
        <div class="discribe">
          <p class="docu-all">
            管理你的文档
          </p>
          <n-button icon-placement="right" class="docu-add" size="tiny" @click="viewAddDocu">
            新 建 文 档
            <template #icon>
              <n-icon>
                <Add/>
              </n-icon>
            </template>
          </n-button>
        </div>
      </n-config-provider>
      <div id="docuITEMS" class="items" :key="docuitemKey">

        <document-item v-for="document in documents" :key="document" :name="document.title" :createTime="document.createTime"
                       @op="openDocu(document.ID)" @modifyName="viewEdiDocu(document.ID)" @del="viewDelDocu(document.ID)" />

      </div>
    </div>
  </div>

  <n-config-provider :theme="darkTheme">
    <n-modal
        v-model:show="showAdd"
        preset="dialog"
        title="新建文档"
        positive-text="确认"
        negative-text="取消"
        @positive-click="posAdd"
        @negative-click="negAdd"
    >
      <n-form ref="addFormRef" :model="addModelRef">
        <n-form-item label="文档名称" :rule="addRule" >
          <n-input v-model:value="addModelRef.addName" @keydown.enter.prevent/>
        </n-form-item>
        <n-form-item label="文档模版选择" :rule="modelRule">
          <n-select   v-model:value="addModelRef.model"
                      placeholder="请选择文档模版"
                      :options="modeloptions"
          />
        </n-form-item>
      </n-form>

    </n-modal>

    <n-modal
        v-model:show="showEdi"
        preset="dialog"
        title="重命名文档"
        positive-text="确认"
        negative-text="取消"
        @positive-click="posEdi"
        @negative-click="negEdi"
    >
      <n-form ref="ediFormRef" :model="ediModelRef">
        <n-form-item label="项目名称 · 新" :rule="ediRule">
          <n-input v-model:value="ediModelRef.ediName" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>

    </n-modal>

    <n-modal
        v-model:show="showDel"
        preset="dialog"
        title="删除文档"
        positive-text="确认"
        negative-text="取消"
        @positive-click="posDel"
        @negative-click="negDel"
    >
      <p style="font-size: 15px">
        确定删除文档
      </p>

    </n-modal>

  </n-config-provider>


</template>

<script setup lang="ts">
import axios from 'axios';
import {Add} from "@vicons/ionicons5";
import {Edit} from "@vicons/tabler";
import {Delete48Regular} from "@vicons/fluent";
import {Icon} from "@vicons/utils";

import {darkTheme, NIcon, useMessage} from "naive-ui";

import VueRouter from 'vue-router';

import {onMounted, ref} from "vue";
import utils from "@/Utils";
import router from "@/router";

import DocumentItem from "@/components/Document/documentItem.vue";

const headers = {
  Authorization: utils.getCookie('Authorization')
}

let proID = ref(0);
const message = useMessage();

let page = ref(2);

//强制刷新页面
let docuitemKey = 0;

//文档项目

let documents = ref([])

//自己设置项目id


//获取项目id
proID.value = parseInt(utils.getCookie('proID'));
/*
const load = () => {
  proID.value=parseInt(utils.getCookie('proID')) ;
  console.log("成功获取项目ID:"+proID.value);
}
*/
onMounted(() => {
  proID.value = parseInt(utils.getCookie('proID'));
  console.log("成功获取项目ID:" + proID.value);
  getDocuAbl();
})


//获取文档列表

const getDocuAbl = () => {

  axios.get('/document/list', {
        headers: headers,
        params:
            {
              programID: proID.value, // proID.value,
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

// 添加文档功能

const addDocuAbl = () => {
  if (addModelRef.value.addName === '') {
    message.warning("文档名不可为空！")
    return;
  }

  axios.post('/document',
      {
        'content': "默认内容",
        'title': addModelRef.value.addName,
        'src': null,
        'programID': proID.value,//proID.value
      }
  ).then(res => {
    if (res.data.msg === '成功') {
      console.log(addModelRef.value.addName);
      console.log("创建文档成功");

      //刷新 获取文档列表

    }
  })
}

// 重命名文档功能

const ediDocuAbl = () => {
  if (ediModelRef.value.ediName === '') {
    message.warning("文档名不可为空！")
    return;
  }

  axios.put('/document/title',
      {
        'ID': utils.getCookie('docIndex'),
        'title': ediModelRef.value.ediName,
      }
  ).then(res => {
    if (res.data.msg === '成功') {
      console.log(ediModelRef.value.ediName);
      console.log("重命名文档成功");

      //刷新 获取文档列表

    }
  })
}

// 删除文档功能

const delDocuAbl = () => {

  let ID = utils.getCookie('docIndex');
  let urlll = "/document/" + ID;
  console.log("/document/" + ID);

  axios.delete('/document/' + ID, {headers: headers}
  ).then(res => {
    if (res.data.msg === '成功') {
      console.log(urlll);
      console.log("删除文档成功");

      //刷新 获取文档列表

    }
  })
}

// 添加文档

const showAdd = ref(false);
const addFormRef = ref<FormData | null>(null)
const addModelRef = ref({ addName: "",model:""})

const modeloptions = [
  {
    label: "无模版创建",
    value: 'model0',
  },
  {
    label: '项目计划书',
    value: 'model1'
  },
  {
    label: '会议纪要',
    value: 'model2'
  },
  {
    label: "项目管理书",
    value: 'model3',
  },
  {
    label: '工作周报',
    value: 'model4'
  },
  {
    label: '项目方案规划',
    value: 'model5'
  },
  {
    label: '需求规格说明书',
    value: 'model6'
  },
  {
    label: '项目工作汇报',
    value: 'model7',
  },
  {
    label: '待解决问题清单',
    value: 'model8',
  },
]

const viewAddDocu = () => {
  showAdd.value = true;
}

const posAdd = () => {

  console.log("确定添加文档");

  //成功添加文档

  if (addModelRef.value.addName === '') {
    message.warning("文档名不可为空！")
    return;
  }

  let initContent=ref("");

  if(addModelRef.value.model==="model0"||addModelRef.value.model===""){
    initContent.value="";
  }else if(addModelRef.value.model==="model1"){
    initContent.value="<h1 id='项目计划书'><strong>项目计划书</strong></h1>" +
        "<p><strong>XX部XX</strong></p>" +
        "<p><strong>202X年X月X日</strong></p>" +
        "<h2 id='一项目摘要'><strong>一、项目摘要</strong></h2>" +
        "<p>xx项目是xx根据xx而产生，在xx方面......</p>" +
        "<h2 id='二项目描述'><strong>二、项目描述</strong></h2>" +
        "<p><strong>1、</strong>项目存在的意义</p>" +
        "<p>......</p>" +
        "<p><strong>2、</strong>项目分析</p>" +
        "<p>A. 项目前景</p>" +
        "<p>B. 项目存在的潜在问题及解决方案设想</p>" +
        "<p>（1）xx方面后续可能会存在于xx问题......</p>" +
        "<p>（2）......</p>" +
        "<p>C. ......</p>" +
        "<p><strong>3、</strong>项目内容及目标</p>" +
        "<p><strong>4、</strong>......</p>" +
        "<h2 id='三项目产品与服务'><strong>三、项目产品与服务</strong></h2>" +
        "<p>在此项目中，有......</p>" +
        "<h2 id='四项目准备与进展'><strong>四、项目准备与进展</strong></h2>" +
        "<p><strong>1、</strong>项目事前准备</p>" +
        "<p>A. 市场预测</p>" +
        "<p>B. ......</p>" +
        "<p><strong>2、</strong>项目进展</p>" +
        "<p>A. 时间与人员安排</p>" +
        "<p>......</p>" +
        "<p>B. 项目分解及进度</p>" +
        "<p>......</p>" +
        "<h2 id='五项目预算'><strong>五、项目预算</strong></h2>"
  }else if(addModelRef.value.model==="model2"){
    initContent.value="<h1 id='会议纪要'><strong>会议纪要</strong></h1>"+
    "<h1 id='一会议信息'><strong>一、会议信息</strong></h1>"+
    "<ul>"+
        "<li><strong>会议主题：</strong>简要描述会议主题和目标</li>"+
    "<li><strong>会议时间：</strong>2021年11月12日（星期五） 14:30 - 15:00</li>"+
    "<li><strong>会议地点：</strong>填写会议室或「插入」腾讯会议链接</li>"+
    "<li><strong>参会人员：</strong>输入“@+人名”插入参会人员</li>"+
    "<li><strong>相关资料：</strong>「插入」本次会议相关的「腾讯文档」或其他内容</li>"+

    "</ul>"+
    "<h1 id='二会议议题'><strong>二、会议议题</strong></h1>"+
    "<ol>"+
        "<li>输入要讨论的议题1</li>"+
    "<li>... </li>"+
    "<li>...</li>"+

    "</ol>"+
    "<h1 id='三会议结论'><strong>三、会议结论</strong></h1>"+
    "<ul>"+
        "<li>输入会议结论1</li>"+
    "<li>... </li>"+
    "<li>... </li>"+

    "</ul>"+
    "<h1 id='四后续跟进'><strong>四、后续跟进</strong></h1>"+
    "<ul>"+
        "<li></li>"+
    "<li></li>"+
    "</ul>"
  }else if(addModelRef.value.model==="model3"){
    initContent.value="<h1 id='项目名称'><strong>项目名称</strong></h1>"+
        "<p>  <strong>XX部XX</strong>"+
        "<strong>202X年X月X日</strong> </p>"+
        "<p>  <strong>项目负责人</strong> </p>"+
        "<h2 id='一项目开发目的'>一、项目开发目的</h2>"+
        "<p>  xx项目是xx根据xx而产生，在xx方面...... </p>"+
        "<h2 id='二项目开发背景'>二、项目开发背景 </h2>"+
        "<h2 id='三项目描述'><strong>三、项目描述</strong> </h2>"+
        "<p>  <strong>1、</strong>项目存在的意义 </p>"+
        "<p>  ...... </p>"+
        "<p>  <strong>2、</strong>项目分析 </p>"+
        "<p>  A. 项目前景 </p>"+
        "<p>  B. 项目存在的潜在问题及解决方案设想 </p>"+
        "<p>  （1）xx方面后续可能会存在于xx问题...... </p>"+
        "<p>  （2）...... </p>"+
        "<p>  C. ...... </p>"+
        "<p>  <strong>3、</strong>项目内容及目标 </p>"+
        "<p>  <strong>4、</strong>...... </p>"+
        "<h2 id='四项目开发计划'><strong>四、项目开发计划</strong> </h2>"+
        "<p>  在此项目中，有...... </p>"+
        "<h2 id='五项目需求说明'><strong>五、项目需求说明</strong> </h2>"+
        "<p>  <strong>1、</strong>项目事前准备 </p>"+
        "<p>  A. 市场预测 </p>"+
        "<p>  B. ...... </p>"+
        "<p>  <strong>2、</strong>项目进展 </p>"+
        "<p>  A. 时间与人员安排 </p>"+
        "<p>  ...... </p>"+
        "<p>  B. 项目分解及进度 </p>"+
        "<p>  ...... </p>"+
        "<h2 id='六项目预算'><strong>六、项目预算</strong> </h2>"
  }else if(addModelRef.value.model==="model4"){
    initContent.value="<h1 id='工作周报'><strong>工作周报</strong></h1>"+

        "<p><strong>汇报人：</strong>@具体人名</p>"+
        "<p><strong>时间：</strong>20XX年XX月XX日</p>"+

        "<h2 id='本周主要进展'><strong>本周主要进展</strong></h2>"+
        "<p>输入本周主要工作事项的进展情况</p>"+
        "<ol>"+
        "<li></li>"+
        "<li></li>"+
        "<li></li>"+

        "</ol>"+
        "<h2 id='下周工作计划'><strong>下周工作计划</strong></h2>"+
        "<p>描述下周工作内容及预计完成时间</p>"+
        "<ul>"+
        "<li></li>"+
        "<li></li>"+
        "<li></li>"
  }else if(addModelRef.value.model==="model5"){
    initContent.value="<h1 id='项目方案规划'><strong>项目方案规划</strong></h1>"+
        "<h1 id='一项目介绍'><strong>一、项目介绍</strong> </h1>"+
        "<p>此模板适用于规划季度、年度的中长期项目。</p>"+

        "<h2 id='11-项目背景'><strong>1.1 项目背景</strong></h2>"+
        "<p>记录项目背景、想解决的问题以及想要达成的目标。</p>"+

        "<h2 id='12-项目目标'><strong>1.2 项目目标</strong></h2>"+
        "<p>定义清晰、可实现、可衡量的项目目标。</p>"+

        "<h2 id='13-项目成员'><strong>1.3 项目成员</strong></h2>"+

        "<h1 id='二里程碑计划'><strong>二、里程碑计划</strong> </h1>"+
        "<p>将项目关键节点需要完成的事项设为里程碑，及时check完成状态。</p>"+
        "<ul>"+
        "<li>20XX年X月X日：项目启动</li>"+
        "<li>20XX年X月X日：里程碑1-完成XXXX</li>"+
        "<li>20XX年X月X日：里程碑2-完成XXXX</li>"+
        "<li>20XX年X月X日：里程碑3-完成XXXX</li>"+
        "<li>20XX年X月X日：项目交付</li>"+

        "</ul>"+


        "<h1 id='三任务拆解'><strong>三、任务拆解</strong> </h1>"+
        "<p>将项目任务进行细化拆解，明确负责人和起止时间。</p>"+

        "<h1 id='四项目例会'><strong>四、项目例会</strong> </h1>"+
        "<p>插入例会纪要，可「插入」文档。</p>"+

        "<h1 id='附相关资料汇总'><strong>附：相关资料汇总</strong></h1>"+
        "<p>「插入」相关的文档。</p>"
  }else if(addModelRef.value.model==="model6"){
    initContent.value="<h1 id='产品需求文档'><strong>需求规格说明书</strong></h1>"+
        "<h2 id='1-前言'><strong>1. 前言</strong></h2>"+

        "<h2 id='2-版本信息'><strong>2. 版本信息</strong></h2>"+
        "<ul>"+
        "<li><p>修改日期：</p>"+
        "</li>"+
        "<li><p>修改内容</p>"+
        "</li>"+
        "<ul>"+
        "<li>.....</li>"+
        "<li>......</li>"+

        "</ul>"+
        "<li><p>审核人：</p>"+
        "</li>"+

        "</ul>"+

        "<h2 id='3-文档说明'><strong>3. 文档说明</strong></h2>"+
        "<ul>"+
        "<li><p>文档读者</p>"+
        "</li>"+
        "<ul>"+
        "<li>........</li>"+

        "</ul>"+
        "<li><p>名词解释</p>"+
        "</li>"+
        "<ul>"+
        "<li>........</li>"+

        "</ul>"+

        "</ul>"+

        "<h2 id='4-背景介绍与产品简介'><strong>4. 背景介绍与产品简介</strong></h2>"+
        "<h3 id='41-产品现状'><strong>4.1. 产品现状</strong></h3>"+

        "<h3 id='42-产品定位'><strong>4.2. 产品定位</strong></h3>"+
        "<ul>"+
        "<li>同质点</li>"+

        "</ul>"+
        "<ul>"+
        "<ul>"+
        "<li>........</li>"+

        "</ul>"+

        "</ul>"+
        "<ul>"+
        "<li>差异点</li>"+

        "</ul>"+
        "<ul>"+
        "<ul>"+
        "<li>........</li>"+

        "</ul>"+

        "</ul>"+

        "<h3 id='43-用户需求'><strong>4.3. 用户需求</strong></h3>"+
        "<ul>"+
        "<li>需求背景</li>"+

        "</ul>"+
        "<ul>"+
        "<ul>"+
        "<li>........</li>"+

        "</ul>"+

        "</ul>"+
        "<ul>"+
        "<li>竞品调研</li>"+

        "</ul>"+
        "<ul>"+
        "<ul>"+
        "<li>........</li>"+

        "</ul>"+

        "</ul>"+
        "<ul>"+
        "<li>用户调研</li>"+

        "</ul>"+
        "<ul>"+
        "<ul>"+
        "<li>........</li>"+

        "</ul>"+

        "</ul>"+

        "<h2 id='5-产品架构'><strong>5. 产品架构</strong></h2>"+
        "<p>此处可以贴产品架构流程图</p>"+

        "<h2 id='6-功能详细说明'><strong>6. 功能详细说明</strong></h2>"+
        "<h3 id='61-功能列表'><strong>6.1. 功能列表</strong></h3>"+
        "<h3 id='62-原型界面'><strong>6.2. 原型界面</strong></h3>"+
        "<p>此处可以插入原型界面图</p>"+

        "<h3 id='63-流程图'><strong>6.3. 流程图</strong></h3>"+
        "<p>此处可以插入流程图</p>"+

        "<h3 id='64-视觉交互图'><strong>6.4. 视觉交互图</strong></h3>"+
        "<p>此处可以插入视觉交互图</p>"+

        "<h2 id='7-非功能需求'><strong>7. 非功能需求</strong></h2>"+


        "<h2 id='8-项目时间节奏规划'><strong>8. 项目时间节奏规划</strong></h2>"+


        "<h2 id='9-附录'><strong>9. 附录</strong></h2>"
  }else if(addModelRef.value.model==="model7"){
    initContent.value= "<h1 id='项目工作汇报'><strong>项目工作汇报</strong></h1>"+
        "<p>汇报人：@汇报人姓名</p>"+
        "<p>日期：2021年12月19日</p>"+
        "<h1 id='一项目概述'><strong>一、项目概述</strong></h1>"+
        "<h2 id='1项目描述'><strong>1、项目描述</strong></h2>"+
        "<p>对项目的真实情况进行总体介绍，描述项目背景和目标。</p>"+
        "<h2 id='2效果复盘'><strong>2、效果复盘</strong></h2>"+
        "<h3 id='数据跟踪'><strong>数据跟踪</strong></h3>"+
        "<p>展现项目实际情况，例如各个指标的数据达成情况、是否符合预期、与预期差距多少。</p>"+
        "<h3 id='结果描述'><strong>结果描述</strong></h3>"+
        "<p>对项目的结果进行分析与总结。</p>"+
        "<h1 id='二经验总结'><strong>二、经验总结</strong> </h1>"+
        "<p>复盘总结项目中的工作经验，沉淀方法论。</p>"+
        "<ul>"+
        "<li>优点：...</li>"+
        "<li>不足：...</li>"+
        "<li>改进方向：... </li>"+

        "</ul>"+
        "<h1 id='三未来规划'><strong>三、未来规划</strong> </h1>"+
        "<p>展示未来工作规划。</p>"+
        "<ul>"+
        "<li></li>"+
        "<li></li>"+
        "<li></li>"+

        "</ul>"

  }else if(addModelRef.value.model==="model8"){
    initContent.value="<h1 id='待解决问题清单'><strong>待解决问题清单</strong> </h1>"+
        "<p><strong>08.17- 08.24</strong></p>"+
        "<p><strong>问题范围：</strong>公司XX项目XX相关问题</p>"+
        "<p><strong>项目负责人：</strong>@王XX</p>"+
        "<p><strong>项目成员：</strong>张XX. 李XX. 刘XX</p>"+
        "<p><strong>完成时间：</strong>本周五下班前</p>"+
        "<p><strong>待解决问题：</strong></p>"+
        "<ul>"+
        "<li>【@XXX】2.0版本Top 10 bug修复</li>"+
        "<li>【@XXX】2.0版本XX交互方案确认</li>"+
        "<li>【@XXX】核心用户体验群名单确定</li>"+
        "<li>【@XXX】XXXXXXXX</li>"+
        "<li>【@XXX】XXXXXXXX</li>"+
        "<li>【@XXX】XXXXXXXX</li>"+
        "<li>【@XXX】XXXXXXXX</li>"+

        "</ul>"+
        "<p><strong>备注：</strong></p>"+
        "<ol>"+
        "<li>清单上的问题必须在限定时间内解决。遇到处理困难，需在限定时间之前1个工作日提出，申请换人负责或其他资源支持。 </li>"+
        "<li>遇到任何问题可以随时咨询项目负责人。</li>"+

        "</ol>"+

        "<p>"
  }

  axios.post('/document',
      {
        'content': initContent.value,
        'title': addModelRef.value.addName,
        'src': null,
        'programID': proID.value,//proID.value
        'type': addModelRef.value.model,
        'copy':true,
      },{headers:headers}
  ).then(res=>{
    if(res.data.msg==='成功'){
      console.log(addModelRef.value.addName);

      console.log(res.data.data);
      console.log(res.data.data);
      console.log(res.data.data);

      console.log("创建文档成功");


      //刷新 获取文档列表
      getDocuAbl();
      //documents.value.push(newdoc);
      console.log("添加文档成功");
      openDocu(res.data.data);

      showAdd.value = false
    }
  })

}

const negAdd = () => {
  addModelRef.value.addName = "";
  showAdd.value = false;
};

const addRule = {
  required: true,
  validator() {
    if (addModelRef.value.addName.length === 0) {
      return new Error("文档名称不可为空")
    } else {
      if (addModelRef.value.addName.length >= 12) {
        return new Error("文档名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}

const modelRule = {
  required: true,
  validator() {
    if (addModelRef.value.model.length === 0 ) {
      return new Error("请选择相应模版")
    }
  },
  trigger: ['input', 'blur']
}


// 重命名文档

const showEdi = ref(false);
const ediFormRef = ref<FormData | null>(null)
const ediModelRef = ref({ediName: ""})
let editID = ref();

function viewEdiDocu(ind) {
  editID.value = ind;
  showEdi.value = true;
}

const posEdi = () => {

  //成功重命名文档

  console.log(editID.value);

  if (ediModelRef.value.ediName === '') {
    message.warning("文档名不可为空！")
    return;
  }

  axios.put('/document/title',
      {
        'ID': editID.value,
        'title': ediModelRef.value.ediName,
      }, {headers: headers}
  ).then(res => {
    if (res.data.msg === '成功') {
      console.log(ediModelRef.value.ediName);
      console.log("重命名文档成功");

      //刷新 获取文档列表
      getDocuAbl();
    }
  })


  ediModelRef.value.ediName = "";

  showEdi.value = false
}

const negEdi = () => {
  ediModelRef.value.ediName = "";
  showEdi.value = false;
};

const ediRule = {
  required: true,
  validator() {
    if (ediModelRef.value.ediName.length === 0) {
      return new Error("文档名称不可为空")
    } else {
      if (ediModelRef.value.ediName.length >= 12) {
        return new Error("文档名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}

// 删除文档

let docIndex: string;

const showDel = ref(false);

let delID = ref();

function viewDelDocu(ind) {
  delID.value = ind;
  showDel.value = true;
}

const posDel = () => {

  //成功删除文档 序号: ind

  let urldel = "/document/" + delID.value;
  console.log("/document/" + delID.value);

  axios.delete(urldel, {headers: headers}
  ).then(res => {
    if (res.data.msg === '成功') {
      console.log(urldel);
      console.log("删除文档成功");

      //刷新 获取文档列表

      getDocuAbl();
    }
  })

  console.log(utils.getCookie(docIndex));

  showDel.value = false;
}

const negDel = () => {
  showDel.value = false;
};

// 打开文档

let opdocuID = ref();

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


</script>

<style scoped>

.main {
  width: 100%;
}

.big-contain {
  /*width:fit-content;*/
  margin: 20px 60px 0;
}

.docu-all {

  /*position: relative;*/

  width: 357px;
  /*height: 40px;*/
  left: 0px;
  top: -26px;

  display: inline-block;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;

  align-items: center;

  color: #414958;
}

/*
.docu-add{

  box-sizing: border-box;


  position: relative;
  width: 150px;
  height: 32px;
  left: 500px;
  top: -32px;

  border: 1px solid #A7AFBE;
  border-radius: 2px;
}
*/

.items {
  /*position: relative;
  left: 0px;
  top:-15px;*/
  width: 100%;
}

.docu-title {

  width: 1000px;
  height: 30px;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  display: flex;
  align-items: flex-end;
  text-align: center;

  color: #E2E4E9;
}

.docu-title:hover {
  color: #FFFFFF;
}

#edi, #del {
  display: flex;
  cursor: pointer;
}

#edi {
  /*position: relative;
  margin-top: 160px;*/
  margin-right: 37%;
}

#del {
  /*position: relative;
  margin-top: 160px;*/
  margin-left: 37%;
  alignment: right;
}

.discribe {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;
  align-items: center;
  margin-bottom: 6px;

  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  color: #414958;
}
</style>