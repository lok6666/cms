<template>
  <u-container-layout>
    <div class="inline-edit-table">
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
            <el-button type="primary" size="small" @click="detail(scope.row)">
              查看详情
            </el-button>
            <el-button type="primary" size="small" @click="examine(scope.row)">
              审核
            </el-button>
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
          v-if="state.showForm"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></formConpoent>
        <examineFormConpoent
          v-if="state.showExamineForm"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></examineFormConpoent>
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
import examineFormConpoent from "@/components/form/examineForm.vue";
import {
  businessApplyAll,
  businessApplyAddOne,
  businessApplyUpdateOne,
  businessApplyDelete,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import { formConfigItem } from "@/utils/interface";
import { deleteItem, post } from "@/utils/request";
import { fa } from "element-plus/es/locale";
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
          prop: "actId",
          label: "活动id",
        },
        {
          prop: "companyid",
          label: "企业id",
        },
        {
          prop: "duties",
          label: "职务",
        },
        {
          prop: "operator",
          label: "操作人",
        },
        {
          prop: "startTime",
          label: "开始时间",
        },
        {
          prop: "endTime",
          label: "结束时间",
        },
        {
          prop: "personName",
          label: "联系人",
        },
        {
          prop: "telPhone",
          label: "人员电话",
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup>
interface formConfigItem {
  prop: string;
  label: string;
  required?: boolean;
  showInput?: boolean;
  showDatePicker?: boolean;
  upload?: boolean;
  uploadType?: string;
  disabled?: true;
}
const formConfig: formConfigItem[] = [
  {
    prop: "actId",
    label: "活动id",
    required: true,
    showInput: true,
    disabled: true,
  },
  {
    prop: "companyid",
    label: "企业id",
    required: true,
    showInput: true,
    disabled: true,
  },
  {
    prop: "duties",
    label: "职务",
    required: true,
    showInput: true,
    disabled: true,
  },
  {
    prop: "operator",
    label: "操作人",
    required: true,
    showInput: true,
    disabled: true,
  },
  {
    prop: "startTime",
    label: "开始时间",
    required: true,
    showDatePicker: true,
    disabled: true,
  },
  {
    prop: "endTime",
    label: "结束时间",
    required: true,
    showDatePicker: true,
    disabled: true,
  },
  {
    prop: "personName",
    label: "联系人",
    required: true,
    showInput: true,
    disabled: true,
  },
  {
    prop: "telPhone",
    label: "人员电话",
    required: true,
    showInput: true,
    disabled: true,
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
  showForm: false,
  showExamineForm: false,
  isResume: false,
});

let currentRoleId = ref<string>("");
const title = ref<string>("新增");

/**
 * 表单详情
 */
const detail = (row) => {
  title.value = "查看详情";
  state.dialogVisible = true;
  state.showForm = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
};

/**
 * 审核
 */
const examine = (row) => {
  state.dialogVisible = true;
  state.showExamineForm = true;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  post(`${businessApplyUpdateOne}`, {
    id: currentRoleId.value,
    ...formData
  })
    .then(function (data) {
      getbusinessApplyAll();
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible = false;
  state.showExamineForm = false;
};

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.showExamineForm = false;
  state.showForm = false;
};

//  文章内容列表
const getbusinessApplyAll = () => {
  post(`${businessApplyAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getbusinessApplyAll();

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getbusinessApplyAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getbusinessApplyAll();
};
const loading = ref(false);

const formInline = reactive({
  username: "",
});
// 删除
const deleteAction = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${businessApplyDelete}`, {
        data: [row.id],
      }).then(function (data) {
        getbusinessApplyAll();
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
