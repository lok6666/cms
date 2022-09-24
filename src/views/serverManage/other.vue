<template>
  <u-container-layout>
    <div style="display: flex; justify-content: flex-end">
      <el-button type="primary" @click="add">
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
       <el-button type="primary" @click="getentServicesAll">查询</el-button>
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
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small"  @click="edit(scope.row)">编辑</el-button>
            <el-button type="success" size="small"  @click="edit(scope.row)">审批</el-button>
            <el-button type="info" size="small"  @click="deleteAction(scope.row)">删除</el-button>
            <el-button type="warning" size="small"  @click="upItem(scope.row)">上架</el-button>
            <el-button type="danger" size="small"  @click="downItem(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="state.dialogVisible"
        :title="title"
        width="50%"
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
      tableHeaderConfig: [
      {
        prop: "serviceName",
        label: "服务名称",
      },
      {
        prop: "serviceStatus",
        label: "审批状态",
      },
      {
        prop: "serviceType",
        label: "服务类型",
      },
      {
        prop: "supplierName",
        label: "服务商名称",
      },
      {
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
      }
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
    prop: "serviceSynopsis",
    label: "服务简介",
    required: true,
    showWangEditor: true
  },
  {
    prop: "serviceType",
    label: "服务类型",
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
      }
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
    prop: "supplierId",
    label: "服务商id",
    required: true,
    showInput: true
  },
  {
    prop: "supplierContact",
    label: "服务商联系方式",
    required: true,
    showInput: true
  },
  {
    prop: "supplierPerson",
    label: "服务商联系人",
    required: true,
    showInput: true
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
  tableData: [{
      address: "测试地点",
      companyicon: "/asset/mxupload/up0642170001558080624.png",
      files: [],
      id: 36,
      images: [],
      pageNum: 0,
      pageSize: 0,
      sercompany: "北京文投大数据有限公司",
      sercompanyId: "62",
      sercompanyid: "62",
      sercontact: "2",
      sermsg: "",
      sername: "知识产权咨询",
      serperson: "1",
      serstatus: "1",
      sersxj: "0",
      sersynopsis: "<p style=\"line-height: normal;\"><strong><span style=\"font-family: simsun, serif; font-size: 18px; white-space: pre-wrap;\">提供免</span><span style=\"font-family: simsun, serif; font-size: 18px; white-space: pre-wrap;\">费的专利、商标、软件著作权等确权、用权、维权咨询服务；专利、商标、软件著作权代理，以及知识产权贯标等由联盟机构提供服务，协议企业享20%优惠。。</span><span style=\"font-family: simsun, serif; font-size: 14px; white-space: pre-wrap;\">。。</span></strong></p>",
      serthumbnail: "/images/82cfb5dc3a40411798baeb2915b1bd1c.jpg",
      sertype: "知识产权服务",
      storgetime: "2022-03-25 17:22:18"
    }],
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
      deleteItem(`${entServicesDeleteOne}`, [row.id]).then(function (data) {
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
ElMessageBox.confirm("你确定要上架当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${entServicesDeleteOne}`, {id: row.id, sersxj: 0}).then(function (data) {
        getentServicesAll();
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
      post(`${entServicesDeleteOne}`, {id: row.id, sersxj: 1}).then(function (data) {
        getentServicesAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 *  获取表格数据
 */
const getentServicesAll = () => {
  post(`${entServicesAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize
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
