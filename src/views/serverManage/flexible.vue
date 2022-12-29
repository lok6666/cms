<template>
  <u-container-layout>   
    <div class="inline-edit-table">
      <el-form :inline="true" :model="state" class="demo-form-inline">
          <el-form-item label="企业名称">
            <el-input v-model="state.entName" placeholder="请输入企业名称"/>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" icon="Search" @click.stop="gettrainingServicesAll">查询</el-button>
          <el-button type="primary" icon="IceCreamSquare" @click.stop="exportClick2">导出EXECL</el-button>
          <el-button type="primary" icon="Refresh" @click.stop="reset">重置</el-button>
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
        <!-- <el-table-column type="index" label="序号" width="80" /> -->
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
        >
        <template #default="scope" v-if="item.prop === 'dockStatus'">
            {{dockStatusObj[scope.row.dockStatus]}}
          </template>
         <img
            v-if="item.showImg"
            :src="item[item.prop]"
            style="width: 50px; height: 50px"
          />
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click.stop="detail(scope.row)">
              查看详情
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
          v-model:formConfig="state.formConfig"
          :showBtn="false"
          :disabled="true"
          @dialogClose="closeDialog"
        ></formConpoent>
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
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import { recruitServiceDockingAll, recruitServiceDockingUpdateOne } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      dockStatusObj: {
          0: '未对接',
          1: '对接中'
        },
      tableHeaderConfig: [
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
/*         {
          prop: "dockStatus",
          label: "对接状态",
        }, */
        {
          prop: "dockTime",
          label: "申请时间",
        }
      ],
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [ {
    prop: "serviceName",
    label: "服务名称",
    showInput: true,
    disabled: true
  }, {
    prop: "companyContact",
    label: "企业联系方式",
    showInput: true,
    disabled: true
  }, 
  {
    prop: "companyName",
    label: "企业名称",
    showInput: true,
    disabled: true
  }, 
  {
    prop: "companyPerson",
    label: "企业联系人",
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
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: '',
  username: '',
  entName: '',
  culName: "",
  formConfig: formConfig,
  form2Config: form2Config,
  selectionList: [],
  tableData: [
  ],
  dockStatusObj: {
          0: '未对接',
          1: '对接中',
          2: '111'
        },
  optionsList: [],
  levelOptions: [],
});
const title = ref("添加");

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
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
/*         {
          prop: "dockStatus",
          label: "对接状态",
        }, */
        {
          prop: "dockTime",
          label: "申请时间",
        }
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '灵活用工管理');
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
		}), '灵活用工管理')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}

const gettrainingServicesAll = () => {
  getrecruitServiceDockingAll();
};
const reset = () => {
  state.entName = '';
  getrecruitServiceDockingAll();
};
/**
 * 编辑表单
 */
const detail = (row) => {
  title.value = "查看详情";
  state.dialogVisible = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      if(e.prop === 'dockStatus') {
        row[e.prop] = row[e.prop] === '未对接' || row[e.prop] === '对接中' ? row[e.prop] : state.dockStatusObj[row[e.prop]];
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
const getrecruitServiceDockingAll = () => {
  post(`${recruitServiceDockingAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    companyName: state.entName
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getrecruitServiceDockingAll();


/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getrecruitServiceDockingAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getrecruitServiceDockingAll();
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
