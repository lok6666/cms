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
              {{applyStatusObj[scope.row.applyStatus]}}
            </template>
            <template #default="scope" v-if="item.prop === 'entLevel'">
              {{vipType[scope.row.entLevel]}}
            </template>
          <template #default="scope" v-if="item.prop === 'entScale'">
              {{busStatusObj[scope.row.entScale]}}
          </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作" width="270" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click.stop="detail(scope.row)">
                查看详情
              </el-button>
              <el-button type="primary" size="small" @click.stop="changeVip(scope.row)">
                修改会员等级
              </el-button>
              <el-button type="primary" size="small" @click.stop="examine(scope.row)" :disabled="[scope.row.applyStatus !== 0]">
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
            :disabled="true"
            v-model:formConfig="state.formConfig"
            @handle="postFormData"
            @dialogClose="closeDialog"
          ></formConpoent>
          <formConpoent
            v-if="state.showForm2"
            :disabled="state.disabled"
            v-model:formConfig="state.formConfig2"
            @handle="postFormData2"
            @dialogClose="closeDialog"
            :showBtn="true"
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
    entInfoAll,
    entApplAddOne,
    entInfoUpdate,
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
        vipType: {
          0: '非会员',
          1: '一万权益包',
          2: '三万权益包',
          3: '五万权益包',
          4: '十万权益包'
        },
        applyStatusObj: {
          0: '未审核',
          1: '审核中',
          2: '审核通过',
          3: '审核未通过'
        },
        busStatusObj: {
          1: '特大',
          2: '大',
          3: '中',
          4: '小',
          5: '微'
        },
        tableHeaderConfig: [
        {
      prop: "username",
      label: "用户名",
      required: true,
      showInput: true
  },
  {
      prop: "entName",
      label: "企业名称",
      required: true,
      showInput: true
  },
  {
    prop: "entCode",
    label: "统一社会信用代码",
    showInput: true,
    required: true,
    code: 10000
  },
  {
    prop: "contactsPerson",
    label: "联系人",
    required: true,
    showInput: true,
  },
  {
      prop: "contactsPhone",
      label: "联系人电话",
      required: true,
      showInput: true,
      telPhone: '17732336725'
  },
  {
    prop: "officeAddress",
    label: "办公地址",
    showInput: true
  },
  {
    prop: "insuredNum",
    label: "参保人数",
    required: false,
    showInput: true
  },
  {
    prop: "businessArea",
    label: "业务领域",
    options: [
      {
        label: '数字创意',
        value: '数字创意'
      },
      {
        label: '文化旅游',
        value: '文化旅游'
      },
      {
        label: '高精尖产业',
        value: '高精尖产业'
      },
      {
        label: '现代服务业',
        value: '现代服务业'
      },
      {
        label: '商贸流通业',
        value: '商贸流通业'
      },
      {
        label: '企业服务',
        value: '企业服务'
      },
      {
        label: '其他',
        value: '其他'
      }
    ],
    showSelect: true,
  },
  {
    prop: "honorsQualification",
    label: "企业资质",
    options: [
      {
        label: '中关村高新企业',
        value: '中关村高新企业'
      },{
        label: '双软认证企业',
        value: '双软认证企业'
      },{
        label: '专精特新企业',
        value: '专精特新企业'
      },{
        label: '专精特新小巨人企业',
        value: '专精特新小巨人企业'
      },{
        label: '科技小巨人企业',
        value: '科技小巨人企业'
      },{
        label: '瞪羚企业',
        value: '瞪羚企业'
      },{
        label: '科技型中小企业',
        value: '科技型中小企业'
      },{
        label: '展翼企业',
        value: '展翼企业'
      },{
        label: '隐形冠军企业',
        value: '隐形冠军企业'
      },{
        label: '技术先进型服务企业',
        value: '技术先进型服务企业'
      },{
        label: '牛羚企业',
        value: '牛羚企业'
      },{
        label: '独角兽企业',
        value: '独角兽企业'
      },{
        label: '创新型企业',
        value: '创新型企业'
      },{
        label: '民营科技企业',
        value: '民营科技企业'
      }
    ], 
    showSelect: true,
  },
  {
    prop: "entLevel",
    label: "会员等级",
    showInput: true
  },
  /* {
    prop: "entScale",
    label: "企业规模",
    options: [
      {
        label: '特大型企业',
        value: '1'
      },
      {
        label: '大型企业',
        value: '2'
      },
      {
        label: '中型企业',
        value: '3'
      },
      {
        label: '小型企业',
        value: '4'
      },
      {
        label: '微型企业',
        value: '5'
      }
    ],
    showSelect: true,
  } */
]
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
    prop: "username",
    label: "用户名",
    required: false,
    showInput: true
  },
  {
      prop: "entName",
      label: "企业名称",
      required: true,
      showInput: true
  },
  {
    prop: "entCode",
    label: "统一社会信用代码",
    showInput: true,
    required: true,
    code: 10000
  },
  {
    prop: "contactsPerson",
    label: "联系人",
    required: true,
    showInput: true,
  },
  {
      prop: "contactsPhone",
      label: "联系人电话",
      required: true,
      showInput: true,
      telPhone: '17732336725'
  },
  {
    prop: "officeAddress",
    label: "办公地址",
    showInput: true
  },
  {
    prop: "insuredNum",
    label: "参保人数",
    required: false,
    showInput: true
  }
];
  const state = reactive({
    currentPage: 0,
    pageSize: 10,
    formConfig: formConfig,
    formConfig2: [{
    prop: "entLevel",
    label: "会员等级",
    entLevel: '0',
    options: [
      {
        label: '非会员',
        value: '0'
      },
      {
        label: '一万权益包',
        value: '1'
      },
      {
        label: '三万权益包',
        value: '2'
      },
      {
        label: '五万权益包',
        value: '3'
      },
      {
        label: '十万权益包',
        value: '4'
      }
    ],
    showSelect: true,
  }],
    tableData: [],
    selectionList: [],
    total: 0,
    entName: '',
    sensitiveword: "",
    dialogVisible: false,
    showForm: false,
    showForm2: false,
    showExamineForm: false,
    isResume: false,
    // disabled: true
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
      prop: "entName",
      label: "企业名称",
      required: true,
      showInput: true
  },
  {
    prop: "entCode",
    label: "统一社会信用代码",
    showInput: true,
    required: true,
    code: 10000
  },
  {
    prop: "contactsPerson",
    label: "联系人",
    required: true,
    showInput: true,
  },
  {
      prop: "contactsPhone",
      label: "联系人电话",
      required: true,
      showInput: true,
      telPhone: '17732336725'
  },
  {
    prop: "officeAddress",
    label: "办公地址",
    showInput: true
  },
  {
    prop: "insuredNum",
    label: "参保人数",
    required: false,
    showInput: true
  },
  {
    prop: "businessArea",
    label: "业务领域",
    options: [
      {
        label: '数字创意',
        value: '数字创意'
      },
      {
        label: '文化旅游',
        value: '文化旅游'
      },
      {
        label: '高精尖产业',
        value: '高精尖产业'
      },
      {
        label: '现代服务业',
        value: '现代服务业'
      },
      {
        label: '商贸流通业',
        value: '商贸流通业'
      },
      {
        label: '企业服务',
        value: '企业服务'
      },
      {
        label: '其他',
        value: '其他'
      }
    ],
    showSelect: true,
  },
  {
    prop: "honorsQualification",
    label: "企业资质",
    options: [
      {
        label: '中关村高新企业',
        value: '中关村高新企业'
      },{
        label: '双软认证企业',
        value: '双软认证企业'
      },{
        label: '专精特新企业',
        value: '专精特新企业'
      },{
        label: '专精特新小巨人企业',
        value: '专精特新小巨人企业'
      },{
        label: '科技小巨人企业',
        value: '科技小巨人企业'
      },{
        label: '瞪羚企业',
        value: '瞪羚企业'
      },{
        label: '科技型中小企业',
        value: '科技型中小企业'
      },{
        label: '展翼企业',
        value: '展翼企业'
      },{
        label: '隐形冠军企业',
        value: '隐形冠军企业'
      },{
        label: '技术先进型服务企业',
        value: '技术先进型服务企业'
      },{
        label: '牛羚企业',
        value: '牛羚企业'
      },{
        label: '独角兽企业',
        value: '独角兽企业'
      },{
        label: '创新型企业',
        value: '创新型企业'
      },{
        label: '民营科技企业',
        value: '民营科技企业'
      }
    ], 
    showSelect: true,
  },
  {
    prop: "entLevel",
    label: "会员等级",
    showInput: true
  },
  /* {
    prop: "entScale",
    label: "企业规模",
    options: [
      {
        label: '特大型企业',
        value: '1'
      },
      {
        label: '大型企业',
        value: '2'
      },
      {
        label: '中型企业',
        value: '3'
      },
      {
        label: '小型企业',
        value: '4'
      },
      {
        label: '微型企业',
        value: '5'
      }
    ],
    showSelect: true,
  } */
];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '基本信息');
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
		}), '基本信息')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
