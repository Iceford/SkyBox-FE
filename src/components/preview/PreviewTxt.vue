<!--
 * @Description: 用于显示和操作文本内容
 * @FilePath: \SkyBox-FE\src\components\preview\PreviewTxt.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:32:51
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:55:48
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div class="code">
    <div class="top-op">
      <div class="encode-select">
        <el-select
            v-model="encode"
            placeholder="选择编码"
            @change="changeEncode"
        >
          <el-option label="utf8编码" value="utf8"></el-option>
          <el-option label="gbk编码" value="gbk"></el-option>
        </el-select>
        <div class="tips">如果出现乱码,请切换编码</div>
      </div>
      <div class="copy-btn">
        <el-button type="primary" @click="copy">复制</el-button>
      </div>
    </div>
    <highlightjs :code="txtContent" autodetect/>
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
import useClipboard from "vue-clipboard3";
import {getCurrentInstance, onMounted, ref} from "vue";

const {toClipboard} = useClipboard();

const {proxy} = getCurrentInstance();

const props = defineProps({
  url: {
    type: String,
  },
});

const codeRef = ref();
const txtContent = ref("");
const blobResult = ref();
const encode = ref("utf8");
const readTxt = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: "blob",
  });
  if (!result) {
    return;
  }
  blobResult.value = result;
  showTxt();
};

const changeEncode = (e) => {
  encode.value = e;
  showTxt();
};

const showTxt = () => {
  const reader = new FileReader();
  reader.onload = () => {
    let txt = reader.result;
    txtContent.value = txt; //获取的数据data
  };
  reader.readAsText(blobResult.value, encode.value);
};

onMounted(() => {
  readTxt();
});

const copy = async () => {
  await toClipboard(txtContent.value);
  proxy.Message.success("复制成功");
};
</script>


<!-- 样式部分 -->
<style lang="scss" scoped>
.code {
  width: 100%;

  .top-op {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .encode-select {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 5px 10px;

    .tips {
      margin-left: 10px;
      color: #828282;
    }
  }

  .copy-btn {
    margin-right: 10px;
  }

  pre {
    margin: 0px;
  }
}
</style>

