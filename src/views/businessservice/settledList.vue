<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <!--      <formConpoent
        :isSHowCloseBtn="true"
        v-if="state.dialogVisible"
        :tabList="state.tabList"
        v-model:baseInfo="state.baseInfo"
        v-model:formConfig="state.formConfig"
        @handle="postFormData"
        @dialogClose="closeDialog"
        v-loading="loading"
      ></formConpoent> -->
      <busneissDetail
        v-if="state.applyDialogVisible"
        :busneissName="state.busneissName"
        :tabList="state.tabList"
        v-model:baseInfo="state.baseInfo"
        v-model:formConfig="state.formConfig"
        @handle="postFormData"
        @dialogClose="closeDialog"
      ></busneissDetail>
      <div>
        <el-form :model="state" class="demo-form-inline">
          <!--           <el-form-item label="招商状态">
            <el-button
              :type="[i.isSelect ? 'primary': '']"
              v-for="(i ,index) in state.status"
              @click.stop="handleClick(index)"
              >{{ i.label }}</el-button
            > -->
          <!-- </el-form-item> -->
          <el-form-item label="导入时间">
            <div style="width: 300px">
              <el-date-picker
                v-model="state.value2"
                type="daterange"
                @change="dateChange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-value="[new Date(), new Date()]"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </el-form-item>
          <el-form-item label="查询条件">
            <div>
              <el-input
                v-model="state.entName"
                style="display: inline; margin-right: 10px"
                placeholder="企业名称"
              />
              <el-input
                v-model="state.entLocal"
                style="display: inline; margin-right: 10px"
                placeholder="地址"
              />
              <el-input
                v-model="state.entSource"
                style="display: inline; margin-right: 10px"
                placeholder="招商来源"
              />
              <el-input
                v-model="state.hctd"
                style="display: inline; margin-right: 10px"
                placeholder="招商专员"
              />
              
            </div>
            <div style="display: flex; align-items: center">
              <el-button
                type="primary"
                @click.stop="getentMerchantsSuccessList"
                icon="Search"
                >查询</el-button
              >
              <el-button type="primary" @click.stop="reset" icon="Refresh"
                >重置</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="">
            <div
              style="
                margin-bottom: 10px;
                height: 19px;
                float: right;
                /* width: 100%; */
                text-align: right;
                width: 100%;
                display: flex;
                align-items: baseline;
                justify-content: flex-end;
              "
            >
              <el-button type="success" icon="DocumentAdd" @click.stop="add"
                >添加</el-button
              >
              <el-upload
                :before-upload="importClick"
                style="margin-top: 9px; margin-left: 10px"
              >
                <el-button type="success" icon="UploadFilled"
                  >导入名单</el-button
                >
              </el-upload>
              <el-button
                type="primary"
                icon="Download"
                style="margin-left: 10px"
                ><a
                  style="text-decoration: none; color: #fff"
                  download="clz.xlsx"
                  href="http://minio.bjwcxf.com/cultural-file/template/ent_merchants_list.xlsx"
                  >下载模板</a
                ></el-button>
                <!-- <el-button type="primary" icon="IceCreamSquare" @click.stop="exportClick2">导出EXECL</el-button> -->
                <el-button type="primary" icon="IceCreamSquare" @click.stop="exportClick2">导出EXECL</el-button>
            </div>
          </el-form-item>
          <!--           <el-form-item label="名单分组">
            <div style="display: flex;width: 100%">
                         <div style="margin-bottom: 20px">
              <el-button size="small" @click.stop="addTab()">+</el-button>
            </div>
              <el-tag
                v-for="tag in state.tabTableData"
                :key="tag.primaryId"
                :effect="[tag.primaryId === state.primaryId ? 'dark' : 'plain']"
                style="margin-right: 10px; cursor: pointer"
                closable
                @click.stop="clickTab(tag)"
                :disable-transitions="false"
                @close="removeTab(tag.primaryId)"
              >
                {{ tag.listName }}
              </el-tag>
              <el-input
                v-if="state.inputVisible"
                ref="InputRef"
                v-model="state.inputValue"
                style="width: 100px"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button
                v-else
                class="button-new-tag ml-1"
                size="small"
                @click.stop="showInput"
              >
                增加筛选名单
              </el-button>
              <div style="height: 19px;float: right;width: 100%;text-align: right;display: flex;align-items: center;justify-content: flex-end;">
                <el-button type="success" icon="DocumentAdd" @click.stop="add">添加</el-button>
              <el-upload
                :before-upload="importClick"
                style="margin-top: 9px; margin-left: 10px"
              >
                <el-button type="success" icon="UploadFilled">导入名单</el-button>
              </el-upload>
              <el-button type="primary" icon="Download" style="margin-left: 10px"
                ><a
                  style="text-decoration: none;color: #fff"
                  download="clz.xlsx"
                  href="http://minio.bjwcxf.com/cultural-file/template/ent_merchants_list.xlsx"
                  >下载模板</a
                ></el-button
              >
              </div>
                         <el-tabs
              v-model="state.listName"
              tabPosition="top"
              class="demo-tabs"
              closable
              @tab-click="clickTab"
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="item in state.tabTableData"
                :key="item.primaryId"
                :label="item.listName"
                :name="item.primaryId"
              >
              </el-tab-pane>
            </el-tabs>
            </div>
          </el-form-item>-->
        </el-form>
        <div style="display: flex; flex-direction: column">
          <!--  <el-tabs
            v-model="state.activeName"
            class="demo-tabs"
            @tab-click="handleClick"
          >
            <el-tab-pane label="待沟通" name="待沟通"></el-tab-pane>
            <el-tab-pane label="无意向" name="无意向"></el-tab-pane>
            <el-tab-pane label="有意向" name="有意向"></el-tab-pane>
            <el-tab-pane label="入驻" name="入驻"></el-tab-pane>
          </el-tabs> -->
          <!--       <div style="border: solid 0.1px;" v-if="state.tableData.length > 0">
            <div v-for="item in state.tableData">
              <div style="height: 120px;padding: 10px 5px;">
                <div style="display: flex;justify-content: space-between;padding: 0px 186px;">
                  <div style="min-width: 256px;">
                    <div style="font-size: 20px;">{{item.companyName}}</div>
                    <div style="margin: 10px 0px;">联系人：{{item.contactPerson}}</div>
                    <div style="margin: 10px 0px;">手机：{{item.contactPhone}}</div>
                    <div style="margin: 10px 0px;">地址：{{item.entLocal}}</div>
                  </div>
                  <div>
                    <div style="margin: 10px 0px;">统一代码：{{item.entCode}}</div>
                    <div style="margin: 10px 0px;">招商来源：{{item.entSource}}</div>
                    <div style="margin: 10px 0px;">导入时间：{{item.storageTime.substring(0, 10)}}</div>
                    <div style="margin: 10px 0px;">招聘专员：{{item.hctd}}</div>
                  </div>
                  <div style="display: flex;flex-direction: column;">
                    <el-button style="margin: 10px 0px;" type="danger" size="small" @click.stop="detail(scope.row)">效果跟踪</el-button>
                    <el-button style="margin: 10px 0px;" type="success" size="small" @click.stop="edit(scope.row)">动态跟踪</el-button>
                    <el-button style="margin: 10px 0px;" type="primary" size="small" @click.stop="edit(scope.row)">编辑内容</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
          <el-table
            id="my-table"
            :data="state.tableData"
            style="width: 100%"
            :cell-style="fn"
            header-row-class-name="custom-header"
            row-class-name="hover-row"
            :header-cell-style="{ 'background-color': `#ecf5ff` }"
            :border="true"
            @row-click="routerTo1"
            @selection-change="handleSelectionChange"
          >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
            <el-table-column
              v-for="(item, index) in tableHeaderConfig"
              :key="index"
              :prop="item.prop"
              :label="item.label"
            >
            </el-table-column>
            <el-table-column
              prop="operator"
              label="操作"
              width="460"
              fixed="right"
            >
              <template #default="scope">
                <div style="display: flex">
                  <el-button
                    type="success"
                    icon="Edit"
                    size="small"
                    @click.stop="edit(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    icon="Delete"
                    size="small"
                    @click.stop="detail(scope.row)"
                  >
                    删除
                  </el-button>
                  <el-button
                    type="primary"
                    icon="view"
                    size="small"
                    @click.stop="routerTo(scope.row)"
                  >
                    企业评估
                  </el-button>
                  <el-button
                    type="primary"
                    icon="view"
                    size="small"
                    @click.stop="echartsTo(scope.row)"
                  >
                    效果追踪
                  </el-button>
                  <el-button
                    type="primary"
                    icon="Medal"
                    size="small"
                    @click.stop="dtTo(scope.row)"
                  >
                    动态追踪
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog
        v-model="state.dialogVisible"
        :title="title"
        :width="state.dialogVisible3 ? '50%' : state.dialogVisible4 ? '90%' : '30%'"
        top="10vh"
        @closed="closeDialog()"
      >
        <test-charts
          v-if="state.dialogVisible4"
          :isShowSearch="false"
          width="100%"
          height="800px"
          :title="state.busneissName"
          v-model:echartsOptions="state.echartsOptions"
        />
        <formConpoent1
          v-if="state.dialogVisible1"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          :showBtn="true"
          @dialogClose="closeDialog"
        ></formConpoent1>
        <formConpoent1
          v-if="state.dialogVisible2"
          v-model:formConfig="state.formConfig2"
          @handle="postFormData2"
          :showBtn="true"
          @dialogClose="closeDialog"
        ></formConpoent1>
        <div style="display: flex">
          <formConpoent1
            v-if="state.dialogVisible3"
            style="width: 436px"
            v-model:formConfig="state.formConfig3"
            @handle="postFormData3"
            :showBtn="true"
            @dialogClose="closeDialog"
          ></formConpoent1>
          <div
            class="dialogVisible3"
            v-if="state.dialogVisible3"
            style="
              width: 98%;
              border-left: solid 0.5px;
              padding-left: 14px;
              max-height: 533px;
              overflow: scroll;
            "
          >
            <div style="margin-bottom: 16px">
              <el-button
                :type="[i.isSelect ? 'primary' : '']"
                v-for="(i, index) in state.options"
                @click.stop="handleClick2(index)"
                >{{ i.label }}</el-button
              >
            </div>
            <el-timeline>
              <el-timeline-item
                v-for="(i, index) in state.timeList"
                :timestamp="i.dynamicTime"
                placement="top"
              >
                <el-card>
                  <div style="margin-bottom: 10px">
                    <el-tag style="margin-right: 10px">{{
                      i.dynamicType
                    }}</el-tag>
                    <el-tag style="margin-right: 10px">{{
                      i.followUpStatus
                    }}</el-tag>
                  </div>
                  <h4>{{ i.dynamicContent }}</h4>
                  <p style="float: right; margin-bottom: 10px">
                    {{ i.dynamicNextTime }}
                  </p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
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
import {
  phoneRules,
  emtyRules
} from "@/config/constants";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { export_json_to_excel } from "@/execl/Export2Excel";
import busneissDetail from "@/components/form/busneissDetail.vue";
import testCharts from "@/components/Charts/echarts.vue";
import { ref, reactive, provide, nextTick, getCurrentInstance  } from "vue";
// import { busneissData } from "./data";
import {
  map,
  entPatentGetMap,
  getSoftByNameMap,
  getTrademarkByNameMap,
  getWorksByNameMap,
  entgetRecruitByNameMap,
  entgetNewsByNameMap,
} from "./constant";
import formConpoent from "@/components/form/essay.vue";
import formConpoent1 from "@/components/form/form.vue";
import {
  entDynamicList,
  entDynamicInsert,
  entMerchantsSuccessList,
  entMerchantsSuccessListInsert,
  entMerchantsSuccessListUpdate,
  entMerchantsSuccessListImportExcel,
  entMerchantsSuccessListdelete,
  entMerchantsPersonList,
  entMerchantsPersonInsert,
  entMerchantsPersondelete,
  entGetByName,
  entPatentGet,
  entgetSoftByName,
  entgetTrademarkByName,
  entgetWorksByName,
  entgetRecruitByName,
  entgetNewsByName,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import { formConfigItem } from "@/utils/interface";
import { deleteItem, get, post } from "@/utils/request";
export default {
  name: "sensitive-manage",
  data() {
    return {
      entCodeStatus: {},
      tableHeaderConfig: [
        {
          prop: "companyName",
          label: "企业名称",
        },
        {
          prop: "contactPerson",
          label: "企业联系人",
        },
        {
          prop: "contactPhone",
          label: "联系人手机",
        },
        /*         {
          prop: "entCode",
          label: "社会统一代码",
        }, */
        {
          prop: "entSource",
          label: "招商来源",
        },
        {
          prop: "hctd",
          label: "招商专员",
        },
        {
          prop: "entLocal",
          label: "地址",
        },
        {
          prop: "storageTime",
          label: "导入时间",
        },
        {
          prop: "entStatus",
          label: "状态",
        },
      ],
      tableHeaderConfig1: [
        {
          prop: "listName",
          label: "",
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
}
let minTime = ref<String>('');
const formConfig: formConfigItem[] = [
  {
    prop: "companyName",
    label: "企业名称",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "contactPerson",
    label: "企业联系人",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "contactPhone",
    label: "联系人手机",
    rules: { required: true, validator: phoneRules, trigger: 'blur'},
    showInput: true,
  },
  /*         {
          prop: "entCode",
          label: "社会统一代码",
        }, */
  {
    prop: "entSource",
    label: "招商来源",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "hctd",
    label: "招商专员",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  },
  {
    prop: "entLocal",
    label: "地址",
    rules: { required: true, validator: emtyRules, trigger: 'blur'},
    showInput: true,
  }
];

const map1 = {
  工商信息: [
    "BASICINFO",
    // 'RESULTTYPEINFO',
    "MAINMANAGERINFO",
    "SHAREHOLDERINFO",
    "SIMPLECANCELINFO",
    "CHANGEINFO",
  ],
  处罚信息: [
    "SERIOUSDISHONESTYINFO",
    "LAWADMININFO",
    "ABNORMALOPERATIONINFO",
    "JUDICIALAIDEQUITYFREEZEINFO",
    "EQUITYPLEDGEDDETAILZXINFO",
    "CHATTELMORTGAGEDYQRINFO",
    "EQUITYPLEDGEDDETAILBGINFO",
    "SPOTCHECKINFO",
    "CHATTELMORTGAGEINFO",
    "CHATTELMORTGAGEBDBZQINFO",
    "CHATTELMORTGAGEDYWINFO",
    "CHATTELMORTGAGEBGINFO",
    "CHATTELMORTGAGEZXINFO",
    "JUDICIALAIDINFO",
    "SETTLEACCOUNTINFO",
    "JUDICIALAIDEQUITYCHANGEINFO",
    "EQUITYPLEDGEDINFO",
  ],
  企业年报: [
    "ANNREPORTINFO",
    "ANNREPORTINVINFO",
    "ANNREPORTTOINVINFO",
    "ANNREPORTWEBSITEINFO",
    "ANNREPORTASSETSINFO",
    "ANNREPORTFORGUARANTEEINFO",
    "ANNREPORTSTOCKCHANAGEINFO",
    "ANNREPORTSOCIALSECURITYINFO",
    "ANNREPORTUPDATEINFO",
  ],
  企业投资: ["BRANCHINFO", "INVESTMENTABROADINFO"],
  人员投资: [
    "ASSOCIATEPERSONINVESTMENTINFO",
    "ASSOCIATEPERSONOFFICEINFO",
    "LAWPERSONTOOTHERINFO",
    "LAWPERSONTOINVESTINFO",
  ],
  上市公司: ["LISTEDCOMPANYINFORMATIONINFO", "LISTEDCOMPANYSHAREHOLDEINFO"],
};
const map2 = {
  专利信息: ["ANNREPORTINFO"],
};
const map3 = {
  软著: ["ANNREPORTINFO"],
};
const map4 = {
  商标: ["ANNREPORTINFO"],
};
const map5 = {
  著作权: ["ANNREPORTINFO"],
};
const map6 = {
  招聘: ["ANNREPORTINFO"],
};
const map7 = {
  舆情: ["EVENT", "KEYWORD"],
};
const InputRef = ref<InstanceType<typeof ElInput>>();

const routerTo = async (row) => {
  title.value = '企业评估';
  state.busneissName = row.companyName;
  // state.dialogVisible1 = true;
  state.applyDialogVisible = true;
  // await getentGetByName(row.entName);
};
const detail = (row) => {
  ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteItem(`${entMerchantsSuccessListdelete}`, {
        data: [row.primaryId],
      }).then(function (data) {
        getentMerchantsSuccessList();
      });
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};
const echartsTo = async (row) => {
  title.value = '效果追踪';
  state.busneissName = row.companyName;
  // state.dialogVisible1 = true;
  state.dialogVisible = true;
  state.dialogVisible4 = true;
  // await getentGetByName(row.entName);
};
const routerTo1 = async (row) => {
    state.busneissName = row.companyName;
    state.applyDialogVisible = true;
};
const dtTo = (row) => {
  title.value = '动态追踪';
  state.companyName = row.companyName;
  getentDynamicList();
};
const fn = ({row, column}) => {
    if(column.label === '企业名称') {
      return {
      color: `#409eff`
    }
    };
  };
let {ctx:that, proxy} = getCurrentInstance()
const getentDynamicList = () => {
  post(`${entDynamicList}`, {
    companyName: state.companyName,
  })
  .then(function (res) {
    state.dialogVisible = true;
    state.timeList = res.list;
    minTime.value = res.list[0] ? res.list[0].dynamicNextTime : '';
    // 强渲染
    proxy.$forceUpdate();
    state.dialogVisible3 = true;
  })
  .catch((e) => {
    console.log("e", e);
  });
};
/**
 * 提交表单数据
 */
 const postFormData3 = (formData) => {
  post(`${entDynamicInsert}`, {
    companyName: state.companyName,
    ...formData,
  })
    .then(function (data) {
      ElMessage.success("添加成功");
      getentDynamicList();
      state.formConfig = state.formConfig.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
      state.formConfig2 = state.formConfig2.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
      state.formConfig3 = state.formConfig3.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
    })
    .catch((e) => {
      console.log("e", e);
    });
/*   state.dialogVisible = false;
  state.dialogVisible3 = false; */
  console.log("submit!", formData);
};

const dateChange = (value) => {
  state.startTime = value[0];
  state.endTime = value[1];
  getentMerchantsSuccessList();
};

const handleClick = (index) => {
  // state.status[state.statusIndex].isSelect = false;
  state.status[index].isSelect = !state.status[index].isSelect;
  if (state.listIds.indexOf(state.status[index].value) > -1) {
    state.listIds.splice(state.listIds.indexOf(state.status[index].value), 1);
  } else {
    state.listIds.push(state.status[index].value);
  }
  console.log("state.listId0---", state.listIds);
  getentMerchantsSuccessList();
};
// 修改
const edit = (row) => {
  state.isAdd = false;
  title.value = "编辑";
  state.dialogVisible = true;
  state.dialogVisible1 = true;
  currentRoleId.value = row.id;
  state.primaryId = row.primaryId;
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };
    result[e.prop] = row[e.prop];
    return result;
  });
};

const addTab = (targetName: string) => {
  state.dialogVisible = true;
  state.dialogVisible2 = true;
};

/**
 * 提交表单数据
 */
const postFormData2 = (formData) => {
  post(`${entMerchantsPersonInsert}`, {
    id: currentRoleId.value,
    ...formData,
  })
    .then(function (data) {
      ElMessage.success("添加成功");
      getentMerchantsPersonList();
      state.formConfig = state.formConfig.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
      state.formConfig2 = state.formConfig2.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
      state.formConfig3 = state.formConfig3.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible = false;
  state.dialogVisible2 = false;
  console.log("submit!", formData);
};

const clickTab = (tab: TabsPaneContext) => {
  state.listName = tab.listName;
  state.primaryId = tab.primaryId;
  getentMerchantsSuccessList();
};

const options1 = [
  {
    value: "",
    label: "全部",
    isSelect: false,
  },
  {
    value: "微信",
    label: "微信",
    isSelect: false,
  },
  {
    value: "电话",
    label: "电话",
    isSelect: false,
  },
  {
    value: "短信",
    label: "短信",
    isSelect: false,
  },
  {
    value: "拜访",
    label: "拜访",
    isSelect: false,
  },
];
const state = reactive({
  currentPage: 0,
  echartsOptions: {
    title: {
      text: "财税数据",
    },
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: ["product", "营业收入", "纳税总额", "资产总额", "负债总额"],
      source: [
        {
          product: "2022年",
          营业收入: 2987.3,
          纳税总额: 30.1,
          资产总额: 10153.9,
          负债总额: 991.4,
        },
        {
          product: "2021年",
          营业收入: 4512.2,
          纳税总额: 3.6,
          资产总额: 10639.2,
          负债总额: 1226.2,
        },
        {
          product: "2020年",
          营业收入: 1874.0,
          纳税总额: 71.4,
          资产总额: 9591.2,
          负债总额: 1361.1,
        },
      ],
    },
    xAxis: { type: "category" },
    yAxis: {
      name: "单位（万元）",
      axisLabel: {
        //这种做法就是在y轴的数据的值旁边拼接单位，貌似也挺方便的
        formatter: "{value} 万元",
      },
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
    ],
  },
  pageSize: 5,
  activeName: "待沟通",
  applyDialogVisible: false,
  dialogVisible4: false,
  formConfig: Object.assign([], formConfig),
  formConfig2: [
    {
      prop: "listName",
      label: "名单名称",
      rules: { required: true, validator: emtyRules, trigger: 'blur'},
      showInput: true,
    },
  ],
  // statusIndex: 0,
  status: [
    {
      value: "待接洽",
      label: "待接洽",
      isSelect: false,
    },
    {
      value: "有意向",
      label: "有意向",
      isSelect: false,
    },
    {
      value: "无意向",
      label: "无意向",
      isSelect: false,
    },
    {
      value: "已入驻",
      label: "已入驻",
      isSelect: false,
    },
  ],
  options: options1,
  formConfig3: [
    {
      prop: "dynamicType",
      label: "跟进方式",
      rules: { required: true, validator: emtyRules, trigger: 'blur'},
      options: options1,
      showSelect: true,
    },
    {
      prop: "followUpStatus",
      label: "跟进状态",
      rules: { required: true, validator: emtyRules, trigger: 'blur'},
      options: [
        {
          value: "未回复",
          label: "未回复",
          isSelect: false,
        },
        {
          value: "未接听",
          label: "未接听",
          isSelect: false,
        },
        {
          value: "回复预约",
          label: "回复预约",
          isSelect: false,
        },
        {
          value: "已拒绝",
          label: "已拒绝",
          isSelect: false,
        },
      ],
      showSelect: true,
    },
    {
      prop: "dynamicTime",
      label: "动态日期",
      placeholder: "动态日期",
      rules: { required: true, validator: emtyRules, trigger: 'blur'},
      showDatePicker: true,
      getMaxTime: () => new Date()
    },
    {
      prop: "dynamicNextTime",
      label: "下一次跟进日期",
      placeholder: "下一次跟进日期",
      rules: { required: true, validator: emtyRules, trigger: 'blur'},
      showDatePicker: true,
      getMinTime: () => minTime.value
    },
    {
      prop: "dynamicContent",
      label: "备注",
      rules: { required: true, validator: emtyRules, trigger: 'blur'},
      showTextarea: true,
    },
  ],
  inputValue: "",
  inputVisible: "",
  listName: "",
  primaryId: "",
  tableData: [],
  tabTableData: [
    {
      listName: "全部",
      primaryId: "",
    },
  ],
  listIds: [],
  selectionList: [],
  total: 0,
  isAdd: false,
  entName: "",
  entLocal: "",
  entSource: "",
  hctd: "",
  startTime: "",
  value2: "",
  endTime: "",
  startTime: "",
  endTime: "",
  searchKey: "",
  sensitiveword: "",
  dialogVisible1: false,
  dialogVisible2: false,
  dialogVisible: false,
  tabList: [],
  baseInfo: {},
});

let currentRoleId = ref<string>("");
const title = ref<string>("添加");

// 导入表格
const importClick = (e) => {
  var axios = require("axios");
  var FormData = require("form-data");
  var data = new FormData();
  data.append("file", e); // file 即选中的文件
  data.append("listId", state.primaryId); // file 即选中的文件
  data.append("listName", state.listName); // file 即选中的文件
  var config = {
    method: "post",
    url: `${entMerchantsSuccessListImportExcel}`, //上传图片地址
    data: data,
  };
  axios(config)
    .then(function (res) {
      if(res.data.code === '3003') {
        ElMessage.error(res.data.msg);
      } else {
        ElMessage.success("添加成功");
        getentMerchantsSuccessList();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const handleSelectionChange = (row) => {
  state.selectionList = row; 
};
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
          prop: "contactPerson",
          label: "企业联系人",
        },
        {
          prop: "contactPhone",
          label: "联系人手机",
        },
        /*         {
          prop: "entCode",
          label: "社会统一代码",
        }, */
        {
          prop: "entSource",
          label: "招商来源",
        },
        {
          prop: "hctd",
          label: "招商专员",
        },
        {
          prop: "entLocal",
          label: "地址",
        },
        {
          prop: "storageTime",
          label: "导入时间",
        },
        {
          prop: "entStatus",
          label: "状态",
        },
      ];
  const tHeader = tableHeaderConfig.map(e => e.label);
  const filterVal = tableHeaderConfig.map(e => e.prop);
  const list = state.selectionList;
  const data = formatJson(filterVal, list);
  export_json_to_excel(tHeader, data, '入驻企业.xlsx');
  }

};
const formatJson  = (filterVal, jsonData) => {
    return jsonData.map(v => filterVal.map(j => v[j]));
  }


  const handleClick2 = (index) => {
  // state.status[state.statusIndex].isSelect = false;
  state.options = state.options.map((e, i) => {
    if(i === index) {
      e.isSelect = !e.isSelect;
      state.dynamicType = e.value;
    } else {
      e.isSelect = false;
    };
    return e;
  });
  post(`${entDynamicList}`, {
      companyName: state.companyName,
      dynamicType: state.dynamicType
    }).then(res => {
      state.timeList = res.list;
    });
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
      "入驻企业"
    ); //自定义文件名
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
};
const reset = () => {
  // state.listName = "";
  // state.primaryId = "";
  state.entName = "";
  state.listIds = "";
  state.value2 = "";
  state.startTime = "";
  state.endTime = "";
  state.entLocal = "";
  state.entSource = "";
  state.hctd = "";
  getentMerchantsSuccessList();
};
const add = () => {
  title.value = '添加';
  state.dialogVisible = true;
  state.dialogVisible1 = true;
  state.isAdd = true;
};

/**
 * 提交表单数据
 */
const postFormData = (formData) => {
  post(
    `${
      state.isAdd
        ? entMerchantsSuccessListInsert
        : entMerchantsSuccessListUpdate
    }`,
    {
      listName: state.listName,
      primaryId: state.primaryId,
      ...formData,
    }
  )
    .then(function (data) {
      ElMessage.success("添加成功");
      state.primaryId = '';
      getentMerchantsSuccessList();
      state.formConfig = state.formConfig.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
      state.formConfig2 = state.formConfig2.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
      state.formConfig3 = state.formConfig3.map((e, b) => {
        let result = { ...e };  
        delete result[e.prop];
        return result;
      });
      console.log('state.formConfig3----', state.formConfig3);
    })
    .catch((e) => {
      console.log("e", e);
    });
  state.dialogVisible = false;
  state.dialogVisible1 = false;
};

// todo 改写法
const closeDialog = async (done: () => void) => {
  state.dialogVisible = false;
  state.dialogVisible1 = false;
  state.dialogVisible2 = false;
  state.dialogVisible3 = false;
  state.dialogVisible4 = false;
  state.applyDialogVisible = false;
  state.formConfig = state.formConfig.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
  state.formConfig2 = state.formConfig2.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
  state.formConfig3 = state.formConfig3.map((e, b) => {
    let result = { ...e };  
    delete result[e.prop];
    return result;
  });
};
//  文章内容列表
const getentMerchantsSuccessList = () => {
  post(`${entMerchantsSuccessList}`, {
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    listName: state.listName,
    listId: state.primaryId,
    companyName: state.entName,
    // "listIds": state.listIds,
    startTime: state.startTime,
    endTime: state.endTime,
    entLocal: state.entLocal,
    entSource: state.entSource,
    hctd: state.hctd,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
};
getentMerchantsSuccessList();
// getentMerchantsPersonList();
//  文章内容列表
const getentGetByName = (busneissName) => {
  get(`${entGetByName}/${busneissName}`, {}).then(async function (data) {
    let list = [];
    Object.keys(map1).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map1[i].forEach((key, index) => {
        if (key === "BASICINFO") {
          state.baseInfo = {
            id: index,
            businessConfig: {
              ENTNAME: "企业名称",
              DOM: "地点",
            },
            businessMessage: {
              ENTNAME: data[key][0].ENTNAME,
              DOM: data[key][0].DOM,
            },
          };
        }
        obj.optionsList.push({
          id: index,
          ...map[key],
          businessMessage: data[key],
        });
      });
      list.push(obj);
    });
    state.tabList = list;
    let data1 = await Promise.all([
      getentPatentGet(busneissName),
      getentgetSoftByName(busneissName),
      getTrademarkByName(busneissName),
      getRecruitByName(busneissName),
      getNewsByName(busneissName),
      getWorksByName(busneissName),
    ]);
    state.dialogVisible = true;
  });
};

//  文章内容列表
const getentPatentGet = (busneissName) => {
  return get(`${entPatentGet}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map2).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map2[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...entPatentGetMap[key],
          businessMessage: data,
        });
      });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};

//  软著列表
const getentgetSoftByName = (busneissName) => {
  return get(`${entgetSoftByName}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map3).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map3[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...getSoftByNameMap[key],
          businessMessage: data,
        });
      });
      list.push(obj);
    });

    state.tabList = state.tabList.concat(list);
    return true;
  });
};

