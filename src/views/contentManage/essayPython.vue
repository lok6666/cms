<template>
  <u-container-layout v-loading="loading">
    <div class="inline-edit-table">
      <el-tabs
        type="card"
        class="demo-tabs"
        style="width: 100%"
        @tab-click="articleHandleClick"
        v-model="state.editableTabsValue"
      >
<!--         <el-tab-pane
          v-for="item in state.optionsList"
          :key="item.id"
          :label="item.title"
          :name="item.id"
        >
          <el-tabs
            type="card"
            class="demo-tabs"
            style="width: 100%"
            v-model="state.activeName"
            @tab-click="articleHandleClick"
          >
            <el-tab-pane
              v-for="i in item.children"
              :key="i.id"
              :label="i.title"
              :name="i.id"
              >
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane> -->
      </el-tabs>
      <el-tabs
        v-model="state.activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="内容列表" name="content"></el-tab-pane>
        <el-tab-pane label="回收站" name="resume"></el-tab-pane>
      </el-tabs>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="formInline.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="onSubmit">搜索</el-button>
          <el-button type="primary" @click.stop="onClear">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: space-between">
        <div style="display: inline-block; padding-bottom: 10px;margin-right: 10px;">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="区县">
              <el-select
                v-model="state.locationValue"
                filterable
                placeholder="区域"
                @change="getData()"
              >
                <el-option
                  v-for="item in locationOptions1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>

      </div>
      <div>
        <el-button type="primary" @click.stop="add"
          ><el-icon><plus /></el-icon> 添加</el-button
        >
        <el-button type="success" @click.stop="publish"
          ><el-icon><Pointer /></el-icon>发布</el-button
        >
      </div>
      </div>
      <el-table
        :data="state.tableData"
        style="width: 100%"
        :border="true"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column prop="id" label="序号" type="index" width='80px'/>
        <el-table-column prop="contentType" label="区县" width='180px' >
          <template #default="scope">
              {{scope.row.contentType.split(',').map(e => tableMap[e]).toString()}}
<!--             <el-select
            v-model="scope.row.contentType"
            filterable
            placeholder="区域"
            @change="getData()"
          >
            <el-option
              v-for="item in locationOptions1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="序号" width='80px'/> -->
        <el-table-column prop="title" label="文章标题" min-width='200'>
          <template #default="scope">
            <a v-if="scope.row.otherUrl" class="aaaa" :href="scope.row.otherUrl" target="_blank">{{scope.row.title}}</a>
            <span v-else>{{scope.row.title}}</span>
          </template>   
        </el-table-column>
        <el-table-column prop="dataSources" label="文章来源" width='150'/>
        <!-- <el-table-column prop="storageTime" label="创建时间" /> -->
        <!-- <el-table-column prop="status" label="发布状态" /> -->
        <el-table-column prop="operator" label="文章作者" width='150'/>
        <el-table-column prop="releaseDate" label="发布日期" width="180px"/>
        <el-table-column prop="recommend" label="发布状态" width="180px">
          <template #default="scope">
            {{publicMap[scope.row.recommend]}}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              v-if="state.isResume"
              type="success"
              size="small"
              icon="Refresh"
              @click.stop="resume(scope.row)"
            >
              恢复
            </el-button>
            <el-button
              v-else
              style="margin-left: 12px;margin-bottom: 3px;"
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
              style="margin-bottom: 3px;"
              @click.stop="deleteAction(scope.row, state.isResume)"
            >
              {{ state.isResume ? "彻底删除" : "删除" }}
            </el-button>
