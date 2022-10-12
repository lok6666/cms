<template>
  <u-container-layout>
    <div class="inline-edit-table">
      资源管理
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="add"
          ><el-icon><plus /></el-icon> 添加</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :border="true"
        default-expand-all
      >
        <el-table-column prop="title" label="资源名称" sortable  />
        <el-table-column
          prop="resourceId"
          label="资源编码"
          sortable  
        />
        <el-table-column
          prop="parentId"
          label="父资源编码"
          sortable
        />
        <el-table-column prop="href" label="资源链接" sortable  />
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
              @click="deleteAction(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-dialog v-model="dialogVisible" :title="title" width="50%" @closed="closeDialog()">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
        >
          <el-form-item label="资源名称" prop="title">
            <el-input v-model="ruleForm.title" />
          </el-form-item>
          <el-form-item label="父资源编码" prop="parentId">
            <el-input v-model="ruleForm.parentId" />
          </el-form-item>
          <!-- <el-form-item label="资源编码" prop="resourceId">
            <el-input v-model="ruleForm.resourceId" />
          </el-form-item> -->
          <el-form-item label="资源链接" prop="href">
            <el-input v-model="ruleForm.href" />
          </el-form-item>
          <!-- <el-form-item label="资源图标" prop="icon">
            <el-input v-model="ruleForm.icon　" />
          </el-form-item> -->
          <!-- <el-form-item label="跳转方式" prop="target">
            <el-input v-model="ruleForm.target" />
          </el-form-item> -->
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
import { sysResourceList, treeTable, sysResourceInsert, sysResourceUpdate, sysResourceDelete } from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { get, post, deleteItem } from "@/utils/request";
let tableData = ref([]);
const ruleFormRef = ref();
const dialogVisible = ref(false);
const title = ref("新增");
const baseData = {
  name: "",
  username: "",
  password: "",
  role: "",
  phone: "",
  href: "",
  picture: "" || 'https://www.baidu.com/img/flexible/logo/pc/result.png',
  type: "",
  id: "",
};
let ruleForm = ref(baseData);

const getTree = () => {
  get(`${treeTable}`, {
    url: `${treeTable}`
  }).then(function (data) {
    tableData.value = data;
    console.log('data--', data);
  });
};
getTree();
let businessUseList = ref([]);
const currentPage = ref(5)
const pageSize = ref(100)

// post(`${sysResourceList}`, {
//   pageSize: 5,
//   pageNum: 1,
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Content-Type": "application/json",
//   },
// }).then(function ({list}) {
//   console.log("data", list);
//   businessUseList.value = list;
// });

// 关闭弹窗
const handleClose = async (done: () => void) => {
  dialogVisible.value = false;
  if(title.value === '新增') {
      post(`${sysResourceInsert}`, {
        ...ruleForm.value
      }).then(function (data) {
        getTree();
      });
  } else {
    post(`${sysResourceUpdate}`, {
      ...ruleForm.value
    }).then(function (data) {
      getTree();
    });
  }
};

// 添加
const add = () => {
  title.value = "新增";
  dialogVisible.value = true;
  ruleForm.value = baseData;
};
//  删除
const deleteAction = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${sysResourceDelete}`, {
          data: [
            row.resourceId
          ]
      })
      .then(function (data) {
        console.log('data', data);
      })
      .catch((e) => {
        console.log("e", e);
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};
// todo 改写法
const closeDialog = async (done: () => void) => {
  ruleForm.value.title = '';
  ruleForm.value.parentId = '';
  ruleForm.value.resourceId = '';
  ruleForm.value.icon = '';
  ruleForm.value.target = '';
  ruleForm.value.href = '';
};
const edit = (row) => {
  title.value = "编辑";
  dialogVisible.value = true;
  console.log('row--', row);
  ruleForm.value.title = row.title;
  ruleForm.value.parentId = row.parentId;
  ruleForm.value.resourceId = row.resourceId;
  ruleForm.value.icon = row.icon;
  ruleForm.value.target = row.target;
  ruleForm.value.href = row.href;
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
