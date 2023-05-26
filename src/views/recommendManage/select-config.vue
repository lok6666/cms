<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-tabs
        type="card"
        class="demo-tabs"
        style="width: 100%"
        @tab-click="articleHandleClick"
        v-model="state.editableTabsValue"
      >
        <el-tab-pane
          v-for="item in state.optionsList"
          :key="item.id"
          :label="item.title"
          :name="item.id"
        >
          <el-tabs
            type="card"
            class="demo-tabs"
            style="width: 100%"
            v-model="state.activeName"
            @tab-click="articleHandleClick"
          >
            <el-tab-pane
              v-for="i in item.children"
              :key="i.id"
              :label="i.title"
              :name="i.id"
            >
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
      <div style="display: flex; justify-content: space-between">
        <el-form :inline="true" :model="state" class="demo-form-inline">
          <el-form-item label="区县">
          <el-select clearable v-model="state.locationValue" class="col"  @change="getData()" size="small" placeholder="选择区县" style="width: 120px;">
            <el-option v-for="i in locationOptions" :key="i.value" :label="i.label" :value="i.value"/>
          </el-select>
      </el-form-item>
      </el-form>
        <el-button type="primary" @click.stop="add"
          ><el-icon><plus /></el-icon> 添加</el-button
        >
      </div>
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
              @click.stop="deleteAction(scope.row)"
            >
              {{ "删除" }}
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
  SelectGetTree,
  SelectGetDataByTypeId,
  selectByIdType,
  selectAddOne,
  articleArticleAelectCircle,
  selectUpdateOne,
  selectDeleteOne,
  selectOptionList
} from "@/config/api";
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
          prop: "id",
          label: "序号",
        },
        {
          prop: "typeName",
          label: "类型名称",
        },
        {
          prop: "name",
          label: "名称",
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "typeName",
    label: "请选择类型名称",
    showSelect: true,
    required: true,
    options: []
  },
  {
    prop: "name",
    label: "下拉框、复选框名称",
    showInput: true,
    required: true
  },
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  activeName: "content",
  editableTabsValue: "1",
  dialogVisible: false,
  
  formConfig: formConfig,
  tableData: [
    {
      code: "",
      files: [],
      id: 1,
      images: [],
      name: "投资机构",
      pageNum: 0,
      pageSize: 0,
      typeName: "机构类型",
      typeid: 1,
    },
    {
      code: "",
      files: [],
      id: 2,
      images: [],
      name: "文化企业",
      pageNum: 0,
      pageSize: 0,
      typeName: "机构类型",
      typeid: 1,
    },
  ],
  optionsList: [],
});
const title = ref("添加");

/**
 * 获取下拉选项列表
 */
const getSelectOptionList = () => {
/*   get(`${selectOptionList}`)
    .then(function (data) {
      state.optionsList = data;
    })
    .catch((e) => {
      console.log("e", e);
    }); */
    return [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
    disabled: true,
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
];
};

// 获取文章列表
const getOPtionList = () => {
  get(`${articleArticleAelectCircle}`)
    .then(function (data) {
      state.optionsList = data;
    })
    .catch((e) => {
      console.log("e", e);
    });
};
// getOPtionList();

const articleHandleClick = (tab, event) => {
  state.articletype = tab.props.name;
  getArticleSelectAll();
};

/**
 * 添加
 */
const add = () => {
  title.value = "添加";
  state.dialogVisible = true;
  state.formConfig[0].options = getSelectOptionList();
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "添加") {
    post(`${selectAddOne}`, {
      ...formData
    })
      .then(function (data) {
        console.log("data-----", data);
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${selectUpdateOne}`, {
      ...formData
    })
      .then(function (data) {
        console.log("data----", data);
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
  post(`${selectByIdType}`, {
    id: row.id
  })
    .then(function (data) {
      state.dialogVisible = true;
    })
    .catch((e) => {
      console.log("e", e);
    });
};

/**
 * 提交表单数据
 */
const getArticleSelectAll = (config?: selectAllConfig) => {
  post(`${SelectGetDataByTypeId}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    articletype: state.articletype,
    ...config,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getArticleSelectAll();

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getArticleSelectAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getArticleSelectAll();
};
const loading = ref(false);

/**
 * 删除表格内容
 */
const deleteAction = (row) => {
  let obj = {
    ...row,
    deleteState: 1,
  };
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${selectDeleteOne}`, {
        ...obj
      }).then(function (data) {
        getArticleSelectAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
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
