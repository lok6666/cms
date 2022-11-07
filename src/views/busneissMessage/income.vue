<template>
    <u-container-layout>
      <div class="inline-edit-table">
        <el-form :inline="true" :model="state" class="demo-form-inline">
          <el-form-item label="企业名称">
            <el-input v-model="state.entName" placeholder="请输入企业名称"/>
          </el-form-item>
          <el-form-item label="年份">
            <el-select v-model="state.incomeYear" placeholder="年份">
            <el-option label="2022" value="2022" />
            <el-option label="2021" value="2021" />
            <el-option label="2020" value="2020" />
          </el-select>
        </el-form-item>
          <el-form-item label="月份">
            <el-select v-model="state.incomeMonth" placeholder="年份">
            <el-option label="1月" value="1月" />
            <el-option label="1-2月" value="1-2月" />
            <el-option label="1-3月" value="1-3月" />
            <el-option label="1-4月" value="1-4月" />
            <el-option label="1-5月" value="1-5月" />
            <el-option label="1-6月" value="1-6月" />
            <el-option label="1-7月" value="1-7月" />
            <el-option label="1-8月" value="1-8月" />
            <el-option label="1-9月" value="1-9月" />
            <el-option label="1-10月" value="1-10月" />
            <el-option label="1-11月" value="1-11月" />
            <el-option label="1-12月" value="1-12月" />
          </el-select> 
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
          v-loading="loading"
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
              <el-button type="primary" size="small" @click="detail(scope.row)">
                查看详情
              </el-button>
              <!-- <el-button type="primary" size="small" @click="examine(scope.row)" :disabled="[scope.row.applyStatus !== 0]">
                审核
              </el-button> -->
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
  import FileSaver from 'file-saver'
  import * as XLSX from 'xlsx';
  import { ref, reactive, provide } from "vue";
  import formConpoent from "@/components/form/form.vue";
  import examineFormConpoent from "@/components/form/examineForm.vue";
  import {
    entIncomeAll,
    entApplAddOne,
    entApplyUpdateOne,
    entApplyDelete,
  } from "@/config/api";
  import { ElMessage, ElMessageBox } from "element-plus";
  // import { formConfigItem } from "@/utils/interface";
  import { deleteItem, post } from "@/utils/request";
  import { fa } from "element-plus/es/locale";
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
        tableHeaderConfig: [{
                prop: "entName",
                label: "企业名称"
            },{
                prop: "incomeYear",
                label: "年份"
            },{
                prop: "incomeMonth",
                label: "月份"
            },{
            prop: "businessIncome",
            label: "营业收入(万)",
            },{
            prop: "cultureIncome",
            label: "文化产业相关营业收入(万)",

            },{
            prop: "totalProfit",
            label: "利润总额(万)",
            },{
            prop: "netProfit",
            label: "净利润(万)",
            },{
            prop: "totalAssets",
            label: "资产总额(万)"
            },{
            prop: "netAssets",
            label: "净资产(万)",
            },{
            prop: "totalLiability",
            label: "负债总额(万)"
            },{
            prop: "equity",
            label: "所有者权益(万)",
            },{
            prop: "payTaxes",
            label: "纳税额(不含个人所得税)(万)",
            },{
            prop: "addedTax",
            label: "增值税(万)",
            },{
            prop: "corporateIncomeTax",
            label: "企业所得税(万)",
            },{
            prop: "individualIncomeTax",
            label: "个人所得税(万)"
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
    disabled?: boolean;
    showTextarea?: boolean;
  }
  const formConfig: formConfigItem[] = [{
  prop: "businessIncome",
  label: "营业收入",
  required: true,
  showInput: true,
},{
  prop: "cultureIncome",
  label: "文化产业相关营业收入",
  required: true,
  showInput: true,

},{
  prop: "totalProfit",
  label: "利润总额",
  required: true,
  showInput: true,

},{
  prop: "netProfit",
  label: "净利润",
  required: true,
  showInput: true,

},{
  prop: "totalAssets",
  label: "资产总额",
  required: true,
  showInput: true,

},{
  prop: "netAssets",
  label: "净资产",
  required: true,
  showInput: true,

},{
  prop: "totalLiability",
  label: "负债总额",
  required: true,
  showInput: true,

},{
  prop: "equity",
  label: "所有者权益",
  required: true,
  showInput: true,

},{
  prop: "payTaxes",
  label: "纳税额(不含个人所得税)",
  required: true,
  showInput: true,

},{
  prop: "addedTax",
  label: "增值税",
  required: true,
  showInput: true,

},{
  prop: "corporateIncomeTax",
  label: "企业所得税",
  required: true,
  showInput: true,

},{
  prop: "individualIncomeTax",
  label: "个人所得税",
  required: true,
  showInput: true,
}];
  const state = reactive({
    currentPage: 0,
    pageSize: 10,
    formConfig: formConfig,
    tableData: [],
    total: 0,
    entName: '',
    incomeYear: '',
    incomeMonth: '',
    sensitiveword: "",
    dialogVisible: false,
    showForm: false,
    showExamineForm: false,
    isResume: false,
    disabled: true
  });
  
  let currentRoleId = ref<string>("");
  const title = ref<string>("新增");
  

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
		}), '财税数据.xlsx')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
const gettrainingServicesAll = () => {
  getentIncomeAll();
};
const reset = () => {
  state.entName = '';
  getentIncomeAll();
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
      applyStatus: formData.status
    })
      .then(function (data) {
        getentIncomeAll();
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
    state.showForm = false;
  };
  
  //  文章内容列表
  const getentIncomeAll = () => {
    post(`${entIncomeAll}`, {
      pageNum: state.currentPage,
      pageSize: state.pageSize,
      entName: state.entName,
      incomeYear: state.incomeYear,
      incomeMonth: state.incomeMonth
    }).then(function (data) {
      state.tableData = data.list;
      state.total = data.total;
    });
  };
  getentIncomeAll();
  
  // 切换每页显示数
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
    state.pageSize = val;
    getentIncomeAll();
  };
  
  // 换页数
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
    state.currentPage = val;
    getentIncomeAll();
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
          getentIncomeAll();
        });
        ElMessage.success("删除成功");
      })
      .catch(() => {});
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
  </style>
  