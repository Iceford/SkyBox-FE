<!--
 * @Description: 在页面加载时发送登录请求到后端，获取用户信息并存储到cookie中，然后根据返回的callbackUrl进行页面重定向。同时，在页面上显示了一个简单的提示信息
 * @FilePath: \SkyBox-FE\src\views\QqLoginCallback.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:27:29
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-11 23:29:50
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div>登录中，请勿刷新页面</div>
</template>

<script setup>
import {getCurrentInstance} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  logincallback: "/qqlogin/callback",
};
const login = async () => {
  let result = await proxy.Request({
    url: api.logincallback,
    params: router.currentRoute.value.query,
    errorCallback: () => {
      router.push("/");
    },
  });
  if (!result) {
    return;
  }

  let redirectUrl = result.data.callbackUrl || "/";
  if (redirectUrl == "/login") {
    redirectUrl = "/";
  }
  proxy.VueCookies.set("userInfo", result.data.userInfo, 0);
  console.log("路径", redirectUrl);
  router.push(redirectUrl);
};
login();
</script>

<style lang="scss" scoped>
</style>

