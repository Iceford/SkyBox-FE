<!--
 * @Description: 一个包含了一个表单用于修改用户头像信息的对话框
 * @FilePath: \SkyBox-FE\src\views\UpdateAvatar.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:27:38
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:59:33
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      :showCancel="true"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="昵称" prop="">
          {{ formData.nickName }}
        </el-form-item>
        <!--textarea输入-->
        <el-form-item label="头像" prop="">
          <AvatarUpload v-model="formData.avatar"></AvatarUpload>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import AvatarUpload from "@/components/AvatarUpload.vue";

import { getCurrentInstance, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  updateUserAvatar: "updateUserAvatar",
};

const formData = ref({});
const formDataRef = ref();

const show = (data) => {
  formData.value = Object.assign({}, data);
  formData.value.avatar = { userId: data.userId, qqAvatar: data.avatar };
  dialogConfig.value.show = true;
};

defineExpose({ show });

const dialogConfig = ref({
  show: false,
  title: "修改头像",
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

const emit = defineEmits(["updateAvatar"]);
const submitForm = async () => {
  if (!(formData.value.avatar instanceof File)) {
    dialogConfig.value.show = false;
    return;
  }
  let result = await proxy.Request({
    url: api.updateUserAvatar,
    params: {
      avatar: formData.value.avatar,
    },
  });
  if (!result) {
    return;
  }
  dialogConfig.value.show = false;
  const cookeUserInfo = proxy.VueCookies.get("userInfo");
  delete cookeUserInfo.avatar;
  proxy.VueCookies.set("userInfo", cookeUserInfo, 0);
  //更新cookie信息
  emit("updateAvatar");
};
</script>

<style lang="scss">
</style>

