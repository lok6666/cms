<template>
  <u-container-layout>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="服务名称">
          <el-input v-model="state.serviceName" placeholder="请输入服务名称" />
      </el-form-item>
      <el-form-item label="服务商名称">
          <el-input v-model="state.supplierName" placeholder="请输入服务商名称" />
      </el-form-item>
      <el-form-item label="服务类型">
          <el-select clearable v-model="state.serviceType" class="col" size="small" placeholder="选择分类" style="width: 120px;">
            <el-option v-for="i in state.formConfig[2].options" :key="i.value" :label="i.label" :value="i.value"/>
          </el-select>
      </el-form-item>
      <el-form-item label="联系人">
          <el-input v-model="state.supplierPerson" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="联系人电话">
          <el-input v-model="state.supplierContact" placeholder="请输入联系人电话" />
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click.stop="getentServicesAll">查询</el-button>
       <el-button type="primary" icon="IceCreamSquare" @click.stop="exportClick2">导出EXECL</el-button>
       <el-button type="primary" @click.stop="add">
        <el-icon><plus /></el-icon>添加
      </el-button>
      </el-form-item>
    </el-form>
    
    <div class="inline-edit-table">
      <el-table
        id="my-table"
        :data="state.tableData"
        style="width: 100%"
        :border="true"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <!-- <el-table-column type="index" width="50" /> -->
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :show-overflow-tooltip="true"
          sortable
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
        >
        <template #default="scope" v-if="item.prop === 'serviceFlag'">
            {{serviceFlagstatus[scope.row.serviceFlag]}}
          </template>
          <template #default="scope" v-if="item.prop === 'serviceType'">
            {{serviceTypetatus[scope.row.serviceType] || '不限'}}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="340" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small"  icon="Edit" @click.stop="edit(scope.row)">编辑</el-button>
            <el-button type="success" size="small"  @click.stop="edit(scope.row)">审批</el-button>
            <el-button type="info" size="small"  @click.stop="deleteAction(scope.row)">删除</el-button>
            <el-button type="warning" size="small"  @click.stop="upItem(scope.row)">上架</el-button>
            <el-button type="danger" size="small"  @click.stop="downItem(scope.row)">下架</el-button>
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
          :showBtn="true"
          v-model:formConfig="state.formConfig"
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
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import { entServicesAll, entServicesInsert, entServicesUpdateOne, entServicesDeleteOne } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, deleteItem, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      serviceFlagstatus: {
        0: '下架',
        1: '上架'
      },
      serviceTypetatus: {
        0: '知识产权',
        1: '资质认定',
        2: '工商业务',
        3: '财税服务',
        4: '政府补贴',
        5: '数字科技',
        6: '企业服务包'
      },
      tableHeaderConfig: [
      {
        prop: "sortNum",
        label: "排序",
        width: '100'
      },
      {
        prop: "serviceName",
        label: "服务名称",
      },
      {
        prop: "serviceFlag",
        label: "上下架",
      },
      {
        prop: "supplierName",
        label: "服务商",
      },
      {
        prop: "serviceType",
        label: "服务类型",
      },
      {
        prop: "supplierPerson",
        label: "联系人",
      },
      {
        prop: "supplierContact",
        label: "联系人方式",
      },
      // {
      //   prop: "supplierName",
      //   label: "服务商名称",
      // },
      /*  {
         prop: "supplierId",
         label: "服务商id",
       },
       {
         prop: "supplierContact",
         label: "服务商联系方式",
       },
       {
         prop: "supplierPerson",
         label: "服务商联系人",
       }, */
       {
         prop: "servicePrice",
         label: "服务价格"
       },
      ],
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "serviceName",
    label: "服务名称",
    required: true,
    showInput: true
  },
  {
    prop: "sortNum",
    label: "序号",
    required: true,
    showInput: true
  },
  {
    prop: "serviceType",
    label: "服务类型",
    options: [
/*       {
        label: '不限',
        value: ''
      }, */
      {
        label: '知识产权',
        value: '0'
      },
      {
        label: '资质认定',
        value: '1'
      },
      {
        label: '工商业务',
        value: '2'
      },
      {
        label: '财税服务',
        value: '3'
      },
      {
        label: '政府补贴',
        value: '4'
      },
      {
        label: '数字科技',
        value: '6'
      },
      {
        label: '企业服务包',
        value: '5'
      },
    ],
    required: true,
    showSelect: true
  },
  {
    prop: "supplierName",
    label: "服务商名称",
    required: true,
    showInput: true
  },
  {
    prop: "supplierPerson",
    label: "联系人",
    required: true,
    showInput: true
  },
  {
    prop: "supplierContact",
    label: "联系方式",
    required: true,
    showInput: true
  },
  {
    prop: "servicePrice",
    label: "服务价格",
    required: true,
    showInput: true
  },
  {
    prop: "supplierContactX",
    label: "虚拟号",
    required: true,
    showInput: true
  },
  {
    prop: "serviceImage",
    label: "服务缩略图",
    required: true,
    upload: true
  },
  {
    prop: "serviceTags",
    label: "企业服务标签",
    required: true,
    upload: true
  },
  {
    prop: "serviceSynopsis",
    label: "服务简介",
    required: true,
    showWangEditor: true
  }
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: '',
  serviceName: '',
  supplierName: '',
  serviceType: '',
  supplierPerson: '',
  supplierContact: '',
  culName: "",
  selectionList: [],
  formConfig: formConfig,
  tableData: [],
  optionsList: [],
  levelOptions: [],
});
const title = ref("添加");
let currentRoleId = ref<string>("");
/**
 * 添加
 */
 const add = (row) => {
  title.value = "添加";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
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
        prop: "sortNum",
        label: "排序",
      },
      {
        prop: "serviceName",
        label: "服务名称",
      },
      {
        prop: "serviceFlag",
        label: "上下架",
      },
      {
        prop: "supplierName",
        label: "服务商",
      },
      {
        prop: "serviceType",
        label: "服务类型",
      },
      {
        prop: "supplierPerson",
        label: "联系人",
      },
      {
        prop: "supplierContact",
        label: "联系人方式",
      },
      // {
      //   prop: "supplierName",
      //   label: "服务商名称",
      // },
      /*  {
         prop: "supplierId",
         label: "服务商id",
       },
       {
         prop: "supplierContact",
         label: "服务商联系方式",
       },
       {
         prop: "supplierPerson",
         label: "服务商联系人",
       }, */
       {
         prop: "servicePrice",
         label: "服务价格"
       },
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '企业服务管理');
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
		}), '企业服务管理')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
