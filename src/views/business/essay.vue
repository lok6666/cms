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
          <el-descriptions title="User Info" :border="true"
              :column="2">
            <el-descriptions-item
              v-for="(value, key) in state.businessMessag"
              :key="key"
              :label="key"
              >{{ value }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
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
      </el-table>
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
  articleSelectAll,
  articleDelete,
  articleSelectById,
} from "@/config/api";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { get, post } from "@/utils/request";

interface selectAllConfig {
  title?: string;
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
const state = reactive({
  currentPage: 0,
  tableData: [],
  total: 0,
  pageSize: 10,
  activeName: "content",
  editableTabsValue: "1",
  dialogVisible: false,
  articletype: 1,
  businessMessage: {
    actualCapital: "600616万人民币",
    actualCapitalCurrency: "人民币",
  },
  optionsList: [
    {
      id: 0,
      title: "工商信息",
    },
    {
      id: 1,
      title: "变更信息",
    },
    {
      id: 2,
      title: "任职信息",
    },
    {
      id: 3,
      title: "股东信息",
    },
    {
      id: 4,
      title: "年报信息",
    },
  ],
});
const ruleFormRef = ref();
const title = ref("新增");
let ruleForm = reactive({});
console.log("ruleForm", ruleForm);
const articleHandleClick = (tab, event) => {
  state.articletype = tab.props.name;
  getArticleSelectAll();
};

// 编辑
const edit = (row) => {
  title.value = "编辑";
  post(`${articleSelectById}?id=${row.id}`, {})
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
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    ...config,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};

// 切换tab
const handleClick = (tab, event) => {
  if (tab.props.name === "resume") {
    getArticleRecycle();
  } else {
    getArticleSelectAll();
  }
};

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getArticleSelectAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getArticleSelectAll();
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
