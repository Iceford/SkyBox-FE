<!--
 * @Description: 用于在网页中嵌入和预览PDF文件
 * @FilePath: \SkyBox-FE\src\components\preview\PreviewPdf.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:32:40
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:55:37
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- HTML模板部分 -->
<template>
  <div class="pdf">
    <vue-pdf-embed
        ref="pdfRef"
        :page="state.pageNum"
        :source="state.url"
        :style="scaleFun"
        class="vue-pdf-embed"
        width="850"
    />
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
import VuePdfEmbed from "vue-pdf-embed";
import {createLoadingTask} from "vue3-pdfjs";
import {ElLoading} from "element-plus";

import {computed, getCurrentInstance, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  url: {
    type: String,
  },
});
const scaleFun = computed(() => {
  return "transform:scale(${state.scale})";
});

const state = reactive({
  url: "", // 预览pdf文件地址
  pageNum: 0, // 当前页面
  numPages: 0, // 总页数
});

const init = () => {
  const url = "/api" + props.url;
  state.url = url;
  const loading = ElLoading.service({
    lock: true,
    text: "加载中......",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const loadingTask = createLoadingTask(state.url);
  loadingTask.promise.then((pdf) => {
    loading.close();
    state.numPages = pdf.numPages;
  });
};

init();
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
.pdf {
  width: 100%;
}
</style>

