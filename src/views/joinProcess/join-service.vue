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
         <img
            v-if="item.showImg"
            :src="item[item.prop]"
            style="width: 50px; height: 50px"
          />
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="detail(scope.row)">
              查看详情
            </el-button>
            <el-button type="primary" size="small" @click="qr(scope.row)">
              确认金额
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
          title="项目"
          :showBtn="false"
          @dialogClose="closeDialog"
        ></formConpoent>
         <formConpoent
          title="产品"
          :showBtn="false"
          v-model:formConfig="state.form2Config"
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
import { fundAll, fundUpdateOne } from "@/config/api";
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
          prop: "dockcompany",
          label: "申请服务企业",
        },
        {
          prop: "",
          label: "服务名称",
        },
        {
          prop: "",
          label: "服务类别",
        },
        {
          prop: "",
          label: "提供服务企业",
        },
        {
          prop: "",
          label: "对接待确认",
        },
        {
          prop: "docktime",
          label: "时间",
        }
      ],
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "",
    label: "服务名称",
    showInput: true,
    disabled: true
  }, {
    prop: "",
    label: "服务类型",
    showInput: true,
    disabled: true
  }, {
    prop: "",
    label: "服务简介",
    showInput: true,
    disabled: true
  }, {
    prop: "",
    label: "项目负责人",
    showInput: true,
    disabled: true
  }, {
    prop: "",
    label: "联系电话",
    showInput: true,
    disabled: true
  }, {
    prop: "intro",
    label: "项目简介",
    showInput: true,
    disabled: true
  }
];
const form2Config = [
  {
    prop: "dockcompany",
    label: "企业名称",
    showInput: true,
    disabled: true
  }, {
    prop: "dockps",
    label: "备注",
    showInput: true,
    disabled: true
  }, {
    prop: "docktime",
    label: "申请日期",
    showInput: true,
    disabled: true
  }, {
    prop: "dockperson",
    label: "负责人",
    showInput: true,
    disabled: true
  }, {
    prop: "dockcontact",
    label: "联系电话",
    showInput: true,
    disabled: true
  }
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: '',
  username: '',
  culName: "",
  formConfig: formConfig,
  form2Config: form2Config,
  tableData: [
    {
      dockcompany: "北京市文化投资发展集团有限责任公司",
      dockcompanyid: 1,
      dockcontact: "18322223726",
      dockdetail: "",
      dockperson: "朱先生",
      dockps: "测试对接",
      dockstatus: "1",
      docktime: "2022-03-18 15:16:38",
      files: [],
      id: 48,
      images: [],
      pageNum: 0,
      pageSize: 0,
      sercompany: "",
      sercompanyid: 0,
      sercontact: "",
      serid: 18,
      sername: "",
      serperson: "",
      sersynopsis: "",
      sertype: ""
    },
  ],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
};

/**
 * 编辑表单
 */
const detail = (row) => {
  title.value = "查看详情";
  state.dialogVisible = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
  state.form2Config = state.form2Config
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
  console.log("state.formConfig", state);
};

/**
 *  获取表格数据
 */
const getfundAll = () => {
  post(`${fundAll}`, {
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
getfundAll();


/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getfundAll({ title: formInline.title });
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getfundAll({ title: formInline.title });
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
