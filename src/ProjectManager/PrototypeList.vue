<template>
  <div class="main">
    <div class="layout">
      <div class="discribe">
        管理你的{{ shortcuts.length }}个页面
        <div class="buttons">
          <n-breadcrumb>
            <n-breadcrumb-item>
              <n-button quaternary class="newpage" size="small" @click="getUrl">
                生成预览&nbsp;
              </n-button>
            </n-breadcrumb-item>
            <n-breadcrumb-item>
              <n-popselect v-model:value="nowCover" :options="CoverOptions" trigger="click">
                <n-button quaternary class="newpage" size="small">
                  设置封面
                </n-button>
              </n-popselect>
            </n-breadcrumb-item>
            <n-breadcrumb-item>
              <n-button quaternary class="newpage" size="small" @click="viewAddDocu">
                新建页面&nbsp;
                <Icon size="14">
                  <Add28Regular/>
                </Icon>
              </n-button>
            </n-breadcrumb-item>
          </n-breadcrumb>
        </div>
      </div>
      <div class="pagelist">
        <PageCard v-for="(item,ind) in shortcuts" :key="item.ID" :name="item.name" :img="item.src" class="card"
                  @delCard="delCard(ind)" @openCard="openCard(ind)"/>
      </div>
    </div>
  </div>


  <n-config-provider :theme="darkTheme">
    <n-modal
        v-model:show="showAdd"
        preset="dialog"
        title="新建布局"
        positive-text="确认"
        negative-text="取消"
        @positive-click="posAdd"
        @negative-click="negAdd"
    >
      <n-form ref="addFormRef" :model="addModelRef">
        <n-form-item label="布局名称" :rule="addRule">
          <n-input v-model:value="addModelRef.addName" @keydown.enter.prevent placeholder="请输入布局名称"/>
        </n-form-item>
        <n-form-item label="布局device">
          <n-input style="margin-right: 10px" v-model:value="addModelRef.device" @keydown.enter.prevent
                   placeholder="设备名" disabled="true"/>
          <n-dropdown
              trigger="click"
              placement="bottom-start"
              :options="devices"
              @select="handleSelect">
            <n-button>请选择设备</n-button>
          </n-dropdown>
        </n-form-item>
        <n-form-item label="布局模板">
          <n-input style="margin-right: 10px" v-model:value="addModelRef.template.name" @keydown.enter.prevent
                   placeholder="设备封面" disabled="true"/>
        </n-form-item>
        <n-space>
          <n-popover trigger="hover" v-for="(item, i) in templates" :key="i">
            <template #trigger>
              <n-button @click="addModelRef.template=item.value">{{ item.label }}</n-button>
            </template>
            <img :src="item.value.cover"/>
          </n-popover>
        </n-space>

      </n-form>

    </n-modal>

    <n-modal
        v-model:show="showDelModal"
        :mask-closable="false"
        preset="dialog"
        title="删除布局"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
    >
    </n-modal>
    <n-modal
        v-model:show="showGetUrl"
        :mask-closable="false"
        preset="dialog"
        title="项目预览链接"
        negative-text="关闭链接"
        positive-text="确认"
        @negative-click="onPositiveClickUrl"
        @positive-click="onNegativeClickUrl"
    >
      <n-form>
        <n-form-item label="该链接24h内有效">

          <n-input ref="inputInstRef" id="url" v-model:value="viewUrl" type="textarea" autosize @keydown.enter.prevent
                   placeholder="正在生成链接...">
            <template #suffix>
              <div class="copyButton">
                <Icon size="20" class="rename">
                  <Copy16Filled @click="copyUrl"/>
                </Icon>
              </div>
            </template>
          </n-input>
        </n-form-item>
      </n-form>
    </n-modal>
  </n-config-provider>
