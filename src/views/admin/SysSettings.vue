<!--
 * @Description: 用于创建一个系统设置面板
 * @FilePath: \SkyBox-FE\src\views\admin\SysSettings.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 17:25:10
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-08 21:33:21
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div class="sys-setting-panel">
    <el-form ref="formDataRef" :model="formData" :rules="rules" label-width="150px" @submit.prevent>
      <!--input输入-->
      <el-form-item label="注册邮件标题" prop="registerEmailTitle">
        <el-input v-model="formData.registerEmailTitle" clearable placeholder="请输入注册邮件验证码邮件标题"></el-input>
      </el-form-item>
      <!--textarea输入-->
      <el-form-item label="注册邮件标题" prop="registerEmailContent">
        <el-input v-model="formData.registerEmailContent" clearable
                  placeholder="请输入注册邮件验证码邮件内容%s占位符为验证码内容"></el-input>
      </el-form-item>
      <el-form-item label="初始空间大小" prop="userInitUseSpace">
        <el-input v-model="formData.userInitUseSpace" clearable placeholder="初始空间大小">
          <template #suffix>MB</template>
        </el-input>
      </el-form-item>
      <!-- 单选 -->
      <el-form-item label="" prop="">
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
import {getCurrentInstance, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  getSysSettings: "/admin/getSysSettings",
  saveSettings: "/admin/saveSysSettings",
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  registerEmailTitle: [
    {required: true, message: "请输入注册邮件验证码邮件标题"},
  ],
  registerEmailContent: [
    {required: true, message: "请输入注册邮件验证码邮件内容"},
  ],
  userInitUseSpace: [
    {required: true, message: "请输入初始化空间大小"},
    {
      validator: proxy.Verify.number,
      message: "空间大小只能是数字",
    },
  ],
};

const getSysSettings = async () => {
  let result = await proxy.Request({
    url: api.getSysSettings,
  });
  if (!result) {
    return;
  }
  formData.value = result.data;
};
getSysSettings();

const saveSettings = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    let result = await proxy.Request({
      url: api.saveSettings,
      params: params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("保存成功");
  });
};
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
.sys-setting-panel {
  margin-top: 20px;
  width: 600px;
}
</style>

