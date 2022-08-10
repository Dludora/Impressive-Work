<template>
  <n-config-provider :theme="theme">
  <div class="nav">
    <!-- <div class="logo" @click="toMain"></div> -->
    <n-popover trigger="hover" placement="right">
       <template #trigger>
    <div class="user-info" @click="toMain">
      <div class="lineI"></div>
      <SvgI size="50" border="0.42" pricolor="none" secolor="none" class="signI"/>
      <div class="user">
        <p>{{ profile.nickname }}</p>
        <p style="color:rgba(167, 175, 190, 1);font-size:small;">{{ profile.email }}</p>
      </div>
    </div>
      </template>
      <div class="paopao">
       <span>昵称: {{profile.nickname}}</span><br/>
        <span>姓名: {{profile.name}}</span><br/>
        <span>邮箱: {{profile.email}}</span><br/>
       <n-button size="tiny" quaternary @click="toMain">
        返回主页
      </n-button>
      <n-button size="tiny" type="error" quaternary @click="logout">
        注销登录
      </n-button>
      </div>
    </n-popover>
    <div class="teamlist">
        <div class="teamsHead">
          <Icon size="18" style="margin:12px;">
          <BoxMultiple20Regular/>
          </Icon>
           您的团队
        </div>
      <div class="divline"/>
      <!-- <n-scrollbar style="margin:0 0 0 -8px;width:197px;padding-right:3px;"> -->
      <n-scrollbar>
        <div class="teams">
          <div class="team">
            <!-- <n-menu :options="sideMenuOptions" @update:value="handleUpdateValue" :default-value="route.query.teamID"/> -->
            <TandP @renew="renewNav" :options="teamAndProjects" :key="renewTag"/>
          </div>
          <div class="addTeam" @click="addTeam">
            <Icon style="margin:15px;" size="12">
              <Add12Filled/>
            </Icon>
            <div class="word">
              新建团队
            </div>
          </div>
        </div>
      </n-scrollbar>
      <!-- <div class="divline"/> -->
    </div>
      <!-- <n-pagination v-model:page="currentPage"
                    :page-count="pageNum"
                    :page-slot="5" size="small"
                    :on-update:page="changePage"
                    id="pagination">
      </n-pagination> -->
      </div>
  </n-config-provider>
</template>

<script lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {defineComponent, h, Component} from 'vue'
import {darkTheme, NIcon, useMessage} from 'naive-ui'
import type {MenuOption} from 'naive-ui'
import {RouterLink, useRoute} from "vue-router";
import {PeopleTeam16Filled as Team} from "@vicons/fluent"
import { Icon } from '@vicons/utils'
import { Add12Filled,BoxMultiple20Regular } from '@vicons/fluent'
import axios from "axios";
import utils from "@/Utils";
import router from '@/router';
import SvgI from '@/components/svgI.vue'
import { menuLight } from 'naive-ui/es/menu/styles';
import TandP from '@/components/Team/teamAndProjects.vue'


const sideMenuOptions = ref([] as MenuOption[])
let teamAndProjects=ref([])
let dataList = ref([{ID: 0}])

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

