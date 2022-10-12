<template>
  <u-container-layout>
    <div class="inline-edit-table">
      角色管理
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="add"
          ><el-icon><plus /></el-icon> 添加</el-button
        >
      </div>
      <el-table
        :data="roleList"
        header-align="center"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号"/>
        <el-table-column prop="roleId" label="角色编码"/>
        <el-table-column prop="roleName" label="角色名称"/>
        <el-table-column prop="roleCreateTime" label="创建日期"/>
        <el-table-column prop="roleUpdateTime" label="修改日期"/>
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
      <el-dialog v-model="dialogVisible" :title="title" @closed="closeDialog()">
        <el-form :model="formInline">
          <el-form-item label="标题" width="100%">
            <el-input v-model="formInline.username" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item>
            <el-tree
              :data="treeTable"
              :props="props"
              show-checkbox
              node-key="id"
              :check-strictly="true"
              @check-change="handleCheckChange"
              default-expand-all
              :default-checked-keys="defaultCheckedKeys"
            />
          </el-form-item>
        </el-form> 
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelBtn()">取消</el-button>
            <el-button type="primary" @click="handleClose()"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    </div>
  </u-container-layout>
</template>
<script lang="ts">
export default { name: "inline-table" };
</script>
<script lang="ts" setup >
import { computed, ref, reactive, onMounted } from "vue";
import { sysRoleList, sysRoleParent, sysRoleUpdate, sysRoleDelete, sysRoleInsert } from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { get, post, deleteItem } from "@/utils/request";
interface Tree {
  name: string
}
const props = {
  label: 'title',
  children: 'children'
}
const formInline = ref({
  username: ""
});
const state = reactive({
  updateList: []
});
const defaultCheckedKeys = ref([]);
// const state.updateList =  ref([]);
let roleList = ref([]);
let currentRoleId = ref('');
let roleName = ref('');
const treeTable = ref([]);
let currentPage = ref(1);
let pageSize = ref(10);
const dialogVisible = ref(false);
const title = ref("新增");

// 获取列表
const getSysRoleList = () => {
  post(`${sysRoleList}`, {
    pageSize: 5,
    pageNum: 1
  }).then(function ({list}) {
    roleList.value = list;
  });
};
getSysRoleList();

const add = () => {
  title.value = "新增";
  dialogVisible.value = true;
  post(`${sysRoleParent}`, {
  }).then(function (data) {
    treeTable.value = data.parent;
    defaultCheckedKeys.value = [];
    state.updateList = data.children.map(el => {
      return {id: el.resourceId, title: el.title};
    });
  });
};
const handleCheckChange = (
  data: Tree,
  checked: boolean,
  indeterminate: boolean
) => {
  if(checked) {
     defaultCheckedKeys.value.push(data.id);
     state.updateList.push({id: data.id, title: data.title});
  }
  else {
    defaultCheckedKeys.value = defaultCheckedKeys.value.filter(id => {
      return id !== data.id;
    });
    state.updateList = state.updateList.filter(e => {
      return e.id !== data.id;
    });
  };
}

// 编辑
const edit = (row) => {
  dialogVisible.value = true;
  currentRoleId.value = row.roleId;
  formInline.value = {username: row.roleName};
  roleName.value = row.roleName;
  title.value = '编辑';
  post(`${sysRoleParent}`, {
    roleId: row.roleId
  }).then(function (data) {
    treeTable.value = data.parent;
    defaultCheckedKeys.value = data.children.map(el => el.resourceId);
    state.updateList = data.children.map(el => {
      return {id: el.resourceId, title: el.title};
    });
  });
};

const cancelBtn = async (done: () => void) => {
  dialogVisible.value = false;
  
};

const closeDialog = async (done: () => void) => {
  state.updateList = [];
};

// 关闭弹窗
const handleClose = async (done: () => void) => {
  dialogVisible.value = false;
  if(title.value === '新增') {
      post(`${sysRoleInsert}`, {
        roleName: formInline.value.username,
        tree: state.updateList
      }).then(function (data) {
        getSysRoleList();
      });
  } else {
    post(`${sysRoleUpdate}`, {
      roleId: currentRoleId.value,
      roleName: formInline.value.username || roleName.value,
      tree: state.updateList
    }).then(function (data) {
      getSysRoleList();
    });
    state.updateList = [];
  }
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
      deleteItem(`${sysRoleDelete}`, {
          data: [
            row.roleId
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
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  pageSize.value = val;
  post(`${sysRoleList}`, {
    pageNum: currentPage.value,
    pageSize: pageSize.value
  }).then(function (data) {
    console.log("tableData-----", data);
    roleList.value = data.list;
  });
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  post(`${sysRoleList}`, {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    articletype: "5"
  }).then(function (data) {
    console.log("tableData-----", data);
    roleList.value = data.list;;
  });
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
