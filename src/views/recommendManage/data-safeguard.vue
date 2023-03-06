<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <div style="display: flex; justify-content: flex-end">
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
        <template #default="scope" v-if="item.showImg">
            <img
            v-if="item.showImg"
            :src="scope.row[item.prop]"
            style="width: 50px; height: 50px"
          />
          </template>
          <template #default="scope" v-if="item.prop === 'bannerType'">
          {{tableMap[scope.row.bannerType]}}
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
          @handle="changeFormData"
          @dialogClose="closeDialog"
          :showBtn="true"
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
import { get, post, deleteItem } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      tableHeaderConfig: [
        {
          prop: "sortNum",
          label: "序号",
        },
        {
          prop: "bannerType",
          label: "区县",
        },
        {
          prop: "bannerPicture",
          label: "轮播图",
          showImg: true
        }
      ],
      tableMap: {
        'shijingshan': '石景山',
        'beijing': '北京'
      },
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "sortNum",
    label: "序号",
    required: true,
    showInput: true
  },
  {
    prop: "bannerPicture",
    label: "轮播图",
    required: true,
    upload: true,
  },
  {
    prop: "bannerType",
    options: [{
      value: "beijing",
      label: "北京",
    },
    {
      value: "dongcheng",
      label: "东城区",
    },
    {
      value: "xicheng",
      label: "西城区",
    },
    {
      value: "haidian",
      label: "海淀区",
    },
    {
      value: "chaoyang",
      label: "朝阳区",
    },
    {
      value: "changping",
      label: "昌平区",
    },
    {
      value: "shijingshan",
      label: "石景山区",
    },
    {
      value: "tongzhou",
      label: "通州区",
    },
    {
      value: "shunyi",
      label: "顺义区",
    },
    {
      value: "yanqing",
      label: "延庆区",
    },
    {
      value: "pinggu",
      label: "延庆区",
    },
    {
      value: "mentougou",
      label: "门头沟区",
    }],
    label: "区县",
    required: true,
    showSelect: true,
  }
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
  currentRoleId: '',
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
const title = ref("添加");

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
  title.value = "添加";
  state.dialogVisible = true;
  state.formConfig[0].options = getindustryDataOptionList();
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  state.dialogVisible = false;
  if (title.value === "添加") {
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
  state.currentRoleId = row.id;
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
      deleteItem(`${industryDataDeleteOne}`, {
        data: [obj.id],
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
  if (title.value === "添加") {
    post(`${industryDataAddOne}`, {
      id: state.currentRoleId,
      ...formData
    })
      .then(function (data) {
        getIndustryDataAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${industryDataUpdateOne}`, {
      id: state.currentRoleId,
      ...formData
    })
      .then(function (data) {
        getIndustryDataAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
  }
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
