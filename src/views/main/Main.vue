<!--
 * @Description: 实现一个文件管理的前端界面，包括文件的上传、列表展示、搜索、多选、编辑、预览、移动、删除、下载、分享等功能
 * @FilePath: \src\views\main\Main.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 17:27:50
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:35:12
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="btn">
          <el-upload
              :accept="fileAccept"
              :http-request="addFile"
              :multiple="true"
              :show-file-list="false"
              :with-credentials="true"
          >
            <el-button type="primary">
              <span class="iconfont icon-upload"></span>
              上传
            </el-button>
          </el-upload>
        </div>
        <el-button v-if="category == 'all'" type="success" @click="newFolder">
          <span class="iconfont icon-folder-add"></span>
          新建文件夹
        </el-button>
        <el-button
            :disabled="selectFileIdList.length == 0"
            type="danger"
            @click="delFileBatch"
        >
          <span class="iconfont icon-del"></span>
          批量删除
        </el-button>
        <el-button
            :disabled="selectFileIdList.length == 0"
            type="warning"
            @click="moveFolderBatch"
        >
          <span class="iconfont icon-move"></span>
          批量移动
        </el-button>
        <div class="search-panel">
          <el-input
              v-model="fileNameFuzzy"
              clearable
              placeholder="输入文件名搜索"
              @keyup.enter="search"
          >
            <template #suffix>
              <i class="iconfont icon-search" @click="search"></i>
            </template>
          </el-input>
        </div>
        <div class="iconfont icon-refresh" @click="loadDataList"></div>
      </div>
      <!--导航-->
      <Navigation ref="navigationRef" @navChange="navChange"></Navigation>
    </div>
    <div v-if="tableData.list && tableData.list.length > 0" class="file-list">
      <Table
          ref="dataTableRef"
          :columns="columns"
          :dataSource="tableData"
          :fetch="loadDataList"
          :initFetch="false"
          :options="tableOptions"
          :showPagination="true"
          @rowSelected="rowSelected"
      >
        <template #fileName="{ index, row }">
          <div
              class="file-item"
              @mouseenter="showOp(row)"
              @mouseleave="cancelShowOp(row)"
          >
            <template
                v-if="(row.fileType == 3 || row.fileType == 1) && row.status == 2"
            >
              <icon :cover="row.fileCover" :width="32"></icon>
            </template>
            <template v-else>
              <icon v-if="row.folderType == 0" :fileType="row.fileType"></icon>
              <icon v-if="row.folderType == 1" :fileType="0"></icon>
            </template>
            <span v-if="!row.showEdit" :title="row.fileName" class="file-name">
              <span @click="preview(row)">{{ row.fileName }}</span>
              <span v-if="row.status == 0" class="transfer-status">转码中</span>
              <span v-if="row.status == 1" class="transfer-status transfer-fail"
              >转码失败</span
              >
            </span>
            <div v-show="row.showEdit" class="edit-panel">
              <el-input
                  ref="editNameRef"
                  v-model.trim="row.fileNameReal"
                  :maxLength="190"
                  @keyup.enter="saveNameEdit(index)"
              >
                <template #suffix>{{ row.fileSuffix }}</template>
              </el-input>
              <span
                  :class="[
                  'iconfont icon-right1',
                  row.fileNameReal ? '' : 'not-allow',
                ]"
                  @click="saveNameEdit(index)"
              ></span>
              <span
                  class="iconfont icon-error"
                  @click="cancelNameEdit(index)"
              ></span>
            </div>
            <span class="op">
              <template v-if="row.showOp && row.fileId && row.status == 2">
                <span class="iconfont icon-share1" @click="share(row)"
                >分享</span
                >
                <span
                    v-if="row.folderType == 0"
                    class="iconfont icon-download"
                    @click="download(row)"
                >下载</span
                >
                <span class="iconfont icon-del" @click="delFile(row)"
                >删除</span
                >
                <span
                    class="iconfont icon-edit"
                    @click.stop="editFileName(index)"
                >重命名</span
                >
                <span class="iconfont icon-move" @click="moveFolder(row)"
                >移动</span
                >
              </template>
            </span>
          </div>
        </template>
        <template #fileSize="{ index, row }">
          <span v-if="row.fileSize">
            {{ proxy.Utils.sizeToStr(row.fileSize) }}</span
          >
        </template>
      </Table>
    </div>
    <div v-else class="no-data">
      <div class="no-data-inner">
        <Icon :width="120" fit="fill" iconName="no_data"></Icon>
        <div class="tips">当前目录为空，上传你的第一个文件吧</div>
        <div class="op-list">
          <el-upload
              :accept="fileAccept"
              :http-request="addFile"
              :multiple="true"
              :show-file-list="false"
              :with-credentials="true"
          >
            <div class="op-item">
              <Icon :width="60" iconName="file"></Icon>
              <div>上传文件</div>
            </div>
          </el-upload>
          <div v-if="category == 'all'" class="op-item" @click="newFolder">
            <Icon :width="60" iconName="folder"></Icon>
            <div>新建目录</div>
          </div>
        </div>
      </div>
    </div>
    <!--预览-->
    <Preview ref="previewRef"></Preview>
    <!--移动-->
    <FolderSelect
        ref="folderSelectRef"
        @folderSelect="moveFolderDone"
    ></FolderSelect>
    <!--分享-->
    <FileShare ref="shareRef"></FileShare>
  </div>
