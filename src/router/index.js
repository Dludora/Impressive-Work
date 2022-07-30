import Vue from 'vue'
import VueRouter from 'vue-router'
import regisTer from "@/components/regisTer";

Vue.use(VueRouter)

const routes = [//添加路由对象
    {
        path: '/regisTer',
        name: 'regisTer',
        component: regisTer
    },
]

const router = new VueRouter({
    mode:'history',//采用哪种路由模式,默认是history,可改为hash
    routes
})

export default router