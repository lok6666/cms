<template>
  <u-container-layout>
    <span v-if="title">{{ state.title }}</span>
    <!--看了源码,为了required校验,必须在form标签循环-->
    <el-form
      ref="formRef"
      v-for="(item, i) in state.formConfig"
      :key="i"
      :disabled="item.disabled"
      :model="item"
      class="demo-dynamic"
      label-width="180px"
      label-position="right"
    >
      <el-form-item
        :rules="[{ required: item.required, message: `${item.label}为必填项` }]"
        :prop="item.prop"
        :label="item.label"
      >
        {{ item[i] }}
        <!--输入框-->
        <el-input v-model="item[item.prop]" v-if="item.showInput" />
        <!--时间选择器-->
        <el-date-picker
          v-model="item[item.prop]"
          type="datetime"
          v-if="item.showDatePicker"
          :placeholder="item[placeholder]"
          format="YYYY/MM/DD hh:mm:ss"
          value-format="YYYY-MM-DD hh:mm:ss"
        />
        <!--年选择器-->
        <el-date-picker
          v-model="item[item.prop]"
          type="year"
          v-if="item.showYearPicker"
          placeholder="Pick a year"
        />
        <!--月选择器-->
        <el-date-picker
          v-model="item[item.prop]"
          type="month"
          v-if="item.showMonthPicker"
          placeholder="Pick a month"
        />
        <!--todo有待改造-->
        <el-select
          v-model="item[item.prop]"
          placeholder="请选择"
          :filterable="item.filterable"
          v-if="item.showSelect"
        >
          <el-option
            v-for="i in item.options"
            :key="i.value"
            :label="i.label"
            :value="i.value"
          />
        </el-select>
        <!--上传图片-->
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          v-if="item.upload"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="item[item.prop]"
            :src="item[item.prop]"
            style="width: 178px; height: 178px"
            class="avatar"
          />
          <video
            v-else-if="item.video"
            :src="item.video"
            controls
            style="width: 178px; height: 178px"
            class="avatar"
          ></video>
          <el-icon v-else class="avatar-uploader-icon" @click="getIndex(i, item)"><Plus /></el-icon>
        </el-upload>
        <!--富文本编辑-->
        <editor
          v-if="item.showWangEditor"
          @click="getIndex(i)"
          :content="content"
          @handle="changeContent"
        ></editor>
      </el-form-item>
    </el-form>
    <div v-if="state.showBtn" style="float: right">
      <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
      <el-button @click="resetForm(formRef)">取消</el-button>
    </div>
  </u-container-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage, UploadProps } from "element-plus";
import editor from "@/components/editor/index.vue";
import { upLoad } from "@/config/api";
import { de } from "element-plus/es/locale";
import { debugWarn } from "element-plus/es/utils";
interface prop{
   formConfig: {
    type: Array<Object>
  },
  title: {
    type: String,
    default: "",
  },
  showBtn: {
    type: Boolean,
    default: true
  }
}
const emit = defineEmits(["handle", "dialogClose"]);
let props = defineProps<prop>();
const state = reactive(props);
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
  state.formConfig[itemIndex.value][state.formConfig[itemIndex.value].prop] = HTML;
};

// 获取索引
const getIndex = (i: Number, item) => {
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
  data.append("userId", 1);
  data.append("type", "image");
  var config = {
    method: "post",
    url: `${upLoad}`, //上传图片地址
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    type: uploadType.value,
    data: data
  };
  axios.defaults.crossDomain = true;
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios(config)
    .then(function (res) {
      state.formConfig[itemIndex.value][state.formConfig[itemIndex.value].prop] = res;
    })
    .catch(function (error) {
      console.log(error);
    });
};
</script>
