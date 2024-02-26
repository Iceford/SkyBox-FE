<!--
 * @Description: 一个可关闭的窗口组件，可以根据传入的属性控制窗口的显示与隐藏、宽度、标题和内容对齐方式，并提供了相应的事件处理逻辑和样式定义
 * @FilePath: \SkyBox-FE\src\components\Window.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:30:39
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-04 09:48:31
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->

<!-- 组件的模板 -->
<template>
  <!-- 一个窗口组件的基本结构，使用v-if指令来控制窗口的显示与隐藏 -->
  <div v-if="show" class="window">
    <!-- window-mask元素是一个透明的背景遮罩层，当用户点击它时，会触发窗口的关闭事件 -->
    <div v-if="show" class="window-mask" @click="close"></div>
    <!-- close元素是一个关闭按钮，当用户点击它时，也会触发窗口的关闭事件。按钮上使用了一个图标字体iconfont，表示关闭图标 -->
    <div class="close" @click="close">
      <span class="iconfont icon-close2"> </span>
    </div>
    <!-- window-content元素是窗口的内容区域，包括一个标题栏和一个内容主体。标题栏中显示了一个标题，内容主体使用了Vue的插槽（slot）来插入具体的内容 -->
    <div :style="{
            top: '0px',
            left: windowContentLeft + 'px',
            width: windowContentWidth + 'px',
        }" class="window-content">
      <div class="title">
        {{ title }}
      </div>
      <div :style="{ 'align-items': align }" class="content-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<!-- 组件的逻辑部分 -->
<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
  show: {
    type: Boolean,
  },
  width: {
    type: Number,
    default: 1000,
  },
  title: {
    type: String,
  },
  align: {
    type: String,
    default: "top",
  },
});

const windowWidth = ref(window.innerWidth);
const windowContentWidth = computed(() => {
  return props.width > windowWidth.value ? windowWidth.value : props.width;
});

const windowContentLeft = computed(() => {
  let left = windowWidth.value - props.width;
  return left < 0 ? 0 : left / 2;
});

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};

const resizeWindow = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", resizeWindow);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});
</script>


<!-- 组件的样式 -->
<style lang="scss" scoped>
.window {
  .window-mask {
    top: 0px;
    left: 0px;
    width: 100%;
    height: calc(100vh);
    z-index: 200;
    opacity: 0.5;
    background: #000;
    position: fixed;
  }

  .close {
    z-index: 202;
    cursor: pointer;
    position: absolute;
    top: 40px;
    right: 30px;
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background: #606266;
    display: flex;
    justify-content: center;
    align-items: center;

    .iconfont {
      font-size: 20px;
      color: #fff;
      z-index: 100000;
    }
  }

  .window-content {
    top: 0px;
    z-index: 201;
    position: absolute;
    background: #fff;

    .title {
      text-align: center;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
    }

    .content-body {
      height: calc(100vh - 41px);
      display: flex;
      overflow: auto;
    }
  }
}
</style>

