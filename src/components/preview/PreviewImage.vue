<!--
 * @Description: 用于实现图片查看器的功能
 * @FilePath: \SkyBox-FE\src\components\preview\PreviewImage.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-30 00:03:57
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-06 01:40:04
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->

<!-- 模板部分 -->
<template>
  <div class="image-viewer">
    <el-image-viewer
        v-if="previewImgIndex != null"
        :initial-index="previewImgIndex"
        :url-list="imageList"
        hide-on-click-modal
        @close="closeImgViewer"
    >
    </el-image-viewer>
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
import {ref} from "vue";

const prosp = defineProps({
  imageList: {
    type: Array,
  },
});

const previewImgIndex = ref(null);

const show = (index) => {
  stopScroll();
  previewImgIndex.value = index;
};

defineExpose({show});

const closeImgViewer = () => {
  startScroll();
  previewImgIndex.value = null;
};

//禁止滚动
const stopScroll = () => {
  document.body.style.overflow = "hidden";
};

// 开始滚动
const startScroll = () => {
  document.body.style.overflow = "auto";
};
</script>


<!-- 样式部分 -->
<style lang="scss" scoped>
.image-viewer {
  .el-image-viewer__mask {
    opacity: 0.7;
  }
}
</style>

