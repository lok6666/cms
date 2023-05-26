<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="活动名称">
            <el-input v-model="state.activityName" placeholder="请输入活动名称" style="width: 300px; margin-right: 10px;margin-bottom: 10px;"/>
        </el-form-item>
        <el-form-item label="区县">
          <el-select clearable v-model="state.locationValue" class="col"  @change="getData()" size="small" placeholder="选择区县" style="width: 120px;">
            <el-option v-for="i in locationOptions" :key="i.value" :label="i.label" :value="i.value"/>
          </el-select>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="onSubmit">搜索</el-button>
          <el-button type="primary" @click.stop="onClear">重置</el-button>
          <el-button type="primary" @click.stop="add">添加</el-button>
          <el-button type="primary" icon="IceCreamSquare" @click.stop="exportClick2">导出EXECL</el-button>
        </el-form-item>
      </el-form>
      <el-table
        id="my-table"
        :data="state.tableData"
        style="width: 100%"
        :border="true"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
        <template #default="scope" v-if="item.prop === 'activityStatus'">
            {{activityStatus[scope.row.activityStatus]}}
          </template>
        <template #default="scope" v-if="item.showImg">
            <img
            v-if="item.showImg"
            :src="scope.row[item.prop]"
            style="width: 50px; height: 50px"
          />
          </template>
          <template #default="scope" v-if="item.prop === 'activityLocation'">
          {{tableMap[scope.row.activityLocation]}}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click.stop="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click.stop="deleteAction(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="state.dialogVisible"
        :destroy-on-close="true"
        :title="title"
        width="80%"
        @closed="closeDialog()"
      >
        <formConpoent
          v-if="state.dialogVisible"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          :showBtn="true"
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
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { ref, reactive, provide } from "vue";
import formConpoent from "@/components/form/form.vue";
import {
  locationOptions,
} from "@/config/constant";
import {
  actionAll,
  actionAddOne,
  actionrUpdateOne,
  actionDelete,
} from "@/config/api";
import {
  phoneRules,
  emtyRules
} from "@/config/constants";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteItem, post } from "@/utils/request";
export default {
  name: "active-publish",
  data() {
    return {
      activityStatus: {
        0: '未发布',
        1: '已发布'
      },
      tableMap: {
        'shijingshan': '石景山',
        'beijing': '北京',
        'chaoyang': '朝阳'
      },
      tableHeaderConfig: [
      {
          prop: "sortNum",
          label: "排序",
      },
      {
        prop: "activityName",
        label: "活动名称"
      },
      {
        prop: "activityAddress",
        label: "活动地点"
      },
      {
        prop: "activityLocation",
        label: "区县"
      },
      // {
      //   prop: "activityAbstract",
      //   label: "活动简介"
      // },
      // {
      //   prop: "activityContent",
      //   label: "活动详情介绍"
      // },
      {
        prop: "activityNum",
        label: "参加人数"
      },
      {
        prop: "applyNum",
        label: "报名人数"
      },
      // {
      //   prop: "activityImg",
      //   label: "活动课程图片",
      //   showImg: true
      // },
      {
        prop: "contactPerson",
        label: "联络人" 
      },
      {
        prop: "contactPhone",
        label: "联络人电话" 
      },
      {
        prop: "activityDateFrom",
        label: "活动开始时间",
        placeholder: "活动开始时间"
      },
      {
        prop: "activityDateTo",
        label: "活动结束时间"    
      },
      {
        prop: "applyTimeFrom",
        label: "活动报名开始时间",
        placeholder: "活动报名开始时间"
      },
      {
        prop: "applyTimeTo",
        label: "活动报名结束时间",
        placeholder: "活动报名结束时间"
      },
      {
        prop: "activityHits",
        label: "浏览"
      },
 /*      {
        prop: "activityStatus",
        label: "活动状态",
        options: [
          {
            label: '报名中',
            value: '1'
          },
          {
            label: '报名结束，进行中',
            value: '2'
          },
          {
            label: '已结束',
            value: '3'
          }
        ]      
      } */
      ],
    };
  },
};
</script>
<script lang="ts" setup>
const formConfig = [
{
    prop: "sortNum",
    label: "序号",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "activityName",
    label: "活动名称",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "activityAddress",
    label: "活动地点",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true 
  },
  {
    prop: "activityLocation",
    label: "区县",
    options: [{
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
    }],
    label: "区县",
    required: true,
    showSelect: true
  },
  {
    prop: "activityNum",
    label: "参加人数",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true 
  },
  {
    prop: "contactPerson",
    label: "联络人",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,   
  },
  {
    prop: "contactPhone",
    label: "联络人电话",
    rules: { required: true, validator: phoneRules, trigger: 'blur'},
    showInput: true,    
  },
  {
    prop: "activityAbstract",
    label: "活动简介",
    required: true,
    showTextarea: true 
  },
  {
    prop: "activityDateFrom",
    label: "活动开始时间",
    placeholder: "活动开始时间",
    getMinTime: () => new Date(),
    rules: { required: true, validator: (r, e, c) => {
      if(!e) {
        c('不能为空');
      }
      else if(formConfig[7].activityDateTo && new Date(formConfig[7].activityDateTo).getTime() < new Date(e).getTime()) {
        c('开始时间不能大于结束时间!');
      } else {
        c();
      }
    }, trigger: 'change'},
    showDatePicker: true
  },
  {
    prop: "activityDateTo",
    label: "活动结束时间",
    getMinTime: () => new Date(),
    rules: { required: true, validator: (r, e, c) => {
      if(!e) {
        c('不能为空');
      }
      else if(formConfig[6].activityDateFrom && new Date(formConfig[6].activityDateFrom).getTime() > new Date(e).getTime()) {
        c('结束时间不能小于开始时间!');
      } else {
        c();
      }
    }, trigger: 'change'},
    showDatePicker: true,
    
  },
  {
    prop: "applyTimeFrom",
    label: "活动报名开始时间",
    placeholder: "活动报名开始时间",
    getMinTime: () => new Date(),
    rules: { required: true, validator: (r, e, c) => {
      if(!e) {
        c('不能为空');
      }
      else if(formConfig[9].applyTimeTo && new Date(formConfig[9].applyTimeTo).getTime() < new Date(e).getTime()) {
        c('开始时间不能大于结束时间!');
      } else {
        c();
      }
    }, trigger: 'change'},
    showDatePicker: true
  },
  {
    prop: "applyTimeTo",
    label: "活动报名结束时间",
    placeholder: "活动报名结束时间",
    getMinTime: () => new Date(),
    rules: { required: true, validator: (r, e, c) => {
      if(!e) {
        c('不能为空');
      }
      else if(formConfig[8].applyTimeFrom && new Date(formConfig[8].applyTimeFrom).getTime() > new Date(e).getTime()) {
        c('结束时间不能小于开始时间!');
      } else {
        c();
      }
    }, trigger: 'change'},
    showDatePicker: true, 
  },
  {
    prop: "activityImg",
    label: "活动课程图片",
    rules: { required: true, validator: emtyRules, trigger: 'change'},
    upload: true 
  },
  {
    prop: "activityThumbnail",
    label: "缩略图",
    rules: { required: true, validator: emtyRules, trigger: 'change'},
    // display: ''
    upload: true 
  },
  {
    prop: "activityContent",
    label: "活动详情介绍",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showWangEditor: true, 
  },
  // {
  //   prop: "activityStatus",
  //   label: "活动状态",
  //   options: [
  //     {
  //       label: '报名中',
  //       value: '1'
  //     },
  //     {
  //       label: '报名结束，进行中',
  //       value: '2'
  //     },
  //     {
  //       label: '已结束',
  //       value: '3'
  //     }
  //   ],
  //   required: true,
  //   showSelect: true,
  // }
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableData: [],
  selectionList: [],
  locationValue: '',
  total: 0,
  activityName: '',
  sensitiveword: "",
  dialogVisible: false
});
const title = ref("添加");
let currentRoleId = ref("");
// 添加
const add = () => {
  title.value = "添加";
  state.dialogVisible = true;
};