</template>
<script setup lang="ts">
import {
  Export
} from '@vicons/carbon'
import {
  Add28Regular
} from '@vicons/fluent'
import {Icon} from '@vicons/utils'
import PageCard from "@/ProjectManager/pageCard.vue"
import axios from "axios";
import utils from "@/Utils";
import {onMounted, ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router"
import {Copy16Filled} from '@vicons/fluent'
import {darkTheme, NIcon, useMessage, InputInst, DropdownOption} from "naive-ui";
import {MdCash} from '@vicons/ionicons4'

let proID = ref(0);
let page = ref(2);
let assis = ref(0)
const router = useRouter()
const message = useMessage()
const inputInstRef = ref<InputInst | null>(null);
let showGetUrl = ref(false)
let viewUrl = ref('')
const onNegativeClickUrl = () => {
  showGetUrl.value = false;
}
const nowCover = ref('')
let CoverOptions = ref([
  {
    label: '默认',
    value: ''
  }
])
const onPositiveClickUrl = () => {
  let url = '/layout/preview/disable?programID=' + proID.value;
  axios.post(url, {}, {headers: headers}).then(res => {
    console.log(res.data)
    if (res.data.msg === '成功') {
      message.success("关闭预览成功")
      showGetUrl.value = false;
    } else {
      message.info(res.data.msg)
    }
  })
}
const copyUrl = () => {
  const input = document.getElementById('url')! as any
  inputInstRef.value?.select()
  document.execCommand('copy')
  message.success("复制成功")
}

//TODO:更换封面
const setCover = () => {
  axios.put('/program', {
    'ID': proID.value,
    'src': nowCover.value,
    'name': utils.getCookie('proNAME')
  }, {headers: headers}).then(res => {
    console.log(res.data)
    if (res.data.msg === "成功") {
      message.success("封面更换成功")
    } else {
      message.info(res.data.msg)
    }
  })
}
//原型项目

let shortcuts = ref([]);
let imgSrc = ref('')
const headers = {
  Authorization: utils.getCookie('Authorization')
}

watch(nowCover, (newCover, oldCover) => {
  console.log(assis.value)
  if (assis.value > 1)
    setCover()
  assis.value++;
}, {immediate: true, deep: true})

const getUrl = () => {
  let base = 'http://127.0.0.1:8080/preview?viewUrl='
  let url = '/layout/preview?programID=' + proID.value;
  axios.post(url, {}, {headers: headers}).then(res => {
    if (res.data.msg === "成功") {
      console.log(res.data)
      viewUrl.value = base + res.data.data
      message.success("链接获取成功")
      showGetUrl.value = true;
    }
  })
}
const getList = () => { //TODO 前后端对接：获取页面列表

  axios.get('/layout/list', {
        headers: headers,
        params:
            {
              programID: proID.value, // proID.value,
            }
      }
  ).then(res => {
    if (res.data.msg === '成功') {

      console.log("获取布局列表成功");

      shortcuts.value = res.data.data.items;


      for (let i = 0; i < shortcuts.value.length; i++) {
        let label = shortcuts.value[i].name
        let value = shortcuts.value[i].src
        if (value != '')
          CoverOptions.value.push({label: label, value: value})
      }

      nowCover.value = imgSrc.value
      console.log("now:" + nowCover.value)
      console.log("assis" + assis.value)
      console.log(shortcuts.value);
    }
  })
}
const route = useRoute()
//删除布局
const delID = ref(0)
const theme = darkTheme
// 删除区域
const showDelModal = ref(false)

const delCard = (item) => {
  console.log(shortcuts.value[item].ID)
  delID.value = shortcuts.value[item].ID
  showDelModal.value = true
}

const onNegativeClick = () => {
  showDelModal.value = false
}

// 点击确定后刷新列表
const onPositiveClick = () => {
  let urldel = "/layout/" + delID.value;
  console.log("/layout/" + delID.value);
  axios.delete(urldel, {headers: headers}
  ).then(res => {
    if (res.data.msg === '成功') {
      console.log("删除布局成功");
      getList()
    }
  })
  showDelModal.value = false

}

const devices = [
  {
    label: 'Phone',
    key: 'Phone',
    children: [
      {
        label: 'iPhone 13 Pro Max',
        key: 'iPhone 13 Pro Max',
        width: 428,
        height: 926
      },
      {
        label: 'iPhone 13 / 13 Pro',
        key: 'iPhone 13 / 13 Pro',
        width: 390,
        height: 390
      },
      {
        label: 'iPhone 13 mini',
        key: 'iPhone 13 mini',
        width: 375,
        height: 812
      },
      {
        label: 'iPhone 11 Pro Max',
        key: 'iPhone 11 Pro Max',
        width: 414,
        height: 896
      },
      {
        label: 'iPhone 11 Pro / X',
        key: 'iPhone 11 Pro / X',
        width: 375,
        height: 812
      },
      {
        label: 'iPhone SE',
        key: 'iPhone SE',
        width: 320,
        height: 568
      },
      {
        label: 'iPhone 8 Plus',
        key: 'iPhone 8 Plus',
        width: 414,
        height: 736
      },
      {
        label: 'iPhone 8',
        key: 'iPhone 8',
        width: 375,
        height: 667
      },
      {
        label: 'Android small',
        key: 'Android small',
        width: 360,
        height: 640
      },
      {
        label: 'Android large',
        key: 'Android large',
        width: 360,
        height: 800
      },
    ]
  },
  {
    label: 'Tablet',
    key: 'Tablet',
    children: [
      {
        label: 'Surface Pro 8',
        key: 'Surface Pro 8',
        width: 1440,
        height: 960
      },
      {
        label: 'iPad mini 8.3',
        key: 'iPad mini 8.3',
        width: 774,
        height: 1133
      },
      {
        label: "iPad Pro 11''",
        key: "iPad Pro 11''",
        width: 834,
        height: 1194
      },
      {
        label: "iPad Pro 12.9''",
        key: "iPad Pro 12.9''",
        width: 1024,
        height: 1366
      },
    ]
  },
  {
    label: 'Desktop',
    key: 'Desktop',
    children: [
      {
        label: "Mac Pro 14''",
        key: "Mac Pro 14''",
        width: 1512,
        height: 982
      },
      {
        label: "Mac Pro 16''",
        key: "Mac Pro 16''",
        width: 1728,
        height: 1117
      },
      {
        label: "Desktop",
        key: "Desktop",
        width: 1440,
        height: 1024
      },
      {
        label: "iMac",
        key: "iMac",
        width: 1280,
        height: 720
      },
    ]
  },
  {
    label: 'Presentation',
    key: 'Presentation',
    children: [
      {
        label: "Slide 16:9",
        key: "Slide 16:9",
        width: 1920,
        height: 1080
      },
      {
        label: "Slide 4:3",
        key: "Slide 4:3",
        width: 1024,
        height: 768
      },
    ]
  },
  {
    label: 'Paper',
    key: 'Paper',
    children: [
      {
        label: "A4",
        key: "A4",
        width: 595,
        height: 842
      },
      {
        label: "A5",
        key: "A5",
        width: 420,
        height: 595
      },
      {
        label: "Letter",
        key: "Letter",
        width: 612,
        height: 792
      },
      {
        label: "Tabloid",
        key: "Tabloid",
        width: 792,
        height: 1224
      },
    ]
  },
]
const templates = ref([])
// 添加布局
type elementParams = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  borderWidth: number;
  borderRadius: string;
  type: string;
  color: string;
  borderColor: string;
  src: string;
  text: string;
  fontSize: number;
}
type Model = {
  name: string;
  elements: elementParams[]
  srcs: string[]
  cover: string
};
const showAdd = ref(false);
const addFormRef = ref<FormData | null>(null)
const addModelRef = ref(
    {
      addName: "",
      addWidth: '',
      addHeight: '',
      device: '',
      template: {} as Model
    }
)
const handleSelect = (key: string | number, option: DropdownOption) => {
  addModelRef.value.device = key;
  addModelRef.value.addWidth = option.width;
  addModelRef.value.addHeight = option.height;
  console.log(addModelRef.value)
}
const handleSelect2 = (key: string | number, option: DropdownOption) => {
  addModelRef.value.template = option.value;

  console.log(option)
}
const viewAddDocu = () => {
  showAdd.value = true;
}

