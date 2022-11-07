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
          <el-button type="primary" @click="exportClick">导出EXECL</el-button>
          </el-form-item>
        </el-form>
        <el-table
          id="my-table"
          :data="state.tableData"
          style="width: 100%"
          :border="true"
          :cell-style="fn"
          :highlight-current-row="false"
          header-row-class-name="custom-header"
          row-class-name="hover-row"
          @row-click="routerTo"
        >
          <el-table-column
            v-for="(item, index) in tableHeaderConfig"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          >
            <template #default="scope" v-if="item.prop === 'applyStatus'">
              {{applyStatusObj[scope.row.applyStatus]}}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作" width="200" fixed="right">
            <template #default="scope">
              <!-- <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="edit(scope.row)"
                >修改</el-button
              > -->
              <el-button type="primary" size="small" @click.stop="detail(scope.row)">
                查看详情
              </el-button>
              <el-button type="primary" :disabled="scope.row.applyStatus !== 0" size="small" @click.stop="examine(scope.row)">
                审核
              </el-button>
              <el-button type="primary" size="small" @click.stop="add(scope.row)">
                添加
              </el-button>
              <!-- <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="deleteAction(scope.row, state.isResume)"
                >删除</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          v-model="state.dialogVisible1"
          :title="title"
          top="1vh"
          :center="true"
          width="98%"
          @closed="closeDialog()"
        >
        <entTable
            v-if="state.applyDialogVisible"
            :tabList="state.tabList"
            v-model:baseInfo="state.baseInfo"
            v-model:formConfig="state.formConfig"
            @handle="postFormData"
            @dialogClose="closeDialog"
          ></entTable>
        </el-dialog>
        <el-dialog
          v-model="state.dialogVisible4"
          :title="title"
          top="5vh"
          width="30%"
          @closed="closeDialog()"
        >
          <formConpoent
            v-if="state.dialogVisible2"
            :disabled="false"
            :showBtn="true"
            v-model:formConfig="state.formConfig2"
            @handle="postFormData2"
            @dialogClose="closeDialog"
          ></formConpoent>
        </el-dialog>
        <el-dialog
          v-model="state.dialogVisible"
          :title="title"
          top="5vh"
          width="80%"
          @closed="closeDialog()"
        >
          <formConpoent
            v-if="state.dialogVisible2"
            :disabled="false"
            :showBtn="true"
            v-model:formConfig="state.formConfig2"
            @handle="postFormData"
            @dialogClose="closeDialog"
          ></formConpoent>
          <cusTomformConpoent
            v-if="state.showForm"
            :disabled="state.disabled"
            v-model:formConfig="state.formConfig"
            @dialogClose="closeDialog"
          ></cusTomformConpoent>
          <examineFormConpoent
            v-if="state.showExamineForm"
            @handle="postFormData"
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
  import FileSaver from 'file-saver'
  import * as XLSX from 'xlsx';
  import { ref, reactive, provide } from "vue";
  import { map,entPatentGetMap, getSoftByNameMap, getTrademarkByNameMap, getWorksByNameMap,
  entgetRecruitByNameMap,entgetNewsByNameMap } from "./constant";
  import examineFormConpoent from "@/components/form/examineForm.vue";
  import entTable from "@/components/form/essay.vue";
  import formConpoent from "@/components/form/form.vue";
  import cusTomformConpoent from "./form.vue";
  import {
    entMerchantsPersonInsert,
    policyApplyList,
    activityApplyAddOne,
    activityApplyrUpdateOne,
    activityApplyDelete,
    entGetByName,
    entPatentGet,
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
  export default {
    name: "sensitive-manage",
    data() {
      return {
        applyStatusObj: {
          0: '未审核',
          1: '审核中',
          2: '审核通过',
          3: '审核未通过'
        },
        tableHeaderConfig: [
        {
          prop: "companyName",
          label: "企业名称",
          required: true,
          showInput: true
        },
        {
          prop: "policyName",
          label: "政策名称",
          required: true,
          showInput: true
        },
        {
          prop: "policyName",
          label: "政策名称",
          required: true,
          showInput: true
        },
        {
          prop: "contactPerson",
          label: "联系人",
          required: true,
          showInput: true
        },
        {
          prop: "contactPhone",
          label: "联系电话",
          required: true,
          showInput: true
        },
        {
          prop: "entCode",
          label: "社会统一代码",
          required: true,
          showInput: true
        },
        ],
      };
    },
  };
  </script>
  <script lang="ts" setup>
  interface formConfigItem {
      prop: string,
      label: string,
      required?: boolean,
      showInput?: boolean,
      showDatePicker?: boolean,
      upload?: boolean,
      uploadType?: string
  }
  const formConfig: formConfigItem[] = [
    {
      prop: "companyName",
      label: "企业名称",
      required: true,
      showInput: true
    },
    {
      prop: "policyName",
      label: "政策名称",
      required: true,
      showInput: true
    },
    {
      prop: "contactPerson",
      label: "联系人",
      required: true,
      showInput: true
    },
    {
      prop: "contactPhone",
      label: "联系电话",
      required: true,
      showInput: true
    },
    {
      prop: "entCode",
      label: "社会统一代码",
      required: true,
      showInput: true
    },
    {
      prop: "policyFile",
      label: "政策附件",
      required: true,
      showFile: true
    },
  ];
  const fn = ({row, column}) => {
    if(column.label === '企业名称') {
      return {
      color: `#409eff`
    }
    };

  };
  const state = reactive({
    currentPage: 0,
    pageSize: 10,
    formConfig: Object.assign([], formConfig),
    formConfig2: [
    {
      prop: "listName",
      label: "名称",
      required: true,
      options: [],
      showSelect: true,
    }
  ],
    tableData: [],
    total: 0,
    tabList: [],
    baseInfo: {},
    entName: '',
    sensitiveword: "",
    dialogVisible: false,
    dialogVisible1: false,
    dialogVisible2: false,
    dialogVisible4: false,
    applyDialogVisible: false,
    isResume: false,
    showForm: false,
    showExamineForm: false,
    disabled: true
  });
  
  let currentRoleId = ref<string>("");
  const title = ref<string>("新增");

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

const add = () => {
  state.dialogVisible4 = true;
  state.dialogVisible2 = true;
};
// 左侧tab
const getentMerchantsPersonList = () => {
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
};
getentMerchantsPersonList();

/**
 * 提交表单数据
 */
 const postFormData2 = (formData) => {
  debugger;
  let data = state.formConfig2[0].options.filter(e => e.value === formData.listName);
  post(`${entMerchantsPersonInsert}`, {
    listName: data[0].label,
    listId: data[0].value,
  })
    .then(function (data) {
      ElMessage.success("添加成功");
      getentMerchantsPersonList();
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible3 = false;
  state.dialogVisible2 = false;
  console.log("submit!", formData);
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
		}), '政策申报.xlsx')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
const gettrainingServicesAll = () => {
  getpolicyApplyList();
};
const reset = () => {
  state.entName = '';
  getpolicyApplyList();
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
    state.dialogVisible = false;
    state.showForm = false;
    state.dialogVisible1 = true;
    state.dialogVisible2 = false;
    state.applyDialogVisible = true;
    state.dialogVisible4 = false;
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
  
  /**
   * 提交表单数据
   */
  const postFormData = (formData) => {
    if (title.value === "新增") {
      post(`${activityApplyAddOne}`, {
        ...formData
      })
        .then(function (data) {
          getpolicyApplyList();
        })
        .catch((e) => {
          console.log("e", e);
        });
      ElMessage.success("添加成功");
    } else {
      post(`${activityApplyrUpdateOne}`, {
        id: currentRoleId.value,
        applyStatus: formData.status
      })
        .then(function (data) {
          getpolicyApplyList();
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
    state.dialogVisible1 = false;
    state.dialogVisible2 = false;
    state.dialogVisible4 = false;
    state.formConfig = formConfig;
    state.applyDialogVisible = false;
  };
  
  // 修改
  const edit = (row) => {
    title.value = "修改";
    state.dialogVisible = true;
    currentRoleId.value = row.id;
    state.formConfig = state.formConfig
    .map((e, b) => {
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    });
  };
  //  文章内容列表
  const getpolicyApplyList = () => {
    post(`${policyApplyList}`, {
      pageNum: state.currentPage,
      pageSize: state.pageSize,
      entName: state.entName
    }).then(function (data) {
      state.tableData = data.list;
      state.total = data.total;
    });
  };
  getpolicyApplyList();
  
  
  /**
   * 表单详情
   */
   const detail = (row) => {
    title.value = "查看详情";
    state.formConfig = state.formConfig
      .map((e, b) => {
        // value 替换成 e.prop
        let result = { ...e };
        result[e.prop] = row[e.prop];
        return result;
      })
      .splice(0);
    state.formConfig.status = row.applyStatus;
    state.dialogVisible = true;
    state.showForm = true;
  };
  
  /**
   * 审核
   */
   const examine = (row) => {
    title.value = "审核";
    currentRoleId.value = row.id;
    state.dialogVisible = true;
    state.showExamineForm = true;
    state.showForm = false;
  };
  
  
  // 切换每页显示数
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
    state.pageSize = val;
    getpolicyApplyList();
  };
  
  // 换页数
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
    state.currentPage = val;
    getpolicyApplyList();
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
        deleteItem(`${activityApplyDelete}`, {
          data: [row.id],
        }).then(function (data) {
          getpolicyApplyList();
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
        background: var(--el-fill-color-light);
      }
    }
     .class-row {
      background-color: gray;
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
  