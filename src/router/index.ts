import { createRouter, createWebHistory } from 'vue-router'

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

import vDitor from "../components/Document/vDitor.vue";
import testVditor from "../views/Document/testVditor.vue"

import upBar from "../components/Document/upBar.vue";
import programView from "../views/Document/programView.vue";

import docuList from "../components/Document/docuList.vue";

import docuEdit from "../views/Document/docuEdit.vue";

import UML from "../components/UML.vue";

const routerHistory = createWebHistory()
// @ts-ignore
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            name:'homePage',
            path: '/',
            component: homePage
        },
        {
            name:'regisTer',
            path: '/regisTer',
            component: regisTer
        },
        {
            name:'layoutPage',
            path:"/layout",
            component: layoutPage
        },
        {
            name:'main',
            path: '/',
            component: mainView,
            children: [
                {
                    name: 'team',
                    path:'/team',
                    // redirect: '/team/projects',
                    component: teamMain,
                    children:[
                        {
                            name:'projects',
                            path: 'projects',
                            component: teamProjects,
                        },
                        {
                            name:'members',
                            path: 'members',
                            component: teamMembers,
                        },
                        {
                            name:'setting',
                            path: 'setting',
                            component: teamSettings,
                        },
                    ]
                },
                {
                    name: 'project',
                    path:'/project',
                    redirect: '/project/prototypes',
                    component: projectMain,
                    children:[
                        {
                            name:'prototypes',
                            path: 'prototypes',
                            component: prototypes,
                        },
                        {
                             name:'UML',
                             path: 'UML',
                             component: UML,
                        },
                        {
                            name:'documents',
                            path: 'documents',
                            component: docuList,
                        },
                    ]
                },
            ]
        },
        // {
        //     name: 'team',
        //     path: '/team',
        //     component: someTeam,
        //     children: [
        //         {
        //             name: 'teamProjects',
        //             path: 'teamProjects',
        //             component: teamProjects
        //         },
        //         {
        //             name: 'teamMembers',
        //             path: 'teamMembers',
        //             component: teamMembers
        //         },
        //         {
        //             name: 'teamSettings',
        //             path: 'teamSettings',
        //             component: teamSettings
        //         },
        //     ]
        // },
        {
            name:'vDitor',
            path: '/vDitor',
            component: vDitor
        },
        {
            name:'testVditor',
            path: '/testVditor',
            component: testVditor
        },
        {
            name:'upBar',
            path: '/upBar',
            component: upBar
        },
        {
            name:'programView',
            path:'/programView',
            component: programView
        },
        {
            name:'docuList',
            path:'/docuList',
            component: docuList
        },
        {
            name:'docuEdit',
            path:'/docuEdit',
            component: docuEdit,
        },
        {
            name:'UML',
            path:'/UML',
            component: UML,
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
export default router