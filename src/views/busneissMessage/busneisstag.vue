<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-form :inline="true" :model="state" class="demo-form-inline">
        <el-form-item label="企业名称">
          <el-input v-model="state.entName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="gettrainingServicesAll"
            >查询</el-button
          >
          <el-button type="primary" icon="Refresh" @click.stop="reset">重置</el-button>
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
          <template #default="scope" v-if="item.prop === 'applyStatus'">
            {{ applyStatusObj[scope.row.applyStatus] }}
          </template>
          <template #default="scope" v-if="item.prop === 'entScale'">
            {{ busStatusObj[scope.row.entScale] }}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click.stop="detail(scope.row)">
              编辑
            </el-button>
            <!--              <el-button type="primary" size="small" @click.stop="examine(scope.row)" :disabled="[scope.row.applyStatus !== 0]">
                审核
              </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="state.dialogVisible"
        :title="title"
        width="1000px"
        @closed="closeDialog()"
      >
        <formConpoent
          v-if="state.showForm"
          :disabled="state.disabled"
          :customStyle="{display: 'grid', 'grid-template-columns': '380px 380px','margin': `0px 0px 0px 30px`}"
          :showBtn="true"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></formConpoent>
        <examineFormConpoent
          v-if="state.showExamineForm"
          @handle="postFormData"
          :status="state.formConfig.status"
          @dialogClose="closeDialog"
        ></examineFormConpoent>
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
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { export_json_to_excel } from "@/execl/Export2Excel";
import { ref, reactive, provide } from "vue";
import formConpoent from "@/components/form/form.vue";
import examineFormConpoent from "@/components/form/examineForm.vue";
import {
  policyMatchList,
  entApplAddOne,
  policyMatchTagsUpdate,
  entApplyDelete,
  upLoad
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import { formConfigItem } from "@/utils/interface";
import { deleteItem, post } from "@/utils/request";
import { fa } from "element-plus/es/locale";
export default {
  name: "sensitive-manage",
  data() {
    return {
      applyStatusObj: {
        0: "未审核",
        1: "审核中",
        2: "审核通过",
        3: "审核未通过",
      },
      busStatusObj: {
        1: "特大",
        2: "大",
        3: "中",
        4: "小",
        5: "微",
      },
      tableHeaderConfig: [
        {
          prop: "companyName",
          label: "企业名称",
        },
        {
          prop: "jigou",
          label: "产业空间",
        },
        {
          prop: "diyu",
          label: "地域",
        },
        {
          prop: "shangshi",
          label: "上市状态",
        },
        {
          prop: "keyan",
          label: "研发机构",
        },
        {
          prop: "fenlei",
          label: "企业分类",
        },
        {
          prop: "xiangmu",
          label: "项目分类",
        },
        {
          prop: "zuzhi",
          label: "组织形式",
        },
        {
          prop: "yewu",
          label: "业务领域",
        },
        {
          prop: "chuangxin",
          label: "创新成果",
        },
        {
          prop: "caiwu",
          label: "财务数据",
        },
        {
          prop: "zizhi",
          label: "企业资质",
        },
        {
          prop: "guimo",
          label: "企业规模",
        },
        {
          prop: "nianxian",
          label: "成立年限",
        },
        {
          prop: "quxian",
          label: "企业规模",
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup>
interface formConfigItem {
  prop: string;
  label: string;
  required?: boolean;
  showInput?: boolean;
  showDatePicker?: boolean;
  upload?: boolean;
  uploadType?: string;
  disabled?: boolean;
  showTextarea?: boolean;
}

const industrialOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "众创空间",
    label: "众创空间",
    isSelect: false,
    type: "jigou",
  },
  {
    value: "孵化器",
    label: "孵化器",
    isSelect: false,
    type: "jigou",
  },
  {
    value: "加速器",
    label: "加速器",
    isSelect: false,
    type: "jigou",
  },
  {
    value: "产业园",
    label: "产业园",
    isSelect: false,
    type: "jigou",
  },
  {
    value: "shijingshan",
    label: "其他",
    isSelect: false,
    type: "jigou",
  },
];

const regionOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "中关村示范区",
    label: "中关村示范区",
    isSelect: false,
    type: "diyu",
  },
  {
    value: "北京经济技术开发区",
    label: "北京经济技术开发区",
    isSelect: false,
    type: "diyu",
  },
  {
    value: "中关村石景山园",
    label: "中关村石景山园",
    isSelect: false,
    type: "diyu",
  },
];
const equityMarketOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "上市企业",
    label: "上市企业",
    isSelect: false,
    type: "shangshi",
  },
  {
    value: "非上市企业",
    label: "非上市企业",
    isSelect: false,
    type: "shangshi",
  },
];
const developmentOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "研发中心",
    label: "研发中心",
    isSelect: false,
    type: "keyan",
  },
  {
    value: "实验室",
    label: "实验室",
    isSelect: false,
    type: "keyan",
  },
];
const projectOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "平台项目",
    label: "平台项目",
    isSelect: false,
    type: "xiangmu",
  },
  {
    value: "示范项目",
    label: "示范项目",
    isSelect: false,
    type: "xiangmu",
  },
  {
    value: "工程项目",
    label: "工程项目",
    isSelect: false,
    type: "xiangmu",
  },
  {
    value: "科技创新项目",
    label: "科技创新项目",
    isSelect: false,
    type: "xiangmu",
  },
  {
    value: "其他",
    label: "其他",
    isSelect: false,
    type: "xiangmu",
  },
];

const busneissOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "上榜企业",
    label: "上榜企业",
    isSelect: false,
    type: "fenlei",
  },
  {
    value: "头部企业",
    label: "头部企业",
    isSelect: false,
    type: "fenlei",
  },
  {
    value: "服务机构",
    label: "服务机构",
    isSelect: false,
    type: "fenlei",
  },
  {
    value: "其他",
    label: "其他",
    isSelect: false,
    type: "fenlei",
  },
];
const organizationOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "企事业单位",
    label: "企事业单位",
    isSelect: false,
    type: "zuzhi",
  },
  {
    value: "社会组织",
    label: "社会组织",
    isSelect: false,
    type: "zuzhi",
  },
];

const favourablebusinessOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    label: "高精尖产业",
    value: "高精尖产业",
    isSelect: false,
    type: "yewu",
  },
  {
    label: "现代服务业",
    value: "现代服务业",
    isSelect: false,
    type: "yewu",
  },
  {
    label: "新基建",
    value: "新基建",
    isSelect: false,
    type: "yewu",
  },
  {
    label: "商贸流通业",
    value: "商贸流通业",
    isSelect: false,
    type: "yewu",
  },
  /*   {
    label: '文化创意',
    value: '文化创意',
    isSelect:　false,
    type: 'yewu'
  }, */
  {
    label: "数字创意",
    value: "数字创意",
    isSelect: false,
    type: "yewu",
  },
  {
    label: "文化旅游",
    value: "文化旅游",
    isSelect: false,
    type: "yewu",
  },
  {
    label: "制造业",
    value: "制造业",
    isSelect: false,
    type: "yewu",
  },
  {
    label: "企业服务",
    value: "企业服务",
    isSelect: false,
    type: "yewu",
  },
  {
    label: "其他",
    value: "其他",
    isSelect: false,
    type: "yewu",
  },
];

const createOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "技术标准",
    label: "技术标准",
    isSelect: false,
    type: "chuangxin",
  },
  {
    value: "知识产权",
    label: "知识产权",
    isSelect: false,
    type: "chuangxin",
  },
];
const taxOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "营收",
    label: "营收",
    isSelect: false,
    type: "caiwu",
  },
  {
    value: "税收",
    label: "税收",
    isSelect: false,
    type: "caiwu",
  },
  {
    value: "注册资本",
    label: "注册资本",
    isSelect: false,
    type: "caiwu",
  },
];
const yearOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "0-3年",
    label: "0-3年",
    isSelect: false,
    type: "nianxian",
  },
  {
    value: "3-5年",
    label: "3-5年",
    isSelect: false,
    type: "nianxian",
  },
  {
    value: "5-10年",
    label: "5-10年",
    isSelect: false,
    type: "nianxian",
  },
  {
    value: "10年以上",
    label: "10年以上",
    isSelect: false,
    type: "nianxian",
  },
];

const zzOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "国家高新技术企业",
    label: "国家高新技术企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "中关村高新企业",
    label: "中关村高新企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "专精特新企业",
    label: "专精特新企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "专精特新小巨人企业",
    label: "专精特新小巨人企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "瞪羚企业",
    label: "瞪羚企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "科技型中小企业",
    label: "科技型中小企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "展翼企业",
    label: "展翼企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "隐形冠军企业",
    label: "隐形冠军企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "技术先进型服务企业",
    label: "技术先进型服务企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "独角兽企业",
    label: "独角兽企业",
    isSelect: false,
    type: "zizhi",
  },
  {
    value: "创新型企业",
    label: "创新型企业",
    isSelect: false,
    type: "zizhi",
  },
];

const businessAttributeOptions = [
  {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "特大型企业",
    label: "特大型企业",
    isSelect: false,
    type: "guimo",
  },
  {
    value: "大型企业",
    label: "大型企业",
    isSelect: false,
    type: "guimo",
  },
  {
    value: "中型企业",
    label: "中型企业",
    isSelect: false,
    type: "guimo",
  },
  {
    value: "小型企业",
    label: "小型企业",
    isSelect: false,
    type: "guimo",
  },
  {
    value: "微型企业",
    label: "微型企业",
    isSelect: false,
    type: "guimo",
  },
];

const locationOptions = [
/*   {
    value: "不符合",
    label: "不符合",
  },
  {
    value: "中国",
    label: "中国",
    isSelect: false,
  },
  {
    value: "北京",
    label: "北京",
    isSelect: false,
  }, */
  {
    value: "东城区",
    label: "东城区",
    isSelect: false,
  },
  {
    value: "西城区",
    label: "西城区",
    isSelect: false,
  },
  {
    value: "海淀区",
    label: "海淀区",
    isSelect: false,
  },
  {
    value: "朝阳区",
    label: "朝阳区",
    isSelect: false,
  },
  {
    value: "昌平区",
    label: "昌平区",
    isSelect: false,
  },
  {
    value: "石景山区",
    label: "石景山区",
    isSelect: false,
  },
  {
    value: "通州区",
    label: "通州区",
    isSelect: false,
  },
  {
    value: "顺义区",
    label: "顺义区",
    isSelect: false,
  },
  {
    value: "延庆区",
    label: "延庆区",
    isSelect: false,
  },
  {
    value: "平谷区",
    label: "平谷区",
    isSelect: false,
  },
  {
    value: "门头沟区",
    label: "门头沟区",
    isSelect: false,
  },
];
const formConfig: formConfigItem[] = [
  {
    prop: "jigou",
    label: "产业空间",
    showSelect: true,
    options: industrialOptions,
  },
  {
    prop: "diyu",
    label: "地域",
    showSelect: true,
    options: regionOptions,
  },
  {
    prop: "shangshi",
    label: "上市状态",
    showSelect: true,
    options: equityMarketOptions,
  },
  {
    prop: "keyan",
    label: "研发机构",
    showSelect: true,
    options: developmentOptions,
  },
  {
    prop: "fenlei",
    label: "企业分类",
    showSelect: true,
    options: busneissOptions,
  },
  {
    prop: "xiangmu",
    label: "项目分类",
    showSelect: true,
    options: projectOptions,
  },
  {
    prop: "zuzhi",
    label: "组织形式",
    showSelect: true,
    options: organizationOptions,
  },
  {
    prop: "yewu",
    label: "业务领域",
    showSelect: true,
    options: favourablebusinessOptions,
  },
  {
    prop: "chuangxin",
    label: "创新成果",
    showSelect: true,
    options: createOptions,
  },
  {
    prop: "caiwu",
    label: "财务数据",
    showSelect: true,
    options: taxOptions,
  },
  {
    prop: "zizhi",
    label: "企业资质",
    showSelect: true,
    options: zzOptions,
  },
  {
    prop: "guimo",
    label: "企业规模",
    showSelect: true,
    required: true,
    options: businessAttributeOptions,
  },
  {
    prop: "nianxian",
    label: "成立年限",
    showSelect: true,
    required: true,
    options: yearOptions,
  },
  {
    prop: "quxian",
    label: "区县",
    required: true,
    showSelect: true,
    options: locationOptions,
  },
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: formConfig,
  tableData: [],
  selectionList: [],
  total: 0,
  entName: "",
  companyid: "",
  sensitiveword: "",
  dialogVisible: false,
  showForm: false,
  showExamineForm: false,
  isResume: false,
  disabled: false,
});

