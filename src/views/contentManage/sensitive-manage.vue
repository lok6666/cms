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
  sensitiveSelectAll,
  sensitiveAddOne,
  sensitiveUpdateOne,
  sensitiveDelete
} from "@/config/api";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { get, post } from "@/utils/request";
export default {
  name: "sensitive-manage",
  data() {
    return {
      tableHeaderConfig: [
        {
          prop: "id",
          label: "序号",
        },
        {
          prop: "sensitiveword",
          label: "敏感词",
          showInput: true
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup>
const rules = reactive<FormRules>({
  title: {
    required: true,
  },
  sensitiveword: {
    required: true,
  },
});
const formConfig = [
  {
    prop: "sensitiveword",
    label: "敏感词",
    showInput: true
  },
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableData: [
    {
      createdate: null,
      deletestate: "",
      files: [],
      id: 1,
      images: [],
      lastupdatatime: null,
      operator: "",
      pageNum: 0,
      pageSize: 0,
      sensitiveword: "造反有理,打到共产党",
      storagetime: "2021-07-16 16:56:30",
    },
    {
      createdate: null,
      deletestate: "",
      files: [],
      id: 2,
      images: [],
      lastupdatatime: null,
      operator: "",
      pageNum: 0,
      pageSize: 0,
      sensitiveword: "法轮功",
      storagetime: "2021-07-16 17:01:08",
    },
  ],
  total: 0,
  sensitiveword: "",
  dialogVisible: false,
  isResume: false,
});
const ruleFormRef = ref();
const eleTable = ref();
const title = ref("新增");

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
    post(`${sensitiveAddOne}`, {
      ...formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then(function (data) {
        console.log("data-----", data);
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${sensitiveUpdateOne}`, {
      ...formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then(function (data) {
        console.log("data----", data);
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
const edit = (row) => {
  title.value = "修改";
  state.dialogVisible = true;
  state.formConfig = Object.assign({}, state.formConfig
    .map((e, b) => {
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    }));
};
//  文章内容列表
const getSensitiveSelectAll = () => {
  post(`${sensitiveSelectAll}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getSensitiveSelectAll();

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getSensitiveSelectAll({ title: formInline.username });
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getSensitiveSelectAll({ title: formInline.username });
};
const loading = ref(false);

const formInline = reactive({
  username: "",
});
// 删除
const deleteAction = (row, isResume) => {
  let obj = {
    ...row,
  };
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${sensitiveDelete}`, [row.id]).then(function (data) {
        getSensitiveSelectAll();
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
