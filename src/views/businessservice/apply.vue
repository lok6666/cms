<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-form :inline="true" :model="state" class="demo-form-inline" style="float: left">
        <el-form-item label="企业名称">
          <el-input v-model="state.entName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click.stop="gettrainingServicesAll">查询</el-button>
          <el-button type="primary" icon="Refresh" @click.stop="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="float: right">
        <!-- <el-button type="primary" icon="plus"  @click.stop="add">添加</el-button> -->
          <el-button type="primary" icon="IceCreamSquare" @click.stop="exportClick2">导出EXECL</el-button>
      </div>
      <el-table
        id="my-table"
        :data="state.tableData"
        style="width: 100%"
        :border="true"
        :cell-style="fn"
        header-row-class-name="custom-header"
        row-class-name="hover-row"
        @row-click="routerTo"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template #default="scope" v-if="item.prop === 'applyStatus'">
            {{ applyStatusObj[scope.row.applyStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              icon="Document"
              @click.stop="detail(scope.row)"
            >
              查看详情
            </el-button>
            <el-button type="primary" icon="plus" size="small" @click.stop="add(scope.row)">转移名单</el-button>
            <el-button
              type="primary"
              size="small"
              icon="check"
              @click.stop="examine(scope.row)"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <busneissDetail
          v-if="state.applyDialogVisible"
          :busneissName="state.busneissName"
          :tabList="state.tabList"
          v-model:baseInfo="state.baseInfo"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></busneissDetail>
      <el-dialog
        v-model="state.dialogVisible1"
        :title="title"
        top="1vh"
        :center="true"
        width="98%"
        @closed="closeDialog()"
      >
<!--         <entTable
          v-if="state.applyDialogVisible"
          :tabList="state.tabList"
          v-model:baseInfo="state.baseInfo"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></entTable> -->
        <formConpoent1
          v-if="state.dialogVisible2"
          v-model:formConfig="state.formConfig2"
          @handle="postFormData2"
          :showBtn="true"
          @dialogClose="closeDialog"
        ></formConpoent1>
      </el-dialog>
      <el-dialog
        v-model="state.dialogVisible3"
        :title="title"
        :center="true"
        width="30%"
        @closed="closeDialog()"
      >
        <formConpoent1
          v-if="state.dialogVisible2"
          v-model:formConfig="state.formConfig2"
          @handle="postFormData2"
          :showBtn="true"
          @dialogClose="closeDialog"
        ></formConpoent1>
      </el-dialog>
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
import { export_json_to_excel } from "@/execl/Export2Excel";
import entTable from "@/components/form/essay.vue";
import formConpoent1 from "@/components/form/form.vue";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  map,
  entPatentGetMap,
  getSoftByNameMap,
  getTrademarkByNameMap,
  getWorksByNameMap,
  entgetRecruitByNameMap,
  entgetNewsByNameMap,
} from "./constant";
import { ref, reactive, provide } from "vue";
import formConpoent from "@/components/form/form.vue";
import busneissDetail from "@/components/form/busneissDetail.vue";
import examineFormConpoent from "@/components/form/examineForm.vue";
import {
  entMerchantsSuccessListInsert,
  entMerchantsInsert,
  entMerchantsList,
  entApplyAll,
  entApplAddOne,
  entApplyUpdateOne,
  entApplyDelete,
  entPatentGet,
  entGetByName,
  entgetSoftByName,
  entgetTrademarkByName,
  entgetWorksByName,
  entgetRecruitByName,
  entgetNewsByName,
  entMerchantsPersonList
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import { formConfigItem } from "@/utils/interface";
import { deleteItem, post, get } from "@/utils/request";
import { fa } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      applyStatusObj: {
        0: "未审核",
        1: "审核通过",
        2: "审核未通过",
      },
      tableHeaderConfig: [
        {
          prop: "entName",
          label: "企业名称",
          width: 250,
        },
        {
          prop: "legalPerson",
          label: "法人",
        },
        {
          prop: "registerDistrict",
          label: "公司地址",
        },
        {
          prop: "entIndustry",
          label: "所在行业",
        },
/*         {
          prop: "entCode",
          label: "企业社会统一代码",
        }, */
        {
          prop: "businessIncome",
          label: "营业收入(万元)",
        },
/*         {
          prop: "legalId",
          label: "法人身份证",
        }, */
        {
          prop: "contactsName",
          label: "联系人",
          required: true,
        },
        {
          prop: "contactsPhone",
          label: "联系方式",
          required: true,
        },
        {
          prop: "applyTime",
          label: "申请时间",
          width: 250,
        },
        {
          prop: "applyStatus",
          label: "审核状态",
        },
/*         {
          prop: "applyInfo",
          label: "备注",
          showTextarea: true,
        }, */
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
  disabled?: boolean;
  showTextarea?: boolean;
}
const formConfig: formConfigItem[] = [
  {
    prop: "entName",
    label: "企业名称",
    required: true,
    showInput: true,
  },
  {
    prop: "entCode",
    label: "企业社会统一代码",
    showInput: true,
  },
  {
    prop: "legalPerson",
    label: "法人",
    showInput: true,
  },
  {
    prop: "legalId",
    label: "法人联系方式",
    showInput: true,
  },
  {
    prop: "contactsName",
    label: "联系人",
    required: true,
    showInput: true,
  },
  {
    prop: "contactsPhone",
    label: "联系方式",
    required: true,
    showInput: true,
  },
  {
    prop: "registerDistrict",
    label: "公司地址",
    showInput: true,
  },
  {
    prop: "entIndustry",
    label: "所在行业",
    showInput: true,
  },
  {
    prop: "businessIncome",
    label: "营业收入",
    showInput: true,
  },
  {
    prop: "applyInfo",
    label: "备注",
    showTextarea: true,
  },
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableItem: {},
  selectionList: [],
  formConfig2: [
    {
      prop: "listName",
      label: "名称",
      required: true,
      options: [
      {
        label: '意向企业',
        value: '意向企业',
      },
      {
        label: '入驻企业',
        value: '入驻企业'
      }
      ],
      showSelect: true,
    },
    {
    prop: "entSource",
    label: "招商来源",
    showInput: true,
    entSource: '北京文投大数据有限公司',
    disabled: true
  },
  {
    prop: "hctd",
    label: "招商专员",
    showInput: true
  }
  ],
  tableData: [],
  total: 0,
  entName: "",
  formMap: {
    'entName': 'companyName',
/*     'entCode': 'entCode',
    'contactsName': 'contactPerson',
    'contactPhone': 'contactsPhone' */
  },
  sensitiveword: "",
  busneissName: '',
  dialogVisible1: false,
  dialogVisible: false,
  dialogVisible2: false,
  dialogVisible3: false,
  showForm: false,
  showExamineForm: false,
  isResume: false,
  disabled: true,
});

let currentRoleId = ref<string>("");
const title = ref<string>("添加");
const map1 = {
  工商信息: [
    "BASICINFO",
    // 'RESULTTYPEINFO',
    "MAINMANAGERINFO",
    "SHAREHOLDERINFO",
    "SIMPLECANCELINFO",
    "CHANGEINFO",
  ],
  处罚信息: [
    "SERIOUSDISHONESTYINFO",
    "LAWADMININFO",
    "ABNORMALOPERATIONINFO",
    "JUDICIALAIDEQUITYFREEZEINFO",
    "EQUITYPLEDGEDDETAILZXINFO",
    "CHATTELMORTGAGEDYQRINFO",
    "EQUITYPLEDGEDDETAILBGINFO",
    "SPOTCHECKINFO",
    "CHATTELMORTGAGEINFO",
    "CHATTELMORTGAGEBDBZQINFO",
    "CHATTELMORTGAGEDYWINFO",
    "CHATTELMORTGAGEBGINFO",
    "CHATTELMORTGAGEZXINFO",
    "JUDICIALAIDINFO",
    "SETTLEACCOUNTINFO",
    "JUDICIALAIDEQUITYCHANGEINFO",
    "EQUITYPLEDGEDINFO",
  ],
  企业年报: [
    "ANNREPORTINFO",
    "ANNREPORTINVINFO",
    "ANNREPORTTOINVINFO",
    "ANNREPORTWEBSITEINFO",
    "ANNREPORTASSETSINFO",
    "ANNREPORTFORGUARANTEEINFO",
    "ANNREPORTSTOCKCHANAGEINFO",
    "ANNREPORTSOCIALSECURITYINFO",
    "ANNREPORTUPDATEINFO",
  ],
  企业投资: ["BRANCHINFO", "INVESTMENTABROADINFO"],
  人员投资: [
    "ASSOCIATEPERSONINVESTMENTINFO",
    "ASSOCIATEPERSONOFFICEINFO",
    "LAWPERSONTOOTHERINFO",
    "LAWPERSONTOINVESTINFO",
  ],
  上市公司: ["LISTEDCOMPANYINFORMATIONINFO", "LISTEDCOMPANYSHAREHOLDEINFO"],
};
const map2 = {
  专利信息: ["ANNREPORTINFO"],
};
const map3 = {
  软著: ["ANNREPORTINFO"],
};
const map4 = {
  商标: ["ANNREPORTINFO"],
};
const map5 = {
  著作权: ["ANNREPORTINFO"],
};
const map6 = {
  招聘: ["ANNREPORTINFO"],
};
const map7 = {
  舆情: ["EVENT", "KEYWORD"],
};
const routerTo = async (row) => {
  state.busneissName = row.entName;
  // state.dialogVisible1 = true;
  state.applyDialogVisible = true;
  // await getentGetByName(row.entName);
};
const fn = ({row, column}) => {
    if(column.label === '企业名称') {
      return {
      color: `#409eff`
    }
    };
  };
// 左侧tab
/* const getentMerchantsPersonList = () => {
  post(`${entMerchantsPersonList}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.formConfig2[state.formConfig2.length - 1].options = data.list.map(e => {
      return {
        label: e.listName,
        value: e.primaryId
      }
    });
  });
}; */
// getentMerchantsPersonList();
//  文章内容列表
const getentGetByName = (busneissName) => {
  get(`${entGetByName}/${busneissName}`, {}).then(async function (data) {
    let list = [];
    Object.keys(map1).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map1[i].forEach((key, index) => {
        if (key === "BASICINFO") {
          state.baseInfo = {
            id: index,
            businessConfig: {
              ENTNAME: "企业名称",
              DOM: "地点",
            },
            businessMessage: {
              ENTNAME: data[key][0].ENTNAME,
              DOM: data[key][0].DOM,
            },
          };
        }
        obj.optionsList.push({
          id: index,
          ...map[key],
          businessMessage: data[key],
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
      getWorksByName(busneissName),
    ]);
    state.dialogVisible1 = true;
    state.applyDialogVisible = true;
  });
};

//  文章内容列表
const getentPatentGet = (busneissName) => {
  return get(`${entPatentGet}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map2).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map2[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...entPatentGetMap[key],
          businessMessage: data,
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
  return get(`${entgetSoftByName}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map3).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map3[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...getSoftByNameMap[key],
          businessMessage: data,
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
  return get(`${entgetTrademarkByName}/${busneissName}`, {}).then(function (
    data
  ) {
    let list = [];
    Object.keys(map4).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map4[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...getTrademarkByNameMap[key],
          businessMessage: data,
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
  return get(`${entgetWorksByName}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map5).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map5[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...getWorksByNameMap[key],
          businessMessage: data,
        });
      });
      list.push(obj);
      title.value = "查看详情";
    });
    state.tabList = state.tabList.concat(list);
  });
};

//  招聘列表
const getRecruitByName = (busneissName) => {
  return get(`${entgetRecruitByName}/${busneissName}`, {}).then(function (
    data
  ) {
    let list = [];
    Object.keys(map6).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map6[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...entgetRecruitByNameMap[key],
          businessMessage: data,
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
  return get(`${entgetNewsByName}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map7).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      /*       map7[i].forEach((key, index) => {
        
        obj.optionsList.push({
              id: index,
              ...entgetNewsByNameMap[key],
              businessMessage: data[index][key]
          });
      }); */
      obj.optionsList.push({
        id: 0,
        ...entgetNewsByNameMap["EVENT"],
        businessMessage: data[0]["EVENT"],
      });
      obj.optionsList.push({
        id: 1,
        ...entgetNewsByNameMap["KEYWORD"],
        // todo 此处优化
        businessMessage: [{ aaaa: data[0]["KEYWORD"] }],
      });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};
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
          prop: "entName",
          label: "企业名称",
          width: 250,
        },
        {
          prop: "legalPerson",
          label: "法人",
        },
        {
          prop: "registerDistrict",
          label: "公司地址",
        },
        {
          prop: "entIndustry",
          label: "所在行业",
        },
/*         {
          prop: "entCode",
          label: "企业社会统一代码",
        }, */
        {
          prop: "businessIncome",
          label: "营业收入(万元)",
        },
/*         {
          prop: "legalId",
          label: "法人身份证",
        }, */
        {
          prop: "contactsName",
          label: "联系人",
          required: true,
        },
        {
          prop: "contactsPhone",
          label: "联系方式",
          required: true,
        },
        {
          prop: "applyTime",
          label: "申请时间",
          width: 250,
        },
        {
          prop: "applyStatus",
          label: "审核状态",
        },
/*         {
          prop: "applyInfo",
          label: "备注",
          showTextarea: true,
        }, */
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '入驻申请');
  }

};
// 导出表格
const exportClick = () => {
  var wb = XLSX.utils.table_to_book(document.querySelector("#my-table")); //关联don节点
  /* get binary string as output */
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      new Blob([wbout], {
        type: "application/octet-stream",
      }),
      "入驻申请"
    ); //自定义文件名
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
};
const gettrainingServicesAll = () => {
  getentApplyAll();
};
const reset = () => {
  state.entName = "";
  getentApplyAll();
};
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
 * 提交表单数据
 */
 const postFormData2 = (formData) => {
  let data = state.formConfig2[0].options.filter(e => e.value === formData.listName);
  post(`${data[0].label === '意向企业' ?  entMerchantsInsert : entMerchantsSuccessListInsert}`, {
    companyName: state.tableItem.entName,
    contactPerson: state.tableItem.legalPerson,
    contactPhone: state.tableItem.legalId,
    ...formData,
    entStatus: data[0].label === '意向企业' ? '待接洽' :  '已入住',
    entLocal: state.tableItem.registerDistrict
  })
    .then(function (data) {
      data && ElMessage.success("添加成功");
      // getentMerchantsPersonList();
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible3 = false;
  state.dialogVisible2 = false;
  console.log("submit!", formData);
};
/**
 * 审核
 */
const add = (row) => {
  title.value = "转移名单";
  state.tableItem = row;
  state.dialogVisible3 = true;
  state.dialogVisible2 = true;
/*   state.formConfig2 = state.formConfig2
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  }); */
};

/**
 * 审核
 */
const examine = (row) => {
  state.formConfig.status = row.applyStatus;
  currentRoleId.value = row.id;
  state.dialogVisible = true;
  state.showExamineForm = true;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  
  post(`${entApplyUpdateOne}`, {
    id: currentRoleId.value,
    applyStatus: formData.status ? 1: 2,
  })
    .then(function (data) {
      getentApplyAll();
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
  state.dialogVisible1 = false;
  state.dialogVisible2 = false;
  state.dialogVisible3 = false;
  state.applyDialogVisible = false;
  state.showForm = false;
};

//  文章内容列表
const getentApplyAll = () => {
  post(`${entApplyAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    entName: state.entName,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getentApplyAll();

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getentApplyAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getentApplyAll();
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
        getentApplyAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};
</script>

<style lang="scss">
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
  .custom-header {
    background: gray;
    th.el-table__cell {
      // background: var(--el-fill-color-light);
    }
  }
  .hover-row>td.el-table__cell {
    background-color: white !important;
  } 
  .hover-row:hover {
      cursor: pointer;
      th.el-table__cell {
        background-color: none !important;
      }
    }
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