let currentRoleId = ref<string>("");
const title = ref<string>("添加");
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
          prop: "companyName",
          label: "企业名称",
        },
        {
          prop: "jigou",
          label: "产业空间",
        },
        {
          prop: "diyu",
          label: "地域",
        },
        {
          prop: "shangshi",
          label: "上市状态",
        },
        {
          prop: "keyan",
          label: "研发机构",
        },
        {
          prop: "fenlei",
          label: "企业分类",
        },
        {
          prop: "xiangmu",
          label: "项目分类",
        },
        {
          prop: "zuzhi",
          label: "组织形式",
        },
        {
          prop: "yewu",
          label: "业务领域",
        },
        {
          prop: "chuangxin",
          label: "创新成果",
        },
        {
          prop: "caiwu",
          label: "财务数据",
        },
        {
          prop: "zizhi",
          label: "企业资质",
        },
        {
          prop: "guimo",
          label: "企业规模",
        },
        {
          prop: "nianxian",
          label: "成立年限",
        },
        {
          prop: "quxian",
          label: "企业规模",
        },
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '企业标签');
  }

};
// 导出表格
const exportClick = () => {
  var wb = XLSX.utils.table_to_book(document.querySelector("#my-table")); //关联don节点
  /* get binary string as output */
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      new Blob([wbout], {
        type: "application/octet-stream",
      }),
      "企业标签"
    ); //自定义文件名
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
};
const gettrainingServicesAll = () => {
  getentInfoAll();
};
const reset = () => {
  state.entName = "";
  getentInfoAll();
};
/**
 * 表单详情
 */
const detail = (row) => {
  title.value = "编辑";
  state.dialogVisible = true;
  state.showForm = true;
  state.companyid = row.companyid;
  state.formConfig = state.formConfig
    .map((e, b) => {
      // value 替换成 e.prop
      let result = { ...e };
      result[e.prop] = row[e.prop];
      return result;
    })
    .splice(0);
};

/**
 * 审核
 */
const examine = (row) => {
  state.formConfig.status = row.applyStatus;
  currentRoleId.value = row.id;
  state.dialogVisible = true;
  state.showExamineForm = true;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  post(`${policyMatchTagsUpdate}`, {
    companyid: state.companyid,
    ...formData,
  })
    .then(function (data) {
      getentInfoAll();
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible = false;
  state.showExamineForm = false;
};

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.showExamineForm = false;
  state.showForm = false;
};

//  文章内容列表
const getentInfoAll = () => {
  post(`${policyMatchList}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    companyName: state.entName
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getentInfoAll();

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getentInfoAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getentInfoAll();
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
      deleteItem(`${businessApplyDelete}`, {
        data: [row.id],
      }).then(function (data) {
        getentInfoAll();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
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
