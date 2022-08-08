<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        style="width: 100%"
        @tab-click="handleClick"
      >
        <el-tab-pane label="User" name="first"></el-tab-pane>
        <el-tab-pane label="Config" name="second"></el-tab-pane>
        <el-tab-pane label="Role" name="third"></el-tab-pane>
        <el-tab-pane label="Task" name="fourth"></el-tab-pane>
      </el-tabs>
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="内容列表" name="first"></el-tab-pane>
        <el-tab-pane label="回收站" name="second"></el-tab-pane>
      </el-tabs>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="formInline.username" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="primary" @click="onClear">清空</el-button>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="add"><el-icon><plus /></el-icon> 添加</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="title" label="文章标题" />
        <el-table-column prop="articleTypeName" label="文章栏目" />
        <el-table-column prop="dataSources" label="文章来源" />
        <el-table-column prop="releaseDate" label="发布日期" />
        <el-table-column prop="createDate" label="创建时间" />
        <el-table-column prop="status" label="发布状态" />
        <el-table-column prop="operator" label="文章作者" />
        <el-table-column prop="isTop" label="置顶">
          <template #default="scope">
            {{ scope.row.isTop === "0 " ? "不置顶" : "置顶" }}
          </template>
        </el-table-column>
        <el-table-column prop="recommend" label="推荐">
          <template #default="scope">
            {{ scope.row.recommend === "0 " ? "不推荐" : "推荐" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作"
          width="180px"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.edit"
              type="success"
              size="small"
              icon="CircleCheckFilled"
              @click="confirmEdit(scope.row)"
            >
              保存
            </el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Edit"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>

            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="deleteAction(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="50%"
        @closed="closeDialog()"
      >
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
        >
          <el-form-item label="栏目" prop="username">
            <el-input v-model="ruleForm.username" />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title" />
          </el-form-item>
          <el-form-item label="摘要" prop="digest">
            <el-input v-model="ruleForm.digest" />
          </el-form-item>
          <el-form-item label="作者" prop="operator">
            <el-input v-model="ruleForm.operator" />
          </el-form-item>
          <el-form-item label="来源" prop="dataSources">
            <el-input v-model="ruleForm.dataSources" />
          </el-form-item>
          <el-form-item label="缩略图" prop="picture">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ruleForm.picture"
                :src="ruleForm.picture"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="发布日期" prop="releaseDate">
            <el-input v-model="ruleForm.releaseDate" />
          </el-form-item>
          <el-form-item label="外部链接" prop="releaseDate">
            <el-input v-model="ruleForm.releaseDate" />
          </el-form-item>
          <el-form-item label="文章内容" prop="content">
            <editor
              :content="ruleForm.content"
              @handle="changeContent"
            ></editor>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleClose(ruleFormRef)"
              >确定</el-button
            >
          </span>
        </template>
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
          :page-size="pageSize.value"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </u-container-layout>
</template>
<script lang="ts">
export default { name: "inline-table" };
</script>
<script lang="ts" setup >
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import editor from "@/components/editor/index.vue";
import {
  articlePpdateOne,
  articleRecycle,
  login,
  articleSelectAll,
  articleDelete,
  articleSelectById,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { deepClone } from "lodash";
import { get, post } from "@/utils/request";
let currentPage = ref(1);
let tableData = ref([]);
const ruleFormRef = ref();
let pageSize = ref(10);
const activeName = ref("first");
const dialogVisible = ref(false);
const title = ref("新增");
const baseData = {
  title: "",
  username: "1",
  operator: "",
  picture: "",
  dataSources: "",
  avatar: "",
  digest: "",
  id: "",
  releasedate: "",
  content: "",
};
let ruleForm = reactive(baseData);
// 添加
const add = () => {
  title.value = "新增";
  dialogVisible.value = true;
};
const changeContent = (HTML) => {
  ruleForm.content = HTML;
};
// 关闭弹窗
const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    debugger;
    console.log('toRef(ruleForm)', {...ruleForm});
    if (valid) {
      let obj = {
        ...ruleForm,
      };
      if (title.value === "新增") {
        post(`${articlePpdateOne}`, {
          ...obj,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        })
          .then(function (data) {
            console.log('data-----', data);
          })
          .catch((e) => {
            console.log("e", e);
          });
        ElMessage.success("添加成功");
      } else {
        post(`${articlePpdateOne}`, {
          ...obj,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        })
          .then(function (data) {
           console.log('data----', data);
          })
          .catch((e) => {
            console.log("e", e);
          });
      }
      dialogVisible.value = false;
      console.log("submit!", obj);
    } else {
      console.log("error submit!", fields);
    }
  });
};
// todo 改写法
const closeDialog = async (done: () => void) => {
  Object.assign(ruleForm, {
    title: "",
    username: "1",
    operator: "",
    picture: "",
    dataSources: "",
    avatar: "",
    digest: "",
    id: "",
    releasedate: "",
    content: "",
  });
};
// 编辑
const edit = (row) => {
  title.value = "编辑";;
  post(`${articleSelectById}?id=${row.id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then(function (data) {
      dialogVisible.value = true;
      Object.assign(ruleForm, data);
    })
    .catch((e) => {
      console.log("e", e);
    });
};
//  文章内容列表
const getArticleSelectAll = () => {
  post(`${articleSelectAll}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    articletype: "5",
  }).then(function (data) {
    tableData.value = data.list;
  });
};
// 回收站·
const getArticleRecycle = (articletype) => {
  post(`${articleRecycle}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    articletype,
  }).then(function (data) {
    tableData.value = data.list;
  });
};
getArticleSelectAll();
// 登录接口
post(`${login}`, {
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  data: {
    name: "admin",
    passWord: "12345",
  },
}).then(function (data) {});

const handleClick = (tab, event) => {
  console.log("handleClick", tab.props.label, event);
  getArticleRecycle(6);
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  pageSize.value = val;
  post(`${articleSelectAll}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    articletype: "5",
  }).then(function (data) {
    tableData.value = data.list;
  });
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  post(`${articleSelectAll}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    articletype: "5",
  }).then(function (data) {
    tableData.value = data.list;
  });
};
const loading = ref(false);

const confirmEdit = (row) => {
  row.edit = false;
};

const cancelEdit = (row) => {
  row.edit = false;
};

const formInline = reactive({
  username: "",
});

const onSubmit = () => {
  console.log("submit!");
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    post(`${articleSelectAll}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      title: formInline.username,
    }).then(function (data) {
      tableData.value = data.list;
    });
  }, 500);
};
const onClear = () => {
  loading.value = true;
  formInline.value = {};
  setTimeout(() => {
    loading.value = false;
    post(`${articleSelectAll}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      title: "",
    }).then(function (data) {
      tableData.value = data.list;
    });
  }, 500);
};

const deleteAction = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${articleDelete}`, [row.id]).then(function (data) {
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
</style>
