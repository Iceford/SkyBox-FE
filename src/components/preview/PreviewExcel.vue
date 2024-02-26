<!--
 * @Description: 用于在网页中展示Excel文件的内容
 * @FilePath: \SkyBox-FE\src\components\preview\PreviewExcel.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-30 00:03:57
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-06 01:36:36
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div v-html="excelContent" class="talbe-info"></div>
</template>

<!-- 脚本部分 -->
<script setup>
// 导入名为xlsx的JavaScript库，该库提供了处理Excel文件的功能
import * as XLSX from "xlsx";
// 导入Vue的一些辅助函数，用于在组件中进行操作
import {getCurrentInstance, onMounted, ref} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  url: {
    type: String,
  },
});

const excelContent = ref();
const initExcel = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: "arraybuffer",
  });
  if (!result) {
    return;
  }
  let workbook = XLSX.read(new Uint8Array(result), {type: "array"}); // 解析数据
  var worksheet = workbook.Sheets[workbook.SheetNames[0]]; // workbook.SheetNames 下存的是该文件每个工作表名字,这里取出第一个工作表
  excelContent.value = XLSX.utils.sheet_to_html(worksheet);
};
onMounted(() => {
  initExcel();
});
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
.talbe-info {
  width: 100%;
  padding: 10px;

  :deep table {
    width: 100%;
    border-collapse: collapse;

    td {
      border: 1px solid #ddd;
      border-collapse: collapse;
      padding: 5px;
      height: 30px;
      min-width: 50px;
    }
  }
}
</style>

