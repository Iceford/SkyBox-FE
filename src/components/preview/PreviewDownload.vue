<!--
 * @Description: 用于在网页中展示其他文件类型（非docx）的预览界面
 * @FilePath: \SkyBox-FE\src\components\preview\PreviewDownload.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-30 00:03:57
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-06 01:35:20
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div class="others">
    <div class="body-content">
      <div>
        <icon
            :iconName="fileInfo.fileType == 9 ? 'zip' : 'others'"
            :width="80"
        ></icon>
      </div>
      <div class="file-name">{{ fileInfo.fileName }}</div>
      <div class="tips">该类型的文件暂不支持预览，请下载后查看</div>
      <div class="download-btn">
        <el-button type="primary" @click="download"
        >点击下载 {{ proxy.Utils.sizeToStr(fileInfo.fileSize) }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
import {getCurrentInstance} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  createDownloadUrl: {
    type: String,
  },
  downloadUrl: {
    type: String,
  },
  fileInfo: {
    type: Object,
  },
});

//下载文件
const download = async () => {
  let result = await proxy.Request({
    url: props.createDownloadUrl,
  });
  if (!result) {
    return;
  }
  window.location.href = props.downloadUrl + "/" + result.data;
};
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
.others {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .body-content {
    text-align: center;

    .file-name {
      font-weight: bold;
    }

    .tips {
      color: #999898;
      margin-top: 5px;
      font-size: 13px;
    }

    .download-btn {
      margin-top: 20px;
    }
  }
}
</style>

