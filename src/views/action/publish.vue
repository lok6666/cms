<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="add">
          <el-icon><plus /></el-icon>添加
        </el-button>
      </div>
      <el-table
        :data="state.tableData"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="edit(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="deleteAction(scope.row, state.isResume)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="state.dialogVisible"
        :title="title"
        width="50%"
        @closed="closeDialog()"
      >
        <formConpoent
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></formConpoent>
      </el-dialog>
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 20px;
        "
      >
        <el-pagination
          v-model:currentPage="currentPage"
          :page-size="state.pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </u-container-layout>
</template>
<script lang="ts">
import { ref, reactive, provide } from "vue";
import formConpoent from "@/components/form/form.vue";
import {
  actionAll,
  actionAddOne,
  actionrUpdateOne,
  actionDelete,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteItem, post } from "@/utils/request";
export default {
  name: "active-publish",
  data() {
    return {
      tableHeaderConfig: [
        {
          prop: "id",
          label: "序号",
        },
        {
          prop: "activityName",
          label: "活动名称",
        },
        {
          prop: "activityAddress",
          label: "活动地址",
        },
        {
          prop: "	applyTimeFrom",
          label: "活动报名开始日期",
        },
        {
          prop: "	applyTimeTo",
          label: "活动报名结束日期",
        },
        {
          prop: "lastUpdataTime",
          label: "最后一次更新时间",
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup>
const formConfig = [
  {
    prop: "activityName",
    label: "活动名称",
    showInput: true,
  },
  {
    prop: "activityAddress",
    label: "活动地址",
    showInput: true,
  },
  {
    prop: "activityDateFrom",
    label: "活动报名开始日期",
    placeholder: "请选择开始日期",
    showDatePicker: true,
  },
  {
    prop: "applyTimeTo",
    label: "活动报名结束日期",
    placeholder: "请选择结束日期",
    showDatePicker: true,
  },
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableData: [],
  total: 0,
  sensitiveword: "",
  dialogVisible: false,
  isResume: false,
});
const title = ref("新增");
let currentRoleId = ref('');
// 添加
const add = () => {
  title.value = "新增";
  state.dialogVisible = true;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${actionAddOne}`, {
      ...formData,
    })
      .then(function (data) {
        getactionAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    // 所有设置更新的都要加id
    post(`${actionrUpdateOne}`, {
      id: currentRoleId.value,
      ...formData
    })
      .then(function () {
        getactionAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
  }
  state.dialogVisible = false;
  console.log("submit!", formData);
};

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.formConfig = formConfig;
};

// 修改
const edit = (row):void => {
  title.value = "修改";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
  console.log("row, row", state.formConfig);
};
//  文章内容列表
const getactionAll = () => {
  post(`${actionAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getactionAll();

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getactionAll({ title: formInline.username });
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getactionAll({ title: formInline.username });
};
const loading = ref(false);

const formInline = reactive({
  username: "",
});
// 删除
const deleteAction = (row, isResume) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${actionDelete}`, {
        data: [row.id],
      }).then(function (data) {
        getactionAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.inline-edit-table {
  width: 100%;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
