<!--
 * @Description: 一个用于修改密码的对话框
 * @FilePath: \src\views\UpdatePassword.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 19:53:17
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:43:49
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div>
    <Dialog
        :buttons="dialogConfig.buttons"
        :show="dialogConfig.show"
        :showCancel="true"
        :title="dialogConfig.title"
        width="500px"
        @close="dialogConfig.show = false"
    >
      <el-form
          ref="formDataRef"
          :model="formData"
          :rules="rules"
          label-width="80px"
          @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="新密码" prop="password">
          <el-input
              v-model="formData.password"
              placeholder="请输入密码"
              show-password
              size="large"
              type="password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!--input输入-->
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
              v-model="formData.rePassword"
              placeholder="请再次输入密码"
              show-password
              size="large"
              type="password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  updatePassword: "updatePassword",
};

const formData = ref({});
const formDataRef = ref();

const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.rePassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const rules = {
  password: [
    {required: true, message: "请输入密码"},
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字，字母，特殊字符 8-18位",
    },
  ],
  rePassword: [
    {required: true, message: "请再次输入密码"},
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
};
const show = () => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {};
  });
};

defineExpose({show});

const dialogConfig = ref({
  show: false,
  title: "修改密码",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.updatePassword,
      params: {
        password: formData.value.password,
      },
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.message.success("密码修改成功");
  });
};
</script>

<style lang="scss"></style>

