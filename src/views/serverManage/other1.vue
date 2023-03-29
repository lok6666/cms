<template>
  <u-container-layout>
    服务商
    <div style="display: flex; justify-content: flex-end">
      <el-button type="primary" @click.stop="add">
        <el-icon><plus /></el-icon>添加
      </el-button>
    </div>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="资金名称">
        <el-input v-model="state.name" placeholder="请输入资金名称" />
      </el-form-item>
      <el-form-item label="企业名称">
          <el-input v-model="state.username" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click.stop="getsuppliersAll">查询</el-button>
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
          :prop="item.prop"
          :label="item.label"
        >
        <template #default="scope" v-if="item.prop === 'supplierType'">
            {{supplierTypeStatus[scope.row.supplierType]}}
        </template>
        <template #default="scope" v-if="item.showImg">
            <img
            v-if="item.showImg"
            :src="scope.row[item.prop]"
            style="width: 50px; height: 50px"
          />
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small"  icon="Edit" @click.stop="edit(scope.row)">编辑</el-button>
            <!-- <el-button type="success" size="small"  @click.stop="edit(scope.row)">审批</el-button> -->
            <!-- <el-button type="info" size="small"  @click.stop="deleteAction(scope.row)">删除</el-button>
            <el-button type="warning" size="small"  @click.stop="upItem(scope.row)">上架</el-button>
            <el-button type="danger" size="small"  @click.stop="downItem(scope.row)">下架</el-button> -->
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
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import {
  phoneRules,
  emtyRules
} from "@/config/constants";
import { suppliersAll, suppliersInsert, suppliersUpdateOne, suppliersDeleteOne } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, deleteItem, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      supplierTypeStatus: {
        0: '不限',
        1: '文化/互联网科技资讯',
        2: '法律服务',
        3: '政策资质',
        4: '知识产权',
        5: '工商财税',
        6: '灵活用工',
        7: '银行'
      },
      tableHeaderConfig: [
        {
          prop: "supplierName",
          label: "供应商名称",
        },
        
        {
          prop: "supplierType",
          label: "供应商类别",
          options: [
            {
              label: '不限',
              value: '0'
            },
            {
              label: '文化/互联网科技资讯',
              value: '1'
            },
            {
              label: '法律服务',
              value: '2'
            },
            {
              label: '政策资质',
              value: '3'
            },
            {
              label: '知识产权',
              value: '4'
            },
            {
              label: '工商财税',
              value: '5'
            },
            {
              label: '灵活用工',
              value: '6'
            },
            {
              label: '银行',
              value: '7'
            }
          ]
        },
        {
          prop: "supplierPerson",
          label: "供应商联系人",
        },
        {
          prop: "supplierContact",
          label: "联系方式",
        },
        {
          prop: "supplierLogo",
          label: "供应商logo",
          showImg: true
        },
        {
          prop: "supplierAddress",
          label: "供应商地址"
        }
      ]
    }
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "supplierName",
    label: "供应商名称",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "supplierType",
    label: "供应商类别",
    options: [
      {
        label: '不限',
        value: '0'
      },
      {
        label: '文化/互联网科技资讯',
        value: '1'
      },
      {
        label: '法律服务',
        value: '2'
      },
      {
        label: '政策资质',
        value: '3'
      },
      {
        label: '知识产权',
        value: '4'
      },
      {
        label: '工商财税',
        value: '5'
      },
      {
        label: '灵活用工',
        value: '6'
      },
      {
        label: '银行',
        value: '7'
      }
    ],
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showSelect: true
  },
  {
    prop: "supplierPerson",
    label: "供应商联系人",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "supplierContact",
    label: "联系方式",
    rules: { required: true, validator: phoneRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "supplierAddress",
    label: "供应商地址",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true
  },
  {
    prop: "supplierLogo",
    label: "供应商logo",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    upload: true
  },
  {
    prop: "supplierContent",
    label: "供应商简介",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showWangEditor: true
  }
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
  currentRoleId.value = row.supplierId;
  state.dialogVisible = true;
};


/**
 * 提交表单数据
 */
 const postFormData = (formData) => {
  if (title.value === "添加") {
    post(`${suppliersInsert}`, {
      ...formData
    })
      .then(function (data) {
        getsuppliersAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${suppliersUpdateOne}`, {
      supplierId: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        getsuppliersAll();
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
};

/**
 * 编辑表单
 */
const edit = (row) => {
  title.value = "编辑";
  state.dialogVisible = true;
  currentRoleId.value = row.supplierId;
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
      deleteItem(`${suppliersDeleteOne}/${row.supplierId}`, {
        data: [row.supplierId],
      }).then(function (data) {
        getsuppliersAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 * 上架
 */
const upItem = (row) => {
ElMessageBox.confirm("你确定要上架当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${suppliersDeleteOne}`, {id: row.id, sersxj: 0}).then(function (data) {
        getsuppliersAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 * 下架
 */
const downItem = (row) => {
ElMessageBox.confirm("你确定要上架当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${suppliersDeleteOne}`, {id: row.id, sersxj: 1}).then(function (data) {
        getsuppliersAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 *  获取表格数据
 */
const getsuppliersAll = () => {
  post(`${suppliersAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getsuppliersAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // getsuppliersAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getsuppliersAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getsuppliersAll();
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
