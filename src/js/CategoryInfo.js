/*
 * @Description: 一个JavaScript对象，其中包含了不同类型文件的接受格式
 * @FilePath: \SkyBox-FE\src\js\CategoryInfo.js
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 16:38:07
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:57:46
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
 */

export default {
    // 所有类型的文件
    "all": {
        accept: "*"
    },
    // 视频文件
    "video": {
        accept: ".mp4,.avi,.rmvb,.mkv,.mov"
    },
    // 音乐文件
    "music": {
        accept: ".mp3,.wav,.wma,.mp2,.flac,.midi,.ra,.ape,.aac,.cda"
    },
    // 图片文件
    "image": {
        accept: ".jpeg,.jpg,.png,.gif,.bmp,.dds,.psd,.pdt,.webp,.xmp,.svg,.tiff"
    },
    // 文档文件
    "doc": {
        accept: ".pdf,.doc,.docx,.xls,.xlsx,.txt"
    },
    // 其他类型的文件
    "others": {
        accept: "*"
    },
}

