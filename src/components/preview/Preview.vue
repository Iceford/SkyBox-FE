<!--
 * @Description: 根据文件的类型和类别展示不同的预览内容
 * @FilePath: \SkyBox-FE\src\components\preview\Preview.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 16:30:23
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-14 16:33:25
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->

<!-- 组件的模板，即组件的 HTML 结构。根据条件渲染，展示不同的预览组件或窗口组件。 -->
<template>
  <!-- 如果 fileInfo.fileCategory 的值为 3，即文件类别为 3，将显示 PreviewImage 组件，用于预览图片。 -->
  <PreviewImage
      v-if="fileInfo.fileCategory == 3"
      ref="imageViewerRef"
      :imageList="[imageUrl]"
  ></PreviewImage>
  <!-- 否则，将显示 Window 组件，用于展示其他文件类型的预览内容。 -->
  <Window
      v-else
      :align="fileInfo.fileCategory == 1 ? 'center' : 'top'"
      :show="windowShow"
      :title="fileInfo.fileName"
      :width="fileInfo.fileCategory == 1 ? 1500 : 900"
      @close="closeWindow"
  >
    <PreviewVideo v-if="fileInfo.fileCategory == 1" :url="url"></PreviewVideo>
    <PreviewExcel v-if="fileInfo.fileType == 6" :url="url"></PreviewExcel>
    <PreviewDoc v-if="fileInfo.fileType == 5" :url="url"></PreviewDoc>
    <PreviewPdf v-if="fileInfo.fileType == 4" :url="url"></PreviewPdf>
    <PreviewTxt
        v-if="fileInfo.fileType == 7 || fileInfo.fileType == 8"
        :url="url"
    ></PreviewTxt>
    <!--特殊预览-->
    <PreviewMusic
        v-if="fileInfo.fileCategory == 2"
        :fileName="fileInfo.fileName"
        :url="url"
    ></PreviewMusic>
    <PreviewDownload
        v-if="fileInfo.fileCategory == 5 && fileInfo.fileType != 8"
        :createDownloadUrl="createDownloadUrl"
        :downloadUrl="downloadUrl"
        :fileInfo="fileInfo"
    ></PreviewDownload>
  </Window>
</template>


<!-- Vue 3 中的新特性，用于编写组件的逻辑部分 -->
<script setup>
// 引入了多个预览组件
import PreviewDoc from "@/components/preview/PreviewDoc.vue";
import PreviewExcel from "@/components/preview/PreviewExcel.vue";
import PreviewImage from "@/components/preview/PreviewImage.vue";
import PreviewPdf from "@/components/preview/PreviewPdf.vue";
import PreviewVideo from "@/components/preview/PreviewVideo.vue";
import PreviewTxt from "@/components/preview/PreviewTxt.vue";
import PreviewDownload from "@/components/preview/PreviewDownload.vue";
import PreviewMusic from "@/components/preview/PreviewMusic.vue";

import {computed, getCurrentInstance, nextTick, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

// 使用 reactive 创建了响应式对象 fileInfo、windowShow、url、createDownloadUrl 和 downloadUrl

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const imageUrl = computed(() => {
  return (
      proxy.globalInfo.imageUrl + fileInfo.value.fileCover.replaceAll("_.", ".")
  );
});

const windowShow = ref(false);
const closeWindow = () => {
  windowShow.value = false;
};
const FILE_URL_MAP = {
  0: {
    fileUrl: "/file/getFile",
    videoUrl: "/file/ts/getVideoInfo",
    createDownloadUrl: "/file/createDownloadUrl",
    downloadUrl: "/api/file/download",
  },
  1: {
    fileUrl: "/admin/getFile",
    videoUrl: "/admin/ts/getVideoInfo",
    createDownloadUrl: "/admin/createDownloadUrl",
    downloadUrl: "/api/admin/download",
  },
  2: {
    fileUrl: "/showShare/getFile",
    videoUrl: "/showShare/ts/getVideoInfo",
    createDownloadUrl: "/showShare/createDownloadUrl",
    downloadUrl: "/api/showShare/download",
  },
};
const url = ref(null);
const createDownloadUrl = ref(null);
const downloadUrl = ref(null);

const fileInfo = ref({});

const imageViewerRef = ref();

// 根据文件的类型和类别设置相关信息，并在用户触发预览时展示对应的组件
const showPreview = (data, showPart) => {
  fileInfo.value = data;
  if (data.fileCategory == 3) {
    nextTick(() => {
      imageViewerRef.value.show(0);
    });
  } else {
    windowShow.value = true;
    let _url = FILE_URL_MAP[showPart].fileUrl;
    // 视频地址单独处理
    if (data.fileCategory == 1) {
      _url = FILE_URL_MAP[showPart].videoUrl;
    }
    let _createDownloadUrl = FILE_URL_MAP[showPart].createDownloadUrl;
    let _downloadUrl = FILE_URL_MAP[showPart].downloadUrl;
    if (showPart == 0) {
      _url = _url + "/" + data.fileId;
      _createDownloadUrl = _createDownloadUrl + "/" + data.fileId;
    } else if (showPart == 1) {
      _url = _url + "/" + data.userId + "/" + data.fileId;
      _createDownloadUrl =
          _createDownloadUrl + "/" + data.userId + "/" + data.fileId;
    } else if (showPart == 2) {
      _url = _url + "/" + data.shareId + "/" + data.fileId;
      _createDownloadUrl =
          _createDownloadUrl + "/" + data.shareId + "/" + data.fileId;
    }
    url.value = _url;
    createDownloadUrl.value = _createDownloadUrl;
    downloadUrl.value = _downloadUrl;
  }
};
defineExpose({showPreview});
</script>

<style lang="scss"></style>

