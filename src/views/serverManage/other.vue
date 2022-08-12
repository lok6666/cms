<template>
  <u-container-layout>
    <el-form :inline="true" :model="state" class="demo-form-inline">
      <el-form-item label="资金名称">
        <el-input v-model="state.name" placeholder="请输入资金名称" />
      </el-form-item>
      <el-form-item label="企业名称">
          <el-input v-model="state.username" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click="getotherAll">查询</el-button>
      </el-form-item>
    </el-form>
    
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
            <el-button type="primary" size="small"  @click="edit(scope.row)">编辑</el-button>
            <el-button type="success" size="small"  @click="edit(scope.row)">审批</el-button>
            <el-button type="info" size="small"  @click="deleteAction(scope.row)">删除</el-button>
            <el-button type="warning" size="small"  @click="upItem(scope.row)">上架</el-button>
            <el-button type="danger" size="small"  @click="downItem(scope.row)">下架</el-button>
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
import { otherAll, otherUpdateOne, otherDeleteOne } from "@/config/api";
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
          prop: "sername",
          label: "服务名称",
        },
        {
          prop: "picture",
          label: "缩略图",
          showImg: true
        },
        {
          prop: "sertype",
          label: "服务类别",
        },
        {
          prop: "sercompany",
          label: "会员单位",
        },
        {
          prop: "",
          label: "审核状态",
        },
        {
          prop: "",
          label: "状态",
        },
        {
          prop: "storgetime",
          label: "创建日期",
        }
      ],
    };
  },
};
</script>
<script lang="ts" setup >
const formConfig = [
  {
    prop: "sername",
    label: "服务名称",
    showInput: true
  }, {
    prop: "sertype",
    label: "服务类型",
    showInput: true
  }, {
    prop: "sercompany",
    label: "会员单位",
    showInput: true
  }, {
    prop: "serperson",
    label: "负责人",
    showInput: true
  }, {
    prop: "sercontact",
    label: "联系方式",
    showInput: true
  }, {
    // todo 封装审批
    // todo 富文本编辑
    prop: "sersynopsis",
    label: "服务简介",
    showWangEditor: true
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
  tableData: [{
      address: "测试地点",
      companyicon: "/asset/mxupload/up0642170001558080624.png",
      files: [],
      id: 36,
      images: [],
      pageNum: 0,
      pageSize: 0,
      sercompany: "北京文投大数据有限公司",
      sercompanyId: "62",
      sercompanyid: "62",
      sercontact: "2",
      sermsg: "",
      sername: "知识产权咨询",
      serperson: "1",
      serstatus: "1",
      sersxj: "0",
      sersynopsis: "<p style=\"line-height: normal;\"><strong><span style=\"font-family: simsun, serif; font-size: 18px; white-space: pre-wrap;\">提供免</span><span style=\"font-family: simsun, serif; font-size: 18px; white-space: pre-wrap;\">费的专利、商标、软件著作权等确权、用权、维权咨询服务；专利、商标、软件著作权代理，以及知识产权贯标等由联盟机构提供服务，协议企业享20%优惠。。</span><span style=\"font-family: simsun, serif; font-size: 14px; white-space: pre-wrap;\">。。</span></strong></p>",
      serthumbnail: "/images/82cfb5dc3a40411798baeb2915b1bd1c.jpg",
      sertype: "知识产权服务",
      storgetime: "2022-03-25 17:22:18"
    }],
  optionsList: [],
  levelOptions: [],
});
const title = ref("新增");

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  post(`${otherUpdateOne}`, {
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
  state.dialogVisible = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
  console.log("state.formConfig", state.formConfig);
};

/**
 * 删除
 */
const deleteAction = (row) => {
ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${otherDeleteOne}`, [row.id]).then(function (data) {
        getotherAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 * 上架
 */
const upItem = (row) => {
ElMessageBox.confirm("你确定要上架当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${otherDeleteOne}`, {id: row.id, sersxj: 0}).then(function (data) {
        getotherAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 * 下架
 */
const downItem = (row) => {
ElMessageBox.confirm("你确定要上架当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${otherDeleteOne}`, {id: row.id, sersxj: 1}).then(function (data) {
        getotherAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 *  获取表格数据
 */
const getotherAll = () => {
  post(`${otherAll}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    name: state.name,
    username: state.username
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getotherAll();

/**
 * 选择文化领域
 */
const chooseCulture = (val) => {
  console.log("val", val);
  state.culName = val;
  // getotherAll();
};

/**
 * 切换每页显示数
 */
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getotherAll({ title: formInline.title });
};

/**
 * 跳转xx页
 */
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getotherAll({ title: formInline.title });
};
const loading = ref(false);

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
