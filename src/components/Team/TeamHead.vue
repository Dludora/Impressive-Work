<template>
    <div class="Team">
        <div class="avator">
            {{teamData.name[0]}}
        </div>
        <div class="name">
            <h2>{{teamData.name}}</h2>
            <span>{{teamData.introduction}}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'
let teamData = ref({
    ID:null,
    name:'Team',
    src:'',
    introduction:'Brief introduction~'
})
</script>
<style scoped>
.Team {
  height: 70px;
  position: relative;
  /*line-height: 70px;*/
}
.avator{
  width: 66px;
  height: 64px;
  background: rgba(228, 27, 77, 1);
  border-radius: 5px;
  font-size: 48px;
  color: whitesmoke;
  text-align: center;
  line-height: 64px;
  display: inline-block;
}
.name span{
    color:  rgba(65, 73, 88, 1);
}
.name {
  height: 100%;
  display: inline-block;
  color: white;
  vertical-align: top;
  margin-left: 20px;
  margin-top: 5px;
}
.name h2{
    vertical-align: top;
}
</style>