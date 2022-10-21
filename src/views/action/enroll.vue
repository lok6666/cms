<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-form :inline="true" :model="state" class="demo-form-inline">
        <el-form-item label="课程名称">
          <el-input v-model="state.actName" placeholder="请输入活动名称"/>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="state.entName" placeholder="请输入企业名称"/>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="gettrainingServicesAll">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
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
          <template #default="scope" v-if="item.prop === 'applyStatus'">
            {{applyStatusObj[scope.row.applyStatus]}}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <!-- <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="edit(scope.row)"
              >修改</el-button
            > -->
            <el-button type="primary" size="small" @click="detail(scope.row)">
              查看详情
            </el-button>
            <el-button type="primary" :disabled="scope.row.applyStatus !== 0" size="small" @click="examine(scope.row)">
              {{applyStatusObj[scope.row.applyStatus]}}
            </el-button>
            <!-- <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="deleteAction(scope.row, state.isResume)"
              >删除</el-button
            > -->
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
          v-if="state.showForm"
          :disabled="state.disabled"
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
import examineFormConpoent from "@/components/form/examineForm.vue";
import formConpoent from "@/components/form/form.vue";
import {
  activityApplyAll,
  activityApplyAddOne,
  activityApplyrUpdateOne,
  activityApplyDelete,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import { formConfigItem } from "@/utils/interface";
import { deleteItem, post } from "@/utils/request";
export default {
  name: "sensitive-manage",
  data() {
    return {
      applyStatusObj: {
        0: '未审核',
        1: '审核通过',
        2: '审核未通过'
      },
      tableHeaderConfig: [
        {
          prop: "id",
          label: '序号'
        },
        {
          prop: "actName",
          label: "活动名称",
        },
        {
          prop: "entName",
          label: '企业名称'
        },
        {
          prop: "applyCount",
          label: "报名人数",
        },
        {
          prop: "duties",
          label: "职务",
        },
        {
          prop: "activityDateFrom",
          label: "报名开始时间",
        },
        {
          prop: "applyTimeTo",
          label: "报名结束时间",
        },
        {
          prop: "personName",
          label: "联系人",
        },
        {
          prop: "telPhone",
          label: "人员电话",
        },
        {
          prop: "applyStatus",
          label: "审核状态",
        }
      ],
    };
  },
};
</script>
<script lang="ts" setup>
interface formConfigItem {
    prop: string,
    label: string,
    required?: boolean,
    showInput?: boolean,
    showDatePicker?: boolean,
    upload?: boolean,
    uploadType?: string
}
const formConfig: formConfigItem[] = [
  {
    prop: "actName",
    label: "活动名称",
    required: true,
    showInput: true
  },
  {
    prop: "duties",
    label: "职务",
    required: true,
    showInput: true
  },
  {
    prop: "operator",
    label: "操作人",
    required: true,
    showInput: true
  },
  {
    prop: "personName",
    label: "联系人",
    required: true,
    showInput: true
  },
  {
    prop: "telPhone",
    label: "人员电话",
    required: true,
    showInput: true
  },
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: Object.assign([], formConfig),
  tableData: [],
  total: 0,
  actName: '',
  entName: '',
  sensitiveword: "",
  dialogVisible: false,
  isResume: false,
  showForm: false,
  showExamineForm: false,
  disabled: true
});

let currentRoleId = ref<string>("");
const title = ref<string>("新增");


const gettrainingServicesAll = () => {
  getactivityApplyAll();
};
const reset = () => {
  state.actName = '';
  state.entName = '';
  getactivityApplyAll();
};
/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${activityApplyAddOne}`, {
      ...formData
    })
      .then(function (data) {
        getactivityApplyAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${activityApplyrUpdateOne}`, {
      id: currentRoleId.value,
      applyStatus: formData.status
    })
      .then(function (data) {
        getactivityApplyAll();
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
  currentRoleId.value = row.id;
  state.formConfig = state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
};
//  文章内容列表
const getactivityApplyAll = () => {
  post(`${activityApplyAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    actName: state.actName,
    entName: state.entName
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getactivityApplyAll();


/**
 * 表单详情
 */
 const detail = (row) => {
  title.value = "查看详情";
  state.formConfig.status = row.applyStatus;
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
  title.value = "审核";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
  state.showExamineForm = true;
  state.showForm = false;
};


// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getactivityApplyAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getactivityApplyAll();
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
      deleteItem(`${activityApplyDelete}`, {
        data: [row.id],
      }).then(function (data) {
        getactivityApplyAll();
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
