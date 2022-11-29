<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click.stop="add">
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
              @click.stop="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click.stop="deleteAction(scope.row, state.isResume)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="state.dialogVisible"
        :title="title"
        width="80%"
        @closed="closeDialog()"
      >
       <formConpoent
          v-if="state.dialogVisible"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
          :showBtn="true"
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
import { deleteItem, get, post } from "@/utils/request";
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
          prop: "sensitiveWord",
          label: "敏感词"
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup>
const formConfig = [
  {
    prop: "sensitiveWord",
    label: "敏感词",
    showInput: true
  },
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableData: [],
  total: 0,
  id: '',
  sensitiveword: "",
  dialogVisible: false,
  isResume: false,
});
const ruleFormRef = ref();
const eleTable = ref();
const title = ref("添加");

// 添加
const add = () => {
  title.value = "添加";
  state.dialogVisible = true;
};


/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${sensitiveAddOne}`, {
      ...formData
    })
      .then(function (data) {
        getSensitiveSelectAll();
        state.formConfig = state.formConfig.map((e, b) => {
          let result = { ...e };  
          delete result[e.prop];
          return result;
        });
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${sensitiveUpdateOne}`, {
      ...formData,
      id: state.id
    })
      .then(function (data) {
        getSensitiveSelectAll();
        state.formConfig = state.formConfig.map((e, b) => {
          let result = { ...e };  
          delete result[e.prop];
          return result;
        });
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
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
};


// 编辑
const edit = (row) => {
  title.value = "编辑";
  state.id = row.id;
  state.dialogVisible = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    });
};
//  文章内容列表
const getSensitiveSelectAll = () => {
  post(`${sensitiveSelectAll}`, {
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
  getSensitiveSelectAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getSensitiveSelectAll();
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
      deleteItem(`${sensitiveDelete}`,{
          data: [row.id],
        }).then(function (data) {
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
