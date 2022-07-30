import { createRouter, createWebHistory } from 'vue-router'

import regisTer from "../components/regisTer.vue";
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
    ]
})
export default router