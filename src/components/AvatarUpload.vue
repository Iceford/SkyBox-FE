<!--
 * @Description: 一个头像上传组件，包括一个用于显示头像的区域和一个选择按钮。用户可以选择本地的图片文件进行上传，并在头像显示区域预览所选择的图片。
 * @FilePath: \SkyBox-FE\src\components\AvatarUpload.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:41:50
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-30 00:23:03
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->

<!-- 模板部分 -->
<template>
  <div class="avatar-upload">
    <div class="avatar-show">
      <template v-if="localFile">
        <img :src="localFile"/>
      </template>
      <template v-else>
        <img
            v-if="modelValue && modelValue.qqAvatar"
            :src="`${modelValue.qqAvatar}`"
        />
        <img v-else :src="`/api/getAvatar/${modelValue.userId}`"/>
      </template>
    </div>
    <div class="select-btn">
      <el-upload
          :http-request="uploadImage"
          :multiple="false"
          :show-file-list="false"
          accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
          name="file"
      >
        <el-button type="primary">选择</el-button>
      </el-upload>
    </div>
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
import {getCurrentInstance, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const timestamp = ref("");

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
});

const localFile = ref(null);
const emit = defineEmits();
const uploadImage = async (file) => {
  file = file.file;
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({target}) => {
    localFile.value = target.result;
  };
  emit("update:modelValue", file);
};
</script>


<!-- 样式部分 -->
<style lang="scss">
// 指定了整个组件的样式，将其显示为弹性盒子，水平居中并与底部对齐
.avatar-upload {
  display: flex;
  justify-content: center;
  align-items: end;

  // 指定了头像显示区域的样式
  .avatar-show {
    background: rgb(245, 245, 245);
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;

    // 指定了图标的样式，设置了字体大小和颜色
    .iconfont {
      font-size: 50px;
      color: #ddd;
    }

    // 指定了头像图片的样式
    img {
      width: 100%;
      height: 100%;
    }

    // 指定了操作按钮的样式，设置了绝对定位、颜色和顶部位置
    .op {
      position: absolute;
      color: #0e8aef;
      top: 80px;
    }
  }

  // 指定了选择按钮的样式，设置了左边距和垂直对齐方式
  .select-btn {
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>