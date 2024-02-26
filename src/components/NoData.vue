<!--
 * @Description: 用于显示一个无数据状态的提示信息，包含一个空图标和一条消息
 * @FilePath: \SkyBox-FE\src\components\NoData.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:30:30
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:57:25
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 组件的模板 -->
<template>
  <div class="no-data">
    <div class="iconfont icon-empty"></div>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<!-- 组件的逻辑部分 -->
<script setup>
const props = defineProps({
  msg: {
    type: String,
  },
});
</script>

<!-- 组件的样式 -->
<style lang="scss" scoped>
.no-data {
  text-align: center;
  padding: 10px 0px;

  .icon-empty {
    font-size: 50px;
    color: #bbb;
  }

  .msg {
    margin-top: 10px;
    color: #909399;
    font-size: 14px;
  }
}
</style>