/**
 * 提交表单数据
 */
 const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${entServicesInsert}`, {
      ...formData
    })
      .then(function (data) {
        getentServicesAll();
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
    post(`${entServicesUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        getentServicesAll();
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
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
};

/**
 * 编辑表单
 */
const edit = (row) => {
  title.value = "编辑";
  state.dialogVisible = true;
  currentRoleId.value = row.id;
  state.formConfig = state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
};

/**
 * 删除
 */
const deleteAction = (row) => {
ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${entServicesDeleteOne}/${row.id}`).then(function (data) {
        getentServicesAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 * 上架
 */
const upItem = (row) => {
  currentRoleId.value = row.id;
ElMessageBox.confirm("你确定要上架当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${entServicesUpdateOne}`, {
      id: currentRoleId.value,
      serviceFlag: 1,
    }).then(function (data) {
        getentServicesAll();
      });
      ElMessage.success("上架成功");
    })
    .catch(() => {});
};

/**
 * 下架
 */
const downItem = (row) => {
  currentRoleId.value = row.id;
ElMessageBox.confirm("你确定要下架当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${entServicesUpdateOne}`, {
      id: currentRoleId.value,
      serviceFlag: 0,
    }).then(function (data) {
        getentServicesAll();
      });
      ElMessage.success("下架成功");
    })
    .catch(() => {});
};

/**
 *  获取表格数据
 */
const getentServicesAll = () => {
  post(`${entServicesAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    serviceName: state.serviceName,
    supplierName: state.supplierName,
    serviceType: state.serviceType,
    supplierPerson: state.supplierPerson,
    supplierContact: state.supplierContact
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getentServicesAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // getentServicesAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getentServicesAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getentServicesAll();
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
