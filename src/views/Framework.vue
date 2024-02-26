<!--
 * @Description: 一个网盘系统的前端界面，包括了用户信息展示、文件上传、菜单切换和空间使用情况展示等功能
 * @FilePath: \src\views\Framework.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 19:52:57
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 22:57:45
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div class="framework">
    <div class="header">
      <div class="logo">
        <span class="iconfont icon-pan"></span>
        <span class="name">SkyBox</span>
      </div>

      <div class="right-panel">
        <el-popover
            v-model:visible="showUploader"
            :hide-after="0"
            :offset="20"
            :popper-style="{ padding: '0px' }"
            :width="800"
            transition="none"
            trigger="click"
        >
          <template #reference>
            <span class="iconfont icon-transfer"></span>
          </template>
          <template #default>
            <Uploader
                ref="uploaderRef"
                @uploadCallback="uploadCallbackHandler"
            ></Uploader>
          </template>
        </el-popover>

        <el-dropdown>
          <div class="user-info">
            <div class="avatar">
              <Avatar
                  :avatar="userInfo.avatar"
                  :timestamp="timestamp"
                  :userId="userInfo.userId"
                  :width="46"
              >
              </Avatar>
            </div>
            <span class="nick-name">{{ userInfo.nickName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="message-item" @click="updateAvatar">
                修改头像
              </el-dropdown-item>
              <el-dropdown-item class="message-item" @click="updatePassword">
                修改密码
              </el-dropdown-item>
              <el-dropdown-item class="message-item" @click="logout">
                退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 主体 -->
    <div class="body">
      <!-- 最左侧菜单栏 一级目录-->
      <div class="left-side">
        <div class="menu-list">
          <div
              v-for="item in menus"
              :class="[
              'menu-item',
              item.menuCode == currentMenu.menuCode ? 'active' : '',
            ]"
              @click="jump(item)"
          >
            <template v-if="item.allShow || (!item.allShow && userInfo.admin)">
              <div :class="['iconfont', 'icon-' + item.icon]"></div>
              <div class="text">
                {{ item.name }}
              </div>
            </template>
          </div>
        </div>
        <div class="menu-sub-list">
          <div
              v-for="sub in currentMenu.children"
              :class="['menu-item-sub', currentPath == sub.path ? 'active' : '']"
              @click="jump(sub)"
          >
            <span
                v-if="sub.icon"
                :class="['iconfont', 'icon-' + sub.icon]"
            ></span>
            <span class="text">{{ sub.name }}</span>
          </div>
          <div v-if="currentMenu && currentMenu.tips" class="tips">
            {{ currentMenu.tips }}
          </div>
          <div class="space-info">
            <div>空间使用</div>
            <div class="percent">
              <el-progress
                  :percentage="
                  Math.floor(
                    (useSpaceInfo.useSpace / useSpaceInfo.totalSpace) * 10000
                  ) / 100
                "
                  color="#409eff"
              />
            </div>

            <div class="space-use">
              <div class="use">
                {{ proxy.Utils.sizeToStr(useSpaceInfo.useSpace) }}/
                {{ proxy.Utils.sizeToStr(useSpaceInfo.totalSpace) }}
              </div>
              <div class="iconfont icon-refresh" @click="getUseSpace"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="body-content">
        <router-view v-slot="{ Component }">
          <component
              :is="Component"
              ref="routerViewRef"
              @addFile="addFile"
              @reload="getUseSpace"
          />
        </router-view>
      </div>
    </div>
    <!--修改头像-->
    <UpdateAvatar
        ref="updateAvatarRef"
        @updateAvatar="reloadAvatar"
    ></UpdateAvatar>
    <!--修改密码-->
    <UpdatePassword ref="updatePasswordRef"></UpdatePassword>
  </div>
</template>

<script setup>
import UpdateAvatar from "@/views/UpdateAvatar.vue";
import UpdatePassword from "./UpdatePassword.vue";
import Uploader from "@/views/main/Uploader.vue";
import {getCurrentInstance, nextTick, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  getUseSpace: "/getUseSpace",
  logout: "/logout",
};

const timestamp = ref(0);
//获取用户信息
const userInfo = ref(proxy.VueCookies.get("userInfo"));
//显示上传窗口
const showUploader = ref(false);

//添加文件
const uploaderRef = ref();
const addFile = (data) => {
  const {file, filePid} = data;
  showUploader.value = true;
  uploaderRef.value.addFile(file, filePid);
};

//上传文件回调
const routerViewRef = ref();
const uploadCallbackHandler = () => {
  nextTick(() => {
    routerViewRef.value.reload();
    getUseSpace();
  });
};

const menus = [
  {
    icon: "cloude",
    name: "首页",
    menuCode: "main",
    path: "/main/all",
    allShow: true,
    children: [
      {
        icon: "all",
        name: "全部",
        category: "all",
        path: "/main/all",
      },
      {
        icon: "video",
        name: "视频",
        category: "video",
        path: "/main/video",
      },
      {
        icon: "music",
        name: "音频",
        category: "music",
        path: "/main/music",
      },
      {
        icon: "image",
        name: "图片",
        category: "image",
        path: "/main/image",
      },
      {
        icon: "doc",
        name: "文档",
        category: "doc",
        path: "/main/doc",
      },
      {
        icon: "more",
        name: "其他",
        category: "others",
        path: "/main/others",
      },
    ],
  },
  {
    path: "/myshare",
    icon: "share",
    name: "分享",
    menuCode: "share",
    allShow: true,
    children: [
      {
        name: "分享记录",
        path: "/myshare",
      },
    ],
  },
  {
    path: "/recycle",
    icon: "del",
    name: "回收站",
    menuCode: "recycle",
    tips: "回收站为你保存10天内删除的文件",
    allShow: true,
    children: [
      {
        name: "删除的文件",
        path: "/recycle",
      },
    ],
  },
  // {
  //   path: "/teams",
  //   icon: "account",
  //   name: "团队",
  //   menuCode: "recycle",
  //   tips: "此功能还在开发阶段，敬请期待",
  //   allShow: true,
  //   children: [
  //     {
  //       name: "团队协作",
  //       path: "/teams",
  //     },
  //   ],
  // },
  {
    path: "/settings/fileList",
    icon: "settings",
    name: "设置",
    menuCode: "settings",
    allShow: false,
    children: [
      {
        name: "用户文件",
        path: "/settings/fileList",
      },
      {
        name: "用户管理",
        path: "/settings/userList",
      },
      {
        path: "/settings/sysSetting",
        name: "系统设置",
      },
    ],
  },
];

const jump = (data) => {
  if (!data.path || data.menuCode == currentMenu.value.menuCode) {
    return;
  }
  router.push(data.path);
};

const currentMenu = ref({});
const currentPath = ref();

const setMenu = (menuCode, path) => {
  const menu = menus.find((item) => {
    return item.menuCode === menuCode;
  });
  currentMenu.value = menu;
  currentPath.value = path;
};

watch(
    () => route,
    (newVal, oldVal) => {
      if (newVal.meta.menuCode) {
        setMenu(newVal.meta.menuCode, newVal.path);
      }
    },
    {immediate: true, deep: true}
);

//使用空间
const useSpaceInfo = ref({useSpace: 0, totalSpace: 1});
const getUseSpace = async () => {
  let result = await proxy.Request({
    url: api.getUseSpace,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  useSpaceInfo.value = result.data;
};
getUseSpace();

//修改头像
const updateAvatarRef = ref();
const updateAvatar = () => {
  updateAvatarRef.value.show(userInfo.value);
};
const reloadAvatar = () => {
  userInfo.value = proxy.VueCookies.get("userInfo");
  timestamp.value = new Date().getTime();
};

//修改密码
const updatePasswordRef = ref();
const updatePassword = () => {
  updatePasswordRef.value.show();
};

//退出登录
const logout = () => {
  proxy.Confirm(`你确定要退出吗`, async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    proxy.VueCookies.remove;
    router.push("/login");
  });
};
</script>

<style lang="scss" scoped>
.header {
  box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
  height: 56px;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;

    .icon-pan {
      font-size: 40px;
      color: #1296db;
    }

    .name {
      font-weight: bold;
      margin-left: 5px;
      font-size: 25px;
      color: #05a1f5;
    }
  }

  .right-panel {
    display: flex;
    align-items: center;

    .icon-transfer {
      cursor: pointer;
    }

    .user-info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;

      // 头像
      .avatar {
        margin: 0 5px 0 15px;
      }

      // 昵称
      .nick-name {
        color: #05a1f5;
      }
    }
  }
}