export default defineComponent({
  components: {
    Icon,
    Add12Filled,
    SvgI,
    BoxMultiple20Regular,
    TandP,
  },
  setup(props, {emit}) {
    const message = useMessage()
    let renewTag=500;
    const route = useRoute();
    let menuKey = ref('')
    const headers = {
      Authorization: utils.getCookie('Authorization')
    }
    const defaultMenu = ref('')
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
    const currentPage = ref(1)
    const pageNum = ref(0)
    const addTeam = () => {
      emit('addTeam');
    }
    const renewNav=()=>{
      emit('renew')
    }
    const load = () => {
      axios.get('/user/info', {headers: headers}).then(res => {
        profile.value = res.data.data
        utils.setCookie("userID", profile.value.ID)
      })
    }
    const logout = () => {
  console.log()
  axios.delete('/auth/token',{headers:headers}
  ).then(res=>{
    console.log(res.data)
    if(res.data.msg==="成功")
    {
      utils.clearCookie('Authorization')
      axios.defaults.headers.common['Authorization'] = '';
      message.info("注销成功")
      router.push('/')
    }
    else{
      utils.clearCookie('Authorization')
      axios.defaults.headers.common['Authorization'] = '';
      message.error("用户未登录")
    }
  })
}
    const getAllTeams = (page: number, size: number) => {
      axios.get('/team/list',
          {headers: headers, params: {
            // page: page, size: size
            }})
          .then(res => {
            // console.log(res)
            const array = ref(res.data.data.items)
            dataList = res.data.data.items
            // console.log(array)
            // console.log(res.data.data.items)
            total.value = res.data.data.total
            pageNum.value = total.value % 8 === 0 ? Math.floor(total.value / 8) : Math.floor(total.value / 8 + 1)
            sideMenuOptions.value.splice(0, sideMenuOptions.value.length)
            teamAndProjects.value.splice(0, teamAndProjects.value.length)
            // console.log('array:')
            // console.log(array)
            for (let i = 0; i < array.value.length; i++) {
              let idd = array.value[i].ID
              let projectlist=[]
              // async getData(){

              // }
              // async function axiosGetJsonData<T>(url: string): Promise<T> {
              //   try {
              //     const response = await axios.get<T>(url);
              //     return response.data;
              //   } catch (error) {
              //     throw new Error(`Error in 'axiosGetJsonData(${url})': ${error.message}`);
              //   }
              // }
              teamAndProjects.value.push({
                link:'/team/teamprojects?teamID=' + idd,
                ID:idd,
                name:array.value[i].name,
                color:array.value[i].src,
                projects:[],
              })
              axios.get('/program/list',{headers: headers, params: {teamID:idd}}).then(prores=>{
                // teamAndProjects.value.push({
                //   link:'/team/teamprojects?teamID=' + idd,
                //   ID:idd,
                //   name:array.value[i].name,
                //   color:array.value[i].src,
                //   projects:prores.data.data.items,
                // })
                // console.log('pushed:')
                // console.log(idd)
                // console.log('teamAndProjects.value:')
                // console.log(teamAndProjects.value)
                teamAndProjects.value[i].projects=prores.data.data.items
              })
              // console.log(projectlist)
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
                    key: idd.toString(),
                    icon: renderIcon(Team)
                  }
              )
                // console.log('sideMenuOptions.value:')
                // console.log(sideMenuOptions.value)
            }
            if(renewTag<600)
              renewTag++;
            else renewTag--;
            // this.$refs.teamAndProject.
            // emit("ID", array.value[0].ID)
            // router.push('/team/teamprojects?teamID=' + array.value[0].ID)
          })
    }
    const changePage = (page: number) => {
      getAllTeams(page - 1, 8)
      currentPage.value=page
    }
    onMounted(() => {
      load()
      if(typeof(route.query.teamID)!="undefined")
       menuKey.value=route.query.teamID.toString();
      //  console.log("menuKey:"+menuKey.value)
      getAllTeams(0, 8)
    })
    return {
      logout,
      renewNav,
      route,
      message,
      menuKey,
      theme: darkTheme,
      addTeam,
      toMain,
      load,
      getAllTeams,
      renewTag,
      handleUpdateValue(key: string, item: MenuOption) {
        emit("ID", parseInt(key))
        utils.setCookie('teamID', parseInt(key))
        menuKey.value=key
        emit("judgechild")
        //     router.push({path:'/team/teamProjects',
        //   query:{teamID:utils.getCookie("teamID")}
        // })
      },
      changePage,
      // 个人信息
      profile,
      sideMenuOptions,
      teamAndProjects,
      defaultMenu,
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
.user{
  margin-left: 20px;
}
.user-info {

  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 25px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}
.user-info:hover{

cursor:pointer
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
  /*font-size: larger;*/
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
  margin: 4px 0;
}

.teamsHead {
  margin: 23px 16px 0 4px;
  color: #E2E4E9;
  font-size: 12px;
  line-height: 42px;
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  /*font-weight:700;*/
  /*border-bottom: 1px solid #414958;*/
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
  margin: 0 10px 24px 0;
  /*margin-left: -10px;
  margin: 6px 8px 0 8px;
  padding-left: 24px;*/
  color: #A7AFBE;
  border-radius: 2px;
  border: 1px solid #A7AFBE00;
  transition: 0.2s;
  align-items: center;
}
.addTeam:hover{
  color: #E2E4E9;
  cursor: pointer;
  border: 1px solid #A7AFBE;
}
.addTeam:active{
    background-color: #2B303B;
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

#pagination {
  /*position: absolute;
  top: calc(100% - 80px);*/
  padding: 5px 0 20px;
  justify-content: center;
}
.signI{
  overflow: hidden;
  width:0;
  transition-timing-function: cubic-bezier(0.29, 0.44, 0.25, 1);
  transition-duration: 0.5s;
  margin-right: 20px;
}

.user-info:hover .signI {
  width: 50px;
  margin-right: 5px;
}

.lineI {
  width: 1px;
  border-radius: 1px;
  height: 100%;
  background-color: #fff;
  transition: 0.2s;
  transition-timing-function: cubic-bezier(0.29, 0.44, 0.25, 1);
}
.user-info:hover .lineI{
  height:0;
}
.teamlist{
  /* margin: 0 0 190px 0; */
  overflow: overlay;
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  align-items: stretch;
}
.teamlist:hover .divline{
  border-bottom: 1px solid #2B303B;
}
.teamlist:hover .teamsHead{
  color:#fff;
}
.divline{
  height:1px;
  margin:0 12px 0 0;
  /*background:#16181D;*/
  border-bottom: 1px solid #16181D;
  transition-duration: 0.3s;
}
</style>