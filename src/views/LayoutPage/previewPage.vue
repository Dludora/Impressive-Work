<template>
  <div>
    <div class="ui pageBoardBox" id="pageBoardBox">
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
  </div>
</template>

<script setup lang="ts">
import axios from "axios"
import gsap from "gsap"
import { ref, reactive, onMounted } from "vue";
import utils from "@/Utils";

const headers = {
  Authorization: utils.getCookie("Authorization"),
};

const initPageImgs = () => {
  axios
    .get("/layout/list", {
      headers: headers,
      params: {
        programID: parseInt(utils.getCookie("proID")), // proID.value,
      },
    })
    .then((res) => {
      if (res.data.msg === "成功") {
        console.log(res.data);

        for (var i = 0; i < res.data.data.items.length; ++i) {
          pageImgs[i]={
            id: res.data.data.items[i].ID,
            name: res.data.data.items[i].name,
            src: res.data.data.items[i].src,
          };
        }
      }
    });
};

const 
</script>
