<template>
  <u-container-layout>
    <div style="display: flex;">
      <div class="custom-tree-container">
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <p style="margin-left: 23px;">菜单管理</p><el-button style="margin-right: 8px;" @click="treeAdd()">添加</el-button>
        </div>
        <el-tree
          :data="dataSource"
          node-key="id"
          default-expand-all
          :default-checked-keys="[1]"
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span v-if="!state.isInput" @click="getNode(data)" @dblclick="(event) =>changeLabel(data, node.label)">{{ node.label }}</span>
              <input v-else :value="node.label"/>
              <span style="margin-left: 10px;">
                <!-- <el-button style="height: 20px;" @click="append(data)"> 添加 </el-button> -->
                <el-button style="margin-left: 8px;height: 20px;" @click="treeDeleteAction(node, data)">删除</el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
      <div style="margin-left: 20px;margin-right: 20px;width: 81%;">
        <el-form :inline="true" :model="state" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" @click.stop="add">
              <el-icon><plus /></el-icon>添加
            </el-button>
          </el-form-item>
        </el-form>
        <div class="inline-edit-table">
          <el-table
            id="my-table"
            :data="state.tableData"
            style="width: 100%"
            :border="true"
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-for="(item, index) in tableHeaderConfig"
              :key="index"
              :show-overflow-tooltip="true"
              sortable
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
            >
              <template #default="scope" v-if="item.prop === 'serviceFlag'">
                {{ serviceFlagstatus[scope.row.serviceFlag] }}
              </template>
              <template #default="scope" v-if="item.prop === 'serviceType'">
                {{ serviceTypetatus[scope.row.serviceType] || "不限" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="operator"
              label="操作"
              width="150"
              fixed="right"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  icon="Edit"
                  @click.stop="edit(scope.row)"
                  >编辑</el-button
                >
                <!-- <el-button type="success" size="small"  @click.stop="edit(scope.row)">审批</el-button> -->
                <el-button
                  type="info"
                  size="small"
                  @click.stop="deleteAction(scope.row)"
                  >删除</el-button
                >
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
              v-if="state.dialogVisible"
              :showBtn="true"
              v-model:formConfig="state.formConfig"
              @handle="postFormData"
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
      </div>
    </div>
  </u-container-layout>
</template>
<script lang="ts">
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import {
  dictionariesList,
  dictionariesGetByCode,
  dictionariesBranchAddOne,
  dictionariesBranchUpdateOne,
  dictionariesBranchDeleteOne,
  dictionariesAddOne,
  dictionariesUpdateOne,
  dictionariesDeleteOne
} from "@/config/api";
import formConpoent from "@/components/form/form.vue";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, deleteItem, post } from "@/utils/request";
import { tr } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      serviceFlagstatus: {
        0: "下架",
        1: "上架",
      },
      serviceTypetatus: {
        0: "知识产权",
        1: "资质认定",
        2: "工商业务",
        3: "财税服务",
        4: "政府补贴",
        5: "数字科技",
        6: "企业服务包",
      },
      tableHeaderConfig: [
/*         {
          prop: "sortNum",
          label: "排序",
        }, */
        {
          prop: "branchCode",
          label: "编号",
        },
        {
          prop: "branchName",
          label: "选项名称",
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup>
const formConfig = [
/*   {
    prop: "sortNum",
    label: "序号",
    required: true,
    showInput: true,
  }, */
  {
    prop: "branchCode",
    label: "编号",
    required: true,
    showInput: true
  },
  {
    prop: "branchName",
    label: "选项名称",
    required: true,
    showInput: true,
  }
];
const treeFormConfig = [
/*   {
    prop: "sortNum",
    label: "序号",
    required: true,
    showInput: true,
  }, */
  {
    prop: "dicCode",
    label: "菜单编码",
    required: true,
    showInput: true
  },
  {
    prop: "dicName",
    label: "菜单名称",
    required: true,
    showInput: true,
  }
];
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  dialogVisible: false,
  name: "",
  serviceName: "",
  supplierName: "",
  serviceType: "",
  supplierPerson: "",
  supplierContact: "",
  culName: "",
  selectionList: [],
  formConfig: formConfig,
  tableData:<any> [],
  optionsList: [],
  levelOptions: [],
  dicCode: 'institutionalType',
  isInput: false
});
const title = ref("添加");
let currentRoleId = ref<string>("");
const inputValue = ref("");
const dynamicTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
let id = 1000;

let dataSource = ref<Tree[]>([
  {
    id: 1,
    label: "个人中心",
    children: [
      {
        id: 4,
        label: "第二级",
        children: [
          {
            id: 9,
            label: "基本信息",
          },
          {
            id: 10,
            label: "财税数据",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "政策匹配",
    children: [
      {
        id: 5,
        label: "业务领域",
      },
      {
        id: 6,
        label: "企业资质",
      },
    ],
  }
]);

const getNode = (data: Tree) => {
  state.dicCode = data.dicCode;
  getDictionariesGetByCode();
};
const changeLabel = (data: Tree, label) => {
  console.log('changeLabel---',data.label === label);
  if(data.label === label) {
    state.isInput = true
  };
};
const append = (data: Tree) => {

  const newChild = { id: id++, label: "testtest", children: [] };
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  dataSource.value = [...dataSource.value];
};

const remove = (node: Node, data: Tree) => {
  const parent = node.parent;
  const children: Tree[] = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.id === data.id);
  children.splice(index, 1);
  dataSource.value = [...dataSource.value];
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

/**
 * 添加
 */
const add = (row) => {
  title.value = "添加";
  currentRoleId.value = row.id;
  state.formConfig = formConfig;
  state.dialogVisible = true;
};

/**
 * 添加
 */
 const treeAdd = (row) => {
  title.value = "添加";
  state.formConfig = treeFormConfig;
  state.dialogVisible = true;
};

const handleSelectionChange = (row) => {
  console.log("row", row);
  state.selectionList = row;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  // 选项添加
  if(formData.branchCode) {
    if (title.value === "添加") {
    post(`${dictionariesBranchAddOne}`, {
      ...formData,
      //todo 一会获取
      branchTypeId: state.dicCode,
    })
      .then(function (data) {
        getDictionariesGetByCode();
        state.formConfig = state.formConfig.map((e, b) => {
          let result = { ...e };
          delete result[e.prop];
          return result;
        });
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
    } else {
      post(`${dictionariesBranchUpdateOne}`, {
        id: currentRoleId.value,
        //todo 一会获取
        branchTypeId: state.dicCode,
        ...formData,
      })
        .then(function (data) {
          getDictionariesGetByCode();
        })
        .catch((e) => {
          console.log("e", e);
        });
    }
  };
    // 菜单添加
  if(formData.dicCode) {
    if (title.value === "添加") {
    post(`${dictionariesAddOne}`, {
      ...formData
    })
      .then(function (data) {
        getDictionariesList();
        state.formConfig = state.formConfig.map((e, b) => {
          let result = { ...e };
          delete result[e.prop];
          return result;
        });
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
    } else {
      post(`${dictionariesUpdateOne}`, {
        ...formData,
      })
        .then(function (data) {
          getDictionariesList();
        })
        .catch((e) => {
          console.log("e", e);
        });
    }
  };
  state.dialogVisible = false;
  console.log("submit!", formData);
};
// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };
    delete result[e.prop];
    return result;
  });
};

/**
 * 编辑表单
 */
const edit = (row) => {
  title.value = "编辑";
  state.dialogVisible = true;
  currentRoleId.value = row.id;
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
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
      deleteItem(`${dictionariesBranchDeleteOne}/${row.id}`).then(function (data) {
        getDictionariesGetByCode();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

/**
 * 删除
 */
 const treeDeleteAction = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,  
  })
    .then(() => {
      deleteItem(`${dictionariesDeleteOne}/${row.data.id}`).then(function (data) {
        getDictionariesList();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

// 一级菜单
const getDictionariesList = () => {
  post(`${dictionariesList}`, {
  }).then(function ({list}) {
    dataSource.value = list.map(e => {
      e.label = e.dicName;
      return e;
    });
    state.dicCode = list[0].dicCode;
    getDictionariesGetByCode();
  });
};
getDictionariesList();

const getDictionariesGetByCode = () => {
  get(`${dictionariesGetByCode}/${state.dicCode}`, {
    }).then(e => {
      state.tableData = e;
    });
};
const loading = ref(false);
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
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
