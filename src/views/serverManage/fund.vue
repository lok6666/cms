<template>
  <u-container-layout>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="服务名称">
          <el-input v-model="state.username" placeholder="请输入服务名称" />
      </el-form-item>
      <el-form-item label="服务商名称">
          <el-input v-model="state.serviceBank" placeholder="请输入服务商名称" />
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click="getfinancialServicesAll">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportClick">导出EXECL</el-button>
      </el-form-item>
    </el-form>
    
    <div class="inline-edit-table">
      <el-table
        :data="state.tableData"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          sortable
          :prop="item.prop"
          :label="item.label"
        >
        <template #default="scope" v-if="item.prop === 'serviceFlag'">
            {{serviceFlagstatus[scope.row.serviceFlag]}}
          </template>
        <template #default="scope" v-if="item.showImg">
         <img
            v-if="item.showImg"
            :src="scope.row.serviceImages"
            style="width: 50px; height: 50px"
          />
        </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="deleteAction(scope.row, state.isResume)"
                >删除</el-button
              >
              <el-button type="warning" size="small"  @click="upItem(scope.row)">上架</el-button>
              <el-button type="danger" size="small"  @click="downItem(scope.row)">下架</el-button>
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
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import { suppliersAll, financialServicesAll, financialServicesUpdateOne, financialServicesDeleteOne, financialServicesInsert } from "@/config/api";
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
      tableHeaderConfig: [
        {
          prop: "sortNum",
          label: "排序",
        },
        {
          prop: "serviceName",
          label: "服务名称",
        },
        {
          prop: "serviceBank",
          label: "服务商"
        },
        {
          prop: "serviceImages",
          label: "机构logo",
          showImg: true
        },
        {
          prop: "serviceQuota",
          label: "额度范围",
        },
        {
          prop: "serviceTerm",
          label: "期限",
        },
        {
          prop: "serviceRange",
          label: "利率范围",
        },
        {
          prop: "serviceType",
          label: "担保方式"
        },
        {
          prop: "serviceFlag",
          label: "上下架",
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup >
let currentRoleId = ref<string>("");
const formConfig = [
  {
    prop: "sortNum",
    label: "排序",
    showInput: true,
    required: true,
  },
  {
    prop: "serviceName",
    label: "服务名称",
    showInput: true,
    required: true
  },
  {
    prop: "serviceImages",
    label: "机构logo",
    upload: true,
    required: true
  },
  {
    prop: "serviceQuota",
    label: "额度范围",
    showInput: true,
    required: true
  },
  {
    prop: "serviceTerm",
    label: "期限",
    showInput: true,
    required: true
  },
  {
    prop: "serviceRange",
    label: "利率范围",
    showInput: true,
    required: true,
  },
  {
    prop: "serviceType",
    label: "担保方式",
    showInput: true,
    required: true,
  },
  {
    prop: "supplierId",
    label: "服务商",
    options: [
    ],
    required: true,
    showSelect: true
  },
  {
    prop: "serviceContent",
    label: "服务详情",
    showWangEditor: true,
    required: true
  },
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: '',
  username: '',
  serviceBank: '',
  culName: "",
  formConfig: formConfig,
  tableData: [
  ],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");

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
		}), '金融服务.xlsx')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}

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
      post(`${financialServicesUpdateOne}`, {
      id: currentRoleId.value,
      serviceFlag: 1,
    }).then(function (data) {
      getsuppliersAll();
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
      post(`${financialServicesUpdateOne}`, {
      id: currentRoleId.value,
      serviceFlag: 0,
    }).then(function (data) {
      getsuppliersAll();
      });
      ElMessage.success("下架成功");
    })
    .catch(() => {});
};

/**
 *  获取表格数据
 */
 const getsuppliersAll = () => {
  post(`${suppliersAll}`, {
  }).then(function (data) {
    state.formConfig[state.formConfig.length -1].options = data.list.map(e => {
      return {
        label: e.supplierName,
        value: e.supplierName,
        id: e.supplierId
      };
    });

  });
};
getsuppliersAll();
/**
 * 添加
 */
const add = (row) => {
  title.value = "新增";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
};


// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.formConfig = formConfig;
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
// todo 服务炸状态

// 删除
const deleteAction = (row, isResume) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${financialServicesDeleteOne}`, {
        data: [row.id],
      }).then(function (data) {
        getfinancialServicesAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 *  获取表格数据
 */
const getfinancialServicesAll = () => {
  post(`${financialServicesAll}`, {
    serviceName: state.username,
    serviceBank: state.serviceBank,
    pageNum: state.currentPage,
    pageSize: state.pageSize
  }).then(function (data) {
    console.log('aaaaa---', data);
    state.tableData = data.list;
    state.total = data.total;
  });
};
getfinancialServicesAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // getfinancialServicesAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getfinancialServicesAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getfinancialServicesAll();
};
const loading = ref(false);


/**
 * 提交表单数据
 */
 const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${financialServicesInsert}`, {
      ...formData
    })
      .then(function (data) {
        getfinancialServicesAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${financialServicesUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        getfinancialServicesAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
  }
  state.dialogVisible = false;
  console.log("submit!", formData);
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
