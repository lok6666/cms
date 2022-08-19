<template>
  <u-container-layout>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="项目名称">
        <el-input v-model="state.name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="企业名称">
          <el-input v-model="state.username" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click="getProjectAll">查询</el-button>
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
              
              @click="edit(scope.row)"
            >
              编辑
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
import { proJectAll, industryDataAddOne, proJectUpdateOne } from "@/config/api";
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
          label: "项目名称",
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
    label: "文化领域",
    showInput: true
  }, {
    prop: "type",
    label: "融资类型",
    showInput: true
  }, {
    prop: "money",
    label: "融资金额",
    showInput: true
  }, {
    prop: "income",
    label: "去年总收入",
    showInput: true
  }, {
    prop: "expenditure",
    label: "去年总支出",
    showInput: true
  },{
    prop: "intro",
    label: "项目简介",
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
      address: "测试地点",
      company: 62,
      companyIco: "/asset/mxupload/up0642170001558080624.png",
      companyName: "",
      count: 0,
      createdate: "2022-03-25 15:21:31",
      date: 0,
      expenditure: "",
      files: [],
      fundId: 0,
      id: 118,
      images: [],
      income: "",
      intro: "该户债权为三笔债权共同使用同一抵押物，并办理了最高额抵押。",
      money: "面议",
      name: "云南中天文化债权",
      pageNum: 0,
      pageSize: 0,
      picture: "/images/a3c96785bbbe464296b268f83d98fd32.jpg",
      principal: "刘经理",
      principalTel: "66295509",
      status: 1,
      sxj: 0,
      trzCompany: null,
      type: "企业债券融资",
      username: "北京文投大数据有限公司",
      ysIssue: 0,
    },
  ],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");


/**
 * 添加
 */
const add = () => {
  title.value = "新增";
  state.dialogVisible = true;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  post(`${proJectUpdateOne}`, {
    ...formData
  })
    .then(function (data) {
      console.log("data----", data);
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible = false;
  console.log("submit!", formData);
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
  state.formConfig = state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
};

/**
 *  获取表格数据
 */
const getProjectAll = () => {
  post(`${proJectAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    name: state.name,
    username: state.username
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getProjectAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // getProjectAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getProjectAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getProjectAll();
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
