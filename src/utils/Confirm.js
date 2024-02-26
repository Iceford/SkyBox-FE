/*
 * @Description: 一个封装了确认对话框功能的模块
 * @FilePath: \SkyBox-FE\src\utils\Confirm.js
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 16:55:31
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-14 16:58:39
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
 */

import {ElMessageBox} from 'element-plus'


const confirm = (message, okfun) => {
    ElMessageBox.confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
    }).then(() => {
        okfun();
    }).catch(() => {
    })
};

export default confirm;

