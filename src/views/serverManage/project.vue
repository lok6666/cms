<template>
  <u-container-layout>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="课程名称">
        <el-input v-model="state.name" placeholder="请输入课程名称" @change="handleChange"/>
      </el-form-item>
      <el-form-item>
       <el-button type="primary" icon="Search" @click.stop="gettrainingServicesAll">查询</el-button>
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
      <!-- <el-table-column type="index" label="序号" width="60" /> -->
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :show-overflow-tooltip="true"
          sortable
          table-layout="auto"
          :key="index"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
        >
        <template #default="scope" v-if="item.showImg">
          <img
            :src="scope.row.serviceImages"
            style="width: 50px; height: 50px"
          />
        </template>
        <template #default="scope" v-if="item.showSwitch">
          <el-switch
          @click.stop="changeStatus(scope.row, state.tableData[scope.$index].serviceStatus)"
            v-model="state.tableData[scope.$index].serviceStatus"
            :active-value="activeValue"
            :inactive-value="inactiveValue"
          />
        </template>
          
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"           
              @click.stop="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button type="info" size="small" @click.stop="deleteAction(scope.row)">删除</el-button>
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
  import {
  phoneRules,
  emtyRules
} from "@/config/constants";
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import { trainingServicesAll, trainingServicesInsert, trainingServicesDeleteOne, trainingServicesUpdateOne } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { deleteItem, get, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      tableHeaderConfig: [
      {
        prop: "sortNum",
        label: "排序",
        width: '100'
      },
      {
        prop: "serviceName",
        label: "课程名称"
      }, {
        prop: "serviceImages",
        label: "课程缩略图",
        showImg: true
      },{
        prop: "bigType",
        label: "课程大类"
      }, {
        prop: "smallType",
        label: "课程小类"
      },{
        prop: "serviceContent",
        label: "课程简介"
      },
      {
        prop: "serviceUrl",
        label: "课程链接"
      },{
        prop: "publicDate",
        label: "发布日期"
      },{
        prop: "serviceStatus",
        label: "课程状态",
        showSwitch: true,
        width: '100'
      }
      ],
    };
  },
};
</script>
<script lang="ts" setup >
let currentRoleId = ref<string>("");
const activeValue = 1;
const inactiveValue = 0;
const formConfig = [
  {
    prop: "sortNum",
    label: "排序",
    showInput: true,
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
  },
  {
    prop: "serviceName",
    label: "课程名称",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  }, {
    prop: "serviceImages",
    label: "课程缩略图",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    upload: true
  },{
    prop: "bigType",
    label: "课程大类",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  }, {
    prop: "smallType",
    label: "课程小类",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "serviceUrl",
    label: "课程链接",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: '',
  username: '',
  culName: "",
  formConfig: formConfig,
  tableData: [
  ],
  selectionList: [],
  serviceName: '',
  optionsList: [],
  levelOptions: [],
});
const title = ref("添加");


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
        label: "排序"
      },
      {
        prop: "serviceName",
        label: "课程名称"
      }, {
        prop: "serviceImages",
        label: "课程缩略图",
        showImg: true
      },{
        prop: "bigType",
        label: "课程大类"
      }, {
        prop: "smallType",
        label: "课程小类"
      },{
        prop: "serviceContent",
        label: "课程简介"
      },
      {
        prop: "serviceUrl",
        label: "课程链接"
      },{
        prop: "publicDate",
        label: "发布日期"
      },{
        prop: "serviceStatus",
        label: "课程状态",
        showSwitch: true
      }
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '行业课程');
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
		}), '行业课程')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
const handleChange = (val) => {
  state.serviceName = val;
};
/**
 * 添加
 */
const add = (row) => {
  title.value = "添加";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "添加") {
    post(`${trainingServicesInsert}`, {
      ...formData
    })
      .then(function (data) {
        gettrainingServicesAll();
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
    post(`${trainingServicesUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        gettrainingServicesAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
  }
  state.dialogVisible = false;
  console.log("submit!", formData);
};


/**
 * 删除
 */
 const deleteAction = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
      deleteItem(`${trainingServicesDeleteOne}/${row.id}`).then(function (data) {
        gettrainingServicesAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
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

// todo 课程状态
// 上架或者下架
const changeStatus = (row, status) => {
   post(`${trainingServicesUpdateOne}`, {
       id: row.id,
       serviceStatus: status
     })
   .then(function (data) {
     gettrainingServicesAll();
   })
   .catch((e) => {
     console.log("e", e);
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
 *  获取表格数据
 */
const gettrainingServicesAll = () => {
  post(`${trainingServicesAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    serviceName: state.serviceName
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
gettrainingServicesAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // gettrainingServicesAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  gettrainingServicesAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  gettrainingServicesAll();
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
