<!--
 * @Description: 用于创建一个用户列表页面
 * @FilePath: \SkyBox-FE\src\views\admin\UserList.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 17:26:05
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-08 21:35:44
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<!-- 模板部分 -->
<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="80px" @submit.prevent>
        <el-row>
          <el-col :span="4">
            <!--input输入-->
            <el-form-item label="用户昵称">
              <el-input
                  v-model.trim="searchFormData.nickNameFuzzy"
                  clearable
                  placeholder="支持模糊搜索"
                  @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!-- 下拉框 -->
            <el-form-item label="状态">
              <el-select
                  v-model="searchFormData.status"
                  clearable
                  placeholder="请选择状态"
              >
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ 'padding-left': '10px' }">
            <el-button type="primary" @click="loadDataList"> 查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="file-list">
      <Table
          :columns="columns"
          :dataSource="tableData"
          :fetch="loadDataList"
          :options="tableOptions"
          :showPagination="true"
      >
        <template #avatar="{ index, row }">
          <div class="avatar">
            <Avatar :avatar="row.qqAvatar" :userId="row.userId"></Avatar>
          </div>
        </template>

        <template #space="{ index, row }">
          {{ proxy.Utils.sizeToStr(row.useSpace) }}/{{
            proxy.Utils.sizeToStr(row.totalSpace)
          }}
        </template>

        <template #status="{ index, row }">
          <span v-if="row.status == 1" style="color: #529b2e">启用</span>
          <span v-if="row.status == 0" style="color: #f56c6c">禁用</span>
        </template>
        <template #op="{ index, row }">
          <span class="a-link" @click="updateSpace(row)">分配空间</span>
          <el-divider direction="vertical"/>
          <span class="a-link" @click="updateUserStatus(row)">{{
              row.status == 0 ? "启用" : "禁用"
            }}</span>
        </template>
      </Table>
    </div>
    <Dialog
        :buttons="dialogConfig.buttons"
        :show="dialogConfig.show"
        :showCancel="false"
        :title="dialogConfig.title"
        width="400px"
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
        <el-form-item label="昵称">
          {{ formData.nickName }}
        </el-form-item>
        <el-form-item label="空间大小" prop="changeSpace">
          <el-input
              v-model="formData.changeSpace"
              clearable
              placeholder="请输入空间大小"
          >
            <template #suffix>MB</template>
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<!-- 脚本部分 -->
<script setup>
import {getCurrentInstance, nextTick, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  loadDataList: "/admin/loadUserList",
  updateUserStatus: "/admin/updateUserStatus",
  updateUserSpace: "/admin/updateUserSpace",
};

// 列表
const columns = [
  {
    label: "头像",
    prop: "avatar",
    width: 80,
    scopedSlots: "avatar",
  },
  {
    label: "昵称",
    prop: "nickName",
  },
  {
    label: "邮箱",
    prop: "email",
  },
  {
    label: "空间使用",
    prop: "space",
    scopedSlots: "space",
  },
  {
    label: "加入时间",
    prop: "joinTime",
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
  },
  {
    label: "状态",
    prop: "status",
    scopedSlots: "status",
    width: 80,
  },
  {
    label: "操作",
    prop: "op",
    width: 150,
    scopedSlots: "op",
  },
];
const searchFormData = ref({});

// 列表
const tableData = ref({});
const tableOptions = {
  extHeight: 20,
};
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchFormData.value);
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};

// 修改状态
const updateUserStatus = (row) => {
  proxy.Confirm(
      `你确定要【${row.status == 0 ? "启动" : "禁用"}】吗?`,
      async () => {
        let result = await proxy.Request({
          url: api.updateUserStatus,
          params: {
            userId: row.userId,
            status: row.status == 0 ? 1 : 0,
          },
        });
        if (!result) {
          return;
        }
        loadDataList();
      }
  );
};

// 分配空间大小
const dialogConfig = ref({
  show: false,
  title: "修改空间大小",
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

const formData = ref({});
const formDataRef = ref();
const rules = {
  changeSpace: [{required: true, message: "请输入空间大小"}],
};

const updateSpace = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = Object.assign({}, data);
  });
};

const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.updateUserSpace,
      params: params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("操作成功");
    loadDataList();
  });
};
</script>

<!-- 样式部分 -->
<style lang="scss" scoped>
.top-panel {
  margin-top: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100;
  }
}
</style>

