<template>
  <n-config-provider :theme="theme">
    <div class="nav">
      <!-- <div class="logo" @click="toMain"></div> -->
      <div class="user-info">
        <!-- <div class="avatar">
          <n-avatar class="pic">
            {{ profile.nickname }}
          </n-avatar>
        </div> -->
        <div class="lineI"></div>
        <SvgI size="50" border="0.34" pricolor="none" secolor="none" class="signI"/>
        <div class="user">
          <p>{{ profile.nickname }}</p>
          <p style="color:rgba(167, 175, 190, 1);font-size:small;">{{ profile.email }}</p>
        </div>
      </div>
      <div class="teamsHead">
        团队和项目
      </div>
      <!-- <div style="width:100%;"> -->
      <n-scrollbar style="margin:0 0 0 -8px;width:197px;padding-right:3px;">
        <div class="teams">
          <div class="team">
            <n-menu :options="sideMenuOptions" @update:value="handleUpdateValue"/>
          </div>
          <div class="addTeam" @click="addTeam">
            <!-- <div class="addImg">
              <img src="@/assets/plus.png"/>
            </div> -->
            <Icon style="margin-right:8px;" size="24">
              <Add12Filled/>
            </Icon>
            <div class="word">
              新建团队
            </div>
          </div>
        </div>
      </n-scrollbar>
      <!-- </div> -->
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
  </n-config-provider>
</template>

<script lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {defineComponent, h, Component} from 'vue'
import {darkTheme, NIcon, useMessage} from 'naive-ui'
import type {MenuOption} from 'naive-ui'
import {RouterLink, useRouter} from "vue-router";
import {PeopleTeam16Filled as Team} from "@vicons/fluent"
import {Icon} from '@vicons/utils'
import {Add12Filled} from '@vicons/fluent'
import axios from "axios";
import utils from "@/Utils";
import router from '@/router';
import SvgI from '@/components/svgI.vue'


const sideMenuOptions = ref([] as MenuOption[])
let dataList = ref([{ID: 0}])

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

export default defineComponent({
  data() {
    return {}
  },
  components: {
    Icon,
    Add12Filled,
    SvgI,
  },
  setup(props, {emit}) {
    const headers = {
      Authorization: utils.getCookie('Authorization')
    }
    const toMain = () => {
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
      axios.get('/user/info', {headers: headers}).then(res => {
        profile.value = res.data.data
        utils.setCookie("userID", profile.value.ID)
      })
    }
    const getAllTeams = (page: number, size: number) => {
      axios.get('/team/list',
          {headers: headers, params: {page: page, size: size}})
          .then(res => {
            console.log(res)
            let array = ref(res.data.data.items)
            dataList = res.data.data.items
            // console.log(res.data.data.items)
            total.value = res.data.data.total
            pageNum.value = total.value % 8 === 0 ? Math.floor(total.value / 8) : Math.floor(total.value / 8 + 1)
            sideMenuOptions.value.splice(0, sideMenuOptions.value.length)
            for (let i = 0; i < array.value.length; i++) {
              let idd = array.value[i].ID
              sideMenuOptions.value.push(
                  {
                    label: () =>
                        h(
                            RouterLink,
                            {
                              to:
                                  '/team/teamprojects?teamID=' + idd,
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
      getAllTeams(page - 1, 8)
    }
    onMounted(() => {
      load()
      getAllTeams(0, 8)
    })
    return {
      theme: darkTheme,
      addTeam,
      toMain,
      load,
      getAllTeams,
      handleUpdateValue(key: string, item: MenuOption) {
        emit("ID", dataList[parseInt(JSON.stringify(key))].ID)
        utils.setCookie('teamID', dataList[parseInt(JSON.stringify(key))].ID)
        //     router.push({path:'/team/teamProjects',
        //   query:{teamID:utils.getCookie("teamID")}
        // })
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
* {
  transition: 0.1s;
  transition-delay: 0s;
}

.nav {
  display: flex;
  flex-direction: column;
  /*box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);*/
  background-color: #16181D;
  border-right: 1px solid #414958;
  /*padding-top: 20px;*/
  padding-left: 8px;
  width: 192px;
  height: 100%;
  overflow: hidden;
}

.logo {
  width: 200px;
  height: 139px;
  /*background-color: rgba(217, 217, 217, 1);*/
  background-image: url("@/assets/slogan2048x705.png");
  background-size: contain;
  /*text-align: center;
  line-height: 56px;*/
  margin-top: 20px;
  background-repeat: no-repeat;
}

.user-info {
  display: flex;
  width: 100%;
  height: 70px;
  margin-top: 30px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
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
  margin: 0 8px;
  /*height: 65px;*/
  color: #fff;
  text-overflow: ellipsis;
  /*width: 127px;*/
  overflow: hidden;
  white-space: nowrap;
  font-size: larger;
}

.user p {
  /*margin-top: 5px;*/
  overflow: hidden;
  text-overflow: ellipsis;
}

.teams {
  font-size: large;
  font-weight: 500;
  color: #E2E4E9;
}

.teamsHead {
  margin: 30px 0 0 4px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
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

.n-menu {
  padding: 0;
}

.addTeam {
  height: 42px;
  line-height: 42px;
  display: flex;
  font-size: 12px;
  /*margin-right: 10px;
  margin-left: -10px;*/
  margin: 6px 8px 0 8px;
  padding-left: 24px;
  color: #A7AFBE;
  border-radius: 2px;
  align-items: center;
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
  color: #E2E4E9;
  background: #414958aa;
  cursor: pointer;
  /*box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);*/
}

#pagination {
  /*position: absolute;
  top: calc(100% - 80px);*/
  padding: 5px 0 20px;
}

.signI {
  width: 0;
  transition-timing-function: cubic-bezier(0.29, 0.44, 0.25, 1);
  transition-duration: 0.5s;
}

.user-info:hover .signI {
  width: 50px;
}

.lineI {
  width: 1px;
  border-radius: 1px;
  height: 100%;
  background-color: #fff;
  transition: 0.2s;
  transition-timing-function: cubic-bezier(0.29, 0.44, 0.25, 1);
}

.user-info:hover .lineI {
  height: 0;
}
</style>