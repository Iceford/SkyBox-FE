<!--
 * @Description: 用于实现一个音乐播放器的功能
 * @FilePath: \SkyBox-FE\src\components\preview\PreviewMusic.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-30 00:03:57
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-06 03:39:16
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div class="music">
    <div class="body-content">
      <div class="cover">
        <img src="@/assets/music_cover.png"/>
      </div>
      <div ref="playerRef" class="music-player"></div>
    </div>
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
import APlayer from "APlayer";
import "APlayer/dist/APlayer.min.css";

import {getCurrentInstance, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  url: {
    type: String,
  },
  fileName: {
    type: String,
  },
});

const playerRef = ref();
const player = ref();
onMounted(() => {
  player.value = new APlayer({
    container: playerRef.value,
    audio: {
      url: `/api${props.url}`,
      name: `${props.fileName}`,
      cover: new URL(`@/assets/music_icon.png`, import.meta.url).href,
      artist: "",
    },
  });
});

onUnmounted(() => {
  player.value.destroy();
});
</script>


<!-- 样式部分 -->
<style lang="scss" scoped>
.music {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .body-content {
    text-align: center;
    width: 80%;

    .cover {
      margin: 0px auto;
      width: 200px;
      text-align: center;

      img {
        width: 100%;
      }
    }

    .music-player {
      margin-top: 20px;
    }
  }
}
</style>

