<!--
 * @Description:用于在网页中展示文件分享的界面
 * @FilePath: \SkyBox-FE\src\views\webshare\ShareCheck.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 19:45:54
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-09 03:31:13
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div class="share">
    <div class="body-content">
      <div class="logo">
        <span class="iconfont icon-pan"></span>
        <span class="name">SkyBox</span>
      </div>
      <div class="code-panel">
        <div class="file-info">
          <div class="avatar">
            <Avatar
                :avatar="shareInfo.avatar"
                :userId="shareInfo.userId"
                :width="50"
            ></Avatar>
          </div>
          <div class="share-info">
            <div class="user-info">
              <span class="nick-name">{{ shareInfo.nickName }} </span>
              <span class="share-time">分享于 {{ shareInfo.shareTime }}</span>
            </div>
            <div class="file-name">分享文件：{{ shareInfo.fileName }}</div>
          </div>
        </div>
        <div class="code-body">
          <div class="tips">请输入提取码：</div>
          <div class="input-area">
            <el-form
                ref="formDataRef"
                :maxLength="5"
                :model="formData"
                :rules="rules"
                @submit.prevent
            >
              <!--input输入-->
              <el-form-item prop="code">
                <el-input
                    v-model="formData.code"
                    class="input"
                    @keyup.enter="checkShare"
                ></el-input>
                <el-button type="primary" @click="checkShare"
                >提取文件
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
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

const api = {
  getShareInfo: "/showShare/getShareInfo",
  checkShareCode: "/showShare/checkShareCode",
};

const shareId = route.params.shareId;
const shareInfo = ref({});
const getShareInfo = async () => {
  let result = await proxy.Request({
    url: api.getShareInfo,
    params: {
      shareId,
    },
  });
  if (!result) {
    return;
  }
  shareInfo.value = result.data;
};
getShareInfo();

const formData = ref({});
const formDataRef = ref();
const rules = {
  code: [
    {required: true, message: "请输入提取码"},
    {min: 5, message: "提取码为5位"},
    {max: 5, message: "提取码为5位"},
  ],
};

const checkShare = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.checkShareCode,
      params: {
        shareId: shareId,
        code: formData.value.code,
      },
    });
    if (!result) {
      return;
    }
    router.push(`/share/${shareId}`);
  });
};
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
.share {
  height: calc(100vh);
  background: url("../../assets/share_bg.png");
  background-repeat: repeat-x;
  background-position: 0 bottom;
  background-color: #eef2f6;
  display: flex;
  justify-content: center;

  .body-content {
    margin-top: calc(100vh / 5);
    width: 500px;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;

      .icon-pan {
        font-size: 60px;
        color: #409eff;
      }

      .name {
        font-weight: bold;
        margin-left: 5px;
        font-size: 25px;
        color: #409eff;
      }
    }

    .code-panel {
      margin-top: 20px;
      background: #fff;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 0 7px 1px #5757574f;

      .file-info {
        padding: 10px 20px;
        background: #409eff;
        color: #fff;
        display: flex;
        align-items: center;

        .avatar {
          margin-right: 5px;
        }

        .share-info {
          .user-info {
            display: flex;
            align-items: center;

            .nick-name {
              font-size: 15px;
            }

            .share-time {
              margin-left: 20px;
              font-size: 12px;
            }
          }

          .file-name {
            margin-top: 10px;
            font-size: 12px;
          }
        }
      }

      .code-body {
        padding: 30px 20px 60px 20px;

        .tips {
          font-weight: bold;
        }

        .input-area {
          margin-top: 10px;

          .input {
            flex: 1;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>

