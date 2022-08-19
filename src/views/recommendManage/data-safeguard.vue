<template>
  <u-container-layout>
    <div style="display: inline-block">
      <el-select
        v-model="state.culName"
        filterable
        placeholder="请选择文化领域"
        @change="chooseCulture"
      >
        <el-option
          v-for="item in state.levelOptions"
          :key="item.value"
          :label="item.title"
          :value="item.value"
        />
      </el-select>
    </div>
    <div style="display: inline-block">
      <!--年选择器-->
      <el-date-picker
        v-model="state.year"
        type="year"
        placeholder="请选择年份"
        format="YYYY"
        value-format="YYYY"
      />
    </div>
    <div style="display: inline-block">
      <!--月选择器-->
      <el-date-picker
        v-model="state.month"
        type="month"
        placeholder="请选择月份"
        format="MM"
        value-format="MM"
      />
    </div>
    <el-button type="primary" @click="getIndustryDataAll">
      <el-icon><plus /></el-icon>查询
    </el-button>
    <div class="inline-edit-table">
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
              {{ "删除" }}
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
        <formConpoent
          v-model:formConfig="state.formConfig"
          @handle="changeFormData"
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
  industryDataList,
  selectByIdType,
  industryDataAddOne,
  articleArticleAelectCircle,
  industryDataUpdateOne,
  industryDataDeleteOne,
  industryDataOptionList,
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
          prop: "culName",
          label: "文化领域",
        },
        {
          prop: "year",
          label: "年份",
        },
        {
          prop: "month",
          label: "月份",
        },
        {
          prop: "revenue",
          label: "收入(亿元)",
        },
        {
          prop: "revenueRate",
          label: "收入同比增长(%)",
        },
        {
          prop: "expend",
          label: "支出(亿元)",
        },
        {
          prop: "profit",
          label: "利润(亿元)",
        },
        {
          prop: "profitRate",
          label: "利润同比增长(%)",
        },
        {
          prop: "avgPeople",
          label: "从业平均人数(万人)",
        },
        {
          prop: "avgPeopleRate",
          label: "从业平均人数同比增长(%)",
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
    label: "文化领域",
    showSelect: true,
    required: true,
    value: "111",
    options: [],
    typeName: "",
  },
  {
    prop: "year",
    label: "年份",
    showYearPicker: true,
    required: true,
    value: "",
  },
  {
    prop: "month",
    label: "月份",
    showMonthPicker: true,
    required: true,
    value: "",
  },
  {
    prop: "revenue",
    label: "收入",
    showInput: true,
    required: true,
    value: "",
    revenue: "",
  },
  {
    prop: "revenueRate",
    label: "收入同比增长(%)",
    showInput: true,
    required: true,
    value: "",
  },
  {
    prop: "profit",
    label: "利润",
    showInput: true,
    required: true,
    value: "",
  },
  {
    prop: "profitRate",
    label: "利润同比增长(%)",
    showInput: true,
    required: true,
    value: "",
  },
  {
    prop: "avgPeople",
    label: "从业平均人数(万人)",
    showInput: true,
    required: true,
    value: "",
  },
  {
    prop: "avgPeopleRate",
    label: "从业平均人数同比增长(%)",
    showInput: true,
    required: true,
    value: "",
  },
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  activeName: "content",
  editableTabsValue: "1",
  dialogVisible: false,
  year: 0,
  month: "",
  articletype: "",
  culName: "",
  formConfig: formConfig,
  tableData: [
    {
      avgPeople: "14.8",
      avgPeopleRate: "4.6",
      culName: "新闻信息服务",
      endMonth: "",
      endYear: "",
      expend: "5070.2",
      files: [],
      id: 381,
      ids: [],
      images: [],
      month: "12",
      pageNum: 0,
      pageSize: 0,
      profit: "54.7",
      profitRate: "-79.6",
      revenue: "5124.9",
      revenueRate: "21.5",
      startMonth: "",
      startYear: "",
      status: "",
      type: "",
      year: "2021",
    },
  ],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");

/**
 * 获取下拉选项列表
 */
const getindustryDataOptionList = () => {
  /*   get(`${industryDataOptionList}`)
    .then(function (data) {
      state.optionsList = data;
    })
    .catch((e) => {
      console.log("e", e);
    }); */
  return [
    {
      value: "Option1",
      label: "Option1",
    },
    {
      value: "Option2",
      label: "Option2",
      disabled: true,
    },
    {
      value: "Option3",
      label: "Option3",
    },
    {
      value: "Option4",
      label: "Option4",
    },
    {
      value: "Option5",
      label: "Option5",
    },
  ];
};
state.levelOptions = getindustryDataOptionList();

/**
 * 添加
 */
const add = () => {
  title.value = "新增";
  state.dialogVisible = true;
  state.formConfig[0].options = getindustryDataOptionList();
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${industryDataAddOne}`, {
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
    post(`${industryDataUpdateOne}`, {
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
  /*   post(`${selectByIdType}`, {
    id: row.id,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then(function (data) { */
  state.dialogVisible = true;
  state.formConfig = state.formConfig
  .map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
  /*     })
    .catch((e) => {
      console.log("e", e);
    }); */
};

/**
 *  获取表格数据
 */
const getIndustryDataAll = () => {
  post(`${industryDataList}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    year: state.year,
    month: state.month,
    culName: state.culName,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getIndustryDataAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // getIndustryDataAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getIndustryDataAll();
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getIndustryDataAll();
};
const loading = ref(false);

/**
 * 删除表格内容
 */
const deleteAction = (row) => {
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
      post(`${industryDataDeleteOne}`, {
        ...obj
      }).then(function (data) {
        getIndustryDataAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 * 提交表单数据
 */
const changeFormData = (formData) => {
  state.dialogVisible = false;
  console.log("changeFormData", formData);
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
