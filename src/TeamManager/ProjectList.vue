<template>
    <div class="main">
        <div class="discribe">
            管理你的{{length}}个项目
            <div class="buttons">
                <n-button class="newpage" @click="displayAdd" size="tiny">
                    新 建 项 目&nbsp;
                    <Icon size="14">
                        <Add28Regular/>
                    </Icon>
                </n-button>
            </div>
        </div>
        <div class="prolist">
            <!-- <ProCard v-for="(item, i) in shortcuts" :key="i" :name="item.name" :id="item.id" :date="item.date" :img="item.img" class="card" @rename="displayMedal(item.id)" @del="displayDel(item.id)"/> -->
            <ProCard v-for="(item, i) in projects" :key="i" :name="item.name" :id="item.ID" :date="item.createTime"  class="card" @rename="displayMedal(item.ID)" @del="displayDel(item.ID)"/>
        </div>
    </div>
    
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModalRef"
        :mask-closable="false"
        preset="dialog"
        title="重命名"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
      <n-form  :model="modelRef">
        <n-form-item label="项目名称" :rule="rule" :render-feedback="formatFeedback">
          <n-input v-model:value="modelRef.name" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>
    </n-modal>
    <n-modal
        v-model:show="delRef"
        :mask-closable="false"
        preset="dialog"
        title="确认要删除项目吗 ? "
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClickDel"
        @negative-click="onNegativeClickDel"
    >
    </n-modal>
  </n-config-provider>
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showModalAddRef"
        :mask-closable="false"
        preset="dialog"
        title="创建项目"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveAddClick"
        @negative-click="onNegativeAddClick"
    >
      <n-form ref="formAddRef" :model="modelAddRef">
        <n-form-item label="项目名称" :rule="ruleAdd" :render-feedback="formatFeedback">
          <n-input v-model:value="modelAddRef.name" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>
    </n-modal>
    <n-modal
        v-model:show="delRef"
        :mask-closable="false"
        preset="dialog"
        title="确认要删除项目吗 ? "
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClickDel"
        @negative-click="onNegativeClickDel"
    >
    </n-modal>
  </n-config-provider>
</template>
<!-- <script lang="ts">
export default {
    components: {
        PageCard,
    }
}
</script> -->
<script setup lang="ts">
import {
    Export
} from '@vicons/carbon'
import {
  Add28Regular
} from '@vicons/fluent'
// import { Icon } from '@vicons/utils'
import ProCard from "@/TeamManager/projectCard.vue"
import {Edit} from "@vicons/tabler"
import {Icon} from "@vicons/utils";
import {darkTheme} from "naive-ui";
import {defineComponent, h, onMounted, reactive, ref} from "vue";
import {useRoute} from 'vue-router'
import {Close} from "@vicons/ionicons5"
import {PlusOutlined} from "@vicons/antd";
import utils from '../Utils'
import axios from "axios";

let shortcuts=[
    {
        id: 0,
        name: '',
        img: null,
        date: '',
    },
]
let length=0
// function getList(){ //TODO 前后端对接：获取页面列表

//     shortcuts=[
//         {
//             id: 1,
//             name: 'home1',
//             img: null,
//             date: '2022/8/2',
//         },
//         {
//             id: 2,
//             name: '名字很长很长很长很长2',
//             img: null,
//             date: '2022/8/3',
//         },
//         {
//             id: 3,
//             name: 'home3',
//             img: null,
//             date: '2022/8/4',
//         },
//         {
//             id: 4,
//             name: 'home1',
//             img: null,
//             date: '2022/8/2',
//         },
//         {
//             id: 5,
//             name: '名字很长很长很长很长2',
//             img: null,
//             date: '2022/8/2',
//         },
//         {
//             id: 5,
//             name: 'home3',
//             img: null,
//             date: '2022/8/2',
//         },
//         {
//             id: 6,
//             name: 'home1',
//             img: null,
//             date: '2022/8/2',
//         },
//         {
//             id: 7,
//             name: '名字很长很长很长很长2',
//             img: null,
//             date: '2022/8/4',
//         },
//         {
//             id: 8,
//             name: 'home3',
//             img: null,
//             date: '2022/8/2',
//         },
//     ]

//     length=shortcuts.length
// }
// getList()

const router = useRoute();

const headers ={
   Authorization: utils.getCookie('Authorization')
}
const theme = darkTheme
let projects =ref( [

])


