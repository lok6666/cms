<template>
    <u-container-layout>
      <div class="inline-edit-table">
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
          <template #default="scope" v-if="item.prop === 'entScale'">
              {{busStatusObj[scope.row.entScale]}}
          </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="detail(scope.row)">
                查看详情
              </el-button>
              <el-button type="primary" size="small" @click="examine(scope.row)" :disabled="[scope.row.applyStatus !== 0]">
                审核
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
    entInfoAll,
    entApplAddOne,
    entApplyUpdateOne,
    entApplyDelete,
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
        busStatusObj: {
          1: '特大',
          2: '大',
          3: '中',
          4: '小',
          5: '微'
        },
        tableHeaderConfig: [
  {
      prop: "entName",
      label: "企业名称",
      required: true,
      showInput: true
  },
  {
    prop: "entCode",
    label: "统一社会信用代码",
    showInput: true,
    required: true,
    code: 10000
  },
  {
    prop: "contactsPerson",
    label: "联系人",
    required: true,
    showInput: true,
  },
  {
      prop: "contactsPhone",
      label: "联系人电话",
      required: true,
      showInput: true,
      telPhone: '17732336725'
  },
  {
    prop: "officeAddress",
    label: "办公地址",
    showInput: true
  },
  {
    prop: "insuredNum",
    label: "参保人数",
    required: false,
    showInput: true
  },
  {
    prop: "businessArea",
    label: "业务领域",
    options: [
      {
        label: '数字创意',
        value: '数字创意'
      },
      {
        label: '文化旅游',
        value: '文化旅游'
      },
      {
        label: '高精尖产业',
        value: '高精尖产业'
      },
      {
        label: '现代服务业',
        value: '现代服务业'
      },
      {
        label: '商贸流通业',
        value: '商贸流通业'
      },
      {
        label: '企业服务',
        value: '企业服务'
      },
      {
        label: '其他',
        value: '其他'
      }
    ],
    showSelect: true,
  },
  {
    prop: "honorsQualification",
    label: "企业资质",
    options: [
      {
        label: '中关村高新企业',
        value: '中关村高新企业'
      },{
        label: '双软认证企业',
        value: '双软认证企业'
      },{
        label: '专精特新企业',
        value: '专精特新企业'
      },{
        label: '专精特新小巨人企业',
        value: '专精特新小巨人企业'
      },{
        label: '科技小巨人企业',
        value: '科技小巨人企业'
      },{
        label: '瞪羚企业',
        value: '瞪羚企业'
      },{
        label: '科技型中小企业',
        value: '科技型中小企业'
      },{
        label: '展翼企业',
        value: '展翼企业'
      },{
        label: '隐形冠军企业',
        value: '隐形冠军企业'
      },{
        label: '技术先进型服务企业',
        value: '技术先进型服务企业'
      },{
        label: '牛羚企业',
        value: '牛羚企业'
      },{
        label: '独角兽企业',
        value: '独角兽企业'
      },{
        label: '创新型企业',
        value: '创新型企业'
      },{
        label: '民营科技企业',
        value: '民营科技企业'
      }
    ], 
    showSelect: true,
  },
  {
    prop: "entScale",
    label: "企业规模",
    options: [
      {
        label: '特大',
        value: '1'
      },
      {
        label: '大',
        value: '2'
      },
      {
        label: '中',
        value: '3'
      },
      {
        label: '小',
        value: '4'
      },
      {
        label: '微',
        value: '5'
      }
    ],
    showSelect: true,
  }]
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
      prop: "entName",
      label: "企业名称",
      required: true,
      showInput: true
  },
  {
    prop: "entCode",
    label: "统一社会信用代码",
    showInput: true,
    required: true,
    code: 10000
  },
  {
    prop: "contactsPerson",
    label: "联系人",
    required: true,
    showInput: true,
  },
  {
      prop: "contactsPhone",
      label: "联系人电话",
      required: true,
      showInput: true,
      telPhone: '17732336725'
  },
  {
    prop: "officeAddress",
    label: "办公地址",
    showInput: true
  },
  {
    prop: "insuredNum",
    label: "参保人数",
    required: false,
    showInput: true
  },
  {
    prop: "businessArea",
    label: "业务领域",
    options: [
      {
        label: '数字创意',
        value: '数字创意'
      },
      {
        label: '文化旅游',
        value: '文化旅游'
      },
      {
        label: '高精尖产业',
        value: '高精尖产业'
      },
      {
        label: '现代服务业',
        value: '现代服务业'
      },
      {
        label: '商贸流通业',
        value: '商贸流通业'
      },
      {
        label: '企业服务',
        value: '企业服务'
      },
      {
        label: '其他',
        value: '其他'
      }
    ],
    showSelect: true,
  },
  {
    prop: "honorsQualification",
    label: "企业资质",
    options: [
      {
        label: '中关村高新企业',
        value: '中关村高新企业'
      },{
        label: '双软认证企业',
        value: '双软认证企业'
      },{
        label: '专精特新企业',
        value: '专精特新企业'
      },{
        label: '专精特新小巨人企业',
        value: '专精特新小巨人企业'
      },{
        label: '科技小巨人企业',
        value: '科技小巨人企业'
      },{
        label: '瞪羚企业',
        value: '瞪羚企业'
      },{
        label: '科技型中小企业',
        value: '科技型中小企业'
      },{
        label: '展翼企业',
        value: '展翼企业'
      },{
        label: '隐形冠军企业',
        value: '隐形冠军企业'
      },{
        label: '技术先进型服务企业',
        value: '技术先进型服务企业'
      },{
        label: '牛羚企业',
        value: '牛羚企业'
      },{
        label: '独角兽企业',
        value: '独角兽企业'
      },{
        label: '创新型企业',
        value: '创新型企业'
      },{
        label: '民营科技企业',
        value: '民营科技企业'
      }
    ], 
    showSelect: true,
  },
  {
    prop: "entScale",
    label: "企业规模",
    options: [
      {
        label: '特大',
        value: '1'
      },
      {
        label: '大',
        value: '2'
      },
      {
        label: '中',
        value: '3'
      },
      {
        label: '小',
        value: '4'
      },
      {
        label: '微',
        value: '5'
      }
    ],
    showSelect: true,
  }];
  const state = reactive({
    currentPage: 0,
    pageSize: 10,
    formConfig: formConfig,
    tableData: [],
    total: 0,
    sensitiveword: "",
    dialogVisible: false,
    showForm: false,
    showExamineForm: false,
    isResume: false,
    disabled: true
  });
  
  let currentRoleId = ref<string>("");
  const title = ref<string>("新增");
  
  /**
   * 表单详情
   */
  const detail = (row) => {
    title.value = "查看详情";
    state.dialogVisible = true;
    state.showForm = true;
    state.formConfig = state.formConfig
      .map((e, b) => {
        // value 替换成 e.prop
        let result = { ...e };
        result[e.prop] = row[e.prop];
        return result;
      })
      .splice(0);
  };
  
  /**
   * 审核
   */
  const examine = (row) => {
    state.formConfig.status = row.applyStatus;
    currentRoleId.value = row.id;
    state.dialogVisible = true;
    state.showExamineForm = true;
  };
  
  /**
   * 提交表单数据
   */
  const postFormData = (formData) => {
    post(`${entApplyUpdateOne}`, {
      id: currentRoleId.value,
      applyStatus: formData.status
    })
      .then(function (data) {
        getentInfoAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    state.dialogVisible = false;
    state.showExamineForm = false;
  };
  
  // todo 改写法
  const closeDialog = async (done: () => void) => {
    state.dialogVisible = false;
    state.showExamineForm = false;
    state.showForm = false;
  };
  
  //  文章内容列表
  const getentInfoAll = () => {
    post(`${entInfoAll}`, {
      pageNum: state.currentPage,
      pageSize: state.pageSize,
    }).then(function (data) {
      state.tableData = data.list;
      state.total = data.total;
    });
  };
  getentInfoAll();
  
  // 切换每页显示数
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
    state.pageSize = val;
    getentInfoAll();
  };
  
  // 换页数
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
    state.currentPage = val;
    getentInfoAll();
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
          getentInfoAll();
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
  