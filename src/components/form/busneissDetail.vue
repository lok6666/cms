<template>
  <!-- <u-container-layout> -->
    <div class="inline-edit-table">
      <el-dialog
        v-model="state.applyDialogVisible"
        :title="title"
        top="1vh"
        :center="true"
        width="98%"
        @closed="closeDialog()"
      >
        <entTable
          v-if="state.applyDialogVisible2"
          :tabList="state.tabList"
          v-model:baseInfo="state.baseInfo"
          v-model:formConfig="state.formConfig"
          @handle="postFormData"
          @dialogClose="closeDialog"
        ></entTable>
      </el-dialog>
    </div>
  <!-- </u-container-layout> -->
</template>
<script lang="ts">
import entTable from "@/components/form/essay.vue";
import formConpoent1 from "@/components/form/form.vue";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  map,
  entPatentGetMap,
  getSoftByNameMap,
  getTrademarkByNameMap,
  getWorksByNameMap,
  entgetRecruitByNameMap,
  entgetNewsByNameMap,
} from "./constant";
import { ref, reactive, provide } from "vue";
import formConpoent from "@/components/form/form.vue";
import examineFormConpoent from "@/components/form/examineForm.vue";
import {
  entMerchantsPersonInsert,
  entMerchantsList,
  entApplyAll,
  entApplAddOne,
  entApplyUpdateOne,
  entApplyDelete,
  entPatentGet,
  entGetByName,
  entgetSoftByName,
  entgetTrademarkByName,
  entgetWorksByName,
  entgetRecruitByName,
  entgetNewsByName,
  entMerchantsPersonList,
} from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteItem, post, get } from "@/utils/request";
export default {
  name: "sensitive-manage",
  data() {
    return {};
  },
};
</script>
<script lang="ts" setup>
interface prop {
  busneissName: {
    type: String;
    default: "";
  },
}
const emit = defineEmits(["dialogClose"]);
let props = defineProps<prop>();
const state = reactive({
  currentPage: 0,
  pageSize: 10,
  tableData: [],
  total: 0,
  entName: "",
  baseInfo: {},
  busneissName: props.busneissName,
  sensitiveword: "",
  applyDialogVisible: false,
  applyDialogVisible2: true,
  disabled: true,
});

let currentRoleId = ref<string>("");
const title = ref<string>("??????");
const map1 = {
  ????????????: [
    "BASICINFO",
    // 'RESULTTYPEINFO',
    "MAINMANAGERINFO",
    "SHAREHOLDERINFO",
    "SIMPLECANCELINFO",
    "CHANGEINFO",
  ],
  ????????????: [
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
  ????????????: [
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
  ????????????: ["BRANCHINFO", "INVESTMENTABROADINFO"],
  ????????????: [
    "ASSOCIATEPERSONINVESTMENTINFO",
    "ASSOCIATEPERSONOFFICEINFO",
    "LAWPERSONTOOTHERINFO",
    "LAWPERSONTOINVESTINFO",
  ],
  ????????????: ["LISTEDCOMPANYINFORMATIONINFO", "LISTEDCOMPANYSHAREHOLDEINFO"],
};
const map2 = {
  ????????????: ["ANNREPORTINFO"],
};
const map3 = {
  ??????: ["ANNREPORTINFO"],
};
const map4 = {
  ??????: ["ANNREPORTINFO"],
};
const map5 = {
  ?????????: ["ANNREPORTINFO"],
};
const map6 = {
  ??????: ["ANNREPORTINFO"],
};
const map7 = {
  ??????: ["EVENT", "KEYWORD"],
};

//  ??????????????????
const getentGetByName = (busneissName) => {
  get(`${entGetByName}/${busneissName}`, {}).then(async function (data) {
    if(Object.keys(data).length === 0) {
        ElMessage({
            message: '????????????',
            type: 'error'
        });
        emit('dialogClose');
    } else {
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
                ENTNAME: "????????????",
                DOM: "??????",
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
      state.applyDialogVisible = true;
      state.applyDialogVisible2 = true;
    }
  });
};
getentGetByName(state.busneissName);

//  ??????????????????
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

//  ????????????
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

//  ????????????
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
//  ???????????????
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
      title.value = "????????????";
    });
    state.tabList = state.tabList.concat(list);
  });
};

//  ????????????
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

// ????????????
const getNewsByName = (busneissName) => {
  return get(`${entgetNewsByName}/${busneissName}`, {}).then(function (data) {
    let list = [];
    Object.keys(map7).forEach((i, index) => {
      let obj = {
        tabName: i,
        id: index,
        optionsList: [],
      };
      /*       map7[i].forEach((key, index) => {
          debugger;
          obj.optionsList.push({
                id: index,
                ...entgetNewsByNameMap[key],
                businessMessage: data[index][key]
            });
        }); */
      obj.optionsList.push({
        id: 0,
        ...entgetNewsByNameMap["EVENT"],
        businessMessage: data[0]["EVENT"],
      });
      obj.optionsList.push({
        id: 1,
        ...entgetNewsByNameMap["KEYWORD"],
        // todo ????????????
        businessMessage: [{ aaaa: data[0]["KEYWORD"] }],
      });
      list.push(obj);
    });
    state.tabList = state.tabList.concat(list);
    return true;
  });
};
// todo ?????????
const closeDialog = async (done: () => void) => {
  emit('dialogClose');
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
