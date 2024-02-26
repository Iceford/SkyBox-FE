<!--
 * @Description: 用于在网页上播放视频
 * @FilePath: \SkyBox-FE\src\components\preview\PreviewVideo.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-30 00:03:57
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-07 16:07:50
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div id="player" ref="player"></div>
</template>

<!-- 脚本部分 -->
<script setup>
import DPlayer from "dplayer";
import {getCurrentInstance, onMounted, ref} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  url: {
    type: String,
  },
});

const videoInfo = ref({
  video: null,
});

const player = ref();
const initPlayer = () => {
  const dp = new DPlayer({
    element: player.value,
    theme: "#b7daff",
    screenshot: true,
    video: {
      //  pic: videoInfo.img, // 封面
      url: `/api${props.url}`,
      type: "customHls",
      customType: {
        customHls: function (video, player) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    },
  });
};

onMounted(() => {
  initPlayer();
});
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
#player {
  width: 100%;

  :deep .dplayer-video-wrap {
    text-align: center;

    .dplayer-video {
      margin: 0px auto;
      max-height: calc(100vh - 41px);
    }
  }
}
</style>

