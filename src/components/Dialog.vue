<!--
 * @Description: 一个可定制的对话框组件，可以接受多个属性和自定义按钮
 * @FilePath: \SkyBox-FE\src\components\Dialog.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:29:56
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-30 00:37:43
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->

<!-- 模板部分 -->
<template>
  <div>
    <el-dialog
        :close-on-click-modal="false"
        :draggable="true"
        :model-value="show"
        :show-close="showClose"
        :title="title"
        :top="top + 'px'"
        :width="width"
        class="cust-dialog"
        @close="close"
    >
      <div
          :style="{ 'max-height': maxHeight + 'px', padding: padding + 'px' }"
          class="dialog-body"
      >
        <slot></slot>
      </div>
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button v-if="showCancel" link @click="close"> 取消</el-button>
          <el-button
              v-for="btn in buttons"
              :type="btn.type || 'primary'"
              @click="btn.click"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
const props = defineProps({
  title: {
    type: String,
  },
  show: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  top: {
    type: Number,
    default: 50,
  },
  width: {
    type: String,
    default: "30%",
  },
  buttons: {
    type: Array,
  },
  padding: {
    type: Number,
    default: 15,
  },
});

const maxHeight = window.innerHeight - props.top - 100;

const emit = defineEmits();
const close = () => {
  emit("close");
};
</script>


<!-- 样式部分 -->
<style lang="scss">
.cust-dialog {
  margin: 30px auto 10px !important;

  .el-dialog__body {
    padding: 0px;
  }

  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    min-height: 80px;
    overflow: auto;
  }

  .dialog-footer {
    text-align: right;
    padding: 5px 20px;
  }
}
</style>