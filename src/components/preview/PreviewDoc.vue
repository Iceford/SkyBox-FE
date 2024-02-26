<!--
 * @Description: 用于在网页中预览和显示一个docx文档
 * @FilePath: \SkyBox-FE\src\components\preview\PreviewDoc.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-30 00:03:57
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-06 01:33:03
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div ref="docRef" class="doc-content"></div>
</template>

<!-- 脚本部分 -->
<script setup>
// 导入名为docx-preview的JavaScript库，该库提供了处理docx文档的功能
import * as docx from "docx-preview";
// 导入Vue的一些辅助函数，用于在组件中进行操作
import {getCurrentInstance, onMounted, ref} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  url: {
    type: String,
  },
});

const docRef = ref();
const initDoc = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: "blob",
  });
  if (!result) {
    return;
  }
  docx.renderAsync(result, docRef.value);
};
onMounted(() => {
  initDoc();
});
</script>


<!-- 样式部分 -->
<style lang="scss" scoped>
.doc-content {
  margin: 0px auto;

  :deep .docx-wrapper {
    background: #fff;
    padding: 10px 0px;
  }

  :deep .docx-wrapper > section.docx {
    margin-bottom: 0px;
  }
}
</style>