// 重命名表单
let showModalRef = ref(false)
const formRef = ref<FormData | null>(null)
const modelRef = ref({
  name: ""
})
const getList = () =>{
  console.log('head'+utils.getCookie('Authorization'))
    const url = '/program/list?'+'teamID='+router.query.teamID+'&page=0&size=10'
    axios.get(url,{headers:headers}).then(res=>{
      console.log(res.data)
      console.log(projects)
      projects.value=res.data.data.items
      
    })
}
onMounted(()=>{
  console.log("project get :"+router.query.teamID)
  console.log(router.query.teamID)
  //teamID.value=parseInt(router.query.teamID.toString())

  getList()
})
const ruleAdd = {
  required: true,
  validator() {
    if (modelAddRef.value.name.length === 0) {
      return new Error("新项目名不能为空!")
    } else {
      if (modelAddRef.value.name.length >= 8) {
        return new Error("新项目名长度不能大于8!")
      }
    }
  },
  trigger: ['input', 'blur']
}

// 操作dialog
// 重命名
const displayMedal = (ID) => {
  opID.value=ID
  showModalRef.value = true
}

const onNegativeClick = () => {
  modelRef.value.name = ""
  showModalRef.value = false
};

const onPositiveClick = () => {
  console.log("修改："+opID.value)
  if(modelRef.value.name.length===0){
    alert("项目名称不能为空～")
    return;
  }
  axios.put("/program",{
    "ID":opID.value,
    "src": "src",
    "name":modelRef.value.name
  },{headers:headers}).then(res=>{
    console.log(res.data)
    if(res.data.msg==="成功"){
      alert("修改成功")
      for(let i=0 ;i<projects.value.length;i++){
        if(projects.value[i].ID===opID.value)
        {
          projects.value[i].name=modelRef.value.name
          break;
        }
      }
    }
    else{
      alert("修改失败")
    }
  })
  showModalRef.value = false
}

// 删除项目
let delRef = ref(false)
let opID = ref()
const displayDel = (ID)=> {
  console.log(ID)
  opID.value  =ID
  delRef.value = true
}

const onNegativeClickDel = () => {
  delRef.value = false
};

const onPositiveClickDel = () => {
  let deleUrl = '/program/'+opID.value
  console.log(deleUrl)
  axios.delete(deleUrl,{headers:headers}).then(res=>{
    console.log(res.data)
    for(let i=0;i<projects.value.length;i++){
      if(projects.value[i].ID===opID.value){
        projects.value.splice(i,1)
      }
    }
    alert("删除成功！")
  })
  delRef.value = false
}

// 添加项目表单
let showModalAddRef = ref(false)
const formAddRef = ref<FormData | null>(null)
const modelAddRef = ref({
  name: ""
})
const formatFeedback = (raw: string | undefined) => {
  h('div', {style: 'color: green'}, [raw + '而且是绿的'])
}

const rule = {
  required: true,
  validator() {
    if (modelAddRef.value.name.length === 0) {
      return new Error("项目名不能为空!")
    } else {
      if (modelAddRef.value.name.length >= 8) {
        return new Error("项目名长度不能大于8!")
      }
    }
  },
  trigger: ['input', 'blur']
}

// 操作dialog
// 重命名
const displayAdd = () => {
  showModalAddRef.value = true
}

const onNegativeAddClick = () => {
  modelRef.value.name = ""
  showModalRef.value = false
};

const onPositiveAddClick = () => {
  if(modelAddRef.value.name.length===0)
  {
    alert("项目名称不能为空！")
    return
  }
  axios.post('/program',{
    'teamID':router.query.teamID,
    "src":"what the fuck photos",
    "name":modelAddRef.value.name
  },{headers:headers}).then(res=>{
    if(res.data.msg==="成功"){
      console.log("添加项目成功！")
      let t= new Date();
      let item = {
        "name": modelAddRef.value.name,
        "src": "nope",
        "createTime":t,
        "ID":res.data
      }
      projects.value.push(item)
      alert("添加成功！")
    }
    else{
      alert("添加失败！")
    }
  })
  showModalRef.value = false
}
</script>

<style scoped>
.main{
    width:fit-content;
    margin:39px 43px 0 61px;
}
.card {
    margin:0 10px 20px 0;
}
.prolist{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}
.discribe{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 29px;
    align-items: center;
    margin-bottom: 12px;

    display:flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;

    color: #414958;
}
.buttons{
    margin-right: 10px;
}
.newpage{
    margin-right: 10px;
}
</style>