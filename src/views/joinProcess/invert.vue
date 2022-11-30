<template>
  <u-container-layout>
    <entTable
        v-if="state.applyDialogVisible"
        :tabList="state.tabList"
        v-model:baseInfo="state.baseInfo"
        v-model:formConfig="state.formConfig"
        @handle="postFormData"
        @dialogClose="closeDialog"
      ></entTable>
    <div class="inline-edit-table">
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
      <el-table
        id="my-table"
        :data="state.tableData"
        style="width: 100%"
        :border="true"
        @row-click="routerTo"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column type="index" label="序号" width="80" />
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
         <img
            v-if="item.showImg"
            :src="item[item.prop]"
            style="width: 50px; height: 50px"
          />
          <template #default="scope" v-if="item.prop === 'dockStatus'">
            {{status[scope.row.dockStatus] || scope.row.dockStatus}}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="170" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click.stop="detail(scope.row)">
              查看详情
            </el-button>
<!--             <el-button type="primary" size="small" @click.stop="editSort(scope.row)">
              排序
            </el-button> -->
            <el-button type="primary" size="small" @click.stop="examine(scope.row)">
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
            :status="state.docStatus"
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
import entTable from "@/components/form/essay.vue";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { export_json_to_excel } from "@/execl/Export2Excel";
import { map, entPatentGetMap, getSoftByNameMap, getTrademarkByNameMap, getWorksByNameMap,
  entgetRecruitByNameMap,entgetNewsByNameMap } from "./constant";
import examineFormConpoent from "@/components/form/examineForm.vue";
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import { fundAll, fundUpdateOne, entPatentGet,
  entGetByName,
    entgetSoftByName,
    entgetTrademarkByName,
    entgetWorksByName,
    entgetRecruitByName,
    entgetNewsByName } from "@/config/api";
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
          width: '150'
        },
        {
          prop: "supplierName",
          label: "服务商",
          width: '120'
        },
        {
          prop: "companyContact",
          label: "企业联系方式",
          width: '150'
        },
        {
          prop: "companyPerson",
          label: "企业联系人",
          width: '120'
        },
        {
          prop: "dockStatus",
          label: "对接状态",
          width: '120'
        },
        {
          prop: "dockTime",
          label: "申请时间",
        },
/*         {
          prop: "sortNum",
          label: "排序",
        }, */
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
    prop: "supplierName",
    label: "服务商",
    showInput: true,
    disabled: true
  },{
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
  docStatus: '',
  entName: '',
  tabList: [],
  baseInfo: {},
  selectionList: [],
  formConfig: formConfig,
  form2Config: form2Config,
  form3Config: form3Config,
  tableData: [
  ],
  status: {
        0: '未审核',
        1: '申请成功',
        2: '申请失败'
      },
  optionsList: [],
  levelOptions: [],
});
const title = ref("添加");
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
const routerTo = async (row) => {
  await getentGetByName(row.companyName);
};
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
// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.applyDialogVisible = false;
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
/*         {
          prop: "sortNum",
          label: "排序",
        }, */
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '金融服务对接管理');
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
		}), '金融服务对接管理')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}

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
  state.docStatus = row.dockStatus === '1' ? true: false;
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
      if(e.prop === 'dockStatus') {
        row[e.prop] = state.status[row[e.prop]];
      };
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
    companyName: state.entName
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
