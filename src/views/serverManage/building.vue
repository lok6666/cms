<template>
  <u-container-layout>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="楼宇名称">
        <el-input v-model="state.buildingName" placeholder="请输入楼宇名称" />
      </el-form-item>
<!--       <el-form-item label="服务商名称">
        <el-input v-model="state.supplierName" placeholder="请输入服务商名称" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="getbuildingsAll">查询</el-button>
        <el-button type="primary" @click="exportClick">导出EXECL</el-button>
        <el-button type="primary" @click="add">
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
      >
        <el-table-column type="index" width="50" />
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          sortable
          :prop="item.prop"
          :label="item.label"
        >
          <template #default="scope" v-if="item.prop === 'serviceFlag'">
            {{ serviceFlagstatus[scope.row.serviceFlag] }}
          </template>
          <template #default="scope" v-if="item.prop === 'serviceType'">
            {{ serviceTypetatus[scope.row.serviceType] || "不限" }}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="edit(scope.row)"
              >编辑</el-button
            >
<!--             <el-button type="success" size="small" @click="edit(scope.row)"
              >审批</el-button
            > -->
            <el-button type="info" size="small" @click="deleteAction(scope.row)"
              >删除</el-button
            >
<!--             <el-button type="warning" size="small" @click="upItem(scope.row)"
              >上架</el-button
            >
            <el-button type="danger" size="small" @click="downItem(scope.row)"
              >下架</el-button
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
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import {
  phoneRules,
  emtyRules
} from "@/config/constants";
import {
  buildingsAll,
  buildingsInsert,
  buildingsUpdateOne,
  buildingsDeleteOne,
} from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, deleteItem, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      serviceFlagstatus: {
        0: "下架",
        1: "上架",
      },
      serviceTypetatus: {
        0: "知识产权",
        1: "资质认定",
        2: "工商业务",
        3: "财税服务",
        4: "政府补贴",
      },
      tableHeaderConfig: [
        {
          prop: "buildingName",
          label: "楼宇名称",
          required: true,
          showInput: true,
        },
        {
          prop: "buildingInfo",
          label: "楼宇简介",
          required: true,
          showInput: true,
        },
        {
          prop: "buildingArea",
          label: "楼宇面积",
          required: true,
          showInput: true,
        },
        {
          prop: "buildingAddress",
          label: "楼宇地址",
          required: true,
          showInput: true,
        },

        {
          prop: "buildingRent",
          label: "楼宇租金",
          required: true,
          showInput: true,
        },
        {
          prop: "buildingService",
          label: "楼宇服务",
          required: true,
          showInput: true,
        },
        {
          prop: "buildingTotalArea",
          label: "楼宇总面积",
          required: true,
          showInput: true,
        },
        {
          prop: "buildingPeripheral",
          label: "周边配套",
          required: true,
          showInput: true,
        },
/*         {
          prop: "buildingDetail",
          label: "楼宇详情",
          required: true,
          showTextarea: true,
        }, */
        {
          prop: "contactsPerson",
          label: "联系人",
          required: true,
          showInput: true,
        },
        {
          prop: "contactsPhone",
          label: "联系方式",
          required: true,
          showInput: true,
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup>
const formConfig = [
  {
    prop: "buildingName",
    label: "楼宇名称",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "buildingInfo",
    label: "楼宇简介",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "buildingImages",
    label: "缩略图",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    upload: true,
  },
  {
    prop: "buildingArea",
    label: "楼宇面积",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "buildingAddress",
    label: "楼宇地址",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },

  {
    prop: "buildingRent",
    label: "楼宇租金",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "buildingService",
    label: "楼宇服务",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "buildingTotalArea",
    label: "楼宇总面积",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "buildingPeripheral",
    label: "周边配套",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "contactsPerson",
    label: "联系人",
    rules: { required: true, validator: phoneRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "contactsPhone",
    label: "联系方式",
    rules: { required: true, validator: phoneRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "buildingDetail",
    label: "楼宇详情",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showWangEditor: true,
  },
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: "",
  buildingName: "",
  supplierName: "",
  culName: "",
  formConfig: formConfig,
  tableData: [],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");
let currentRoleId = ref<string>("");
/**
 * 添加
 */
const add = (row) => {
  title.value = "新增";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
};

// 导出表格
const exportClick = () => {
  var wb = XLSX.utils.table_to_book(document.querySelector("#my-table")); //关联don节点
  /* get binary string as output */
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      new Blob([wbout], {
        type: "application/octet-stream",
      }),
      "企业服务管理.xlsx"
    ); //自定义文件名
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
};
/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${buildingsInsert}`, {
      ...formData,
    })
      .then(function (data) {
        getbuildingsAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${buildingsUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        getbuildingsAll();
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
  state.formConfig = formConfig;
/*   this.applyMessageForm1 = this.applyMessageForm1.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  }); */
};

/**
 * 编辑表单
 */
const edit = (row) => {
  title.value = "编辑";
  state.dialogVisible = true;
  currentRoleId.value = row.id;
  state.formConfig = state.formConfig.map((e, b) => {
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
      deleteItem(`${buildingsDeleteOne}/${row.id}`).then(function (data) {
        getbuildingsAll();
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
      post(`${buildingsUpdateOne}`, {
        id: currentRoleId.value,
        serviceFlag: 1,
      }).then(function (data) {
        getbuildingsAll();
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
      post(`${buildingsUpdateOne}`, {
        id: currentRoleId.value,
        serviceFlag: 0,
      }).then(function (data) {
        getbuildingsAll();
      });
      ElMessage.success("下架成功");
    })
    .catch(() => {});
};

/**
 *  获取表格数据
 */
const getbuildingsAll = () => {
  post(`${buildingsAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    buildingName: state.buildingName,
    supplierName: state.supplierName,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getbuildingsAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // getbuildingsAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getbuildingsAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getbuildingsAll();
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
