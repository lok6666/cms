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
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
        <template #default="scope" v-if="item.prop === 'dockStatus'">
            {{applyStatusObj[scope.row.dockStatus]}}
          </template>
         <img
            v-if="item.showImg"
            :src="item[item.prop]"
            style="width: 50px; height: 50px"
          />
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click.stop="detail(scope.row)">
              查看详情
            </el-button>
            <el-button type="primary" size="small" @click.stop="qr(scope.row)">
              分配
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
          v-if="state.dialogVisible"
          v-model:formConfig="state.formConfig"
          :showBtn="false"
          :disabled="true"
          @dialogClose="closeDialog"
        ></formConpoent>
      </el-dialog>
      <el-dialog
        v-model="state.dialogVisible2"
        :title="title"
        width="80%"
        @closed="closeDialog()"
      >
        <formConpoent
          v-if="state.dialogVisible2"
          v-model:formConfig="state.formConfig2"
          :showBtn="true"
          @handle="postFormData"
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
import { computed, ref, reactive, onMounted, toRefs, } from "vue";
import { entServiceDockingAll, entServiceDockingUpdate, suppliersAll } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      applyStatusObj: {
        0: '未分配',
        1: '已分配'
      },
      tableHeaderConfig: [{
        prop: "serviceName",
        label: "服务名称",
      },  {
    prop: "supplierName",
    label: "服务商名称",
    showInput: true,
    disabled: true
  },  {
        prop: "companyContact",
        label: "企业联系方式",
      }, 
      {
        prop: "companyName",
        label: "企业名称",
      }, 
      {
        prop: "companyPerson",
        label: "企业联系人",
      }, {
        prop: "dockStatus",
        label: "对接状态",
      },
      {
        prop: "dockTime",
        label: "对接时间",
      }
      ],
    };
  },
};
</script>
<script lang="ts" setup >
let currentRoleId = ref("")
const formConfig = [
  {
    prop: "supplierId",
    label: "服务ID",
    showInput: true,
    disabled: true
  }, {
    prop: "supplierName",
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
  },{
    prop: "dockStatus",
    label: "对接状态",
    showInput: true,
    disabled: true
  },
  {
    prop: "dockTime",
    label: "对接时间",
    showInput: true,
    disabled: true
  }
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  dialogVisible2: false,
  name: '',
  username: '',
  culName: "",
  entName: '',
  formConfig: formConfig,
  tableData: [
  ],
  selectionList: [],
  formConfig2: [{
    prop: "supplierName",
    label: "服务商",
    showSelect: true
  }],
  optionsList: [],
  levelOptions: [],
});
const title = ref("添加");

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.dialogVisible2 = false;
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
    const tableHeaderConfig = [{
        prop: "serviceName",
        label: "服务名称",
      },  {
    prop: "supplierName",
    label: "服务商名称",
    showInput: true,
    disabled: true
  },  {
        prop: "companyContact",
        label: "企业联系方式",
      }, 
      {
        prop: "companyName",
        label: "企业名称",
      }, 
      {
        prop: "companyPerson",
        label: "企业联系人",
      }, {
        prop: "dockStatus",
        label: "对接状态",
      },
      {
        prop: "dockTime",
        label: "对接时间",
      }
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '企业服务对接管理');
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
		}), '企业服务对接管理')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
const gettrainingServicesAll = () => {
  getentServiceDockingAll();
};
const reset = () => {
  state.entName = '';
  getentServiceDockingAll();
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
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
  console.log("state.formConfig", state);
};

/**
 * 编辑表单
 */
 const qr = (row) => {
  title.value = "分配";
  currentRoleId.value = row.id;
  state.dialogVisible2 = true;
  state.formConfig2 = state.formConfig2
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
const getentServiceDockingAll = () => {
  post(`${entServiceDockingAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    entName: state.entName
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getentServiceDockingAll();

/**
 *  获取表格数据
 */
 const getsuppliersAll = () => {
  post(`${suppliersAll}`, {
  }).then(function (data) {
    state.formConfig2[0].options = data.list.map((e, index) => {
      return {
        label: e.supplierName,
        value: e.supplierName,
        id: e.supplierId
      };
    });
    console.log('data--', data);
  });
};
getsuppliersAll();


/**
 * 提交表单数据
 */
 const postFormData = (formData) => {
    let supplierId = '';
    state.formConfig2[0].options.forEach(e => {
      if(e.value === formData.supplierName) {
        supplierId = e.id;
      };
    });
    post(`${entServiceDockingUpdate}`, {
      id: currentRoleId.value,
      ...formData,
      supplierId,
      dockStatus: 1
    })
    .then(function (data) {
      getsuppliersAll();
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible2 = false;
  console.log("submit!", formData);
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getentServiceDockingAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getentServiceDockingAll();
};
const loading = ref(false);

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
