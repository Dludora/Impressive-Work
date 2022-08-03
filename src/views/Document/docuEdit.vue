<template>
  <n-config-provider :theme="theme">
    <div>
      <n-space class="head-bg" justify="space-between">

          <n-button text style="position: relative; font-size: 30px;display: inline;top: 4px">
            <n-icon>
              <exitIcon />
            </n-icon>
          </n-button>

        <h style="position: inherit; top: 0; left: 0; bottom: 0; right: 0;color: #FFFFFF; display: inline">
          {{teamDocument.title}}
        </h>
        <n-space justify="end">
          <n-button text style="position: relative;font-size: 25px;display: inline;top:4px">
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
            <vDitor style=""></vDitor>
          </n-layout-content>
        </n-layout>

      </n-space>

    </div>
  </n-config-provider>
</template>

<script lang="ts">

import { ArrowBack as exitIcon } from '@vicons/ionicons5';
import {SaveOutline as saveIcon} from '@vicons/ionicons5';
import {defineComponent} from "vue";
import {darkTheme} from "naive-ui";
import vDitor from "../../components/Document/vDitor.vue";

export default({
  components: {
    exitIcon,
    saveIcon,
    vDitor,
  },

  data(){
    return {
      teamDocument:{
            content:"测试：文档内容",
            title:"测试：文档标题",
      },
    }
  },

  setup () {
    return {
      theme: darkTheme,
    }
  }
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