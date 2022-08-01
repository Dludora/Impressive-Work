import { createRouter, createWebHistory } from 'vue-router'

import regisTer from "../components/User/regisTer.vue";
import homePage from "../components/homePage.vue";

import someTeam from "../components/someTeam.vue";
import teamMembers from "../components/someTeam/teamMembers.vue";
import teamSettings from "../components/someTeam/teamSettings.vue";
import teamProjects from "../components/someTeam/teamProjects.vue"

import vDitor from "../components/Document/vDitor.vue";
import testVditor from "../views/Document/testVditor.vue"


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

            name: 'team',
            path: '/team',
            component: () => import("../views/Team/TeamMain.vue"),
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
            name: 'someTeam',
            path: '/someTeam',
            component: someTeam,
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
    ]
})
export default router