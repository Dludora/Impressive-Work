import { createRouter, createWebHistory } from 'vue-router'

import regisTer from "../components/User/regisTer.vue";
import homePage from "../components/homePage.vue";
import layoutPage from "../views/LayoutPage/layoutPage.vue"

import prototypes from "../ProjectManager/PrototypeList.vue"

import someTeam from "../components/someTeam.vue";
import teamMembers from "../components/someTeam/teamMembers.vue";
import teamSettings from "../components/someTeam/teamSettings.vue";
import teamProjects from "../components/someTeam/teamProjects.vue";

import vDitor from "../components/Document/vDitor.vue";
import testVditor from "../views/Document/testVditor.vue"

import upBar from "../components/Document/upBar.vue";
import programView from "../views/Document/programView.vue";

import docuList from "../components/Document/docuList.vue";

import docuEdit from "../views/Document/docuEdit.vue";

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
            name: 'team',
            path: '/team',
            component: someTeam,
            children: [
                {
                    name: 'teamProjects',
                    path: '',
                    component: teamProjects
                },
                {
                    name: 'teamMembers',
                    path: 'teamMembers',
                    component: teamMembers
                },
                {
                    name: 'teamSettings',
                    path: 'teamSettings',
                    component: teamSettings
                },
            ]
        },
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
            name: 'programBig',
            path: '/programBig',
            component:  programView,
            children: [
                {
                    name: 'prototypes',
                    path: 'prototypes',
                    component: prototypes
                },
                // {
                //     name: 'drawUML',
                //     path: 'drawUML',
                //     component: drawUML
                // },
                {
                    name: 'docuList',
                    path: '',
                    component: docuList
                },
            ]
        },
    ]
})
export default router