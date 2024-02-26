/*
 * @Description: 一个使用Vue.js框架中的vue-router库来创建路由的示例
 * @FilePath: \SkyBox-FE\src\router\index.js
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 16:47:07
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:57:55
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
 */
import {createRouter, createWebHistory} from 'vue-router' // 分别用于创建路由和指定路由的历史模式
import VueCookies from 'vue-cookies' // 用于处理Cookie相关的操作

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    // 定义应用程序的各个路由
    routes: [
        {
            path: '/login',
            name: '登录',
            component: () => import("@/views/Login.vue")
        },
        {
            path: '/qqlogincallback',
            name: 'qq登录回调',
            component: () => import("@/views/QqLoginCallback.vue")
        },
        {
            path: "/",
            component: () => import("@/views/Framework.vue"),
            children: [
                {
                    path: '/',
                    redirect: "/main/all"
                },
                // 一个动态参数，可以匹配不同的值
                {
                    path: '/main/:category',
                    name: '首页',
                    meta: {
                        needLogin: true,
                        menuCode: "main"
                    },
                    component: () => import("@/views/main/Main.vue")
                },
                {
                    path: '/myshare',
                    name: '我的分享',
                    meta: {
                        needLogin: true,
                        menuCode: "share"
                    },
                    component: () => import("@/views/share/Share.vue")
                },
                {
                    path: '/recycle',
                    name: '回收站',
                    meta: {
                        needLogin: true,
                        menuCode: "recycle"
                    },
                    component: () => import("@/views/recycle/Recycle.vue")
                },
                {
                    path: '/settings/sysSetting',
                    name: '系统设置',
                    meta: {
                        needLogin: true,
                        menuCode: "settings"
                    },
                    component: () => import("@/views/admin/SysSettings.vue")
                },
                {
                    path: '/settings/userList',
                    name: '用户管理',
                    meta: {
                        needLogin: true,
                        menuCode: "settings"
                    },
                    component: () => import("@/views/admin/UserList.vue")
                },
                {
                    path: '/settings/fileList',
                    name: '用户文件',
                    meta: {
                        needLogin: true,
                        menuCode: "settings"
                    },
                    component: () => import("@/views/admin/FileList.vue")
                },
            ]
        },
        {
            path: '/shareCheck/:shareId',
            name: '分享校验',
            component: () => import("@/views/webshare/ShareCheck.vue")
        },
        {
            path: '/share/:shareId',
            name: '分享',
            component: () => import("@/views/webshare/Share.vue")
        }, {
            path: '/qqlogincalback',
            name: "qq登录回调",
            component: () => import('@/views/QqLoginCallback.vue'),
        }
    ]
})

// 一个全局前置守卫，用于在路由切换前进行一些逻辑处理
router.beforeEach((to, from, next) => {
    // 检查用户是否已登录，如果未登录且目标路由需要登录，则会跳转到登录页面
    const userInfo = VueCookies.get("userInfo");
    if (to.meta.needLogin != null && to.meta.needLogin && userInfo == null) {
        router.push("/login");
    }
    next();
})

export default router

