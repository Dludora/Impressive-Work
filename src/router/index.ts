import { createRouter, createWebHistory } from 'vue-router'

import regisTer from "../components/regisTer.vue";
import homePage from "../components/homePage.vue";
import layoutPage from "../components/DesignPage/layoutPage.vue"

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
            name:'layoutPage',
            path:"/layout",
            component: layoutPage
        }
    ]
})
export default router