<!--             <el-button type="warning" v-if="!state.isResume" size="small" icon="Top" @click.stop="upItem(scope.row)">上架</el-button>
            <el-button type="danger" v-if="!state.isResume" size="small" icon="Bottom"  @click.stop="downItem(scope.row)">下架</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="state.dialogVisible"
        :title="title"
        width="80%"
        @closed="closeDialog()"
      >
        <el-form
          v-if="state.dialogVisible"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title" />
          </el-form-item>
          <el-form-item label="区县" prop="title">
            <el-select multiple v-model="ruleForm.contentType" class="col" size="small" placeholder="选择区县">
              <el-option v-for="i in roleOptions" :key="i.value" :label="i.label" :value="i.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="摘要" prop="digest">
            <el-input v-model="ruleForm.digest" />
          </el-form-item>
          <el-form-item label="作者" prop="operator">
            <el-input v-model="ruleForm.operator" />
          </el-form-item>
          <el-form-item label="来源" prop="dataSources">
            <el-input v-model="ruleForm.dataSources" />
          </el-form-item>
          <el-form-item label="发布时间" prop="releaseDate">
            <el-date-picker
              v-model="ruleForm.releaseDate"
              type="datetime"
              format="YYYY/MM/DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="缩略图" prop="picture">
            <el-upload
              class="avatar-uploader"
              :list-type="rest(ruleForm.picture)"
              :before-upload="beforeAvatarUpload"
            >
            <div v-if="ruleForm.picture">
              <img
                v-if="ruleForm.picture"
                :src="ruleForm.picture"
                style="width: 50px; height: 50px;"
                class="avatar"
              />
              <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop="handlePictureCardPreview(ruleForm.picture)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click.stop="handleRemove(ruleForm.picture)"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
            </div>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="文章内容" prop="content">
            <editor
              :content="ruleForm.content"
              @handle="changeContent"
            ></editor>
            <!-- <div v-html="ruleForm.content" style="width: 100%;border: 0.5px solid;padding: 0 40px;"></div> -->
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click.stop="state.dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.stop="handleClose(ruleFormRef)"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogVisible">
      <img  :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height:100%"/>
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
export default { name: "inline-table" };
</script>
<script lang="ts" setup >
import { computed, ref, reactive, onMounted, toRefs,getCurrentInstance } from "vue";
import { upLoad } from "@/config/api";
import editor from "@/components/editor/index.vue";
import {
  locationOptions1,
} from "@/config/constant";
import {
  articleSpiderArticleAddOne,
  articleSpiderUpdateOne,
  articleSpiderRecycle,
  articleSpiderSelectAll,
  articleSpiderDelete,
  articleArticleAelectCircle,
  articleSpiderSelectById,
  articleSpiderMoveUp,
  articleSpiderMoveDown,
  articleSpiderTransform
} from "@/config/api";
import {
  phoneRules,
  emtyRules
} from "@/config/constants";
import { ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus";
import { get, post, deleteReal, postArray } from "@/utils/request";
const tableMap = {
    'shijingshan': '石景山',
    'beijing': '北京',
    'chaoyang': '朝阳'
  };
  const publicMap = {
    '1': '已发布',
    '0': '未发布'
  };
const roleOptions = [
    {
      value: "beijing",
      label: "北京",
    },
    {
      value: "dongcheng",
      label: "东城区",
    },
    {
      value: "xicheng",
      label: "西城区",
    },
    {
      value: "haidian",
      label: "海淀区",
    },
    {
      value: "chaoyang",
      label: "朝阳区",
    },
    {
      value: "changping",
      label: "昌平区",
    },
    {
      value: "shijingshan",
      label: "石景山区",
    },
    {
      value: "tongzhou",
      label: "通州区",
    },
    {
      value: "shunyi",
      label: "顺义区",
    },
    {
      value: "yanqing",
      label: "延庆区",
    },
    {
      value: "pinggu",
      label: "延庆区",
    },
    {
      value: "mentougou",
      label: "门头沟区",
    }];
interface baseData {
  title: string;
  operator: string;
  picture: string;
  dataSources: string;
  avatar: string;
  releaseDate: string;
  content: string;
}

interface selectAllConfig {
  title?: string,
  deleteState?: number
}

const rules = reactive<FormRules>({
  title: { required: true, validator: emtyRules, trigger: 'blur'},
  operator:{ required: true, validator: emtyRules, trigger: 'blur'},
  dataSources: { required: true, validator: emtyRules, trigger: 'blur'},
  releaseDate: { required: true, validator: emtyRules, trigger: 'blur'},
  content: { required: true, validator: emtyRules, trigger: 'blur'},
});
const formInline = reactive({
  title: ""
});
const state = reactive({
  currentPage: 0,
  tableData: [],
  total: 0,
  pageSize: 10,
  activeName: "content",
  editableTabsValue: "1",
  dialogVisible: false,
  locationValue: '',
  optionsList: [],
  isResume: false,
  isTop: 0,
  title: '',
  selectionList: []
});
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const ruleFormRef = ref();
const title = ref("添加");
let ruleForm: baseData = reactive({
  title: "",
  contentType: '',
  operator: "",
  picture: "",
  
  dataSources: "",
  avatar: "",
  digest: "",
  id: "",
  releaseDate: "",
  content: ""
});

const userChange1 = (row) => {
  let obj = {
    ...row,
    isTop:row.booleanIsTop ? 1 : 0,
  };
  post(`${articleSpiderUpdateOne}`, {
    ...obj
  }).then(function (data) {
    getArticleSelectAll();
    ElMessage.success("操作成功");
  });
};

const publish = () => {
  if(!state.selectionList.length) {
    ElMessage.warning("请选择要发布的文章");
  } else {
    postArray(`${articleSpiderTransform}`, [...state.selectionList]).then(function (data) {
      ElMessage.success("操作成功");
      getArticleSelectAll();
    });
  }
};
// 发布
const handleSelectionChange = (row) => {
  state.selectionList = row;
};
const handleRemove = (i, res) => {
  ruleForm.picture = '';
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file;
  dialogVisible.value = true;
};

const rest = (i) => {
  return i ? 'picture-card' : ''
};

const userChange = (row) => {
  let obj = {
    ...row,
    recommend:row.booleanRecommend ? 1 : 0,
  };
  post(`${articleSpiderUpdateOne}`, {
    ...obj
  }).then(function (data) {
    getArticleSelectAll();
    ElMessage.success("操作成功");
  });
};

// // 获取文章类型
// const getOPtionList = () => {
//   get(`${articleArticleAelectCircle}`)
//     .then(function (data) {
//       state.optionsList = data;
//     })
//     .catch((e) => {
//       console.log("e", e);
//     });
// };
// getOPtionList();

const getData = () => {
  getArticleSelectAll();
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
      get(`${articleSpiderMoveUp}?id=${row.id}`).then(function (data) {
        getArticleSelectAll();
      });
      ElMessage.success("上架成功");
    })
    .catch(() => {});
};