//  商标列表
const getTrademarkByName = (busneissName) => {
  return get(`${entgetTrademarkByName}/${busneissName}`, {}).then(function (
    data
  ) {
    let list = [];
    Object.keys(map4).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map4[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...getTrademarkByNameMap[key],
          businessMessage: data,
        });
      });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};
//  著作权列表
const getWorksByName = (busneissName) => {
  return get(`${entgetWorksByName}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map5).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map5[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...getWorksByNameMap[key],
          businessMessage: data,
        });
      });
      list.push(obj);
      title.value = "查看详情";
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};

//  招聘列表
const getRecruitByName = (busneissName) => {
  return get(`${entgetRecruitByName}/${busneissName}`, {}).then(function (
    data
  ) {
    let list = [];
    Object.keys(map6).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      map6[i].forEach((key, index) => {
        obj.optionsList.push({
          id: index,
          ...entgetRecruitByNameMap[key],
          businessMessage: data,
        });
      });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};

// 舆情列表
const getNewsByName = (busneissName) => {
  return get(`${entgetNewsByName}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map7).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      /*        map7[i].forEach((key, index) => {
          
          obj.optionsList.push({
                id: index,
                ...entgetNewsByNameMap[key],
                businessMessage: data[index][key]
            });
        });  */
      data.length > 0 &&
        obj.optionsList.push({
          id: 0,
          ...entgetNewsByNameMap["EVENT"],
          businessMessage: data[0]["EVENT"],
        });
      data.length > 0 &&
        obj.optionsList.push({
          id: 1,
          ...entgetNewsByNameMap["KEYWORD"],
          // todo 此处优化
          businessMessage: [{ aaaa: data[0]["KEYWORD"] }],
        });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};
const handleChange = (val) => {
  post(`${entMerchantsSuccessList}`, {
    companyName: val,
    pageNum: state.currentPage,
    pageSize: state.pageSize,
  }).then(function (data) {
    state.tableData = data.list;
    state.total = data.total;
  });
  state.tableData = [{}];
};

// 切换每页显示数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  state.pageSize = val;
  getentMerchantsSuccessList();
};

// 换页数
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  state.currentPage = val;
  getentMerchantsSuccessList();
};
const loading = ref(false);

const formInline = reactive({
  username: "",
});
</script>

<style lang="scss">
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
  .custom-header {
    background: gray;
    th.el-table__cell {
      // background: var(--el-fill-color-light);
    }
  }
    .hover-row>td.el-table__cell {
    background-color: white !important;
  } 
  .hover-row:hover {
      cursor: pointer;
      th.el-table__cell {
        background-color: none !important;
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
</style>