.body {
  display: flex;

  .left-side {
    border-right: 1px solid #f1f2f4;
    display: flex;

    .menu-list {
      height: calc(100vh - 56px);
      width: 80px;
      box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
      border-right: 1px solid #f1f2f4;

      .menu-item {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        padding: 20px 0;
        cursor: pointer;

        &:hover {
          background: #f3f3f3;
        }

        .iconfont {
          font-weight: normal;
          font-size: 28px;
        }
      }

      .active {
        .iconfont {
          color: #06a7ff;
        }

        .text {
          color: #06a7ff;
        }
      }
    }

    .menu-sub-list {
      width: 200px;
      padding: 20px 10px 0;
      position: relative;

      .menu-item-sub {
        text-align: center;
        line-height: 40px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background: #f3f3f3;
        }

        .iconfont {
          font-size: 14px;
          margin-right: 20px;
        }

        .text {
          font-size: 13px;
        }
      }

      .active {
        background: #eef9fe;

        .iconfont {
          color: #05a1f5;
        }

        .text {
          color: #05a1f5;
        }
      }

      .tips {
        margin-top: 10px;
        color: #888888;
        font-size: 13px;
      }

      .space-info {
        position: absolute;
        bottom: 10px;
        width: 100%;
        padding: 0px 5px;

        .percent {
          padding-right: 10px;
        }

        .space-use {
          margin-top: 5px;
          color: #7e7e7e;
          display: flex;
          justify-content: space-around;

          .use {
            flex: 1;
          }

          .iconfont {
            cursor: pointer;
            margin-right: 20px;
            color: #05a1f5;
          }
        }
      }
    }
  }

  .body-content {
    flex: 1;
    width: 0;
    padding-left: 20px;
  }
}
</style>

