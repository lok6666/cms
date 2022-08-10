<template>
  <u-container-layout>
    <div class="inline-edit-table">
      账户管理
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="add"
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="picture" label="头像">
          <template #default="scope">
            <img v-if="scope.row.picture" :src="scope.row.picture" alt=""  style="width: 50px; height: 50px;"/>
          </template>
        </el-table-column>
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
              @click="confirmEdit(scope.row)"
            >
              保存
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
              @click="del(scope.row)"
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
        layout="prev, pager, next, jumper"
        :total="1000"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog
        v-model="dialogVisible"
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
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="职务" prop="type">
            <el-input v-model="ruleForm.type" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input v-model="ruleForm.role" />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="ruleForm.phone" />
          </el-form-item>
          <el-form-item label="头像" prop="picture">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleClose(ruleFormRef)"
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
<script lang="ts" setup >
import { computed, ref, reactive, onMounted } from "vue";
import TwoPng from "@/assets/image/im1.jpeg";
import UUpload from "../components-demo/form/u-upload.vue";
import {
  sysUserSelectAll,
  sysUserAddOne,
  sysUserDeleteOne,
  sysUserUpdateOne,
} from "@/config/api";
import { ElMessage, ElMessageBox, UploadProps } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import { get, post } from "@/utils/request";
import formData from "form-data";

const formItem:[] = [];
let businessUseList = ref([]);
let currentPage = ref(1);
let pageSize = ref(10);
const ruleFormRef = ref();
const rowObj = ref({});
const formData1 = ref(new formData());
const file = ref({
  url: "",
});
const dialogVisible = ref(false);
const title = ref("新增");
const baseData = {
  name: "",
  username: "",
  password: "",
  role: "",
  phone: "",
  picture: "" || "https://www.baidu.com/img/flexible/logo/pc/result.png",
  type: "",
  id: "",
};
let ruleForm = ref(baseData);

const getSysUserSelectAll = () => {
post(`${sysUserSelectAll}`, {
    pageSize: pageSize.value,
    pageNum: currentPage.value,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  }).then(function ({ list }) {
    console.log("data", list);
    businessUseList.value = list;
  });
};
getSysUserSelectAll();
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
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
          data: data,
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
const closeDialog = async (done: () => void) => {
  ruleForm.value.name = "";
  ruleForm.value.username = "";
  ruleForm.value.password = "";
  ruleForm.value.role = "";
  ruleForm.value.phone = "";
  ruleForm.value.picture = "";
  ruleForm.value.type = "";
  ruleForm.value.id = "";
};
// 添加
const add = () => {
  title.value = "新增";
  dialogVisible.value = true;
  ruleForm.value = baseData;
};

// 编辑
const edit = (row) => {
  title.value = "编辑";
  rowObj.value = row;
  dialogVisible.value = true;
  ruleForm.value.name = row.name;
  ruleForm.value.username = row.username;
  ruleForm.value.password = row.password;
  ruleForm.value.role = row.role;
  ruleForm.value.phone = row.phone;
  ruleForm.value.picture = row.picture;
  ruleForm.value.type = row.type;
  ruleForm.value.id = row.id;
};

// 关闭弹窗
const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      let obj = {
        ...ruleForm.value,
      };
      if (title.value === "新增") {
        post(`${sysUserAddOne}`, {
          ...obj,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
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
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        })
          .then(function (data) {
            businessUseList.value.forEach((item) => {
              if (item.id === data.id) {
                item.password = obj.password;
                item.username = obj.username;
                item.type = obj.type;
                item.name = obj.name;
                item.role = obj.role;
                item.phone = obj.phone;
              }
            });
          })
          .catch((e) => {
            console.log("e", e);
          });
      }
      dialogVisible.value = false;
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
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
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
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
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
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
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
