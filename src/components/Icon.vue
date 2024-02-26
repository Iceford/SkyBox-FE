<!--
 * @Description: 用于显示一个图标
 * @FilePath: \src\components\Icon.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:30:11
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:19:57
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->

<!-- 模板部分 -->
<template>
  <span :style="{ width: width + 'px', height: width + 'px' }" class="icon">
    <img :src="getImage()" :style="{ 'object-fit': fit }"/>
  </span>
</template>
<!-- 设置组件的逻辑部分 -->
<script setup>
import {getCurrentInstance} from "vue";
// 法获取当前组件实例的代理对象
const {proxy} = getCurrentInstance();

// 使用 defineProps 方法定义组件的属性
const props = defineProps({
  fileType: {
    type: Number,
  },
  iconName: {
    type: String,
  },
  cover: {
    type: String,
  },
  width: {
    type: Number,
    default: 32,
  },
  fit: {
    type: String,
    default: "cover",
  },
});

// 文件类型映射到对应的描述和图标。
const fileTypeMap = {
  0: {desc: "目录", icon: "folder"},
  1: {desc: "视频", icon: "video"},
  2: {desc: "音频", icon: "music"},
  3: {desc: "图片", icon: "image"},
  4: {desc: "exe", icon: "pdf"},
  5: {desc: "doc", icon: "word"},
  6: {desc: "excel", icon: "excel"},
  7: {desc: "纯文本", icon: "txt"},
  8: {desc: "程序", icon: "code"},
  9: {desc: "压缩包", icon: "zip"},
  10: {desc: "其他文件", icon: "others"},
};

// 根据传入的属性来获取图像的路径
const getImage = () => {
  if (props.cover) {
    return proxy.globalInfo.imageUrl + props.cover;
  }
  let icon = "unknown_icon";
  if (props.iconName) {
    icon = props.iconName;
  } else {
    console.log(props.fileType);
    const iconMap = fileTypeMap[props.fileType];
    if (iconMap !== undefined) {
      icon = iconMap["icon"];
    }
  }
  return new URL(`/src/assets/icon-image/${icon}.png`, import.meta.url).href;
};
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
.icon {
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
