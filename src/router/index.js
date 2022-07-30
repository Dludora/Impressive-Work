import { createRouter, createWebHistory } from 'vue-router'

import regisTer from "@/components/regisTer"
import homePage from "@/components/homePage";

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            component: homePage
        },
        {
            path: '/regisTer',
            component: regisTer
        },
    ]
})
export default router