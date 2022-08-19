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
         <img
            v-if="item.showImg"
            :src="item[item.prop]"
            style="width: 50px; height: 50px"
          />
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="detail(scope.row)">
              查看详情
            </el-button>
            <el-button type="primary" size="small" @click="qr(scope.row)">
              确认金额
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
          title="项目"
          :showBtn="false"
          @dialogClose="closeDialog"
        ></formConpoent>
         <formConpoent
          title="产品"
          :showBtn="false"
          v-model:formConfig="state.form2Config"
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
          prop: "protName",
          label: "项目名称",
        },
        {
          prop: "proCompany",
          label: "企业名称",
        },
        {
          prop: "fundName",
          label: "企业资金",
        },
        {
          prop: "fundCompnay",
          label: "资金企业",
        },
        {
          prop: "amount",
          label: "确认金额(万元)",
        },
        {
          prop: "",
          label: "对接状态",
        },
        {
          prop: "",
          label: "对接类别",
        },
        {
          prop: "storageTime",
          label: "时间",
        }
      ],
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "protName",
    label: "项目名称",
    showInput: true,
    disabled: true
  }, {
    prop: "proType",
    label: "融资类型",
    showInput: true,
    disabled: true
  }, {
    prop: "money",
    label: "融资金额",
    showInput: true,
    disabled: true
  }, {
    prop: "income",
    label: "去年总收入",
    showInput: true,
    disabled: true
  }, {
    prop: "expenditure",
    label: "去年总支出",
    showInput: true,
    disabled: true
  }, {
    prop: "intro",
    label: "项目简介",
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
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: '',
  username: '',
  culName: "",
  formConfig: formConfig,
  form2Config: form2Config,
  tableData: [
    {
      amount: "",
      company: "",
      companyid: 0,
      definition: "",
      describe: "",
      entryConditions: "1、具有国家高新技术企业证书或中关村高新技术企业证书的科技企业；。",
      expenditure: "100",
      files: [],
      fundCompnay: "华夏银行股份有限公司",
      fundName: "小额智融宝",
      fundPrincipal: "1",
      fundPrincipalTel: "2",
      fundid: 39,
      id: 30,
      images: [],
      income: "100",
      intro: "该户债权为三笔债权共同使用同一抵押物，并办理了最高额抵押。",
      investmentIndustry: "与北京IP合作",
      money: "面议",
      pageNum: 0,
      pageSize: 0,
      principal: "刘经理",
      principalTel: "66295509",
      proCompany: "北京文投大数据有限公司",
      proType: "企业债券融资",
      projectid: 118,
      protName: "云南中天文化债权",
      status: 1,
      storageTime: "2022-07-27 11:30:44",
      trzFundList: [],
      trzProjectList: [],
      type: 1
    },
  ],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
};

/**
 * 编辑表单
 */
const detail = (row) => {
  title.value = "查看详情";
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
