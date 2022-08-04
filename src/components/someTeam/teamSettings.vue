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
import {onMounted, ref} from 'vue'
import {darkTheme} from 'naive-ui'
import axios from "axios";
import {useRouter, useRoute} from "vue-router";

const theme = darkTheme
const router = useRouter()
const route = useRoute()
const model = ref({
  inputValue: '',
  textareaValue: '',
  switchValue: false
})
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

}
const getTeamInfo = () => {
  const teamID = route.params.teamID
  axios.get('/team/' + {teamID} + '/info').then(res => {
    model.value.inputValue = res.data.name
    model.value.textareaValue = res.data.introduction
  })
}
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