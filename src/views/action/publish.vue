<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
            <el-input v-model="state.activityName" placeholder="请输入活动名称" style="width: 300px; margin-right: 10px;margin-bottom: 10px;"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="primary" @click="onClear">清空</el-button>
        </el-form-item>
      </el-form>
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
        <template #default="scope" v-if="item.prop === 'activityStatus'">
            {{activityStatus[scope.row.activityStatus]}}
          </template>
        <template #default="scope" v-if="item.showImg">
            <img
            v-if="item.showImg"
            :src="scope.row[item.prop]"
            style="width: 50px; height: 50px"
          />
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="edit(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="deleteAction(scope.row)"
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
          :showBtn="true"
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
  actionAll,
  actionAddOne,
  actionrUpdateOne,
  actionDelete,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteItem, post } from "@/utils/request";
export default {
  name: "active-publish",
  data() {
    return {
      activityStatus: {
        0: '未发布',
        1: '已发布'
      },
      tableHeaderConfig: [
      {
        prop: "activityName",
        label: "活动名称"
      },
      {
        prop: "activityAddress",
        label: "活动地点"
      },
      // {
      //   prop: "activityAbstract",
      //   label: "活动简介"
      // },
      // {
      //   prop: "activityContent",
      //   label: "活动详情介绍"
      // },
      {
        prop: "activityNum",
        label: "参加人数"
      },
      // {
      //   prop: "activityImg",
      //   label: "活动课程图片",
      //   showImg: true
      // },
      {
        prop: "contactPerson",
        label: "联络人" 
      },
      {
        prop: "contactPhone",
        label: "联络人电话" 
      },
      {
        prop: "activityDateFrom",
        label: "活动开始时间",
        placeholder: "活动开始时间"
      },
      {
        prop: "activityDateTo",
        label: "活动结束时间"    
      },
      {
        prop: "applyTimeFrom",
        label: "活动报名开始日期",
        placeholder: "活动报名开始日期"
      },
      {
        prop: "applyTimeTo",
        label: "活动报名结束日期",
        placeholder: "活动报名结束日期"
      },
      {
        prop: "activityStatus",
        label: "活动状态",
        options: [
          {
            label: '报名中',
            value: '1'
          },
          {
            label: '报名结束，进行中',
            value: '2'
          },
          {
            label: '已结束',
            value: '3'
          }
        ]      
      }
      ],
    };
  },
};
</script>
<script lang="ts" setup>
const formConfig = [
  {
    prop: "activityName",
    label: "活动名称",
    required: true,
    showInput: true,
  },
  {
    prop: "activityAddress",
    label: "活动地点",
    required: true,
    showInput: true 
  },
  {
    prop: "activityNum",
    label: "参加人数",
    required: true,
    showInput: true 
  },
  {
    prop: "contactPerson",
    label: "联络人",
    required: true,
    showInput: true,   
  },
  {
    prop: "contactPhone",
    label: "联络人电话",
    required: true,
    showInput: true,    
  },
  {
    prop: "activityAbstract",
    label: "活动简介",
    required: true,
    showTextarea: true 
  },
  {
    prop: "activityDateFrom",
    label: "活动开始时间",
    placeholder: "活动开始时间",
    required: true,
    showDatePicker: true
  },
  {
    prop: "activityDateTo",
    label: "活动结束时间",
    required: true,
    showDatePicker: true,
    
  },
  {
    prop: "applyTimeFrom",
    label: "活动报名开始日期",
    placeholder: "活动报名开始日期",
    required: true,
    showDatePicker: true
  },
  {
    prop: "applyTimeTo",
    label: "活动报名结束日期",
    placeholder: "活动报名结束日期",
    required: true,
    showDatePicker: true, 
  },
  {
    prop: "activityImg",
    label: "活动课程图片",
    required: true,
    upload: true 
  },
  {
    prop: "activityThumbnail",
    label: "缩略图",
    required: true,
    // display: ''
    upload: true 
  },
  {
    prop: "activityContent",
    label: "活动详情介绍",
    required: true,
    showWangEditor: true, 
  },
  // {
  //   prop: "activityStatus",
  //   label: "活动状态",
  //   options: [
  //     {
  //       label: '报名中',
  //       value: '1'
  //     },
  //     {
  //       label: '报名结束，进行中',
  //       value: '2'
  //     },
  //     {
  //       label: '已结束',
  //       value: '3'
  //     }
  //   ],
  //   required: true,
  //   showSelect: true,
  // }
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableData: [],
  total: 0,
  activityName: '',
  sensitiveword: "",
  dialogVisible: false
});
const title = ref("新增");
let currentRoleId = ref("");
// 添加
const add = () => {
  title.value = "新增";
  state.dialogVisible = true;
};


const onSubmit = () => {
  getactionAll();
};
const onClear = () => {
  state.activityName = '';
  getactionAll();
}
/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${actionAddOne}`, {
      ...formData,
    })
      .then(function (data) {
        getactionAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    // 所有设置更新的都要加id
    post(`${actionrUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function () {
        getactionAll();
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

// 修改
const edit = (row): void => {
  title.value = "修改";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
};
//  文章内容列表
const getactionAll = () => {
  post(`${actionAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    activityName: state.activityName
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getactionAll();

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getactionAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getactionAll();
};
const loading = ref(false);

const formInline = reactive({
  username: "",
});
// 删除
const deleteAction = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${actionDelete}`, {
        data: [row.id],
      }).then(function (data) {
        getactionAll();
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
