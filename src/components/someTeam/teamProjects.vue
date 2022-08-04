<template>
  <div class="team-projects">
    <n-grid cols="2 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen" :x-gap="12" :y-gap="12">
      <n-grid-item v-for="project in projects" :key="project">
        <div class="project-item">
          <div class="pic"></div>
          <div class="info">
            <p id="team">
              {{ project.name }}
              <Icon id="edit" size="20">
                <Edit @click="displayMedal"/>
              </Icon>
              <Icon id="del" size="25">
                <Close @click="displayDel"/>
              </Icon>
            </p>
            <p id="time">创建于 {{ project.createTime }}</p>
          </div>
        </div>
      </n-grid-item>
      <n-grid-item>
        <div class="addProject" @click="displayAdd">
          <Icon><PlusOutlined id="add"/></Icon>
        </div>
      </n-grid-item>
    </n-grid>
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
      <n-form ref="formRef" :model="modelRef">
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

<script setup lang="ts">
import {Edit} from "@vicons/tabler"
import {Icon} from "@vicons/utils";
import {darkTheme} from "naive-ui";
import {defineComponent, h, onMounted, reactive, ref} from "vue";
import {useRoute} from 'vue-router'
import {Close} from "@vicons/ionicons5"
import {PlusOutlined} from "@vicons/antd";
import utils from '../../Utils'
import axios from "axios";
const router = useRoute();
let teamID = ref();
const headers ={
   Authorization: utils.getCookie('Authorization')
}
const theme = darkTheme
let projects =ref( [

])

//const headers = 
// 重命名表单
let showModalRef = ref(false)
const formRef = ref<FormData | null>(null)
const modelRef = ref({
  name: ""
})
const getList = () =>{
  console.log('head'+utils.getCookie('Authorization'))
    const url = '/program/list?'+'teamID='+teamID.value+'&page=0&size=10'
    axios.get(url,{headers:headers}).then(res=>{
      console.log(res.data)
      console.log(projects)
      projects.value=res.data.data.items
      
    })
}
onMounted(()=>{
  console.log("project get :"+router.query.teamID1)
  console.log(router.query.teamID1)
  teamID.value=parseInt(router.query.teamID1.toString())
  console.log("teamID:"+teamID.value)
  getList()
})
const ruleAdd = {
  required: true,
  validator() {
    if (modelRef.value.name.length === 0) {
      return new Error("新项目名不能为空!")
    } else {
      if (modelRef.value.name.length >= 8) {
        return new Error("新项目名长度不能大于8!")
      }
    }
  },
  trigger: ['input', 'blur']
}

// 操作dialog
// 重命名
const displayMedal = () => {
  showModalRef.value = true
}

const onNegativeClick = () => {
  modelRef.value.name = ""
  showModalRef.value = false
};

const onPositiveClick = () => {
  showModalRef.value = false
}

// 删除项目
let delRef = ref(false)
const displayDel = () => {
  delRef.value = true
}

const onNegativeClickDel = () => {
  delRef.value = false
};

const onPositiveClickDel = () => {
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
  axios.post('/program',{
    'teamID':teamID.value,
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
.team-projects {
  padding: 12px 36px;
}

.project-item {
  height: 240px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  background: #16181D;
}

.pic {
  width: 100%;
  height: 166px;
  background-color: #414958;
}

.info {
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-top: #0f4eee 1px;
  height: 54px;
  padding: 10px 8px;
  background-color: #2B303B;
}

.info:hover {
  background-color: #414958;
}

.info:hover #del, .info:hover #edit {
  display: inline-block;
}

p {
  position: relative;
  margin-top: 0;
  margin-bottom: 5px;
  margin-left: 5px;
}

#team {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: flex-end;

  color: #E2E4E9;
}

#time {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: flex-end;

  color: #A7AFBE;
}

#del, #edit {
  display: none;
  cursor: pointer;
}

#edit {
  margin-bottom: 5px;
}

#del {
  position: absolute;
  top: calc(50% - 30px / 2);
  left: calc(100% - 50px / 2);
}

.addProject {
  height: 240px;
  border: 3px solid #2B303B;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25));
  border-radius: 5px;
  position: relative;
}

#add {
  position: absolute;
  top: calc(50% - 200px / 2);
  left: calc(50% - 200px / 2);
  width: 200px;
  height: 200px;
}

.addProject:hover {
  cursor: pointer;
  color: #A7AFBE;
  border: 3px solid #A7AFBE;

}
</style>