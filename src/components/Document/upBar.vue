<template>
  <div class="up">
    <div class="pro-name">
      {{programname}}
    </div>
    <div class="pro-des">
      来自团队: {{teamname}} 的项目
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import utils from "@/Utils";
import axios from "axios";

  let proid=ref(0);

  let programname=ref<String>('');
  let teamname=ref<String>('');
  let teamID=ref('');

const headers = {
  Authorization: utils.getCookie('Authorization')
}

  onMounted(()=>{
    proid.value = parseInt(utils.getCookie('proID'));
    programname.value=utils.getCookie('proNAME');
    teamID.value=utils.getCookie('proTeam');

    let getTeamURL = '/team/' + teamID.value +'/info';


    axios.get(getTeamURL,{headers:headers,}
    ).then(res=>{
      if(res.data.msg==='成功'){

        console.log("获取团队信息成功");

        teamname.value = res.data.data.name;

        console.log(teamname.value);
      }
    })
  })


</script>

<style scoped>
.up{
  position: relative;
  /*height: 100%;*/
  top: 0px;

  /*background: #666f83;*/
}

.pro-name{
  position: relative;
  /*height: 22px;*/
  top: 0px;

  display: inline-block;

  vertical-align: center;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;

  color: #FFFFFF;

  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.pro-des{
  position: relative;
  /*height: 24px;*/
  top: 6px;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: flex-end;

  color: #414958;
}
</style>