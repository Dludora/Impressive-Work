<template>
  <div class="docu-item" draggable="true">
    <div class="docu-cover">
    </div>
    <div class="docu-title">
      <p @click="openDocu" style="cursor: pointer;width: 80px;position: relative;display: flex">
        {{ title }}</p>
      <n-space justify="end" style="gap: 0; flex-wrap: nowrap;">
        <Icon id="edi" size="24" @click="viewEdiDocu">
          <Edit/>
        </Icon>
        <Icon id="del" size="24" @click="viewDelDocu">
          <Delete48Regular/>
        </Icon>
      </n-space>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import {Edit} from "@vicons/tabler";
import {Delete48Regular} from "@vicons/fluent";
import {Icon} from "@vicons/utils";
import {darkTheme, NIcon, useMessage} from "naive-ui";
import {onMounted, ref, defineComponent} from "vue";
import utils from "@/Utils";
import router from "@/router";

export default defineComponent({
  name: 'docCard',
  props: {
    ID: String,
    title: String
  },
  components: {
    Delete48Regular,
    Edit,
    Icon
  },
  setup(props, {emit}) {
    const headers = {
      Authorization: utils.getCookie('Authorization')
    }
    const openDocu = () => {
      let urlOP = "/document/" + props.ID;
      axios.get(urlOP, {headers: headers}
      ).then(res => {
        if (res.data.msg === '成功') {

          console.log("获取文档内容成功");

          let opContent = res.data.data.content;
          let opTitle = res.data.data.title;

          utils.setCookie('editDocID', props.ID);
          utils.setCookie('DocTitle', opTitle);
          utils.setCookie('DocContent', opContent);

          router.push("/docuEdit");
        } else {
          console.log(res)
        }
      })
    }
    const viewEdiDocu = () => {
      emit('edit')
    }
    const viewDelDocu = () => {
      emit('del')
    }
    return {
      openDocu,
      viewEdiDocu,
      viewDelDocu,
    }
  }
})

</script>

<style scoped>

.docu-item {
  height: 200px;
  width: 140px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.docu-cover {
  width: 100px;
  border-radius: 0 5px;
  height: 170px;
  display: flex;
  background: #E2E4E9;
  border-right: 8px solid #414958;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}

.docu-cover:hover {
  background-color: #FFFFFF;
}

.docu-title {
  min-width: border-box;

  width: 100px;
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
</style>