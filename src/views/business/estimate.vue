<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <formConpoent
        v-if="state.dialogVisible"
        :tabList="state.tabList"
        v-model:baseInfo="state.baseInfo"
        v-model:formConfig="state.formConfig"
        @handle="postFormData"
        @dialogClose="closeDialog"
      ></formConpoent>
      <div v-else>
            <el-input v-model="state.searchKey" placeholder="请输入" style="width: 300px; margin-bottom: 10px;" @change="handleChange"/>
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
        <el-table-column prop="operator" label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="detail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
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
import { map,entPatentGetMap, getSoftByNameMap, getTrademarkByNameMap, getWorksByNameMap,
  entgetRecruitByNameMap,entgetNewsByNameMap } from "./constant";
import formConpoent from "@/components/form/essay.vue";
import {
  businessEstimateAll,
  entGetByName,
  entPatentGet,
  entgetSoftByName,
  entgetTrademarkByName,
  entgetWorksByName,
  entgetRecruitByName,
  entgetNewsByName
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
          prop: "companyName",
          label: "企业名称"
        },
        {
          prop: "entLocal",
          label: "企业地点"
        },
        {
          prop: "entCode",
          label: "企业码"
        }
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
    prop: "companyName",
    label: "企业名称",
    required: true,
    showInput: true,
  },
  {
    prop: "entLocal",
    label: "企业地点",
    required: true,
    showInput: true,
  },
  {
    prop: "entCode",
    label: "企业码",
    required: true,
    showInput: true,
  }
];

const map1 = {
    '工商信息': [
      'BASICINFO',
      // 'RESULTTYPEINFO',
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
const map2 = {
  '专利信息': [
  'ANNREPORTINFO'
  ],
};
const map3 = {
  '软著': [
  'ANNREPORTINFO'
  ],
};
const map4 = {
  '商标': [
  'ANNREPORTINFO'
  ],
};
const map5 = {
  '著作权': [
  'ANNREPORTINFO'
  ],
};
const map6 = {
  '招聘': [
  'ANNREPORTINFO'
  ],
};
const map7 = {
  '舆情': [
  'EVENT',
  'KEYWORD'
  ],
};
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: Object.assign([], formConfig),
  tableData: [],
  total: 0,
  searchKey: '',
  sensitiveword: "",
  dialogVisible: false,
  tabList: [],
  baseInfo: {}
});

let currentRoleId = ref<string>("");
const title = ref<string>("新增");

/**
 * 表单详情
 */
// todo 单独封装
const detail = async (row) => {
  await getentGetByName(row.companyName);
  // await getentPatentGet(row.companyName);
  // await getentgetSoftByName(row.companyName);
  // await getTrademarkByName(row.companyName);
  // await getWorksByName(row.companyName);
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
const getentGetByName = (busneissName) => {
  get(`${entGetByName}/${busneissName}`, {

  }).then(async function (data) {
    let list = [];
    Object.keys(map1).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: []
      };
      map1[i].forEach((key, index) => {
        if(key === 'BASICINFO') {
          state.baseInfo = {
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
    await getentPatentGet(busneissName);
    await getentgetSoftByName(busneissName);
    await getTrademarkByName(busneissName);
    await getRecruitByName(busneissName);
    await getNewsByName(busneissName);
    await getWorksByName(busneissName);
  });
};

//  文章内容列表
const getentPatentGet = (busneissName) => {
  return get(`${entPatentGet}/${busneissName}`, {

  }).then(function (data) {
    let list = [];
    Object.keys(map2).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: []
      };
      map2[i].forEach((key, index) => {
        obj.optionsList.push({
              id: index,
              ...entPatentGetMap[key],
              businessMessage: data
          });
      });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};

//  软著列表
const getentgetSoftByName = (busneissName) => {
  return get(`${entgetSoftByName}/${busneissName}`, {

  }).then(function (data) {
    let list = [];
    Object.keys(map3).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: []
      };
      map3[i].forEach((key, index) => {
        obj.optionsList.push({
              id: index,
              ...getSoftByNameMap[key],
              businessMessage: data
          });
      });
      list.push(obj);
    });
    
    state.tabList = state.tabList.concat(list);
    return true;
  });
};


//  商标列表
const getTrademarkByName = (busneissName) => {
  return get(`${entgetTrademarkByName}/${busneissName}`, {
  }).then(function (data) {
    let list = [];
    Object.keys(map4).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: []
      };
      map4[i].forEach((key, index) => {
        obj.optionsList.push({
              id: index,
              ...getTrademarkByNameMap[key],
              businessMessage: data
          });
      });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};
//  著作权列表
const getWorksByName = (busneissName) => {
  return get(`${entgetWorksByName}/${busneissName}`, {
  }).then(function (data) {
    let list = [];
    Object.keys(map5).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: []
      };
      map5[i].forEach((key, index) => {
        obj.optionsList.push({
              id: index,
              ...getWorksByNameMap[key],
              businessMessage: data
          });
      });
      list.push(obj);
      title.value = "查看详情";
      state.dialogVisible = true;
    });
    state.tabList = state.tabList.concat(list);
  });
};

//  招聘列表
const getRecruitByName = (busneissName) => {
  return get(`${entgetRecruitByName}/${busneissName}`, {
  }).then(function (data) {
    let list = [];
    Object.keys(map6).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: []
      };
      map6[i].forEach((key, index) => {
        obj.optionsList.push({
              id: index,
              ...entgetRecruitByNameMap[key],
              businessMessage: data
          });
      });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};

// 舆情列表
const getNewsByName = (busneissName) => {
  return get(`${entgetNewsByName}/${busneissName}`, {
  }).then(function (data) {
    let list = [];
    Object.keys(map7).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: []
      };
/*       map7[i].forEach((key, index) => {
        debugger;
        obj.optionsList.push({
              id: index,
              ...entgetNewsByNameMap[key],
              businessMessage: data[index][key]
          });
      }); */
      obj.optionsList.push({
          id: 0,
          ...entgetNewsByNameMap['EVENT'],
          businessMessage: data[0]['EVENT']
      });
      obj.optionsList.push({
          id: 1,
          ...entgetNewsByNameMap['KEYWORD'],
          // todo 此处优化
          businessMessage: [{'aaaa': data[0]['KEYWORD']}]
      }); 
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};
const handleChange = val => {
  console.log('valk------', val);
  post(`${businessEstimateAll}`, {
    companyName: val,
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
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
