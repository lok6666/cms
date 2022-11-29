<template>
  <u-container-layout>
    <div class="inline-edit-table">
      企业用户
      <el-table
        :data="businessUse"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column prop="id" width="60" label="id" />
        <el-table-column prop="name" label="姓名" min-width="200px">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <div style="display: flex; align-items: center">
                <el-input v-model="scope.row.name" size="small" />
                <el-button
                  size="small"
                  icon="Refresh"
                  type="warning"
                  @click.stop="cancelEdit(scope.row)"
                >
                  取消
                </el-button>
              </div>
            </template>
            <template v-else>{{ scope.row.name }}</template>
          </template>
        </el-table-column>
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
              @click.stop="scope.row.edit = !scope.row.edit"
            >
              编辑
            </el-button>

            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click.stop="deleteAction(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
  </u-container-layout>
</template>
<script lang="ts">
export default { name: "inline-table" };
</script>
<script lang="ts" setup >
import { computed, ref, reactive, onMounted } from "vue";
import { roleResourceList } from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
let businessUse = ref([]);
import { get, post } from "@/utils/request";
post(`${roleResourceList}`, {
  pageSize: 5,
  pageNum: 1,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
}).then(function ({list}) {
  console.log("data", list);
  businessUse.value = list;
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
