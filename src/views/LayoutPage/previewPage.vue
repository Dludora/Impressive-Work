<template>
  <div class="board">
    <div class="img" id="img" v-if="!empty"></div>
    <div class="ui pageBoardBox" id="pageBoardBox" v-if="!empty">
      <n-scrollbar
        style="
          width: 279px;
          height: 100%;
          transform: translate(-100%, 0);
          position: absolute;
        "
        id="pageScrollBar"
      >
        <div class="pageBoard" id="pageBoard">
          <div
            v-for="(value, index) in pageImgs"
            :class="
              value.id != layoutId ? pageImageClass : pageImageSelectedClass
            "
            :key="index"
            :style="{ backgroundImage: 'url(' + value.src + ')' }"
            @click="switchPage(value.id)"
          ></div>
        </div>
      </n-scrollbar>

      <div
        class="ui elementRightUnit elementBrowser pageBrowser"
        @click="displayPageBoard"
        id="pageBrowser"
      >
        <n-icon size="18" color="#A7AFBE" class="elementArrow" v-show="pageOn">
          <arrow-back-ios-round />
        </n-icon>
        <n-icon size="18" color="#A7AFBE" class="elementArrow" v-show="!pageOn">
          <arrow-forward-ios-round />
        </n-icon>
      </div>
    </div>
    <div v-if="empty"></div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios"
import gsap from "gsap"
import { ref, reactive, onMounted } from "vue";
import {useRoute} from "vue-router"
import utils from "@/Utils";

const route = useRoute();

const headers = {
  Authorization: utils.getCookie("Authorization"),
};

type Page = {
  name: string,
  src: string,
  width: number,
  height: number,
}

let proCode:string = "";
const pageList = reactive<Page[]>([])

const pageOn = ref<boolean>(false)
const empty = ref<boolean>(true);

const screenW = document.body.clientWidth;
const screenH = document.body.clientHeight;
const ratiohw = screenH/screenW;

const initPageImgs = () => {
  axios
    .get("/layout/preview/code/"+proCode, {
      headers: headers,
    })
    .then((res) => {
      if (res.data.msg == "成功") {
        console.log(res.data);

        for (var i = 0; i < res.data.data.items.length; ++i) {
          pageList[i]={
            name: res.data.data.items[i].name,
            src: res.data.data.items[i].src,
            width: res.data.data.items[i].width,
            height: res.data.data.items[i].height,
          };
        }
        if(pageList.length<=0)
        {
          empty.value = true;
        }
        else{
          empty.value = false;
          switchPage(0);
        }
      }
    });
};

const switchPage = (id: number) => {
  var page = pageList[id];
  var calcH = page.width * ratiohw;
  var element = document.getElementById("img");
  if(calcH>=screenH)
  {
    element.style.width = screenH*(pageList[id].width/pageList[id].height)+"px";
    element.style.height = screenH + "px";
  }
  else
  {
    element.style.width = screenW +"px";
    element.style.height = screenW*(pageList[id].height/pageList[id].width) + "px";
  }
  element.style.backgroundImage="url("+page.src+")";
};

const displayPageBoard = () => {
  if (pageOn.value) {
    gsap.to("#pageScrollBar", {
      duration: 0.2,
      translateX: "-100%",
    });
    gsap.to("#pageBrowser", {
      duration: 0.2,
      translateX: "0px",
    });
    pageOn.value = false;
  } else {
    gsap.to("#pageScrollBar", {
      duration: 0.2,
      translateX: "0%",
    });
    gsap.to("#pageBrowser", {
      duration: 0.2,
      translateX: "279px",
    });
    pageOn.value = true;
  }
};

onMounted(()=>{
  proCode = route.query.proCode as string;
  initPageImgs();
})
</script>

<style scoped>
.board{
  background-color: black;
}
.img{
  position:absolute;
  left:50%;
  transform: -50%;
  background-size: cover;
}
.pageBoardBox {
  position: absolute;
  height: 100%;
}
.pageBoard {
  position: absolute;
  display: inline-block;
  background-color: #2b303b;
  opacity: 70%;
  border-width: 0px;
  border-style: solid;
  border-right-width: 3px;
  border-color: #151515;
  left: 0px;
  top: 0px;
  bottom: 0px;
  /* transform: translate(-100%, 0); */
  text-align: left;
  padding: 15px;
}
.pageImage {
  width: 240px;
  height: 140px;
  border-style: solid;
  border-width: 3px;
  margin-bottom: 25px;
  background-size: cover;
}
.pageImageSelected {
  width: 240px;
  height: 140px;
  border-style: solid;
  border-color: red;
  border-width: 3px;
  margin-bottom: 25px;
  background-size: cover;
}
</style>