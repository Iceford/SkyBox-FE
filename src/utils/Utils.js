/*
 * @Description: 将文件大小转换为易读的字符串格式，方便在界面或日志中展示文件大小信息
 * @FilePath: \SkyBox-FE\src\utils\Utils.js
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 17:03:38
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-14 17:03:48
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
 */
export default {
    sizeToStr: (limit) => {
        var size = "";
        if (limit < 0.1 * 1024) {                            //小于0.1KB，则转化成B
            size = limit.toFixed(2) + "B"
        } else if (limit < 0.1 * 1024 * 1024) {            //小于0.1MB，则转化成KB
            size = (limit / 1024).toFixed(2) + "KB"
        } else if (limit < 0.1 * 1024 * 1024 * 1024) {        //小于0.1GB，则转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + "MB"
        } else {                                            //其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
        }
        var sizeStr = size + "";                        //转成字符串
        var index = sizeStr.indexOf(".");                    //获取小数点处的索引
        var dou = sizeStr.substr(index + 1, 2)            //获取小数点后两位的值
        if (dou == "00") {                                //判断后两位是否为00，如果是则删除00               
            return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
        }
        return size;
    },
}

