<template>
  <u-container-layout>
    <div style="display: flex; justify-content: flex-end">
      <el-button type="primary" @click.stop="add">
        <el-icon><plus /></el-icon>添加
      </el-button>
    </div>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="项目名称">
        <el-input v-model="state.name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="企业名称">
          <el-input v-model="state.username" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item>
       <el-button type="primary" icon="Search" @click.stop="gettrainingServicesAll">查询</el-button>
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
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import { trainingServicesAll, trainingServicesInsert, trainingServicesDeleteOne, trainingServicesUpdateOne } from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      tableHeaderConfig: [
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
      },{
        prop: "publicDate",
        label: "发布日期"
      },{
        prop: "serviceStatus",
        label: "课程状态",
        showSwitch: true
      },
      {
        prop: "serviceUrl",
        label: "课程链接"
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
const formConfig = [{
    prop: "serviceName",
    label: "课程名称",
    required: true,
    showInput: true
  }, {
    prop: "serviceImages",
    label: "课程缩略图",
    required: true,
    upload: true
  },{
    prop: "bigType",
    label: "课程大类",
    required: true,
    showInput: true
  }, {
    prop: "smallType",
    label: "课程小类",
    required: true,
    showInput: true
  },
  {
    prop: "serviceUrl",
    label: "课程链接",
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
  tableData: [
  ],
  optionsList: [],
  levelOptions: [],
});
const title = ref("添加");


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

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.formConfig = formConfig;
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
    pageSize: state.pageSize
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
