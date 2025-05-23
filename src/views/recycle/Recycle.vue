<!--
 * @Description: 用于展示文件列表和执行文件操作的Vue单文件组件，包含了加载文件列表、还原文件、删除文件等功能
 * @FilePath: \SkyBox-FE\src\views\recycle\Recycle.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 19:40:39
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-09 03:33:06
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div>
    <div class="top">
      <el-button
          :disabled="selectFileIdList.length == 0"
          type="success"
          @click="revertBatch"
      >
        <span class="iconfont icon-revert"></span>还原
      </el-button>
      <el-button
          :disabled="selectFileIdList.length == 0"
          type="danger"
          @click="delBatch"
      >
        <span class="iconfont icon-del"></span>批量删除
      </el-button>
    </div>

    <div class="file-list">
      <Table
          :columns="columns"
          :dataSource="tableData"
          :fetch="loadDataList"
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
                v-if="
                (row.fileType == 3 || row.fileType == 1) && row.status !== 0
              "
            >
              <icon :cover="row.fileCover"></icon>
            </template>
            <template v-else>
              <icon v-if="row.folderType == 0" :fileType="row.fileType"></icon>
              <icon v-if="row.folderType == 1" :fileType="0"></icon>
            </template>
            <span :title="row.fileName" class="file-name">
              <span>{{ row.fileName }}</span>
            </span>
            <span class="op">
              <template v-if="row.showOp && row.fileId">
                <span class="iconfont icon-revert" @click="revert(row)"
                >还原</span
                >
                <span class="iconfont icon-del" @click="delFile(row)"
                >删除</span
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
  loadDataList: "/recycle/loadRecycleList",
  delFile: "/recycle/delFile",
  recoverFile: "/recycle/recoverFile",
};

//列表
const columns = [
  {
    label: "文件名",
    prop: "fileName",
    scopedSlots: "fileName",
  },
  {
    label: "删除时间",
    prop: "recoveryTime",
    width: 200,
  },
  {
    label: "大小",
    prop: "fileSize",
    scopedSlots: "fileSize",
    width: 200,
  },
];
//列表
const tableData = ref({});
const tableOptions = {
  extHeight: 20,
  selectType: "checkbox",
};
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  if (params.category !== "all") {
    delete params.filePid;
  }
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
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

const selectFileIdList = ref([]);
const rowSelected = (rows) => {
  selectFileIdList.value = [];
  rows.forEach((item) => {
    selectFileIdList.value.push(item.fileId);
  });
};

//恢复
const revert = (row) => {
  proxy.Confirm(`你确定要还原【${row.fileName}】吗?`, async () => {
    let result = await proxy.Request({
      url: api.recoverFile,
      params: {
        fileIds: row.fileId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};

const revertBatch = () => {
  if (selectFileIdList.value.length == 0) {
    return;
  }
  proxy.Confirm(`你确定要还原这些文件吗?`, async () => {
    let result = await proxy.Request({
      url: api.recoverFile,
      params: {
        fileIds: selectFileIdList.value.join(","),
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};
//删除文件
const emit = defineEmits(["reload"]);
const delFile = (row) => {
  proxy.Confirm(`你确定要删除【${row.fileName}】?`, async () => {
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
    emit("reload");
  });
};

const delBatch = (row) => {
  if (selectFileIdList.value.length == 0) {
    return;
  }
  proxy.Confirm(`你确定要删除选中的文件?删除将无法恢复`, async () => {
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
    emit("reload");
  });
};
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
@import "@/assets/file.list.scss";

.file-list {
  margin-top: 10px;

  .file-item {
    .op {
      width: 120px;
    }
  }
}
</style>

