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
      <el-tabs
        v-model="state.activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="内容列表" name="content"></el-tab-pane>
        <el-tab-pane label="回收站" name="resume"></el-tab-pane>
      </el-tabs>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="formInline.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="primary" @click="onClear">清空</el-button>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="add"
          ><el-icon><plus /></el-icon> 添加</el-button
        >
      </div>
      <el-table
        :data="state.tableData"
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
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              v-if="state.isResume"
              type="success"
              size="small"
              icon="Refresh"
              @click="resume(scope.row)"
            >
              恢复
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
              @click="deleteAction(scope.row, state.isResume)"
            >
              {{ state.isResume ? "彻底删除" : "删除" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="state.dialogVisible"
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
          <el-form-item label="栏目" prop="articleType">
            <el-input v-model="ruleForm.articleType" />
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
                style="width: 50px; height: 50px;"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
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
            <el-button @click="state.dialogVisible = false">取消</el-button>
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
export default { name: "inline-table" };
</script>
<script lang="ts" setup >
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import editor from "@/components/editor/index.vue";
import {
  articleArticleAddOne,
  articleUpdateOne,
  articleRecycle,
  login,
  articleSelectAll,
  articleDelete,
  articleArticleAelectCircle,
  articleSelectById,
} from "@/config/api";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, post } from "@/utils/request";

interface baseData {
  title: string;
  operator: string;
  picture: string;
  dataSources: string;
  avatar: string;
  releaseDate: string;
  content: string;
}

interface selectAllConfig {
  title?: string
}

const rules = reactive<FormRules>({
  title: {
    required: true,
  },
  operator: {
    required: true,
  },
  dataSources: {
    required: true,
  },
  picture: {
    required: true,
  },
  releaseDate: {
    required: true,
  },
  content: {
    required: true,
  },
});
const formInline = reactive({
  title: ""
});
const state = reactive({
  currentPage: 0,
  tableData: [],
  total: 0,
  pageSize: 10,
  activeName: "content",
  editableTabsValue: "1",
  dialogVisible: false,
  articletype: 1,
  optionsList: [
    {
      label: "User",
      name: "User",
    },
  ],
  isResume: false,
});
const ruleFormRef = ref();
const title = ref("新增");
let ruleForm: baseData = reactive({
  title: "",
  articleType: "",
  operator: "",
  picture: "",
  articletype: 1,
  dataSources: "",
  avatar: "",
  digest: "",
  id: "",
  releaseDate: "",
  content: "",
});

// 获取文章类型
const getOPtionList = () => {
  get(`${articleArticleAelectCircle}`)
    .then(function (data) {
      state.optionsList = data;
    })
    .catch((e) => {
      console.log("e", e);
    });
};
getOPtionList();

const articleHandleClick = (tab, event) => {
  state.articletype = tab.props.name;
  getArticleSelectAll();
};
// 添加
const add = () => {
  title.value = "新增";
  state.dialogVisible = true;
};

//富文本编辑emit事件
const changeContent = (HTML) => {
  ruleForm.content = HTML;
};

// 关闭弹窗
const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      let obj = {
        ...ruleForm,
      };
      if (title.value === "新增") {
        post(`${articleArticleAddOne}`, {
          ...obj,
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
        post(`${articleUpdateOne}`, {
          ...obj,
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
      console.log("submit!", obj);
    } else {
      console.log("error submit!", fields);
    }
  });
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  debugger;
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
        var axios = require("axios");
        var FormData = require("form-data");
        var data = new FormData();
        data.append("file", rawFile); // file 即选中的文件
        data.append("userId", 1);
        data.append("type", "image");
        var config = {
          method: "post",
          url: "http://172.16.12.8:28182/upload", //上传图片地址
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          type: "image",
          data: data
        };
        axios.defaults.crossDomain = true;
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios(config)
        .then(function (res) {
          ruleForm.picture = res
        })
        .catch(function (error) {
          console.log(error);
        });
};
// todo 改写法
const closeDialog = async (done: () => void) => {
  Object.assign(ruleForm, {
    title: "",
    articleType: "",
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
  title.value = "编辑";
  post(`${articleSelectById}?id=${row.id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then(function (data) {
      state.dialogVisible = true;
      Object.assign(ruleForm, data);
    })
    .catch((e) => {
      console.log("e", e);
    });
};
//  文章内容列表
const getArticleSelectAll = (config?: selectAllConfig) => {
  post(`${articleSelectAll}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
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

// 回收站·
const getArticleRecycle = (config?: selectAllConfig) => {
  post(`${articleRecycle}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    ...config,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};

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

// 切换tab
const handleClick = (tab, event) => {
  if (tab.props.name === "resume") {
    state.isResume = true;
    getArticleRecycle();
  } else {
    state.isResume = false;
    getArticleSelectAll();
  }
};

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getArticleSelectAll({ title: formInline.title});
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getArticleSelectAll({ title: formInline.title});
};
const loading = ref(false);

// 搜索
const onSubmit = () => {
  console.log("submit!");
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    getArticleSelectAll({ title: formInline.title});
  }, 500);
};

// 清空
const onClear = () => {
  loading.value = true;
  formInline.value = {};
  setTimeout(() => {
    loading.value = false;
    getArticleSelectAll({ title: ""});
  }, 500);
};

// 删除
const deleteAction = (row, isResume) => {
  let obj = {
    ...row,
    deleteState: 1,
  };
  debugger;
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      !isResume
        ? post(`${articleUpdateOne}`, {
            ...obj,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }).then(function (data) {
            getArticleSelectAll();
          })
        : post(`${articleDelete}`, [row.id]).then(function (data) {
            getArticleRecycle();
          });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

// 恢复
const resume = (row) => {
  let obj = {
    ...row,
    deleteState: 0,
  };
  ElMessageBox.confirm("你确定要恢复当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${articleUpdateOne}`, {
        ...obj,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }).then(function (data) {
        getArticleRecycle();
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
