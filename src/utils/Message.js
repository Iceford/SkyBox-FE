/*
 * @Description: 一个封装了消息提示功能的模块
 * @FilePath: \SkyBox-FE\src\utils\Message.js
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 17:01:52
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-14 17:02:01
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
 */
import {ElMessage} from 'element-plus'

const showMessage = (msg, callback, type) => {
    ElMessage({
        type: type, message: msg, duration: 2000, onClose: () => {
            if (callback) {
                callback();
            }
        }
    })
}

const message = {
    error: (msg, callback) => {
        showMessage(msg, callback, "error");
    }, success: (msg, callback) => {
        showMessage(msg, callback, "success");
    }, warning: (msg, callback) => {
        showMessage(msg, callback, "warning");
    },
}

export default message;

