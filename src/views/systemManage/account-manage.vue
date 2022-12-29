<template>
  <u-container-layout>
    <div class="inline-edit-table">
      账户管理
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click.stop="add"
          ><el-icon><plus /></el-icon> 添加</el-button
        >
      </div>
      <el-table
        :data="businessUseList"
        @selection-change="selectionChange"
        header-align="center"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column width="100" label="序号" type="index"/>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="type" label="职务" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column prop="phone" label="手机" />
        <el-table-column prop="loginSum" label="登录次数" />
        <el-table-column prop="lastLoginTime" label="最后登录时间" />
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
              @click.stop="confirmEdit(scope.row)"
            >
              保存
            </el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Edit"
              @click.stop="edit(scope.row)"
            >
              编辑
            </el-button>

            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click.stop="del(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totaL"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="80%"
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
          <el-form-item label="用户名" prop="username"  :rules="[
                {
                  validator: (rule, value, callback) => {
                    if (/^(?![a-zA-Z0-9_])/.test(value)) {
                      callback('不能以特殊符号开头');
                    } else {
                      callback();
                    }
                  },
                  trigger: ['blur', 'change'],
                },
              ]">
            <el-input :disabled="formDisabled" v-model="ruleForm.username"
            />
          </el-form-item>
           <el-form-item label="密码" prop="password" >
            <el-input type="password" v-model="ruleForm.password" :disabled="formDisabled"/>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="职务" prop="type">
            <el-input v-model="ruleForm.type" />
          </el-form-item>
          <el-form-item label="角色" prop="roleName">
            <el-select v-model="ruleForm.roleName" class="col" size="small" placeholder="选择角色">
              <el-option v-for="i in roleOptions" :key="i.value" :label="i.label" :value="i.value"/>
            </el-select>
            <!-- <el-input v-model="ruleForm.roleName" /> -->
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="ruleForm.phone" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click.stop="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.stop="handleClose(ruleFormRef)"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </u-container-layout>
</template>
<script lang="ts">
export default { name: "inline-table" };
</script>
<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from "vue";
import TwoPng from "@/assets/image/im1.jpeg";
import UUpload from "../components-demo/form/u-upload.vue";
import {
  sysUserSelectAll,
  sysUserAddOne,
  sysUserDeleteOne,
  sysUserUpdateOne,
  upLoad,
} from "@/config/api";
import { ElMessage, ElMessageBox, UploadProps } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import { get, post } from "@/utils/request";
import formData from "form-data";

let businessUseList = ref([]);
let currentPage = ref(1);
let pageSize = ref(10);
let totaL = ref(10);
const ruleFormRef = ref();
const passwordDisabled = ref<Boolean>(false);
const roleOptions = ref<[]>([]);
const rowObj = ref({});
const dialogVisible = ref(false);
const title = ref("添加");
const baseData = {
  name: "",
  username: "",
  password: "",
  roleName: "",
  phone: "",
  picture: "" || "https://www.baidu.com/img/flexible/logo/pc/result.png",
  type: "",
  id: "",
};
let ruleForm = ref(baseData);
const formDisabled = ref(false);
const getSysUserSelectAll = () => {
  post(`${sysUserSelectAll}`, {
    pageSize: pageSize.value,
    pageNum: currentPage.value,
  }).then(function ({ list,total }) {
    businessUseList.value = list;
    totaL.value = total;
  });
};
getSysUserSelectAll();
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  var axios = require("axios");
  var FormData = require("form-data");
  var data = new FormData();
  data.append("file", rawFile); // file 即选中的文件
  data.append("userId", 1);
  data.append("type", "image");
  var config = {
    method: "post",
    url: `${upLoad}`, //上传图片地址
    type: "image",
    data,
  };

  axios.defaults.crossDomain = true;
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios(config)
    .then(function (res) {
      ruleForm.value.picture = res;
      // getSysUserSelectAll();
    })
    .catch(function (error) {
      console.log(error);
    });
};

// todo 改写法
const closeDialog = (): void => {
  ruleForm.value.name = "";
  ruleForm.value.username = "";
  ruleForm.value.password = "";
  ruleForm.value.roleName = "";
  ruleForm.value.phone = "";
  ruleForm.value.picture = "";
  ruleForm.value.type = "";
  ruleForm.value.id = "";
};
// 添加
const add = (): void => {
  title.value = "添加";
  roleOptions.value = businessUseList.value.map(e => {
    return {
      label: e.roleName,
      value: e.roleName
    }
  });
  formDisabled.value = false;
  dialogVisible.value = true;
  ruleForm.value = baseData;
};

// 编辑
const edit = (row): void => {
  formDisabled.value = true;
  title.value = "编辑";
  rowObj.value = row;
  ruleForm.value.name = row.name;
  ruleForm.value.username = row.username;
  ruleForm.value.password = row.password;
  roleOptions.value = businessUseList.value.map(e => {
    return {
      label: e.roleName,
      value: e.roleName
    }
  });
  ruleForm.value.roleName = row.roleName;
  ruleForm.value.phone = row.phone;
  ruleForm.value.picture = row.picture;
  ruleForm.value.type = row.type;
  ruleForm.value.id = row.id;
  passwordDisabled.value = true;
  dialogVisible.value = true;
};

// 关闭弹窗
const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      let obj = {
        ...ruleForm.value,
      };
      if (title.value === "添加") {
        post(`${sysUserAddOne}`, {
          ...obj,
        })
          .then(function (data) {
            businessUseList.value = [data, ...businessUseList.value];
          })
          .catch((e) => {
            console.log("e", e);
          });
        ElMessage.success("添加成功");
      } else {
        post(`${sysUserUpdateOne}`, {
          ...obj,
        })
          .then(function (data) {
            businessUseList.value.forEach((item) => {
              if (item.id === data.id) {
                item.password = obj.password;
                item.username = obj.username;
                item.type = obj.type;
                item.name = obj.name;
                item.roleName = obj.roleName;
                item.phone = obj.phone;
              }
            });
          })
          .catch((e) => {
            console.log("e", e);
          });
      }
      dialogVisible.value = false;
      formDisabled.value = false;
      console.log("submit!", obj);
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 删除
const del = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      businessUseList.value = businessUseList.value.filter(
        (item) => item.id !== row.id
      );
      get(`${sysUserDeleteOne}`, {
        id: row.id,
      })
        .then(function (data) {
          console.log("data", data);
        })
        .catch((e) => {
          console.log("e", e);
        });
      ElMessage.success("删除成功");
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 500);
    })
    .catch(() => {});
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  post(`${sysUserSelectAll}`, {
    pageSize: pageSize.value,
    pageNum: currentPage.value,
  }).then(function ({ list }) {
    console.log("data", list);
    businessUseList.value = list;
  });
};
const handleCurrentChange = (val) => {
  currentPage.value = val;
  post(`${sysUserSelectAll}`, {
    pageSize: pageSize.value,
    pageNum: currentPage.value,
  }).then(function ({ list }) {
    console.log("data", list);
    businessUseList.value = list;
  });
};
</script>
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
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
