<template>
  <n-config-provider :theme="theme">
    <n-scrollbar style="box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);background:rgba(43, 48, 59, 1);">
  <div class="nav">
    <div class="logo" @click="toMain">墨书</div>
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
      <div class="teams">
        <div class="teamsHead">
          团队和项目
        </div>
        <div class="team">
          <n-menu :options="sideMenuOptions"/>
        </div>
        <div class="addTeam" @click="addTeam">
          <div class="addImg">
            <img src="@/assets/plus.png"/>
          </div>
          <div class="word">
            新建团队
          </div>
        </div>
        <n-pagination v-model:page="currentPage"
                      :page-count="pageNum"
                      show-quick-jumper
                      :page-slot="3" size="small"
                      :on-update:page="changePage"
                      id="pagination">
          <template #goto>
            请回答
          </template>
        </n-pagination>
      </div>
    </div>
  </div>
    </n-scrollbar>
  </n-config-provider>
</template>

<script lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {defineComponent, h, Component} from 'vue'
import {darkTheme, NIcon, useMessage} from 'naive-ui'
import type {MenuOption} from 'naive-ui'
import {RouterLink, useRouter} from "vue-router";
import {PeopleTeam16Filled as Team} from "@vicons/fluent"
import axios from "axios";
import utils from "@/Utils";
import router from '@/router';

const headers = {
  Authorization: utils.getCookie('Authorization')
}

const sideMenuOptions = ref([] as MenuOption[])
let dataList = ref([{ID:0}])
function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

export default defineComponent({
  data() {
    return {}
  },
  setup(props, {emit}) {
    const toMain=()=>{
      router.push("/")
    }
    const profile = ref({
      ID: null,
      email: "",
      id: null,
      name: "",
      nickname: "",
      src: ""
    })
    const total = ref(0)
    const currentPage = ref(0)
    const pageNum = ref(0)
    const addTeam = () => {
      emit('addTeam');
    }
    const load = () => {
      axios.get('user/info', {headers: headers}).then(res => {
        profile.value = res.data.data
      })
    }
    const getAllTeams = (page: number, size: number) => {
      axios.get('/team/list',
          {headers: headers, params: {page: page, size: size}})
          .then(res => {
            let array = ref(res.data.data.items)
            dataList = res.data.data.items
            console.log(res.data.data)
            // console.log(res.data.data.items)
            console.log(array.value)
            total.value = res.data.data.total
            pageNum.value = total.value % 8 === 0 ? Math.floor(total.value / 8) : Math.floor(total.value / 8 + 1)
            sideMenuOptions.value.splice(0, sideMenuOptions.value.length)
            for (let i = 0; i < array.value.length; i++) {
              sideMenuOptions.value.push(
                  {
                    label: () =>
                        h(
                            RouterLink,
                            {
                              to: {
                                path: '/team'+array.value[i].ID,
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
    const changePage = (page: number) => {
      getAllTeams(page-1, 8)
    }
    onMounted(async () => {
      load()
      getAllTeams(0, 8)
    })

    return {
      theme: darkTheme,
      addTeam,
      toMain,
      load,
      getAllTeams,
      handleUpdateValue (key: string, item: MenuOption) {
            emit("ID",dataList[parseInt(JSON.stringify(key))].ID)
        },
      changePage,
      // 个人信息
      profile,
      sideMenuOptions,

      // 分页
      currentPage,
      total,
      pageNum,
    }
  },
})

</script>

<style scoped>
.nav {
  background-color: rgba(43, 48, 59, 1);
  padding-top: 20px;
  padding-left: 20px;
  width:220px;
  height:100%;
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
  flex-direction: column;
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

#pagination {
  position: absolute;
  top: calc(100% - 80px);
}
</style>