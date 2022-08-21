<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <formConpoent
          v-if="state.dialogVisible"
          :optionsList="state.optionsList"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></formConpoent>
      <el-table
        v-else
        :data="state.tableData"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column
          v-for="(item, index) in tableHeaderConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="detail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-dialog
        v-model="state.dialogVisible"
        :title="title"
        width="90%"
        @closed="closeDialog()"
      >
        <formConpoent
          v-if="state.dialogVisible"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></formConpoent>
      </el-dialog> -->
      <div
      v-if="!state.dialogVisible"
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
import { ref, reactive, provide } from "vue";
import formConpoent from "./essay.vue";
import {
  businessEstimateAll,
  businessEstimateAddOne,
  businessEstimatUpdateOne,
  businessEstimatDelete,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import { formConfigItem } from "@/utils/interface";
import { deleteItem, post } from "@/utils/request";
export default {
  name: "sensitive-manage",
  data() {
    return {
      tableHeaderConfig: [
        {
          prop: "id",
          label: '序号'
        },
        {
          prop: "actId",
          label: "活动id",
        },
        {
          prop: "companyid",
          label: "企业id",
        },
        {
          prop: "duties",
          label: "职务",
        },
        {
          prop: "operator",
          label: "操作人",
        },
        {
          prop: "startTime",
          label: "开始时间",
        },
        {
          prop: "endTime",
          label: "结束时间",
        },
        {
          prop: "personName",
          label: "联系人",
        },
        {
          prop: "telPhone",
          label: "人员电话",
        },
      ],
    };
  },
};
</script>
<script lang="ts" setup>
interface formConfigItem {
    prop: string,
    label: string,
    required?: boolean,
    showInput?: boolean,
    showDatePicker?: boolean,
    upload?: boolean,
    uploadType?: string
}
const formConfig: formConfigItem[] = [
  {
    prop: "actId",
    label: "活动id",
    required: true,
    showInput: true
  },
  {
    prop: "companyid",
    label: "企业id",
    required: true,
    showInput: true
  },
  {
    prop: "duties",
    label: "职务",
    required: true,
    showInput: true
  },
  {
    prop: "operator",
    label: "操作人",
    required: true,
    showInput: true
  },
  {
    prop: "startTime",
    label: "开始时间",
    required: true,
    showDatePicker: true
  },
  {
    prop: "endTime",
    label: "结束时间",
    required: true,
    showDatePicker: true
  },
  {
    prop: "personName",
    label: "联系人",
    required: true,
    showInput: true
  },
  {
    prop: "telPhone",
    label: "人员电话",
    required: true,
    showInput: true
  },
];
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  formConfig: Object.assign([], formConfig),
  tableData: [],
  total: 0,
  sensitiveword: "",
  dialogVisible: false,
  optionsList: [
    {
      id: 0,
      title: "工商信息",
      useComType: "desc",
      businessMessage: {
        actualCapital: "600616万人民币",
        actualCapitalCurrency: "人民币",
        alias: "文化投资",
        authDate: "2022-03-18",
        base: "bj",
        baseName: "北京市",
        busScope: "投资与投资管理；资产管理；组织企业资产重组、并购。（市场主体依法自主选择经营项目，开展经营活动；依法须经批准的项目，经相关部门批准后依批准的内容开展经营活动；不得从事国家和本市产业政策禁止和限制类项目的经营活动。）",
        categoryScore: "9753",
        correctCompanyId: "",
        creditNo: "911100000592736444",
        entType: "有限责任公司(国有独资)",
        entityName: "北京市文化投资发展集团有限责任公司",
        estbDate: "2012-12-11",
        flag: "1",
        historyNames: "北京市文化投资发展集团中心;",
        id: "992685333",
        industryName: "商务服务业",
        isMicroEnt: "1",
        legalPersonId: "1857714708",
        legalRepName: "周茂非",
        opTermFrom: "2015-05-20",
        opTermTo: "2065-05-19",
        orgNo: "059273644",
        percentileScore: "9945",
        property3: "Beijing Cultural Investment And Development Group Co.,Ltd.",
        regAddress: "北京市西城区车公庄大街4号1、2号楼",
        regAuthority: "北京市市场监督管理局",
        regCapital: "621332.12",
        regCapitalCurrency: "人民币",
        regNo: "110000015455463",
        regStatus: "存续",
        socialStaffNum: "46",
        sourceFlag: "",
        sourceTableId: "19696223",
        staffNumRange: "小于50人",
        tags: "存续;曾用名;小微企业;项目品牌:北京市文投集团;投资机构:北京市文投集团;企业集团",
        taxNumber: "911100000592736444",
        type: "1",
        updatetime: "2022-08-19"
      },
      businessConfig: {
        creditNo: "统一社会信用代码",
        regNo: "工商注册号",
        orgNo: "组织机构代码",
        entType: "企业类型",
        legalRepName: "法定代表人",
        authDate: "成立日期",
        regCapital: "注册资本",
        regStatus: "登记状态",
        opTermFrom: "营业期限起始日期",
        opTermTo: "营业期限截止日期",
        regAuthority: "登记机关",
        regAddress: "注册地址",
        busScope: "经营范围",
      },
    },
    {
      id: 1,
      title: "变更信息",
      useComType: "table",
      businessMessage: [
        {
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        },{
          changeDate: "2022-03-18",
          changeItem: "董事（理事）、经理、监事",
          contentAfter: "徐哲,阎晓东,杨锟,于爱晶,周茂非*,朱永利",
          contentBefore: "肖蔚然,徐哲,阎晓东,于爱晶,周茂非*",
          createTime: "2022-03-19",
        }
      ],
    },
    {
      id: 2,
      title: "任职信息",
      useComType: "spDesc",
      businessMessage: [
        {
          personName: "周茂非",
          position: "董事长",
          toco: "3",
          type: "2",
        },
      ],
    },
    {
      id: 3,
      title: "股东信息",
      useComType: "desc",
      businessMessage: {
        // capitalTime: "2021-07-15",
        // contributionRatio: "100.00%",
        shareholderName: "北京市国有文化资产监督管理办公室",
        // shareholderType: "1",
        // shareholderTypeStr: "公司",
        subCapital: "621332.12万元",
        // subCapitalCurrency: "万人民币",
        // subCapitals: "621332.12万人民币"
      },
      businessConfig: {
        shareholderName: "股东名称",
        subCapital: "认缴出资额（万元）",
      },
    },
    {
      id: 4,
      title: "年报信息",
    },
  ] 
});

let currentRoleId = ref<string>("");
const title = ref<string>("新增");

/**
 * 表单详情
 */
// todo 单独封装
const detail = (row) => {
  title.value = "查看详情";
  state.dialogVisible = true;
//   state.formConfig = state.formConfig
//     .map((e, b) => {
//       // value 替换成 e.prop
//       let result = { ...e };
//       result[e.prop] = row[e.prop];
//       return result;
//     })
//     .splice(0);
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  if (title.value === "新增") {
    post(`${businessEstimateAddOne}`, {
      ...formData
    })
      .then(function (data) {
        getbusinessEstimateAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
    ElMessage.success("添加成功");
  } else {
    post(`${businessEstimatUpdateOne}`, {
      id: currentRoleId.value,
      ...formData,
    })
      .then(function (data) {
        getbusinessEstimateAll();
      })
      .catch((e) => {
        console.log("e", e);
      });
  }
  state.dialogVisible = false;
  console.log("submit!", formData);
};

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
};
//  文章内容列表
const getbusinessEstimateAll = () => {
  post(`${businessEstimateAll}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getbusinessEstimateAll();

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getbusinessEstimateAll();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getbusinessEstimateAll();
};
const loading = ref(false);

const formInline = reactive({
  username: "",
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
