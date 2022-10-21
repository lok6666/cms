<template>
  <u-container-layout>   
    <div class="inline-edit-table">
      <el-form :inline="true" :model="state" class="demo-form-inline">
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
      <el-table-column type="index" label="序号" width="80" />
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
         <img
            v-if="item.showImg"
            :src="item[item.prop]"
            style="width: 50px; height: 50px"
          />
          <template #default="scope" v-if="item.prop === 'dockStatus'">
            {{status[scope.row.dockStatus]}}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="detail(scope.row)">
              查看详情
            </el-button>
            <el-button type="primary" size="small" @click="editSort(scope.row)">
              排序
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
        width="80%"
        @closed="closeDialog()"
      >
        <formConpoent
          v-if="state.showForm"
          v-model:formConfig="state.formConfig"
          :showBtn="false"
          :disabled="true"
          @dialogClose="closeDialog"
        ></formConpoent>
        <formConpoent
          v-if="state.showSort"
          @handle="postFormData1"
          v-model:formConfig="state.form3Config"
          :showBtn="true"
          :disabled="false"
          @dialogClose="closeDialog"
        ></formConpoent>
        <examineFormConpoent
            v-if="state.showExamineForm"
            @handle="postFormData"
            :status="state.formConfig.status"
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
import examineFormConpoent from "@/components/form/examineForm.vue";
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import { fundAll, fundUpdateOne } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      status: {
        0: '未审核',
        1: '申请成功',
        2: '申请失败'
      },
      tableHeaderConfig: [
        {
          prop: "companyName",
          label: "企业名称",
        },
        {
          prop: "serviceName",
          label: "服务名称",
        },
        {
          prop: "companyContact",
          label: "企业联系方式",
        },
        {
          prop: "companyPerson",
          label: "企业联系人"
        },
        {
          prop: "dockStatus",
          label: "对接状态",
        },
        {
          prop: "dockTime",
          label: "申请时间",
        },
        {
          prop: "sortNum",
          label: "排序",
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "companyName",
    label: "企业名称",
    showInput: true,
    disabled: true
  }, {
    prop: "companyContact",
    label: "企业联系方式",
    showInput: true,
    disabled: true
  }, {
    prop: "serviceName",
    label: "服务名称",
    showInput: true,
    disabled: true
  }, {
    prop: "companyPerson",
    label: "企业联系人",
    showInput: true,
    disabled: true
  }, {
    prop: "dockStatus",
    label: "对接状态",
    showInput: true,
    disabled: true
  },
  {
    prop: "dockTime",
    label: "申请时间",
    showInput: true,
    disabled: true
  }
];
const form2Config = [
  {
    prop: "fundName",
    label: "产品名称",
    showInput: true,
    disabled: true
  }, {
    prop: "",
    label: "定义",
    showInput: true,
    disabled: true
  }, {
    prop: "investmentIndustry",
    label: "产品特征",
    showInput: true,
    disabled: true
  }, {
    prop: "entryConditions",
    label: "准入条件",
    showInput: true,
    disabled: true
  }, {
    prop: "",
    label: "备注",
    showInput: true,
    disabled: true
  }, {
    prop: "fundCompnay",
    label: "发行单位",
    showInput: true,
    disabled: true
  }
];

const form3Config = [
  {
    prop: "sortNum",
    label: "排序",
    showInput: true,
    disabled: false
  }
];
let currentRoleId = ref<string>("");
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: '',
  username: '',
  culName: "",
  showForm: false,
  showExamineForm: false,
  showSort: false,
  entName: '',
  formConfig: formConfig,
  form2Config: form2Config,
  form3Config: form3Config,
  tableData: [
  ],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
};



const gettrainingServicesAll = () => {
  getfundAll();
};
const reset = () => {
  state.entName = '';
  getfundAll();
};
/**
 * 修改排序
 */
const editSort = (row) => {
  currentRoleId.value = row.id;
  state.dialogVisible = true;
  state.showSort = true;
  state.showForm = false;
  state.showExamineForm = false;
  state.form3Config = state.form3Config
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
  state.formConfig.status = row.dockStatus;
  currentRoleId.value = row.id;
  state.dialogVisible = true;
  state.showForm = false;
  state.showSort = false;
  state.showExamineForm = true;
};

/**
   * 提交表单数据
   */
   const postFormData1 = (formData) => {
  post(`${fundUpdateOne}`, {
    id: currentRoleId.value,
    ...formData
  })
    .then(function (data) {
      getfundAll();
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible = false;
  state.showExamineForm = false;
  state.showSort = false;
};



  /**
   * 提交表单数据
   */
  const postFormData = (formData) => {
  post(`${fundUpdateOne}`, {
    id: currentRoleId.value,
    dockStatus: formData.status ? 1:2
  })
    .then(function (data) {
      getfundAll();
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible = false;
  state.showExamineForm = false;
  state.showSort = false;
};

/**
 * 编辑表单
 */
const detail = (row) => {
  title.value = "查看详情";
  state.showForm = true;
  state.showSort = false;
  state.showExamineForm = false;
  state.dialogVisible = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
  state.form2Config = state.form2Config
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
};

/**
 *  获取表格数据
 */
const getfundAll = () => {
  post(`${fundAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    entName: state.entName
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getfundAll();


/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getfundAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getfundAll();
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
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
