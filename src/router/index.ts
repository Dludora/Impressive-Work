import { createRouter, createWebHistory } from 'vue-router'

import regisTer from "../components/User/regisTer.vue";
import homePage from "../components/homePage.vue";

const routerHistory = createWebHistory()
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
            
        }
    ]
})
export default router