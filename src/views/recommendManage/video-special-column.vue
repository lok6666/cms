<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="add">
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
              
              @click="edit(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="deleteAction(scope.row, state.isResume)"
              >删除</el-button
            >
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
  videoAll,
  videoAddOne,
  videoUpdateOne,
  videoDelete
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
          prop: "infomation",
          label: "简介",
        },
        {
          prop: "createdate",
          label: "创建日期",
        },
        {
          prop: "lastupdatatime",
          label: "修改日期",
        },
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
    showInput: true
  },
  {
    prop: "infomation",
    label: "位置",
    showSelect: true,
    showInput: true
  },
  {
    prop: "picture",
    label: "轮播图",
    upload: true,
    required: true,
    picture: ""
  },
  // todo form模板增加视频
  {
    prop: "video",
    label: "视频",
    upload: true,
    required: true,
    picture: ""
  }
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableData: [{
    createdate: "2022-03-25 11:43:51",
    deletestate: "",
    files: [],
    id: 46,
    images: [],
    infomation: "北京文投大数据有限公司",
    lastupdatatime: "2022-03-25 15:20:31",
    operator: "",
    pageNum: 0,
    pageSize: 0,
    picture: "/images/89af238c85484ecab0b189b19126ad5b.jpg",
    status: 0,
    storagetime: "2022-03-25 11:43:51",
    title: "环球影城5G消息案例(文投大数据)",
    type: "",
    url: "8_46.html",
    video: "/images/0e6e9f471f424c948e883a891079842d.mp4"
  }],
  total: 0,
  sensitiveword: "",
  dialogVisible: false,
  isResume: false,
});
const ruleFormRef = ref();
const title = ref("新增");

/**
 * 添加
 */
const add = async () => {
  title.value = "新增";
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
    post(`${videoAddOne}`, {
      ...formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then(function (data) {
        console.log("data-----", data);
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${videoUpdateOne}`, {
      ...formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
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
  state.formConfig = Object.assign({}, state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  }));
};

/**
 * 文章内容列表
 */
const getvideoAll = () => {
  post(`${videoAll}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getvideoAll();

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getvideoAll({ title: formInline.username });
};

/**
 * 换页数
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getvideoAll({ title: formInline.username });
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
      post(`${videoDelete}`, [row.id]).then(function (data) {
        getvideoAll();
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
