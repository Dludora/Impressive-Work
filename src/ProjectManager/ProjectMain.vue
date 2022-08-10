<template>
  <div class="mainframe">
    <UpBar style="padding:25px 60px 23px"/>
    <div class="three-cls">
      <n-config-provider :theme="theme">
        <n-menu mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" :value="judge"/>
      </n-config-provider>
    </div>
    <div class="divline"/>

    <div class="view">
      <n-scrollbar style="max-height:100%">
        <router-view/>
      </n-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
// import LeftNav from "@/components/Team/LeftNav.vue";
import UpBar from "@/components/Document/upBar.vue"

import {h, Component, defineComponent, ref, onMounted} from 'vue'
import {darkTheme, MentionOption, MenuOption, NIcon, useMessage} from "naive-ui";
import {RouterLink, useRouter,useRoute} from "vue-router";

import {PeopleTeam16Filled as Team} from "@vicons/fluent";
import {Brush} from "@vicons/ionicons5";
import {Analytics} from "@vicons/ionicons5";
import {DocumentText} from "@vicons/ionicons5";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}
export default defineComponent(
    {
      components: {
        UpBar
      },
      setup() {
        const route = useRoute()
        const menuOptions: MentionOption[] = [
          {
            label: () =>
                h(
                    RouterLink,
                    {
                      to: "/project/prototypes?teamID="+route.query.teamID
                    },
                    {default: () => '原型设计'}
                ),
            key: 'prototypes',
            icon: renderIcon(Brush),
          },
          {
            label: () =>
                h(
                    RouterLink,
                    {
                      to: "/UML"
                    },
                    {default: () => '图'}
                ),
            key: 'UML',
            icon: renderIcon(Analytics),
          },
          {
            label: () =>
                h(
                    RouterLink,
                    {
                      to:"/project/documents?teamID="+route.query.teamID
                    },
                    {default: () => '文档'}
                ),
            key: 'documents',
            icon: renderIcon(DocumentText)
          },
        ]
        const judge = ref('')
        const router = useRouter()
        onMounted(() => {
          judge.value = router.currentRoute.value.fullPath.toString().split("/")[2]
          console.log('judge: ' + judge.value)

        })
        const handleUpdateValue = (key: string, item: MenuOption) => {
          judge.value = key
        }
        return {
          route,
          theme: darkTheme,
          menuOptions,
          handleUpdateValue,
          judge
        }
      },

    }
)


</script>

<style scoped>
.n-layout {
  height: calc(100%);
}

.n-layout-header,
.n-layout-footer {
  background: #16181D;
  /*padding: 36px;*/
}

.n-layout-sider {
  height: calc(100%);
  background: #2B303B;
}

.n-layout-content {
  background: #16181D;
  height: calc(100%);
}

.big-bg {
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background-color: #16181D;
}

.left {
  width: 240px;
  height: 97%;
  display: inline-block;
}

.content {
  display: inline-block;
  vertical-align: top;
}

.top {
  min-width: 100%;
  vertical-align: top;
  height: 100px;
  margin-top: 36px;
}

.three-cls {
  /*background: #666f83;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);*/
  /*position: absolute;*/
  min-width: 100%;
  /*top:0%;*/
  padding: 0px 50px;
  z-index: 1;
}

.solid {
  overflow: hidden;
}

.scroll {
  overflow: display;
}

.frame {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;
}

.side {
  height: 100%;
  z-index: 2;
}

::-webkit-scrollbar {
  width: 8px;
  height: 16px;
  background-color: #F5F5F5;
}

.mainframe {
  height: 100%;
  /* max-height: 100%; */
  /* overflow: auto; */
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
}

.view {
  overflow: auto;
}

.divline {
  height: 1px;
  margin: 0 60px;
  /* background: #414958; */
  border-bottom: 1px solid #414958;
}
</style>