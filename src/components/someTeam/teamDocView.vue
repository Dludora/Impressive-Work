<template>
  <n-layout style="height: 100%">
    <n-layout-header>返回键位</n-layout-header>
    <n-layout has-sider>
      <n-layout-sider content-style="padding: 24px;">
        树
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">
        <tip-tap />
      </n-layout-content>
    </n-layout>
    <n-layout-footer>成府路</n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import tipTap from '../tipTap/tipTap.vue'
import { defineComponent, h, Component, ref, onMounted} from 'vue'
import {repeat} from 'seemly'
import { NIcon } from 'naive-ui'
import type { TreeOption } from 'naive-ui'
import TipTap from "@/components/tipTap/tipTap.vue";

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = ref([] as [])


// const createData = (level, baseKey) => {
//   if (!level) return undefined
//   return repeat(6 - level, undefined).map((_, index) => {
//     const key = '' + baseKey + level + index
//     return {
//       whateverLabel: createLabel(level),
//       whateverKey: key,
//       whateverChildren: createData(level - 1, key)
//     }
//   })
// }

const getMenus = () => {
  // 获取项目文件夹

}

onMounted(() => {

})
</script>

<style scoped>

</style>