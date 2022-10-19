<template>
    <u-container-layout>
      <div class="inline-edit-table">
        <entTable
        v-if="state.applyDialogVisible"
        :tabList="state.tabList"
        v-model:baseInfo="state.baseInfo"
        v-model:formConfig="state.formConfig"
        @handle="postFormData"
        @dialogClose="closeDialog"
      ></entTable>
        <el-table
          :data="state.tableData"
          style="width: 100%"
          :border="true"
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
              <el-button type="primary" :disabled="scope.row.applyStatus !== 0" size="small" @click="examine(scope.row)">
                审核
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
  import { ref, reactive, provide } from "vue";
  import { map,entPatentGetMap, getSoftByNameMap, getTrademarkByNameMap, getWorksByNameMap,
  entgetRecruitByNameMap,entgetNewsByNameMap } from "./constant";
  import examineFormConpoent from "@/components/form/examineForm.vue";
  import entTable from "@/components/form/essay.vue";
  import formConpoent from "@/components/form/form.vue";
  import {
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
    entgetNewsByName
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
      prop: "policyFile",
      label: "政策附件",
      required: true,
      showFile: true
    },
  ];
  const state = reactive({
    currentPage: 0,
    pageSize: 10,
    formConfig: Object.assign([], formConfig),
    tableData: [],
    total: 0,
    tabList: [],
    baseInfo: {},
    sensitiveword: "",
    dialogVisible: false,
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
      state.applyDialogVisible = true;
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
    state.formConfig.status = row.applyStatus;
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
  