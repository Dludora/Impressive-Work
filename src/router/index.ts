import { createRouter, createWebHistory } from 'vue-router'

import regisTer from "../components/User/regisTer.vue";
import homePage from "../components/homePage.vue";
<<<<<<< HEAD
import someTeam from "../components/someTeam.vue";
import teamMembers from "../components/someTeam/teamMembers.vue";
import teamSettings from "../components/someTeam/teamSettings.vue";
import teamProjects from "../components/someTeam/teamProjects.vue"
=======
import vDitor from "../components/Document/vDitor.vue";
import testVditor from "../views/Document/testVditor.vue"
>>>>>>> 3c01ea7d2ba9fae98eb1701e654747ef502f447b

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
<<<<<<< HEAD
            name: 'someTeam',
            path: '/someTeam',
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
=======
            name:'vDitor',
            path: '/vDitor',
            component: vDitor
        },
        {
            name:'testVditor',
            path: '/testVditor',
            component: testVditor
>>>>>>> 3c01ea7d2ba9fae98eb1701e654747ef502f447b
        },
    ]
})
export default router