<template>
  <div class="nav">
    <div class="logo">This is a logo</div>
    <div class="user-info">
      <div class="avatar">
        <n-avatar class="pic">
          {{ nickname[0] }}
        </n-avatar>
      </div>
      <div class="user">
        <p>{{ nickname }}</p>
        <p style="color:rgba(167, 175, 190, 1);font-size:small;">{{ email }}</p>
      </div>
    </div>
    <div class="teams">
      <div class="teamsHead">
          团队和项目
        </div>
      <div :key="item.id" v-for="(item) in teams" class="team">
        <router-link to="#">
          <div class="pack">
            <div class="src"></div>
            <div class="TeamName">
              {{ item.name }}
            </div>
          </div>
        </router-link>

      </div>
      <div class="addTeam">
        <div class="addImg">
          <img src="@/assets/plus.png"/>
        </div>
        <div class="word">
          新建团队
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.nav {
  background-color: rgba(43, 48, 59, 1);
  padding-top: 20px;
  padding-left: 20px;
}

.logo {
  width: 200px;
  height: 56px;
  background-color: rgba(217, 217, 217, 1);
  text-align: center;
  line-height: 56px;
}

.user-info {
  display: flex;
  width: 100%;
  height: 70px;
  margin-top: 30px;
}

.avatar {
  width: 70px;
  height: 70px;
}

.pic {
  width: 56px;
  height: 56px;
  text-align: center;
  line-height: 56px;
  border-radius: 50%;
  background: skyblue;
  margin: 7px;
}

.user {
  margin-top: 5px;
  margin-left: 8px;
  height: 65px;
  color: rgba(255, 255, 255, 1);
  font-size: larger;
}

.user p {
  margin-top: 5px;
}

.teams {
  margin-top: 30px;
  font-size: large;
  font-weight: 500;
  color: #E2E4E9;
}

.teamsHead {
  font-family: 黑体;
}

.src {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  background-color: bisque;
  vertical-align: middle;
  display: inline-block;
  margin-top: 12px;
  margin-bottom: 12px;
}

.team {
  margin-left: -20px;
}

.TeamName {
  margin-left: 24px;
  display: inline-block;
  line-height: 20px;
  vertical-align: middle;
  color: #E2E4E9;
}

.team:hover .TeamName{
  color: pink;
}

.pack:hover {
  background: #414958;
}

.addTeam {
  height: 45px;
  line-height: 45px;
  display: flex;
  margin-right: 10px;
  margin-left: -10px;
  color: #E2E4E9;
}

.addImg {
  height: 100%;
  width: 40px;
  line-height: 45px;
  text-align: center;
  margin-right: 15px;
}
.addImg img {
  margin-top: 12px;
  width: 20px;
  height: 20px;
}

.addTeam:hover {
  color: pink;
  background: #414958;
  cursor: pointer;
}
</style>
<script setup lang="ts">
import {ref} from 'vue'

let nickname = ref<String>('Loading...')
let email = ref<String>('email@163.com')
const teams = ref([
  {
    id: 1,
    src: 'T',
    name: 'Team'
  },
  {
    id: 1,
    src: 'T',
    name: 'Team'
  },
  {
    id: 1,
    src: 'T',
    name: 'Team'
  }
])


</script>