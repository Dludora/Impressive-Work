<template>
  <div class="main">
    <div class="discribe">
      管理你的{{ shortcuts.length }}个页面
      <div class="buttons">
        <n-button class="newpage" size="tiny">
          新 建 页 面&nbsp;
          <Icon size="14">
            <Add28Regular/>
          </Icon>
        </n-button>
        <n-button size="tiny">
          导 出 页 面&nbsp;
          <Icon size="14">
            <Export/>
          </Icon>
        </n-button>
      </div>
    </div>
    <div class="pagelist">
      <PageCard v-for="item in shortcuts" :key="item.ID" :name="item.name" :img="item.img" class="card"
                @delCard="showDelModal=true;delID=item.ID"/>
    </div>
  </div>
  <n-config-provider :theme="theme">
    <n-modal
        v-model:show="showDelModal"
        :mask-closable="false"
        preset="dialog"
        title="删除项目"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
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
import {Icon} from '@vicons/utils'
import {darkTheme} from "naive-ui"
import PageCard from "@/ProjectManager/pageCard.vue"
import axios from "axios";
import {ref} from "vue";


let shortcuts = ref([])
let length = 0

function getList() { //TODO 前后端对接：获取页面列表
  shortcuts.value = [
    {
      name: 'home1',
      img: null,
      ID: 1
    },
    {
      name: '名字很长很长很长很长2',
      img: null,
      ID: 2

    },
    {
      name: 'home3',
      img: null,
      ID: 3

    },
    {
      name: 'home1',
      img: null,
      ID: 4

    },
    {
      name: '名字很长很长很长很长2',
      img: null,
      ID: 5

    },
    {
      name: 'home3',
      img: null,
      ID: 6

    },
    {
      name: 'home1',
      img: null,
      ID: 7

    },
    {
      name: '名字很长很长很长很长2',
      img: null,
      ID: 8

    },
    {
      name: 'home3',
      img: null,
      ID: 9

    },
  ]

}


const delID = ref(0)
const theme = darkTheme
// 删除区域
const showDelModal = ref(false)
const onNegativeClick = () => {
  showDelModal.value = false
}

// 点击确定后刷新列表
const onPositiveClick = () => {
  showDelModal.value = false
  axios.delete('/layout/' + delID.value).then(res => {
    getList()
  })
}

getList()
</script>

<style scoped>
.main {
  width: fit-content;
  margin: 39px 43px 0 61px;
}

.card {
  margin: 0 10px 20px 0;
}

.pagelist {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.discribe {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 29px;
  align-items: center;
  margin-bottom: 12px;

  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  color: #414958;
}

.buttons {
  margin-right: 10px;
}

.newpage {
  margin-right: 10px;
}
</style>