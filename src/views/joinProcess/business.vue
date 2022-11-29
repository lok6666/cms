<template>
  <u-container-layout>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="会员单位">
        <el-input v-model="state.name" placeholder="请输入会员单位" />
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click.stop="getfundAll">查询</el-button>
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
         <img
            v-if="item.showImg"
            :src="item[item.prop]"
            style="width: 50px; height: 50px"
          />
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              
              @click.stop="edit(scope.row)"
            >
              编辑
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
          v-if="state.dialogVisible"
          v-model:formConfig="state.formConfig"
          @handle="changeFormData"
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
import { fundAll, fundUpdateOne } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
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
          prop: "name",
          label: "产品名称",
        },
        {
          prop: "picture",
          label: "缩略图",
          showImg: true
        },
        {
          prop: "username",
          label: "企业名称",
        },
        {
          prop: "",
          label: "审核状态",
        },
        {
          prop: "",
          label: "状态",
        },
        {
          prop: "createdate",
          label: "创建日期",
        }
      ],
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "name",
    label: "产品名称",
    showInput: true
  }, {
    prop: "definition",
    label: "定义",
    showInput: true
  }, {
    prop: "investmentindustry",
    label: "特征",
    showInput: true
  }, {
    prop: "entryconditions",
    label: "准入条件",
    showInput: true
  }, {
    prop: "describe",
    label: "描述",
    showInput: true
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
const title = ref("添加");


/**
 * 添加
 */
const add = () => {
  title.value = "添加";
  state.dialogVisible = true;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  post(`${fundUpdateOne}`, {
    ...formData
  })
    .then(function (data) {
      console.log("data----", data);
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible = false;
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
  console.log("submit!", formData);
};

/**
 * 关闭弹窗
 */
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
};

/**
 * 编辑表单
 */
const edit = (row) => {
  title.value = "编辑";
  state.dialogVisible = true;
  state.formConfig = state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
  console.log("state.formConfig", state.formConfig);
};

/**
 *  获取表格数据
 */
const getfundAll = () => {
  post(`${fundAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    name: state.name,
    username: state.username
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getfundAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val: string) => {
  console.log("val", val);
  state.culName = val;
  // getfundAll();
};

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
const loading = ref(false);

/**
 * 提交表单数据
 */
const changeFormData = (formData) => {
  state.dialogVisible = false;
  console.log("changeFormData", formData);
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
