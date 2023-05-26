<template>
  <u-container-layout>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="服务名称">
          <el-input v-model="state.username" placeholder="请输入服务名称" />
      </el-form-item>
      <el-form-item label="服务商名称">
          <el-input v-model="state.serviceBank" placeholder="请输入服务商名称" />
      </el-form-item>
      <el-form-item label="区县">
          <el-select clearable v-model="state.locationValue" class="col"  @change="getData()" size="small" placeholder="选择区县" style="width: 120px;">
            <el-option v-for="i in locationOptions" :key="i.value" :label="i.label" :value="i.value"/>
          </el-select>
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click.stop="getfinancialServicesAll">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="add">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="IceCreamSquare" @click.stop="exportClick2">导出EXECL</el-button>
      </el-form-item>
    </el-form>
    
    <div class="inline-edit-table">
      <el-table
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
          :show-overflow-tooltip="true"
          sortable
          :prop="item.prop"
          :label="item.label"
        >
        <template #default="scope" v-if="item.prop === 'serviceLocation'">
            {{scope.row.serviceLocation.split(',').map(e => tableMap[e]).toString()}}
          </template>
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
        <el-table-column prop="operator" label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              
              @click.stop="edit(scope.row)"
            >
              编辑
            </el-button>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click.stop="deleteAction(scope.row, state.isResume)"
                >删除</el-button
              >
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
import {
  locationOptions,
} from "@/config/constant";
import {
  phoneRules,
  emtyRules,
  typeRules
} from "@/config/constants";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { export_json_to_excel } from "@/execl/Export2Excel";
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
      tableMap: {
        'shijingshan': '石景山',
        'beijing': '北京',
        'chaoyang': '朝阳'
      },
      tableHeaderConfig: [
        {
          prop: "sortNum",
          label: "排序",
        },
        {
        prop: "serviceLocation",
        label: "区县",
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
        {
          prop: "serviceHits",
          label: "浏览",
        }
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
    prop: "serviceLocation",
    label: "区县",
    multiple: true,
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    options: [{
      value: "beijing",
      label: "北京",
    },
    {
      value: "dongcheng",
      label: "东城区",
    },
    {
      value: "xicheng",
      label: "西城区",
    },
    {
      value: "haidian",
      label: "海淀区",
    },
    {
      value: "chaoyang",
      label: "朝阳区",
    },
    {
      value: "changping",
      label: "昌平区",
    },
    {
      value: "shijingshan",
      label: "石景山区",
    },
    {
      value: "tongzhou",
      label: "通州区",
    },
    {
      value: "shunyi",
      label: "顺义区",
    },
    {
      value: "yanqing",
      label: "延庆区",
    },
    {
      value: "pinggu",
      label: "延庆区",
    },
    {
      value: "mentougou",
      label: "门头沟区",
    }],
    label: "区县",
    required: true,
    showSelect: true
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
    prop: "serviceBank",
    label: "服务商",
    showInput: true,
    required: true,
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
  locationValue: '',
  formConfig: formConfig,
  tableData: [
  ],
  selectionList: [],
  optionsList: [],
  levelOptions: [],
});
const title = ref("添加");
const getData = () => {
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
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '金融服务');
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
		}), '金融服务')//自定义文件名
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
  title.value = "添加";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
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
    if(e.prop === 'serviceLocation') {
      result[e.prop] = row[e.prop].split(',');
    } else {
      result[e.prop] = row[e.prop];
    }
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
      deleteItem(`${financialServicesDeleteOne}/${row.id}`, {
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
    pageSize: state.pageSize,
    serviceLocation: state.locationValue.toString()
  }).then(function (data) {
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
  formData.serviceLocation = formData.serviceLocation.toString();
  if (title.value === "添加") {
    post(`${financialServicesInsert}`, {
      ...formData
    })
      .then(function (data) {
        getfinancialServicesAll();
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
