<template>
  <u-container-layout>
    <div>
      <h3 style="display: inline; margin-bottom: 20px;">企业信息</h3>
        <formConpoent
        :disabled="true"
        v-model:formConfig="formConfig1"
        @handle="postFormData"
        @dialogClose="closeDialog"
        ></formConpoent>
      <h3 style="display: inline; margin-bottom: 40px;">申报材料</h3>
      <el-descriptions
        style="margin-bottom: 20px;margin-top: 20px;"
        :border="true"
        :column="2"
      >
        <el-descriptions-item
          v-for="(item, i) in applyForm"
          :key="key"
          label-class-name="my-label"
          class-name="my-content"
          :label="item.label"
          >
          <el-form
          ref="formRef"
          :inline="true"
          :key="i"
          :model="item"
          size="mini"
          style="padding-top: 21px;width: 400px;"
          label-position="right">
            <el-form-item :prop="item.prop">
                  <a :href="item.url">{{item.name}}</a>
            </el-form-item>
          </el-form>
        </el-descriptions-item>
      </el-descriptions>
      <div v-if="showBtn" style="float: right">
        <el-button type="primary" @click.stop="submitForm('formRef')">保存</el-button>
      </div>
    </div>
  </u-container-layout>
</template>

<script lang="ts" setup>
import formConpoent from "@/components/form/form.vue";
import { ref, reactive, watch, onMounted, getCurrentInstance } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage, UploadProps } from "element-plus";
import editor from "@/components/editor/index.vue";
import { upLoad, policyApplyById } from "@/config/api";
import { de } from "element-plus/es/locale";
import { debugWarn } from "element-plus/es/utils";
interface prop {
  formConfig: {
    type: Array<Object>;
  };
  title: {
    type: String;
    default: "";
  };
  showBtn: {
    type: Boolean;
    default: true;
  };
  customStyle: {
    type: Object;
    default: {};
  };
  disabled: {
    type: Boolean;
    default: false;
  };
}
const emit = defineEmits(["handle", "dialogClose"]);
const uploadSingle = ref(null);
let props = defineProps<prop>();
const state = reactive(props);

const applyForm = reactive([
  {
    prop: "individualIncomeTax1",
    label: "项目奖励类材料",
    required: false,
    file: true,
    disabled: false
  },{
    prop: "individualIncomeTax2",
    label: "项目贷款贴息类材料",
    required: false,
    file: true,
    disabled: false
  },{
    prop: "individualIncomeTax3",
    label: "项目贴租类材料",
    required: false,
    file: true,
    disabled: false
  },{
    prop: "individualIncomeTax4",
    label: "项目贴保类材料",
    required: false,
    file: true,
    disabled: false
  },{
    prop: "individualIncomeTax5",
    label: "项目保险贴费类材料",
    required: false,
    file: true,
    disabled: false
  },{
    prop: "individualIncomeTax6",
    label: "企业奖励类材料",
    required: false,
    file: true,
    disabled: false
  },{
    prop: "individualIncomeTax7",
    label: "项目补助类材料",
    required: false,
    file: true,
    disabled: false
  },{
    prop: "individualIncomeTax",
    label: "疫情期间企业贷款材料",
    required: false,
    file: true,
    disabled: false
  },
].map(el => {
    let data = JSON.parse(props.formConfig[5].policyFile)[el.prop];
    if(data) {
    el[el.prop] = {...JSON.parse(data)[0]};
    el.name = JSON.parse(data)[0].name;
    el.url = JSON.parse(data)[0].url;
    };
    return el;
}));
let formConfig1 = ref(state.formConfig.slice(0, 5));
const itemIndex = ref<number>();
const uploadType = ref<string>();
const content = ref("");
watch(
  () => props.formConfig,
  (val, prevVal) => {
    // state.formConfig = val;
    console.log("formConfig----", val);
  }
);
const formData = {};
const formRef = ref<FormInstance>();

console.log('applyForm---', applyForm);
onMounted(() => {
  return uploadSingle;
});
/**
 * 表单校验
 */
const validateForm = (formEl: FormInstance | undefined) => {
  let add: number = 0;
  return new Promise((resolve, reject) => {
    formEl.forEach(async (el) => {
      el.validate((v) => {
        ++add;
        // 当存在校验失败的情况直接返回
        if (!v) {
          resolve(false);
        }
        // 遍历结束返回
        else if (add === formEl.length) {
          resolve(true);
        }
      });
    });
  });
};

/**
 * 提交表单
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (await validateForm(formEl)) {
    state.formConfig.forEach((v) => {
      formData[v.prop] = v[v.prop];
    });
    emit("handle", formData);
    ElMessage.success("保存成功");
  }
};

/**
 * 关闭弹窗
 */
const resetForm = (formEl: FormInstance | undefined) => {
  emit("dialogClose");
};

/**
 * 富文本编辑e
 */
const changeContent = (HTML: String) => {
  // todo 记得封装一下
  let index = uploadSingle.value[0].attributes.indexvalue.value;
  state.formConfig[index].prop &&
    (state.formConfig[index][state.formConfig[index].prop] = HTML);
};

// 获取索引
const getIndex = (i: Number, item) => {
  console.log("getIndex", i);
  itemIndex.value = i;
};

/**
 * 上传图片
 */
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // if (rawFile.type !== "image/jpeg") {
  //   ElMessage.error("Avatar picture must be JPG format!");
  //   return false;
  // } else if (rawFile.size / 1024 / 1024 > 2) {
  //   ElMessage.error("Avatar picture size can not exceed 2MB!");
  //   return false;
  // }
  var axios = require("axios");
  var FormData = require("form-data");
  var data = new FormData();
  data.append("file", rawFile); // file 即选中的文件
  data.append("userId", window.localStorage);
  data.append("type", "image");
  var config = {
    method: "post",
    url: `${upLoad}`, //上传图片地址
    type: uploadType.value,
    data: data,
  };
  axios.defaults.crossDomain = true;
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios(config)
    .then(function (res) {
      state.formConfig[itemIndex.value][
        state.formConfig[itemIndex.value].prop
      ] = res;
    })
    .catch(function (error) {
      console.log(error);
    });
};
</script>
<style>
.my-label {
  width: 200px;
  border-left: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.my-content {
  border: 1px solid #ebeef5;
  padding-left: 23px;
}
</style>