</template>

<script setup>
import CategoryInfo from "@/js/CategoryInfo.js";
import FileShare from "./ShareFile.vue";
import {computed, getCurrentInstance, nextTick, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["addFile"]);
//添加文件
const addFile = async (fileData) => {
  emit("addFile", {file: fileData.file, filePid: currentFolder.value.fileId});
};
//添加文件回调
const reload = () => {
  showLoading.value = false;
  loadDataList();
};
defineExpose({
  reload,
});

const api = {
  loadDataList: "/file/loadDataList",
  rename: "/file/rename",
  newFolder: "/file/newFolder",
  getFolderInfo: "/file/getFolderInfo",
  delFile: "/file/delFile",
  changeFileFolder: "/file/changeFileFolder",
  createDownloadUrl: "/file/createDownloadUrl",
  download: "/api/file/download",
};

const fileAccept = computed(() => {
  const categoryItem = CategoryInfo[category.value];
  return categoryItem ? categoryItem.accept : "*";
});

//列表
const columns = [
  {
    label: "文件名",
    prop: "fileName",
    scopedSlots: "fileName",
  },
  {
    label: "修改时间",
    prop: "lastUpdateTime",
    width: 200,
  },
  {
    label: "大小",
    prop: "fileSize",
    scopedSlots: "fileSize",
    width: 200,
  },
];
//搜索
const search = () => {
  showLoading.value = true;
  loadDataList();
};
//列表
const tableData = ref({});
const tableOptions = {
  extHeight: 50,
  selectType: "checkbox",
};

//多选 批量选择
const selectFileIdList = ref([]);
const rowSelected = (rows) => {
  selectFileIdList.value = [];
  rows.forEach((item) => {
    selectFileIdList.value.push(item.fileId);
  });
};

