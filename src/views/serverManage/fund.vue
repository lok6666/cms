<template>
  <u-container-layout>
    <div style="display: flex; justify-content: flex-end">
      <el-button type="primary" @click="add">
        <el-icon><plus /></el-icon>添加
      </el-button>
    </div>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="资金名称">
        <el-input v-model="state.name" placeholder="请输入资金名称" />
      </el-form-item>
      <el-form-item label="企业名称">
          <el-input v-model="state.username" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click="getfinancialServicesAll">查询</el-button>
      </el-form-item>
    </el-form>
    
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
        <template #default="scope" v-if="item.showImg">
         <img
            v-if="item.showImg"
            :src="scope.row.serviceImages"
            style="width: 50px; height: 50px"
          />
        </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
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
          :showBtn="true"
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
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import { financialServicesAll, financialServicesUpdateOne, financialServicesDeleteOne, financialServicesInsert } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, deleteItem, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      tableHeaderConfig: [
        {
          prop: "serviceName",
          label: "服务名称",
        },
        {
          prop: "serviceQuota",
          label: "额度范围",
        },
        {
          prop: "serviceImages",
          label: "机构logo",
          showImg: true
        },
        {
          prop: "serviceTerm",
          label: "期限",
        },
        {
          prop: "serviceRange",
          label: "利率范围",
        },
        {
          prop: "serviceType",
          label: "担保方式"
        },
        {
          prop: "supplierId",
          label: "服务商ID"
        }
      ],
    };
  },
};
</script>
<script lang="ts" setup >
let currentRoleId = ref<string>("");
const formConfig = [
  {
    prop: "serviceName",
    label: "服务名称",
    showInput: true,
    required: true
  },
  {
    prop: "serviceContent",
    label: "服务详情",
    showWangEditor: true,
    required: true
  },
  {
    prop: "serviceImages",
    label: "机构logo",
    upload: true,
    required: true
  },
  {
    prop: "serviceQuota",
    label: "额度范围",
    showInput: true,
    required: true
  },
  {
    prop: "serviceTerm",
    label: "期限",
    showInput: true,
    required: true
  },
  {
    prop: "serviceRange",
    label: "利率范围",
    showInput: true,
    required: true,
  },
  {
    prop: "serviceType",
    label: "担保方式",
    showInput: true,
    required: true,
  },
  {
    prop: "supplierId",
    label: "服务商ID",
    options: [
      {
        label: '报名中',
        value: '1'
      },
      {
        label: '报名结束，进行中',
        value: '2'
      },
      {
        label: '已结束',
        value: '3'
      }
    ],
    required: true,
    showSelect: true
  }
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: '',
  username: '',
  culName: "",
  formConfig: formConfig,
  tableData: [
    {
      address: "",
      company: 5,
      companyIco: "/asset/mxupload/up0255470001577778909.png",
      companyName: "",
      cound: 0,
      createdate: "2022-03-25 17:17:04",
      date: 0,
      definition: "“短贷宝”是我行向个体工商户、企业主（包括企业主要股东、法定代表人或实际控制人等）发放的用于其企业正常经营活动的个人贷款或个人授信。",
      describe: "1、贷款申请简、易、快。简：提供资料简洁，贷款手续简便；易：专",
      entryconditions: "1、受信人须为具有完全民事行为能力的中国籍自然人，年龄1",
      files: [],
      id: 40,
      images: [],
      investmentindustry: "贷款申请简、易、快",
      name: "短贷宝",
      pageNum: 0,
      pageSize: 0,
      picture: "/images/a1121f2b923a4b1aba90ea379114287b.gif",
      principal: "1",
      principalTel: "2",
      projectId: 0,
      status: 1,
      sxj: 0,
      trzCompany: null,
      username: "北京银行股份有限公司",
ysIssue: 0
    },
  ],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");


/**
 * 添加
 */
const add = (row) => {
  title.value = "新增";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
};


// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.formConfig = formConfig;
};

/**
 * 编辑表单
 */
const edit = (row) => {
  title.value = "编辑";
  state.dialogVisible = true;
  currentRoleId.value = row.id;
  state.formConfig = state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
};
// todo 服务炸状态

// 删除
const deleteAction = (row, isResume) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${financialServicesDeleteOne}`, {
        data: [row.id],
      }).then(function (data) {
        getfinancialServicesAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 *  获取表格数据
 */
const getfinancialServicesAll = () => {
  post(`${financialServicesAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize
  }).then(function (data) {
    console.log('aaaaa---', data);
    state.tableData = data.list;
    state.total = data.total;
  });
};
getfinancialServicesAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // getfinancialServicesAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getfinancialServicesAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getfinancialServicesAll();
};
const loading = ref(false);


/**
 * 提交表单数据
 */
 const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${financialServicesInsert}`, {
      ...formData
    })
      .then(function (data) {
        getfinancialServicesAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${financialServicesUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        getfinancialServicesAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
  }
  state.dialogVisible = false;
  console.log("submit!", formData);
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