const posAdd = () => {
  console.log("确定添加布局");
  //成功添加文档
  if (addModelRef.value.addName === '') {
    message.warning("文档名不可为空！")
    return;
  }

  axios.post('/layout',
      {
        'name': addModelRef.value.addName,
        'src': null,
        'width': addModelRef.value.addWidth,
        'height': addModelRef.value.addHeight,
        'programID': proID.value,
      }, {headers: headers}
  ).then(res => {
    if (res.data.msg === '成功') {
      console.log(addModelRef.value.addName);
      console.log(res);
      console.log("创建布局成功");
      //刷新 获取文档列表
      getList();
      //documents.value.push(newdoc);

      router.push({
        path: "/layout",
        query: {
          teamID: route.query.teamID,
          layoutId: res.data.data,
          layoutName: addModelRef.value.addName,
          canvasWidth: addModelRef.value.addWidth,
          canvasHeight: addModelRef.value.addHeight,
          modelName: addModelRef.value.template.name
        }
      })

    }
  })

  showAdd.value = false
}

const negAdd = () => {
  addModelRef.value.addName = "";
  showAdd.value = false;
};

const r = /^\+?[1-9][0-9]*$/;

const addRule = {
  required: true,
  validator() {
    if (addModelRef.value.addName.length === 0) {
      return new Error("布局名称不可为空")
    } else {
      if (addModelRef.value.addName.length >= 12) {
        return new Error("布局名称长度不能大于8")
      }
    }
  },
  trigger: ['input', 'blur']
}