const fileNameFuzzy = ref();
const showLoading = ref(true);
const category = ref();

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
    category: category.value,
    filePid: currentFolder.value.fileId,
  };
  if (params.category !== "all") {
    delete params.filePid;
  }
  let result = await proxy.Request({
    url: api.loadDataList,
    showLoading: showLoading,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
  editing.value = false;
};

//展示操作按钮
const showOp = (row) => {
  tableData.value.list.forEach((element) => {
    element.showOp = false;
  });
  row.showOp = true;
};

const cancelShowOp = (row) => {
  row.showOp = false;
};

//编辑行
const editing = ref(false);
const editNameRef = ref();
//新建文件夹
const newFolder = () => {
  if (editing.value) {
    return;
  }
  tableData.value.list.forEach((element) => {
    element.showEdit = false;
  });
  editing.value = true;
  tableData.value.list.unshift({
    showEdit: true,
    fileType: 0,
    fileId: "",
    filePid: currentFolder.value.fileId,
  });
  nextTick(() => {
    editNameRef.value.focus();
  });
};

//编辑文件名
const editFileName = (index) => {
  if (tableData.value.list[0].fileId == "") {
    tableData.value.list.splice(0, 1);
  }
  tableData.value.list.forEach((element) => {
    element.showEdit = false;
  });
  let cureentData = tableData.value.list[index];
  cureentData.showEdit = true;

  //编辑文件
  if (cureentData.folderType == 0) {
    cureentData.fileNameReal = cureentData.fileName.substring(
        0,
        cureentData.fileName.indexOf(".")
    );
    cureentData.fileSuffix = cureentData.fileName.substring(
        cureentData.fileName.indexOf(".")
    );
  } else {
    cureentData.fileNameReal = cureentData.fileName;
    cureentData.fileSuffix = "";
  }
  editing.value = true;
  nextTick(() => {
    editNameRef.value.focus();
  });
};

const cancelNameEdit = (index) => {
  const fileData = tableData.value.list[index];
  if (fileData.fileId) {
    fileData.showEdit = false;
  } else {
    tableData.value.list.splice(index, 1);
    editing.value = false;
  }
};

const saveNameEdit = async (index) => {
  const {fileId, filePid, fileNameReal} = tableData.value.list[index];
  if (fileNameReal == "" || fileNameReal.indexOf("/") != -1) {
    proxy.Message.warning("文件名不能为空且不能含有斜杠");
    return;
  }
  let url = api.rename;
  if (fileId == "") {
    url = api.newFolder;
  }
  let result = await proxy.Request({
    url: url,
    params: {
      fileId,
      filePid: filePid,
      fileName: fileNameReal,
    },
  });
  if (!result) {
    return;
  }
  tableData.value.list[index] = result.data;
  editing.value = false;
};

const previewRef = ref();
const navigationRef = ref();
const preview = (data) => {
  if (data.folderType == 1) {
    //openFolder(data);
    navigationRef.value.openFolder(data);
    return;
  }
  if (data.status != 2) {
    proxy.Message.warning("文件正在转码中，无法预览");
    return;
  }
  previewRef.value.showPreview(data, 0);
};

// 目录
const currentFolder = ref({fileId: 0});
const navChange = (data) => {
  const {curFolder, categoryId} = data;
  currentFolder.value = curFolder;
  showLoading.value = true;
  category.value = categoryId;
  loadDataList();
};

// 移动目录
const folderSelectRef = ref();
const currentMoveFile = ref({});
const moveFolder = (data) => {
  currentMoveFile.value = data;
  folderSelectRef.value.showFolderDialog(data.fileId);
};

// 批量删除
const moveFolderBatch = () => {
  currentMoveFile.value = {};
  folderSelectRef.value.showFolderDialog(selectFileIdList.value.join(","));
};

const moveFolderDone = async (folderId) => {
  if (
      currentMoveFile.value.filePid === folderId ||
      currentFolder.value.fileId == folderId
  ) {
    proxy.Message.warning("文件正在当前目录，无需移动");
    return;
  }
  let filedIdsArray = [];
  if (currentMoveFile.value.fileId) {
    filedIdsArray.push(currentMoveFile.value.fileId);
  } else {
    filedIdsArray = filedIdsArray.concat(selectFileIdList.value);
  }
  let result = await proxy.Request({
    url: api.changeFileFolder,
    params: {
      fileIds: filedIdsArray.join(","),
      filePid: folderId,
    },
  });
  if (!result) {
    return;
  }
  folderSelectRef.value.close();
  loadDataList();
};

//删除文件
const delFile = (row) => {
  proxy.Confirm(
      `你确定要删除【${row.fileName}】吗？删除的文件可在10天内通过回收站还原`,
      async () => {
        let result = await proxy.Request({
          url: api.delFile,
          params: {
            fileIds: row.fileId,
          },
        });
        if (!result) {
          return;
        }
        loadDataList();
        dataTableRef.value.clearSelection();
      }
  );
};
//批量删除
const delFileBatch = () => {
  if (selectFileIdList.value.length == 0) {
    return;
  }
  proxy.Confirm(
      `你确定要删除这些文件吗？删除的文件可在10天内通过回收站还原`,
      async () => {
        let result = await proxy.Request({
          url: api.delFile,
          params: {
            fileIds: selectFileIdList.value.join(","),
          },
        });
        if (!result) {
          return;
        }
        loadDataList();
      }
  );
};

//下载文件
const download = async (row) => {
  let result = await proxy.Request({
    url: api.createDownloadUrl + "/" + row.fileId,
  });
  if (!result) {
    return;
  }
  window.location.href = api.download + "/" + result.data;
};

//分享
const shareRef = ref();
const share = (row) => {
  shareRef.value.show(row);
};
</script>

<style lang="scss" scoped>
@import "@/assets/file.list.scss";
</style>

