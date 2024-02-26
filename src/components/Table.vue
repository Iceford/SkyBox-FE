<!--
 * @Description: 用于显示一个带有分页和可排序列的表格
 * @FilePath: \src\components\Table.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:30:39
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:21:43
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div>
    <el-table
        ref="dataTable"
        :border="options.border"
        :data="dataSource.list || []"
        :height="tableHeight"
        :stripe="options.stripe"
        header-row-class-name="table-header-row"
        highlight-current-row
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
    >
      <!--selection选择框-->
      <el-table-column
          v-if="options.selectType && options.selectType == 'checkbox'"
          align="center"
          type="selection"
          width="50"
      ></el-table-column>
      <!--序号-->
      <el-table-column
          v-if="options.showIndex"
          align="center"
          label="序号"
          type="index"
          width="60"
      ></el-table-column>
      <!--数据列-->
      <template v-for="(column, index) in columns">
        <template v-if="column.scopedSlots">
          <el-table-column
              :key="index"
              :align="column.align || 'left'"
              :label="column.label"
              :prop="column.prop"
              :width="column.width"
          >
            <template #default="scope">
              <slot
                  :index="scope.$index"
                  :name="column.scopedSlots"
                  :row="scope.row"
              >
              </slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
              :key="index"
              :align="column.align || 'left'"
              :fixed="column.fixed"
              :label="column.label"
              :prop="column.prop"
              :width="column.width"
          >
          </el-table-column>
        </template>
      </template>
    </el-table>
    <!-- 分页 -->
    <div v-if="showPagination" class="pagination">
      <el-pagination
          v-if="dataSource.totalCount"
          :current-page.sync="dataSource.pageNo"
          :layout="layout"
          :page-size="dataSource.pageSize"
          :page-sizes="[15, 30, 50, 100]"
          :total="dataSource.totalCount"
          background
          style="text-align: right"
          @size-change="handlePageSizeChange"
          @current-change="handlePageNoChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script setup>
import {computed, ref} from "vue";

const emit = defineEmits(["rowSelected", "rowClick"]);
const props = defineProps({
  dataSource: Object,
  showPagination: {
    type: Boolean,
    default: true,
  },
  showPageSize: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object,
    default: {
      extHeight: 0,
      showIndex: false,
    },
  },
  columns: Array,
  fetch: Function, // 获取数据的函数
  initFetch: {
    type: Boolean,
    default: true,
  },
});

const layout = computed(() => {
  return `total, ${
      props.showPageSize ? "sizes" : ""
  }, prev, pager, next, jumper`;
});
//顶部 60 , 内容区域距离顶部 20， 内容上下内间距 15*2  分页区域高度 46
const topHeight = 60 + 20 + 30 + 46;

const tableHeight = ref(
    props.options.tableHeight
        ? props.options.tableHeight
        : window.innerHeight - topHeight - props.options.extHeight
);

//初始化
const init = () => {
  if (props.initFetch && props.fetch) {
    props.fetch();
  }
};
init();

const dataTable = ref();
//清除选中
const clearSelection = () => {
  dataTable.value.clearSelection();
};

//设置行选中
const setCurrentRow = (rowKey, rowValue) => {
  let row = props.dataSource.list.find((item) => {
    return item[rowKey] === rowValue;
  });
  dataTable.value.setCurrentRow(row);
};
//将子组件暴露出去，否则父组件无法调用
defineExpose({setCurrentRow, clearSelection});

//行点击
const handleRowClick = (row) => {
  emit("rowClick", row);
};

//多选
const handleSelectionChange = (row) => {
  emit("rowSelected", row);
};

//切换每页大小
const handlePageSizeChange = (size) => {
  props.dataSource.pageSize = size;
  props.dataSource.pageNo = 1;
  props.fetch();
};
// 切换页码
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  props.fetch();
};
</script>
<style lang="scss" scoped>
.pagination {
  padding-top: 10px;
  padding-right: 10px;
}

.el-pagination {
  justify-content: right;
}

:deep .el-table__cell {
  padding: 4px 0px;
}
</style>
