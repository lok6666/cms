<template>
  <u-container-layout>
    <el-input v-model="state.searchKey" placeholder="请输入" style="width: 300px; margin-bottom: 10px;" @change="handleChange"/>
    <div class="inline-edit-table">
      <formConpoent
        v-if="state.dialogVisible"
        :tabList="state.tabList"
        v-model:baseInfo="state.baseInfo"
        v-model:formConfig="state.formConfig"
        @handle="postFormData"
        @dialogClose="closeDialog"
      ></formConpoent>
      <el-table
        v-else
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
        <el-table-column prop="operator" label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="detail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-dialog
        v-model="state.dialogVisible"
        :title="title"
        width="90%"
        @closed="closeDialog()"
      >
        <formConpoent
          v-if="state.dialogVisible"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></formConpoent>
      </el-dialog> -->
      <div
        v-if="!state.dialogVisible"
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
// import { busneissData } from "./data";
import { map } from "./constant";
import formConpoent from "./essay.vue";
import {
  businessEstimateAll,
  testAll
  // businessEstimateAddOne,
  // businessEstimatUpdateOne,
  // businessEstimatDelete,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import { formConfigItem } from "@/utils/interface";
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
}
const formConfig: formConfigItem[] = [
  {
    prop: "actId",
    label: "活动id",
    required: true,
    showInput: true,
  },
  {
    prop: "companyid",
    label: "企业id",
    required: true,
    showInput: true,
  },
  {
    prop: "duties",
    label: "职务",
    required: true,
    showInput: true,
  },
  {
    prop: "operator",
    label: "操作人",
    required: true,
    showInput: true,
  },
  {
    prop: "startTime",
    label: "开始时间",
    required: true,
    showDatePicker: true,
  },
  {
    prop: "endTime",
    label: "结束时间",
    required: true,
    showDatePicker: true,
  },
  {
    prop: "personName",
    label: "联系人",
    required: true,
    showInput: true,
  },
  {
    prop: "telPhone",
    label: "人员电话",
    required: true,
    showInput: true,
  },
];

const map1 = {
    '工商信息': [
      'BASICINFO',
      'RESULTTYPEINFO',
      'MAINMANAGERINFO',
      'SHAREHOLDERINFO',
      'SIMPLECANCELINFO',
      'CHANGEINFO'
    ],
    '处罚信息': [
      'SERIOUSDISHONESTYINFO',
      'LAWADMININFO',
      'ABNORMALOPERATIONINFO',
      'JUDICIALAIDEQUITYFREEZEINFO',
      'EQUITYPLEDGEDDETAILZXINFO',
      'CHATTELMORTGAGEDYQRINFO',
      'EQUITYPLEDGEDDETAILBGINFO',
      'SPOTCHECKINFO',
      'CHATTELMORTGAGEINFO',
      'CHATTELMORTGAGEBDBZQINFO',
      'CHATTELMORTGAGEDYWINFO',
      'CHATTELMORTGAGEBGINFO',
      'CHATTELMORTGAGEZXINFO',
      'JUDICIALAIDINFO',
      'SETTLEACCOUNTINFO',
      'JUDICIALAIDEQUITYCHANGEINFO',
      'EQUITYPLEDGEDINFO'
    ],
    '企业年报': [
    'ANNREPORTINFO',
    'ANNREPORTINVINFO',
    'ANNREPORTTOINVINFO',
    'ANNREPORTWEBSITEINFO',
    'ANNREPORTASSETSINFO',
    'ANNREPORTFORGUARANTEEINFO',
    'ANNREPORTSTOCKCHANAGEINFO',
    'ANNREPORTSOCIALSECURITYINFO',
    'ANNREPORTUPDATEINFO',
    ],
    '企业投资': [
      'BRANCHINFO',
      'INVESTMENTABROADINFO'
    ],
    '人员投资': [
    'ASSOCIATEPERSONINVESTMENTINFO',
    'ASSOCIATEPERSONOFFICEINFO',
    'LAWPERSONTOOTHERINFO',
    'LAWPERSONTOINVESTINFO',
    ],
    '上市公司': [
      'LISTEDCOMPANYINFORMATIONINFO',
      'LISTEDCOMPANYSHAREHOLDEINFO'
    ]
  };
let list: Array = [];
let baseInfo: Object = {};
console.log('e---', list, baseInfo);
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: Object.assign([], formConfig),
  tableData: [],
  total: 0,
  searchKey: '',
  sensitiveword: "",
  dialogVisible: false,
  tabList: list,
  baseInfo: baseInfo
});

let currentRoleId = ref<string>("");
const title = ref<string>("新增");

/**
 * 表单详情
 */
// todo 单独封装
const detail = (row) => {
  title.value = "查看详情";
  state.dialogVisible = true;
  //   state.formConfig = state.formConfig
  //     .map((e, b) => {
  //       // value 替换成 e.prop
  //       let result = { ...e };
  //       result[e.prop] = row[e.prop];
  //       return result;
  //     })
  //     .splice(0);
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${businessEstimateAddOne}`, {
      ...formData,
    })
      .then(function (data) {
        getbusinessEstimateAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${businessEstimatUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        getbusinessEstimateAll();
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
};
//  文章内容列表
const getbusinessEstimateAll = () => {
  post(`${businessEstimateAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getbusinessEstimateAll();

//  文章内容列表
const getTestAll = () => {
  get(`${testAll}`, {

  }).then(function (data) {
    console.log('data----', data);   
    Object.keys(map1).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: []
      };
      map1[i].forEach((key, index) => {
        if(key === 'BASICINFO') {
          baseInfo = {
              id: index,
              businessConfig: {
                ENTNAME: '企业名称',
                DOM: '地点'
              },
              businessMessage: {
                ENTNAME: data[key][0].ENTNAME,
                DOM: data[key][0].DOM
              }
          };
        };
          obj.optionsList.push({
              id: index,
              ...map[key],
              businessMessage: data[key]
          });
      });
      list.push(obj);
      
    });
    state.tabList = list;
  });
};
getTestAll();


const handleChange = val => {
  console.log('valk------', val);
  state.tableData = [{}];
};

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getbusinessEstimateAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getbusinessEstimateAll();
};
const loading = ref(false);

const formInline = reactive({
  username: "",
});
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