const handleSelectionChange = (row) => {
  console.log('row', row);
  state.selectionList = row; 
};
const formatJson  = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]));
}
// 导出表格
const exportClick2 = () => {
  if(state.selectionList.length === 0) {
    ElMessage({
        message: '请选择要导出的数据',
        type: 'warning'
      })
  } else {
    const tableHeaderConfig = [
      {
        prop: "activityName",
        label: "活动名称"
      },
      {
        prop: "activityAddress",
        label: "活动地点"
      },
      // {
      //   prop: "activityAbstract",
      //   label: "活动简介"
      // },
      // {
      //   prop: "activityContent",
      //   label: "活动详情介绍"
      // },
      {
        prop: "activityNum",
        label: "参加人数"
      },
      {
        prop: "applyNum",
        label: "报名人数"
      },
      // {
      //   prop: "activityImg",
      //   label: "活动课程图片",
      //   showImg: true
      // },
      {
        prop: "contactPerson",
        label: "联络人" 
      },
      {
        prop: "contactPhone",
        label: "联络人电话" 
      },
      {
        prop: "activityDateFrom",
        label: "活动开始时间",
        placeholder: "活动开始时间"
      },
      {
        prop: "activityDateTo",
        label: "活动结束时间"    
      },
      {
        prop: "applyTimeFrom",
        label: "活动报名开始时间",
        placeholder: "活动报名开始时间"
      },
      {
        prop: "applyTimeTo",
        label: "活动报名结束时间",
        placeholder: "活动报名结束时间"
      },
 /*      {
        prop: "activityStatus",
        label: "活动状态",
        options: [
          {
            label: '报名中',
            value: '1'
          },
          {
            label: '报名结束，进行中',
            value: '2'
          },
          {
            label: '已结束',
            value: '3'
          }
        ]      
      } */
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '活动发布');
  }

};
// 导出表格
const exportClick = () => {
	var wb = XLSX.utils.table_to_book(document.querySelector('#my-table'));//关联don节点
	/* get binary string as output */
	var wbout = XLSX.write(wb, {
		bookType: 'xlsx',
		bookSST: true,
		type: 'array'
	})
	try {
		FileSaver.saveAs(new Blob([wbout], {
			type: 'application/octet-stream'
		}), '活动发布')//自定义文件名
	} catch (e) {
		if (typeof console !== 'undefined') console.log(e, wbout);
	}
	return wbout
}
const onSubmit = () => {
  getactionAll();
};
const onClear = () => {
  state.activityName = '';
  getactionAll();
}
/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "添加") {
    post(`${actionAddOne}`, {
      ...formData,
    })
      .then(function (data) {
        getactionAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    // 所有设置更新的都要加id
    post(`${actionrUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function () {
        getactionAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
  }
  state.dialogVisible = false;
  state.formConfig = state.formConfig.map((e, b) => {
            let result = { ...e };  
            delete result[e.prop];
            return result;
          });
  console.log("submit!", formData);
};

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  // state.formConfig = formConfig;
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
};

// 编辑
const edit = (row): void => {
  title.value = "编辑";
  currentRoleId.value = row.id;
  state.dialogVisible = true;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
};
//  文章内容列表
const getactionAll = () => {
  post(`${actionAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    activityName: state.activityName,
    activityLocation: state.locationValue
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getactionAll();

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getactionAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getactionAll();
};
const loading = ref(false);

const formInline = reactive({
  username: "",
});
// 删除
const deleteAction = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${actionDelete}/${row.id}`, {
        data: [row.id],
      }).then(function (data) {
        getactionAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {
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
