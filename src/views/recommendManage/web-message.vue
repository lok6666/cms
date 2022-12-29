<template>
    <u-container-layout>
      <div class="inline-edit-table">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
            <el-input v-model="state.companyName" placeholder="请输入企业名称" style="width: 300px; margin-right: 10px;margin-bottom: 10px;"/>
            <el-input v-model="state.messageContent" placeholder="请输入消息内容" style="width: 300px; margin-bottom: 10px;"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="onSubmit">搜索</el-button>
          <el-button type="primary" @click.stop="onClear">重置</el-button>
          <el-button type="primary" @click.stop="examine">编辑站内信</el-button>
        </el-form-item>
      </el-form>
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
          <template #default="scope" v-if="item.prop === 'applyStatus'">
              {{applyStatusObj[scope.row.applyStatus]}}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click.stop="detail(scope.row)">
                查看详情
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
            v-if="state.showForm"
            :disabled="state.disabled"
            v-model:formConfig="state.formConfig"
            :showBtn="state.showBtn"
            @handle="postFormData"
            @dialogClose="closeDialog"
          ></formConpoent>
          <examineFormConpoent
            v-if="state.showExamineForm"
            @handle="postFormData"
            :status="state.formConfig.status"
            @dialogClose="closeDialog"
          ></examineFormConpoent>
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
  import examineFormConpoent from "@/components/form/examineForm.vue";
  import {
    messageList,
    messageInsertBatch,
    entInfoAll
  } from "@/config/api";
  import { ElMessage, ElMessageBox } from "element-plus";
  // import { formConfigItem } from "@/utils/interface";
  import { deleteItem, post } from "@/utils/request";
  import { fa } from "element-plus/es/locale";
  export default {
    name: "sensitive-manage",
    data() {
      return {
        applyStatusObj: {
          0: '未审核',
          1: '审核中',
          2: '审核通过',
          3: '审核未通过'
        },
        tableHeaderConfig: [
            {
                prop: "companyName",
                label: "企业名称"
            },
            {
                prop: "messageContent",
                label: "消息内容"
            },
            // {
            //     prop: "messageType",
            //     label: "消息类别"
            // },
            {
                prop: "messageTime",
                label: "推送时间"
            }
        ],
      };
    },
  };
  </script>
  <script lang="ts" setup>
  interface formConfigItem {
    prop: string;
    label: string;
    required?: boolean;
    showInput?: boolean;
    showDatePicker?: boolean;
    upload?: boolean;
    uploadType?: string;
    disabled?: boolean;
    showTextarea?: boolean;
  }
  const formConfig: formConfigItem[] = [
    {
      prop: "companyName",
      label: "企业名称",
      required: true,
      showSelect: true,
    },
    {
      prop: "messageContent",
      label: "消息内容",
      required: true,
      showTextarea: true
    },
  ];
  const state = reactive({
    currentPage: 0,
    pageSize: 10,
    formConfig: formConfig,
    tableData: [],
    total: 0,
    showBtn: false,
    companyName: '',
    messageContent: '',
    sensitiveword: "",
    dialogVisible: false,
    showForm: false,
    showExamineForm: false,
    isResume: false,
    disabled: true
  });
  
  let currentRoleId = ref<string>("");
  const title = ref<string>("添加");
  // 提交
  const onSubmit = (val) => {
    getmessageList();
  };
  // 重置
  const onClear = (val) => {
    state.messageContent = '';
    state.companyName = '';
    getmessageList();
  };
  // 发送
  const examine = () => {
    post(`${entInfoAll}`, {
        attestationStatus: 1
    }).then(function (data) {
        formConfig[0].options = data.list.map(e => {
            return {
                label: e.entName,
                value: e.entId
            }
        });
        state.dialogVisible = true;
        state.showForm = true;
        state.disabled = false;
        state.formConfig = formConfig;
        state.showBtn = true;
    });
  };

  /**
 * 提交表单数据
 */
const postFormData = (formData) => {
    post(`${messageInsertBatch}`, {
        companyids: [formData.companyids],
        messageContent: formData.messageContent
    })
    .then(function (data) {
        state.dialogVisible = false;
        state.showForm = false;
    });
};
  /**
   * 表单详情
   */
  const detail = (row) => {
    title.value = "查看详情";
    state.dialogVisible = true;
    state.showForm = true;
    state.showBtn = false;
    state.formConfig = state.formConfig
      .map((e, b) => {
        // value 替换成 e.prop
        let result = { ...e };
        result[e.prop] = row[e.prop];
        return result;
      })
      .splice(0);
  };
  
  // todo 改写法
  const closeDialog = async (done: () => void) => {
    state.dialogVisible = false;
    state.showExamineForm = false;
    state.showForm = false;
  };
  
  //  文章内容列表
  const getmessageList = () => {
    post(`${messageList}`, {
      pageNum: state.currentPage,
      pageSize: state.pageSize,
      messageContent: state.messageContent,
      companyName: state.companyName
    }).then(function (data) {
      state.tableData = data.list;
      state.total = data.total;
    });
  };
  getmessageList();
  
  // 切换每页显示数
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
    state.pageSize = val;
    getmessageList();
  };
  
  // 换页数
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
    state.currentPage = val;
    getmessageList();
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
        deleteItem(`${businessApplyDelete}`, {
          data: [row.id],
        }).then(function (data) {
          getmessageList();
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
  