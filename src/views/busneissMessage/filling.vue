<template>
    <u-container-layout>
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
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column
            v-for="(item, index) in tableHeaderConfig"
            :key="index"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
          >
          <template #default="scope" v-if="item.prop === 'applyStatus'">
              {{this.applyStatusObj[scope.row.applyStatus]}}
            </template>
          </el-table-column>
<!--           <el-table-column prop="operator" label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click.stop="detail(scope.row)">
                查看详情
              </el-button>
              <el-button type="primary" size="small" @click.stop="examine(scope.row)">
                审核
              </el-button>
            </template>
          </el-table-column> -->
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
  import FileSaver from "file-saver";
  import * as XLSX from "xlsx";
  import { export_json_to_excel } from "@/execl/Export2Excel";
  import { ref, reactive, provide } from "vue";
  import formConpoent from "@/components/form/form.vue";
  import examineFormConpoent from "@/components/form/examineForm.vue";
  import {
    entFilingAll,
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
        tableHeaderConfig: [
            {
                prop: "entname",
                label: "企业名称"
            },
            {
                prop: 'shxydm',
                label: "社会统一代码"
            },
            {
                prop: "frdb",
                label: "法定代表人",
                width: '140'
            },
            {
                prop: "frdbPhone",
                label: "法人手机号",
                width: '140'
            },
            {
                prop: "frdbCard",
                label: "法人身份证"
            },
            {
                prop: "authData",
                label: "认证日期"
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
  const formConfig: formConfigItem[] = [
  {
      prop: "frdb",
      label: "法定代表人",
      required: true,
      showInput: true
  },
  {
      prop: "busneissEmail",
      label: "企业邮箱",
      required: true,
      showInput: true
  },
  {
    prop: "entPhone",
    label: "公司电话",
    required: true,
    showInput: true
  },
  {
    prop: "authorDate",
    label: "认证日期",
    required: true,
    showDatePicker: true
  }];
  const state = reactive({
    currentPage: 0,
    pageSize: 10,
    formConfig: formConfig,
    tableData: [],
    total: 0,
    entName: '',
    sensitiveword: "",
    dialogVisible: false,
    showForm: false,
    showExamineForm: false,
    isResume: false,
    disabled: true
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
                prop: "entname",
                label: "企业名称"
            },
            {
                prop: "frdb",
                label: "法定代表人"
            },
            {
                prop: "email",
                label: "企业邮箱"
            },
            {
                prop: "entPhone",
                label: "公司电话"
            },
            {
                prop: "authorDate",
                label: "认证日期"
            }
        ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '认证信息');
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
		}), '认证信息')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
const gettrainingServicesAll = () => {
  getentFilingAll();
};
const reset = () => {
  state.entName = '';
  getentFilingAll();
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
        getentFilingAll();
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
  const getentFilingAll = () => {
    post(`${entFilingAll}`, {
      pageNum: state.currentPage,
      pageSize: state.pageSize,
      entName: state.entName
    }).then(function (data) {
      state.tableData = data.list;
      state.total = data.total;
    });
  };
  getentFilingAll();
  
  // 切换每页显示数
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
    state.pageSize = val;
    getentFilingAll();
  };
  
  // 换页数
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
    state.currentPage = val;
    getentFilingAll();
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
        deleteItem(`${businessApplyDelete}/${row.id}`, {
          data: [row.id],
        }).then(function (data) {
          getentFilingAll();
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
  