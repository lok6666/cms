<template>
  <u-container-layout>
    <div class="inline-edit-table">
      系统日志
      <el-table
        :data="businessUseList"
        header-align="center"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="资源名称"/>
        <el-table-column prop="storagetime" label="操作时间"/>
        <el-table-column prop="operation" label="操作内容"/>
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
              @click="scope.row.edit = !scope.row.edit"
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
    </div>
  </u-container-layout>
</template>
<script lang="ts">
export default { name: "inline-table" };
</script>
<script lang="ts" setup >
import { computed, ref, reactive, onMounted } from "vue";
import { sysLogSelectAll } from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { get, post } from "@/utils/request";
let businessUseList = ref([]);
const currentPage = ref(5)
const pageSize = ref(100)

post(`${sysLogSelectAll}`, {
  pageSize: 5,
  pageNum: 1
}).then(function ({list}) {
  console.log("data", list);
  businessUseList.value = list;
});
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
