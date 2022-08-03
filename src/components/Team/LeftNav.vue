<template>
  <n-config-provider :theme="theme">
    <div class="nav">
      <div class="logo">This is a logo</div>
      <div class="user-info">
        <div class="avatar">
          <n-avatar class="pic">
            {{ profile.nickname }}
          </n-avatar>
        </div>
        <div class="user">
          <p>{{ profile.nickname }}</p>
          <p style="color:rgba(167, 175, 190, 1);font-size:small;">{{ profile.email }}</p>
        </div>
      </div>
      <div class="teams">
        <div class="teamsHead">
          团队和项目
        </div>
        <div class="team">
          <n-menu :options="sideMenuOptions" @update:value="handleUpdateValue"/>
        </div>
        <div class="addTeam" @click="addTeam">
          <div class="addImg">
            <img src="@/assets/plus.png"/>
          </div>
          <div class="word">
            新建团队
          </div>
        </div>
      </div>
    </div>
  </n-config-provider>
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

.team:hover .TeamName {
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
<script lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {defineComponent, h, Component} from 'vue'
import {darkTheme, NIcon, useMessage} from 'naive-ui'
import type {MenuOption} from 'naive-ui'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from '@vicons/ionicons5'
import {RouterLink} from "vue-router";
import {PeopleTeam16Filled as Team} from "@vicons/fluent"
import axios from "axios";
import utils from "@/Utils";

const headers = {
  Authorization: utils.getCookie('Authorization')
}

const sideMenuOptions = ref([{ID:0}] as MenuOption[])
let dataList = ref([{ID:0,name:"loading..."}])
function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

export default defineComponent({
  data() {
    return {}
  },
  setup(props, {emit}) {
    const profile = ref({
      ID: null,
      email: "",
      id: null,
      name: "",
      nickname: "",
      src: ""
    })
    //传值

    const total = ref(0)
    const currentPage = ref(0)
    const addTeam = () => {
      emit('addTeam');
    }
    const load = () => {
      axios.get('user/info', {headers: headers}).then(res => {
        console.log(res.data)
        profile.value = res.data.data
      })
    }
    const getAllTeams = (page:number, size:number) => {
      axios.get('/team/list',
          {headers: headers, params: {page: page, size: size}})
          .then(res => {
            let array = ref(res.data.data.items)
            console.log(res.data.data.items)
            dataList.value = res.data.data.items
            sideMenuOptions.value.splice(0, sideMenuOptions.value.length)
            for (let i = 0; i < array.value.length; i++) {
              sideMenuOptions.value.push(
                  {
                    label: () =>
                        h(
                            RouterLink,
                            {
                              to: {
                                path: '/team'
                              }
                            },
                            {default: () => array.value[i].name}
                        ),
                    key: i,
                    icon: renderIcon(Team)
                  }
              )
            }
          })
    }

    onMounted(async () => {
      load()
      getAllTeams(0, 6)
    })

    return {
      theme: darkTheme,
      addTeam,
      load,
      getAllTeams,
      sideMenuOptions,
       handleUpdateValue (key: string, item: MenuOption) {
          let index=parseInt(JSON.stringify(key))
          let out=dataList.value[index].ID
          emit("ID",out)
          console.log("send"+out)
       },
      // 个人信息
      profile,
      total,
      
    }
  },
})

</script>