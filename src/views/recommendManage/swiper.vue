<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click.stop="add">
          <el-icon><plus /></el-icon>添加
        </el-button>
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
          <img
            v-if="item.showImg"
            :src="item[item.prop]"
            style="width: 50px; height: 50px"
          />
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              
              @click.stop="edit(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click.stop="deleteAction(scope.row, state.isResume)"
              >删除</el-button
            >
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
import { ref, reactive, provide } from "vue";
import formConpoent from "@/components/form/form.vue";
import {
  swiperAll,
  swiperAddOne,
  swiperUpdateOne,
  swiperDelete,
  swiperArticleOption,
  swiperVideoOption,
} from "@/config/api";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
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
          prop: "picture",
          label: "轮播图",
          showImg: true,
        },
        {
          prop: "title",
          label: "标题",
        },
        {
          prop: "urlname",
          label: "链接文章",
        },
        {
          prop: "type",
          label: "位置",
        },
        {
          prop: "order",
          label: "顺序",
        },
        {
          prop: "createdate",
          label: "创建日期",
        },
        {
          prop: "lastupdatatime",
          label: "修改日期",
        }
      ],
    };
  },
};
</script>
<script lang="ts" setup>
const loading = ref(false);

const formInline = reactive({
  username: "",
});
const rules = reactive<FormRules>({
  title: {
    required: true,
  },
  swiper: {
    required: true,
  },
});
const formConfig = [
  {
    prop: "title",
    label: "标题",
    required: true,
    showInput: true,
  },
  {
    prop: "type",
    label: "位置",
    showSelect: true,
    required: true,
    filterable: true,
    options: [
      {
        value: 1,
        label: "顶部",
      },
      {
        value: 2,
        label: "左侧",
      },
    ],
  },
  {
    prop: "order",
    label: "顺序",
    required: true,
    showInput: true,
  },
  {
    prop: "urlname",
    label: "文章",
    showSelect: true,
    filterable: true,
    options: [],
  },
  {
    prop: "picture",
    label: "轮播图",
    upload: true,
    filterable: true,
    required: true,
    options: [],
    picture: ""
  },
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableData: [
    {
      createdate: "2020-05-25 14:11:17",
      deletestate: "",
      files: [],
      id: 15,
      images: [],
      lastupdatatime: "2021-04-29 14:17:32",
      operator: "",
      picture: "/images/81731bc9b43847bdab2ed5252893a98b.jpg",
      storagetime: "2020-05-25 14:11:17",
      title: "文创法务专委会“股权结构与激励的实务操作”线上主题沙龙活动成功举办",
      type: 2,
      url: "7_339.html",
      urlname: "独树一帜 卓然而立11",
    },
  ],
  total: 0,
  sensitiveword: "",
  dialogVisible: false,
  isResume: false,
});
const ruleFormRef = ref();
const title = ref("添加");

/**
 * 添加
 */
const add = async () => {
  title.value = "添加";
  state.formConfig = formConfig;
  //   let articleOption  = await get(`${swiperArticleOption}`);
  //   let videoOption  = await get(`${swiperVideoOption}`);
  state.dialogVisible = true;
//   console.log("add=======", state.formConfig);
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${swiperAddOne}`, {
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
    post(`${swiperUpdateOne}`, {
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
};

/**
 * 修改
 */
const edit = (row) => {
  title.value = "修改";
  state.dialogVisible = true;
  // 修改传给表单初始值
  state.formConfig = state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
};

/**
 * 文章内容列表
 */
const getswiperAll = () => {
  post(`${swiperAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getswiperAll();

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getswiperAll();
};

/**
 * 换页数
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getswiperAll();
};

/**
 * 删除
 */
const deleteAction = (row, isResume) => {
  let obj = {
    ...row,
  };
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${swiperDelete}`, [row.id]).then(function (data) {
        getswiperAll();
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
</style>
