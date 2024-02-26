/*
 * @Description: 一个使用Pinia库定义的用户存储
 * @FilePath: \SkyBox-FE\src\stores\useInfoStore.js
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 16:51:24
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-14 16:53:47
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
 */

import {defineStore} from 'pinia' // 定义Pinia存储

export const userStore = defineStore('userInfo', {
    // 一个函数，返回存储的初始状态
    state: () => {
        return {
            userInfo: {},
        }
    },
    // 一个对象，包含存储的计算属性
    getters: {
        getUserInfo() {
            return this.userInfo;
        }
    },
    // 一个对象，包含存储的异步操作
    actions: {
        saveUserInfo(userInfo) {
            this.userInfo = userInfo
        }
    }
})

