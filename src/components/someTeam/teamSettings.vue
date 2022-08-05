<template>
  <div class="out">
    <n-config-provider :theme="theme">
      <n-form
          ref="formRef"
          :model="model"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          :style="{
      maxWidth: '640px'
    }"
      >
        <n-form-item label="团队名称" path="inputValue" :rule="ruleName">
          <n-input style="backgroud:green;" v-model:value="model.inputValue" placeholder="Input"/>
        </n-form-item>
        <n-form-item label="团队简介" path="textareaValue">
          <n-input
              v-model:value="model.textareaValue"
              placeholder="Textarea"
              type="textarea"
              :autosize="{
          minRows: 3,
          maxRows: 5
        }"
          />
        </n-form-item>
        <n-form-item label="锁定加入" path="switchValue">
          <n-switch v-model:value="model.switchValue"/>
        </n-form-item>
      </n-form>
      <n-button @click="change" style="margin-left:200px" size="large" type="primary">
        保存修改
      </n-button>
      <n-button style="margin-left:50px" size="large" type="tertiary">
        取消修改
      </n-button>
    </n-config-provider>

  </div>
</template>

<script setup tang="ts">
import {onMounted, ref,watch,computed} from 'vue'
import {darkTheme,useMessage} from 'naive-ui'
import axios from "axios";
import {useRouter, useRoute} from "vue-router";
import utils from '../../Utils'
const theme = darkTheme
const router = useRouter()
const route = useRoute()
const message = useMessage()
const model = ref({
  inputValue: '',
  textareaValue: '',
  switchValue: false
})
const headers = {
  Authorization: utils.getCookie('Authorization')
}
const ruleName = {
  required: true,
  validator() {
    if (model.value.inputValue.length === 0) {
      return new Error("新团队名不能为空!")
    } else {
      if (model.value.inputValue.length >= 8) {
        return new Error("新团队名长度不能大于8!")
      }
    }
  },
  trigger: ['input', 'blur']
}
const change=()=>{
    axios.put('/team',{
      "ID": route.query.teamID,
      "name": model.value.inputValue,
      "src":"",
      "introduction":model.value.textareaValue
    },{headers:headers}).then(res=>{
      console.log(res.data)
      if(res.data.msg==="成功")
      {
        message.info("修改成功!")
        // router.go(0)

      }
      else{
        message.info(res.data.msg)
      }
    })
}
const getTeamInfo = () => {
  console.log(route.query.teamID)
  axios.get('/team/' + route.query.teamID+ '/info',{headers:headers}).then(res => {
    console.log(res.data)
    model.value.inputValue = res.data.data.name
    model.value.textareaValue = res.data.data.introduction
  })
}
const getGlobal = computed(()=>{
  return route.query.teamID
})
watch(getGlobal, (newVal,oldVal)=>{
  console.log("value change"+newVal)
  getTeamInfo();
},{immediate:true,deep:true})
onMounted(() => {
  getTeamInfo()
})
</script>

<style scoped>
.out {
  margin-top: 30px;
  margin-left: 50px;
}

</style>