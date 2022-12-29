<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-form :inline="true" :model="state" class="demo-form-inline">
        <el-form-item label="活动名称">
          <el-input v-model="state.actName" placeholder="请输入活动名称"/>
        </el-form-item>
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
      <el-table-column type="index" label="序号" width="50" />
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
        <el-table-column prop="operator" label="操作" width="300" fixed="right">
          <template #default="scope">
            <!-- <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click.stop="edit(scope.row)"
              >修改</el-button
            > -->
            <el-button type="primary" size="small" @click.stop="detail(scope.row)">
              查看详情
            </el-button>
            <el-button type="primary" size="small" @click.stop="examine(scope.row)">
              审核
            </el-button>
            <el-button  type="primary" size="small" @click.stop="edit(scope.row)">
              编辑
            </el-button>
            <el-button  type="primary" size="small" @click.stop="deleteAction(scope.row)">
              删除
            </el-button>
            <!-- <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click.stop="deleteAction(scope.row, state.isResume)"
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
          :showBtn="state.showBtn"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></formConpoent>
        <examineFormConpoent
          v-if="state.showExamineForm"
          @handle="postFormData"
          :status="state.applyStatus"
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
import {
  phoneRules,
  emtyRules
} from "@/config/constants";
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { export_json_to_excel } from "@/execl/Export2Excel";
import { ref, reactive, provide } from "vue";
import examineFormConpoent from "@/components/form/examineForm.vue";
import formConpoent from "@/components/form/form.vue";
import {
  activityApplyAll,
  activityApplyAddOne,
  activityApplyrUpdateOne,
  activityApplyDelete,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import { formConfigItem } from "@/utils/interface";
import { deleteItem, post } from "@/utils/request";
export default {
  name: "sensitive-manage",
  data() {
    return {
      applyStatusObj: {
        0: '未审核',
        1: '审核通过',
        2: '审核未通过'
      },
      tableHeaderConfig: [
/*         {
          prop: "id",
          label: '序号'
        }, */
        {
          prop: "actName",
          label: "活动名称",
        },
        {
          prop: "entName",
          label: '企业名称'
        },
        {
          prop: "applyCount",
          label: "报名人数",
        },
        {
          prop: "duties",
          label: "职务",
        },
        {
          prop: "storageTime",
          label: "报名时间",
        },
        {
          prop: "activityDateFrom",
          label: "报名开始时间",
        },
        {
          prop: "applyTimeTo",
          label: "报名结束时间",
        },
        {
          prop: "personName",
          label: "联系人",
        },
        {
          prop: "telPhone",
          label: "人员电话",
        },
        {
          prop: "applyStatus",
          label: "审核状态",
        }
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
    prop: "actName",
    label: "活动名称",
    disabled: true,
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "applyTimeTo",
    label: "报名截止时间",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    disabled: true,
    showDatePicker: true,
  },
  {
    prop: "activityDateFrom",
    label: "活动开始时间",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    disabled: true,
    showDatePicker: true,
  },
  {
    prop: "entName",
    label: '企业名称',
    disabled: true,
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "applyCount",
    label: "报名人数",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "personName",
    label: "联系人",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "telPhone",
    label: "人员电话",
    rules: { required: true, validator: phoneRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "duties",
    label: "职务",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "storageTime",
    label: "报名时间",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    disabled: true,
    showDatePicker: true,
  }
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: Object.assign([], formConfig),
  tableData: [],
  selectionList: [],
  total: 0,
  actName: '',
  entName: '',
  actId: '',
  applyCount: '',
  applyStatus: 0,
  sensitiveword: "",
  dialogVisible: false,
  showBtn: false,
  isResume: false,
  showForm: false,
  showExamineForm: false,
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
/*         {
          prop: "id",
          label: '序号'
        }, */
        {
          prop: "actName",
          label: "活动名称",
        },
        {
          prop: "entName",
          label: '企业名称'
        },
        {
          prop: "applyCount",
          label: "报名人数",
        },
        {
          prop: "duties",
          label: "职务",
        },
        {
          prop: "storageTime",
          label: "报名时间",
        },
        {
          prop: "activityDateFrom",
          label: "报名开始时间",
        },
        {
          prop: "applyTimeTo",
          label: "报名结束时间",
        },
        {
          prop: "personName",
          label: "联系人",
        },
        {
          prop: "telPhone",
          label: "人员电话",
        },
        {
          prop: "applyStatus",
          label: "审核状态",
        }
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '活动报名');
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
		}), '活动报名')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
const gettrainingServicesAll = () => {
  getactivityApplyAll();
};
const reset = () => {
  state.actName = '';
  state.entName = '';
  getactivityApplyAll();
};
/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "添加") {
    post(`${activityApplyAddOne}`, {
      ...formData,
      id:　currentRoleId.value,
      actId: state.actId,
      applyCount: state.applyCount,
      applyStatus: formData.status ? 1: 2,
    })
      .then(function (data) {
        getactivityApplyAll();
        state.formConfig = state.formConfig.map((e, b) => {
          let result = { ...e };  
          delete result[e.prop];
          return result;
        });
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${activityApplyrUpdateOne}`, {
      id:　currentRoleId.value,
      actId: state.actId,
      ...formData,
      applyStatus: formData.status ? 1: 2,
    })
      .then(function (res) {
        getactivityApplyAll();
        !res && ElMessage.warning('该报名人数已满');
        state.applyStatus = false;
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
  state.showExamineForm = false;
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
};

// 修改
const edit = (row) => {
  title.value = "修改";
  state.dialogVisible = true;
  state.showForm = true;
  state.disabled = false;
  state.showBtn = true;
  console.log('edit----', row);
  currentRoleId.value = row.id;
  state.actId = row.actId;
  state.formConfig = state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
};
//  文章内容列表
const getactivityApplyAll = () => {
  post(`${activityApplyAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    actName: state.actName,
    entName: state.entName
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getactivityApplyAll();


/**
 * 表单详情
 */
 const detail = (row) => {
  title.value = "查看详情";
  state.formConfig.status = row.applyStatus;
  state.dialogVisible = true;
  state.showForm = true;
  state.disabled = true;
  state.showBtn = false;
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
  state.actId = row.actId;
  state.applyCount = row.applyCount;
  state.applyStatus = row.applyStatus;
  state.dialogVisible = true;
  state.showExamineForm = true;
  state.showForm = false;
};


// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getactivityApplyAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getactivityApplyAll();
};
const loading = ref(false);

const formInline = reactive({
  username: "",
});
// 删除
const deleteAction = (row) => {
  state.actId = row.actId;
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${activityApplyDelete}/${row.id}/${state.actId}`).then(function (data) {
        getactivityApplyAll();
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
