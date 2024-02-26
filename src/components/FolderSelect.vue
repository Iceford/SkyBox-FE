<!--
 * @Description: 用于实现一个移动文件夹的对话框
 * @FilePath: \SkyBox-FE\src\components\FolderSelect.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:30:06
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-30 00:39:01
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div>
    <Dialog
        :buttons="dialogConfig.buttons"
        :show="dialogConfig.show"
        :showCancel="true"
        :title="dialogConfig.title"
        width="600px"
        @close="close"
    >
      <div class="navigation-panel">
        <Navigation
            ref="navigationRef"
            :watchPath="false"
            @navChange="navChange"
        ></Navigation>
      </div>
      <div v-if="folderList.length > 0" class="folder-list">
        <div
            v-for="item in folderList"
            class="folder-item"
            @click="selectFolder(item)"
        >
          <icon :fileType="0"></icon>
          <span class="file-name">{{ item.fileName }}</span>
        </div>
      </div>
      <div v-else class="tips">
        移动到 <span>{{ currentFolder.fileName }}</span> 文件夹
      </div>
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
  loadAllFolder: "/file/loadAllFolder",
};

const dialogConfig = ref({
  show: false,
  title: "移动到",
  buttons: [
    {
      type: "primary",
      click: () => {
        folderSelect();
      },
      text: "移动到此",
    },
  ],
});

//父级ID
const filePid = ref("0");
const folderList = ref([]);
const loadAllFolder = async () => {
  let result = await proxy.Request({
    url: api.loadAllFolder,
    params: {
      filePid: filePid.value,
      currentFileIds: currentFileIds.value,
    },
  });
  if (!result) {
    return;
  }
  folderList.value = result.data;
};

const close = () => {
  dialogConfig.value.show = false;
};

//当前目录，传入后 获取目录需要排除该目录
const currentFileIds = ref({});
//展示弹出框对外的方法
const showFolderDialog = (curFileIds) => {
  dialogConfig.value.show = true;
  currentFileIds.value = curFileIds;
  filePid.value = "0";
  nextTick(() => {
    navigationRef.value.init();
  });
};

defineExpose({
  showFolderDialog,
  close,
});
//选择目录
const navigationRef = ref();
const selectFolder = (data) => {
  navigationRef.value.openFolder(data);
};

//当前的目录
const currentFolder = ref({});
//导航改变回调
const navChange = (data) => {
  const {curFolder} = data;
  currentFolder.value = curFolder;
  filePid.value = curFolder.fileId;
  loadAllFolder();
};

const emit = defineEmits(["folderSelect"]);

const folderSelect = () => {
  emit("folderSelect", filePid.value);
};
</script>
<style lang="scss" scoped>
.navigation-panel {
  padding-left: 10px;
  background: #f1f1f1;
}

.folder-list {
  .folder-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px;

    .file-name {
      display: inline-block;
      margin-left: 10px;
    }

    &:hover {
      background: #f8f8f8;
    }
  }

  max-height: calc(100vh - 200px);
  min-height: 200px;
}

.tips {
  text-align: center;
  line-height: 200px;

  span {
    color: #06a7ff;
  }
}
</style>