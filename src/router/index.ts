import { createRouter, createWebHistory } from 'vue-router'

import regisTer from "../components/User/regisTer.vue";
import homePage from "../components/homePage.vue";
import vDitor from "../components/Document/vDitor.vue";
import testVditor from "../views/Document/testVditor.vue"

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