const widthRule = {
  required: true,
  validator() {
    if (!r.test(addModelRef.value.addWidth)) {
      return new Error("布局宽度必须为正整数")
    }
  },
  trigger: ['input', 'blur']
}

const heightRule = {
  required: true,
  validator() {
    if (!r.test(addModelRef.value.addHeight)) {
      return new Error("布局高度必须为正整数")
    }
  },
  trigger: ['input', 'blur']
}

let openID = ref(0); //要打开的布局ID

const openCard = (indx) => {
  openID.value = shortcuts.value[indx].ID  //已成功获取要打开的布局ID

  router.push({
    path: "/layout",
    query: {
      teamID: route.query.teamID,
      layoutId: openID.value,
      layoutName: shortcuts.value[indx].name,
      canvasWidth: shortcuts.value[indx].width,
      canvasHeight: shortcuts.value[indx].height,
    }
  })

}

//to do for zf 导出布局
const exportLayout = () => {

}

onMounted(() => {
  proID.value = parseInt(utils.getCookie('proID'));
  imgSrc.value = utils.getCookie('proIMG');
  console.log("成功获取项目ID:" + proID.value);
  getList();

  axios.get(
      '/layout/module/list',
      {headers: headers}
  ).then(res => {
    if (res.data.msg == '成功') {
      const array = res.data.data
      for (let i = 0; i < array.length; i++) {
        templates.value.push(
            {
              label: array[i].name,
              value: JSON.parse(array[i].content)
            }
        )
      }
    }
  })
})
</script>

<style scoped>
.newpage {
  padding-left: 0px;
  padding-right: 0px;
}

.copyButton:hover {
  cursor: pointer;
}

.main {
  width: 100%;
  /*margin:39px 43px 0 61px;*/
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

.buttons {
  margin-right: 10px;
}

.layout {
  margin: 20px 50px 0 60px;
}
</style>