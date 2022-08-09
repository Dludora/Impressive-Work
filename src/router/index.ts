import {createRouter, createWebHistory} from 'vue-router'

import regisTer from "../components/User/regisTer.vue";
import homePage from "../components/homePage.vue";
import layoutPage from "../views/LayoutPage/layoutPage.vue"

import prototypes from "../ProjectManager/PrototypeList.vue"

import mainView from "../TeamManager/MainView.vue"
import teamMain from "../TeamManager/TeamMain.vue"
import projectMain from "../ProjectManager/ProjectMain.vue"

import someTeam from "../components/someTeam/someTeam.vue";
import teamMembers from "../components/someTeam/teamMembers.vue";
import teamSettings from "../components/someTeam/teamSettings.vue";
import teamProjects from "../TeamManager/ProjectList.vue";
import teamDocuments from '../components/someTeam/teamDocument.vue'
import teamChoose from '../components/TeamChose/TeamChoose.vue'
import teamDocView from '../components/someTeam/teamDocView.vue'


import vDitor from "../components/Document/vDitor.vue";
import testVditor from "../views/Document/testVditor.vue"

import upBar from "../components/Document/upBar.vue";
import programView from "../views/Document/programView.vue";

import docuList from "../components/Document/docuList.vue";

import docuEdit from "../views/Document/docuEdit.vue";

import UML from "../components/UML.vue";

import tipTap from "../components/tipTap/tipTap.vue";


// @ts-ignore
// @ts-ignore
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'homePage',
            path: '/',
            component: homePage,
        },
        {
            name: 'teamChoose',
            path: '/teamchoose',
            component: teamChoose,
        },
        {
            name: 'regisTer',
            path: '/regisTer',
            component: regisTer
        },
        {
            name: 'layoutPage',
            path: "/layout",
            component: layoutPage,
            meta: {
                auth: true
            }
        },
        {
            name: 'main',
            path: '/',
            component: mainView,
            meta: {
                auth: true
            },
            children: [
                // {
                //     name: 'team',
                //     path:'/team',
                //     // redirect: '/team/projects',
                //     component: teamMain,
                //     children:[
                //         {
                //             name:'projects',
                //             path: 'projects',
                //             component: teamProjects,
                //         },
                //         {
                //             name:'members',
                //             path: 'members',
                //             component: teamMembers,
                //         },
                //         {
                //             name:'setting',
                //             path: 'setting',
                //             component: teamSettings,
                //         },
                //     ]
                // },
                {
                    name: 'project',
                    path: '/project',
                    redirect: '/project/prototypes',
                    component: projectMain,
                    meta: {
                        auth: true
                    },
                    children: [
                        {
                            name: 'prototypes',
                            path: 'prototypes',
                            component: prototypes,
                            meta: {
                                auth: true
                            },
                        },
                        {
                            name: 'UML',
                            path: 'UML',
                            component: UML,
                            meta: {
                                auth: true
                            },
                        },
                        {
                            name: 'documents',
                            path: 'documents',
                            component: docuList,
                            meta: {
                                auth: true
                            },
                        },
                    ]
                },
            ]
        },
        {
            name: 'team',
            path: '/team',
            component: someTeam,
            meta: {
                auth: true
            },
            // redirect: '/team/teamProjects',
            children: [
                {
                    name: 'teamProjects',
                    path: 'teamProjects',
                    component: teamProjects,
                    meta: {
                        auth: true
                    },
                },
                {
                    name: 'teamMembers',
                    path: 'teamMembers',
                    component: teamMembers,
                    meta: {
                        auth: true
                    },
                },
                {
                    name: 'teamSettings',
                    path: 'teamSettings',
                    component: teamSettings,
                    meta: {
                        auth: true
                    },
                },
                {
                    name: 'teamDocuments',
                    path: 'teamDocuments',
                    component: teamDocuments,
                    meta: {
                        auth: true
                    }
                },
            ]
        },
        {
            name: 'teamDocView',
            path: '/teamDocView',
            component: teamDocView,
            meta: {
                auth: true
            }
        },
        {
            name: 'vDitor',
            path: '/vDitor',
            component: vDitor,
            meta: {
                auth: true
            },
        },
        {
            name: 'testVditor',
            path: '/testVditor',
            component: testVditor,
            meta: {
                auth: true
            },
        },
        {
            name: 'upBar',
            path: '/upBar',
            component: upBar,
            meta: {
                auth: true
            },
        },
        {
            name: 'programView',
            path: '/programView',
            component: programView,
            meta: {
                auth: true
            },
        },
        {
            name: 'docuList',
            path: '/docuList',
            component: docuList,
            meta: {
                auth: true
            },
        },
        {
            name: 'docuEdit',
            path: '/docuEdit',
            component: docuEdit,
            meta: {
                auth: true
            },
        },
        {
            name: 'UML',
            path: '/UML',
            component: UML,
            meta: {
                auth: true
            },
        },
        {
            name:'tipTap',
            path:'/tipTap',
            component: tipTap,
        }

        // {
        //     name: 'programBig',
        //     path: '/programBig',
        //     component:  programView,
        //     children: [
        //         {
        //             name: 'prototypes',
        //             path: '',
        //             component: prototypes
        //         },
        //         // {
        //         //     name: 'drawUML',
        //         //     path: 'drawUML',
        //         //     component: drawUML
        //         // },
        //         {
        //             name: 'docuList',
        //             path: 'docuList',
        //             component: docuList
        //         },
        //     ]
        // },
    ]
})

import utils from "@/Utils";

router.beforeEach((to, from, next) => {
    // 1. 每个条件执行后都要跟上 next() 或 使用路由跳转 api 否则页面就会停留一动不动
    // 2. 要合理的搭配条件语句，避免出现路由死循环。
    const token = utils.getCookie('Authorization')

    if (to.meta.auth) {
        if (!token) {
            next({name: 'regisTer'})
        } else {
            next()
        }
    } else {
        next()

    }
})

export default router