const gettrainingServicesAll = () => {
  getentInfoAll();
};
const reset = () => {
  state.entName = '';
  getentInfoAll();
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
   * 表单详情
   */
   const changeVip = (row) => {
    title.value = "查看详情";
    state.dialogVisible = true;
    state.showForm2 = true;
    currentRoleId.value = row.entId;
/*     state.formConfig2 = state.formConfig2
      .map((e, b) => {
        // value 替换成 e.prop
        let result = { ...e };
        result[e.prop] = row[e.prop];
        return result;
      })
      .splice(0); */
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
    post(`${entInfoUpdate}`, {
      id: currentRoleId.value,
      ...formData,
      applyStatus: formData.status
    })
      .then(function (data) {
        getentInfoAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    state.dialogVisible = false;
    state.showExamineForm = false;
  };
    /**
   * 提交表单数据
   */
   const postFormData2 = (formData) => {
    post(`${entInfoUpdate}`, {
      entId: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        getentInfoAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    state.dialogVisible = false;
    state.showForm2 = false;
  };
  
  // todo 改写法
  const closeDialog = async (done: () => void) => {
    state.dialogVisible = false;
    state.showExamineForm = false;
    state.showForm = false;
    state.showForm2 = false;
  };
  
  //  文章内容列表
  const getentInfoAll = () => {
    post(`${entInfoAll}`, {
      pageNum: state.currentPage,
      pageSize: state.pageSize,
      entName: state.entName
    }).then(function (data) {
      state.tableData = data.list;
      state.total = data.total;
    });
  };
  getentInfoAll();
  
  // 切换每页显示数
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
    state.pageSize = val;
    getentInfoAll();
  };
  
  // 换页数
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
    state.currentPage = val;
    getentInfoAll();
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
          getentInfoAll();
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
  