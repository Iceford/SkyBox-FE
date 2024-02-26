<!--
 * @Description: 用于显示一个带有头像图片的容器，头像的 URL 可以通过传入 avatar 属性指定，如果 avatar 为空则使用默认的头像 URL
 * @FilePath: \SkyBox-FE\src\components\Avatar.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:48:01
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-14 15:48:09
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->

<!-- 模板部分 -->
<template>
  <span :style="{ width: width + 'px', height: width + 'px' }" class="avatar">
    <img
        v-if="userId"
        :src="
        avatar && avatar != ''
          ? avatar
          : `${proxy.globalInfo.avatarUrl}${userId}?${timestamp}`
      "
    />
  </span>
</template>

<!-- 脚本部分 -->
<script setup>
import {getCurrentInstance} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  userId: {
    // 用户ID
    type: String,
  },
  avatar: {
    // 头像图像的URL
    type: String,
  },
  timestamp: {
    // 时间戳
    type: Number,
    default: 0,
  },
  width: {
    // 头像的宽度
    type: Number,
    default: 40,
  },
});
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
.avatar {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    object-fit: cover;
  }
}
</style>

