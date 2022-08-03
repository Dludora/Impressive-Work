<template>
  <div class="out">
    <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
    :size="size"
    :style="{
      maxWidth: '640px'
    }"
  >
    <n-form-item label-style="color:white;" label="团队名称" path="inputValue">
      <n-input style="backgroud:green;" v-model:value="model.inputValue" placeholder="Input" />
    </n-form-item>
    <n-form-item label-style="color:white;" label="团队简介" path="textareaValue">
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
    <n-form-item label-style="color:white;" label="锁定加入" path="switchValue">
      <n-switch v-model:value="model.switchValue" />
    </n-form-item>
    </n-form>
    <n-button style="margin-left:200px" size="large" type="primary">
      保存修改
    </n-button>
    <n-button style="margin-left:50px" size="large" type="tertiary">
      取消修改
    </n-button>
  </div>
</template>

<script setup tang="ts">
import {ref} from 'vue'

const model = ref({
  inputValue:'',
  textareaValue:'',
  switchValue:false
})

</script>

<style scoped>
.out{
  margin-top: 30px;
  margin-left: 50px;
}

</style>