/**
 * 下架
 */
const downItem = (row) => {
ElMessageBox.confirm("你确定要下架当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      get(`${articleSpiderMoveDown}?id=${row.id}`).then(function (data) {
        getArticleSelectAll();
      });
      ElMessage.success("下架成功");
    })
    .catch(() => {});
};

const articleHandleClick = (tab, event) => {
  state.articletype = tab.props.name;
  getArticleSelectAll();
};
// 添加
const add = () => {
  title.value = "添加";
  state.dialogVisible = true;
};

//富文本编辑emit事件
const changeContent = (HTML) => {
  ruleForm.content = HTML;
};

// 关闭弹窗
const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      let obj = {
        ...ruleForm,
      };
      obj.contentType = obj.contentType.toString();
      if (title.value === "添加") {
        post(`${articleSpiderArticleAddOne}`, {
          ...obj,
        })
          .then(function (data) {
            getArticleSelectAll();
          })
          .catch((e) => {
            console.log("e", e);
          });
        ElMessage.success("添加成功");
      } else {
        post(`${articleSpiderUpdateOne}`, {
          ...obj,
        })
          .then(function (data) {
            getArticleSelectAll();
          })
          .catch((e) => {
            console.log("e", e);
          });
      }
      state.dialogVisible = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};
let {ctx:that, proxy} = getCurrentInstance()
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
          data: data
        };
        axios.defaults.crossDomain = true;
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios(config)
        .then(function (res) {
          ruleForm.picture = res;
          proxy.$forceUpdate()
        })
        .catch(function (error) {
          console.log(error);
        });
};
// todo 改写法
const closeDialog = async (done: () => void) => {
  Object.assign(ruleForm, {
    title: "",
    operator: "",
    picture: "",
    dataSources: "",
    releaseDate: "",
    avatar: "",
    digest: "",
    id: "",
    releasedate: "",
    content: "",
  });
};
// 编辑
const edit = (row) => {
  title.value = "编辑";
  get(`${articleSpiderSelectById}/${row.id}`, {
  })
    .then(function (data) {
      state.dialogVisible = true;
      data.contentType = data.contentType.split(',');
      Object.assign(ruleForm, data);
    })
    .catch((e) => {
      console.log("e", e);
    });
};
//  文章内容列表
const getArticleSelectAll = (config?: selectAllConfig) => {
  post(`${articleSpiderSelectAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    articletype: state.articletype,
    contentType: state.locationValue,
    title: state.title,
    ...config,
    deleteState: state.isResume ? 1: 0
  }).then(function (data) {
    state.tableData = data.list.map(e => {
      e.booleanIsTop = e.isTop === 0 ? false :true;
      e.booleanRecommend = e.recommend === 0 ? false :true;
      return e;
    });
    state.total = data.total;
  });
};
getArticleSelectAll();

// 回收站·
const getArticleRecycle = (config?: selectAllConfig) => {
  post(`${articleSpiderSelectAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    deleteState: 1,
  }).then(function (data) {
    state.tableData = data.list.map(e => {
      e.booleanIsTop = e.isTop === 0 ? false :true;
      e.booleanRecommend = e.recommend === 0 ? false :true;
      return e;
    });
    state.total = data.total;
  });
};

// 切换tab
const handleClick = (tab, event) => {
  if (tab.props.name === "resume") {
    state.isResume = true;
    getArticleRecycle({deleteState: 1});
  } else {
    state.isResume = false;
    getArticleSelectAll({deleteState: 0});
  }
};

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getArticleSelectAll({ title: formInline.title});
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getArticleSelectAll({ title: formInline.title});
};
const loading = ref(false);

// 搜索
const onSubmit = () => {
  console.log("submit!");
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    getArticleSelectAll({ title: formInline.title});
  }, 500);
};

// 重置
const onClear = () => {
  loading.value = true;
  formInline.title = '';
  formInline.value = {};
  setTimeout(() => {
    loading.value = false;
    getArticleSelectAll({ title: ""});
  }, 500);
};

// 删除
const deleteAction = (row, isResume) => {
  let obj = {
    ...row,
    deleteState: 1,
  };
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      !isResume
        ? post(`${articleSpiderUpdateOne}`, {
            ...obj
          }).then(function (data) {
            getArticleSelectAll();
          })
        : deleteReal(`${articleSpiderDelete}`, [row.id]).then(function (data) {
            getArticleRecycle();
          });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

// 恢复
const resume = (row) => {
  let obj = {
    ...row,
    deleteState: 0,
  };
  ElMessageBox.confirm("你确定要恢复当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      post(`${articleSpiderUpdateOne}`, {
        ...obj
      }).then(function (data) {
        getArticleRecycle();
      });
      ElMessage.success("恢复成功");
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
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
  .aaaa {
    text-decoration : none;
    &:visited {
      color:  rgb(0, 0, 238);
  }
  }
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
