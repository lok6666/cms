<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <busneissDetail
        v-if="state.dialogVisible"
        :busneissName="state.busneissName"
        :tabList="state.tabList"
        v-model:baseInfo="state.baseInfo"
        v-model:formConfig="state.formConfig"
        @handle="postFormData"
        @dialogClose="closeDialog"
      ></busneissDetail>
<!--       <formConpoent
        :isSHowCloseBtn="true"
        v-if="state.dialogVisible"
        :tabList="state.tabList"
        v-model:baseInfo="state.baseInfo"
        v-model:formConfig="state.formConfig"
        @handle="postFormData"
        @dialogClose="closeDialog"
        v-loading="loading"
      ></formConpoent> -->
      <div v-else>
        <el-form :inline="true" :model="state" class="demo-form-inline">
          <el-form-item label="企业名称">
            <el-input v-model="state.entName" placeholder="请输入企业名称"/>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" icon="Search" @click.stop="gettrainingServicesAll">查询</el-button>
          <el-button type="primary" icon="Refresh" @click.stop="reset">重置</el-button>
          <el-button type="primary" icon="IceCreamSquare" @click.stop="exportClick2">导出EXECL</el-button>
          </el-form-item>
        </el-form>
        <el-tabs
            v-model="state.activeName"
            type="card"
            class="demo-tabs"
            @tab-click="handleClick"
        >
            <el-tab-pane :label="item" :name="item" v-for="item in state.tabList"></el-tab-pane>
        </el-tabs>
        <el-table
          id="my-table"
          :data="state.tableData"
          style="width: 100%"
          :border="true"
          @selection-change="handleSelectionChange"
        >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" icon="Document" size="small" @click.stop="detail(scope.row)">
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
import {
  phoneRules,
  emtyRules
} from "@/config/constants";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { export_json_to_excel } from "@/execl/Export2Excel";
import { ref, reactive, provide } from "vue";
// import { busneissData } from "./data";
import { map,entPatentGetMap, getSoftByNameMap, getTrademarkByNameMap, getWorksByNameMap,
  entgetRecruitByNameMap,entgetNewsByNameMap } from "./constant";
import formConpoent from "@/components/form/essay.vue";
import busneissDetail from "@/components/form/busneissDetail.vue";
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
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "entLocal",
    label: "企业地点",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "entCode",
    label: "企业码",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
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
  entName: '',
  tabList: [
        '1', '2', '3'
    ],
  selectionList: [],
  busneissName: '',
  searchKey: '',
  sensitiveword: "",
  dialogVisible: false,
  tabList: [],
  baseInfo: {}
});

let currentRoleId = ref<string>("");
const title = ref<string>("添加");
  const handleSelectionChange = (row) => {
  console.log('row', row);
  state.selectionList = row; 
};
const formatJson  = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]));
}
// 导出表格
const exportClick2 = () => {
  if(state.selectionList.length === 0) {
    ElMessage({
        message: '请选择要导出的数据',
        type: 'warning'
      })
  } else {
    const tableHeaderConfig = [
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
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '企业评估');
  }

};
 // 导出表格
const exportClick = () => {
var wb = XLSX.utils.table_to_book(document.querySelector('#my-table'));//关联don节点
/* get binary string as output */
var wbout = XLSX.write(wb, {
  bookType: 'xlsx',
  bookSST: true,
  type: 'array'
})
try {
  FileSaver.saveAs(new Blob([wbout], {
    type: 'application/octet-stream'
  }), '企业评估')//自定义文件名
} catch (e) {
  if (typeof console !== 'undefined') console.log(e, wbout);
}
return wbout
}
const gettrainingServicesAll = () => {
  getbusinessEstimateAll();
};
const reset = () => {
  state.entName = '';
  getbusinessEstimateAll();
};
/**
 * 表单详情
 */
// todo 单独封装
const detail = async (row) => {
  state.busneissName = row.companyName;
  state.dialogVisible = true;
  // await getentGetByName(row.companyName);
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
    companyName: state.entName
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
     let data1 = await Promise.all([
        getentPatentGet(busneissName), 
        getentgetSoftByName(busneissName),
        getTrademarkByName(busneissName),
        getRecruitByName(busneissName),
        getNewsByName(busneissName),
        getWorksByName(busneissName)
    ]);
    state.dialogVisible = true;
/*     await getentPatentGet(busneissName);
    await getentgetSoftByName(busneissName);
    await getTrademarkByName(busneissName);
    await getRecruitByName(busneissName);
    await getNewsByName(busneissName); */
    // await getWorksByName(busneissName);
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
    });
    state.tabList = state.tabList.concat(list);
    return true;
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
/*        map7[i].forEach((key, index) => {
        debugger;
        obj.optionsList.push({
              id: index,
              ...entgetNewsByNameMap[key],
              businessMessage: data[index][key]
          });
      });  */
      data.length > 0 && obj.optionsList.push({
          id: 0,
          ...entgetNewsByNameMap['EVENT'],
          businessMessage: data[0]['EVENT']
      });
      data.length > 0 && obj.optionsList.push({
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
