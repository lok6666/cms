<template>
  <u-container-layout>
    <span v-if="title">{{ state.title }}</span>
    <!--看了源码,为了required校验,必须在form标签循环-->
    <div :style="customStyle">
      <el-form
        ref="formRef"
        style="width: 80%; display: inline"
        v-for="(item, i) in state.formConfig"
        :key="i"
        :disabled="state.disabled || item.disabled"
        :model="item"
        class="demo-dynamic"
        label-width="140px"
        label-position="right"
      >
        <el-form-item
          :rules="
            item.rules || [
              {
                required: item.required,
                message: `${item.label}为必填项`,
                validator: item.validator,
              },
            ]
          "
          :prop="item.prop"
          :label="item.label"
        >
          {{ item[i] }}
          <!--输入框-->
          <el-input
            :readonly="state.disabled"
            v-model="item[item.prop]"
            v-if="item.showInput"
          />
          <!--输入框-->
          <el-input
            v-model="item[item.prop]"
            type="textarea"
            v-if="item.showTextarea"
          />
          <!--时间选择器-->
          <el-date-picker
            v-model="item[item.prop]"
            type="datetime"
            v-if="item.showDatePicker"
            :placeholder="item[placeholder]"
            :disabled-date="
              (e) => {
                if (!item.getMinTime && !item.getMaxTime) {
                  return false;
                } else if (item.getMinTime) {
                  return minTime(e, item.getMinTime, item);
                } else if (item.getMaxTime) {
                  return maxTime(e, item.getMaxTime, item);
                }
              }
            "
            format="YYYY/MM/DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
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
            :multiple="item.multiple"
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
          <!--附件文件-->
          <!--照片墙-->
          <div v-if="item.zlupload && item[item.prop]" class="avatar-uploader">
            <img
              v-for="i in JSON.parse(item[item.prop])"
              :src="i.url"
              style="width: 120px; height: 80px"
              class="avatar"
            />
          </div>
          <!--             <div v-else-if="item.showFile && item[item.prop]" class="avatar-uploader" style="display: flex;flex-direction: column;">
              <div v-for="(items, i) in Object.values(JSON.parse(item[item.prop]))">
                {{JSON.parse(items)[0].label}}: <a :href="JSON.parse(items)[0].url">{{JSON.parse(items)[0].name}}</a>
              </div>  
            </div> -->
          <!--上传图片-->
          <div @click.stop="getIndex(i)" v-else-if="item.upload">
            <el-upload
              class="avatar-uploader"
              v-if="item.upload"
              :list-type="rest(item[item.prop])"
              :before-upload="beforeAvatarUpload"
              :on-change="handleChange"
            >
              <div v-if="item[item.prop]">
                <video
                  v-if="item.isSHowVideo"
                  :src="item[item.prop]"
                  style="width: 178px; height: 178px"
                  @click="getIndex(i, item)"
                  class="avatar"
                ></video>
                <img
                  v-else
                  :src="item[item.prop]"
                  style="width: 178px; height: 178px"
                  @click="getIndex(i, item)"
                  class="avatar"
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop="handlePictureCardPreview(item[item.prop])"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click.stop="handleRemove(i, item[item.prop])"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
             <el-icon v-else class="avatar-uploader-icon" @click="getIndex(i, item)"><Plus /></el-icon>
            </el-upload>
          </div>
          <!--上传视频-->
          <div @click.stop="getIndex(i)" v-else-if="item.videoUpload">
            <el-upload
              class="avatar-uploader"
              v-if="item.videoUpload"
              :action="upLoad"
              :data="upLoadData.upload"
              :before-upload="videoBeforeAvatarUpload"
              :on-progress="videoProgress"
              :on-success="videoSuccess"
              :on-remove="videoRemove"
              :file-list="fileList"
            >
              <div v-if="item[item.prop]" class="el-upload-list--picture-card">
                <video
                  :src="item[item.prop]"
                  style="width: 178px; height: 178px"
                  @click="getIndex(i, item)"
                  class="avatar"
                ></video>
    <!--             <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop="handleVideoCardPreview(item[item.prop])"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click.stop="handleRemove(i, item[item.prop])"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span> -->
              </div>       
              <el-icon  v-else class="avatar-uploader-icon" @click="getIndex(i, item)"><Plus /></el-icon>
            </el-upload>
          </div>
          <!--富文本编辑-->
          <div
            @click.stop="getIndex(i)"
            ref="uploadSingle"
            :indexValue="i"
            v-if="item.showWangEditor"
          >
            <editor :content="item[item.prop]" @handle="changeContent"></editor>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog v-model="dialogVisible">
      <img  :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height:100%"/>
    </el-dialog>
    <el-dialog v-model="dialogVideoVisible">
      <video  autoplay='true' controls="true" :src="dialogVideoUrl"  style="width: 100%; height:100%"></video>
    </el-dialog>
    <div v-if="state.showBtn" style="float: right">
      <el-button type="primary" @click.stop="submitForm(formRef)"
        >保存</el-button
      >
      <el-button @click.stop="resetForm(formRef)">取消</el-button>
    </div>
  </u-container-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, getCurrentInstance, computed } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage, UploadProps, UploadUserFile } from "element-plus";
import editor from "@/components/editor/index.vue";
import { upLoad } from "@/config/api";
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

let upLoadData = reactive({
  upload: {}
});
const dialogImageUrl = ref('')
const dialogVideoUrl = ref('')
const dialogVisible = ref(false)
const dialogVideoVisible = ref(false)
const fileList = ref<UploadUserFile[]>([]);
const defaultTime2: [Date, Date] = [new Date(2022, 11, 1, 12, 0, 0)];
let minTimeValue = ref<String>("");
let maxTimeValue = ref<String>("");
const minTime = (time, getMinTime, item): boolean => {
  if (!minTimeValue.value) {
    minTimeValue.value = getMinTime();
  }
  return new Date(minTimeValue.value).getTime() > new Date(time).getTime();
};
const maxTime = (time, getMaxTime, item): boolean => {
  if (!maxTimeValue.value) {
    maxTimeValue.value = getMaxTime();
  }
  return new Date(maxTimeValue.value).getTime() < new Date(time).getTime();
};
const emit = defineEmits(["handle", "dialogClose"]);
const uploadSingle = ref(null);
let props = defineProps<prop>();
const state = reactive(props);
const progressPercentState = ref<number>(0);
const isShowprogressPercent = ref(true);
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
onMounted(() => {
  return uploadSingle;
});
/**
 * 表单校验
 */
const validateForm = (formEl: FormInstance | undefined) => {
  return new Promise((resolve, reject) => {
    let add: number = 0;
    formEl.forEach(async (el, i) => {
      el.validate((v, a, c) => {
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
  console.log('state.formConfig---', state.formConfig);
  if (await validateForm(formEl)) {
    state.formConfig.forEach((v) => {
      formData[v.prop] = v[v.prop];
    });
    emit("handle", formData);
    // ElMessage.success("保存成功");
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

const handleRemove = (i, res) => {
  state.formConfig[i][
        state.formConfig[i].prop
      ] = '';
      formRef.value[i] && formRef.value[i].validate(() => true);
};
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file;
  dialogVisible.value = true;
};
const handleVideoCardPreview = (file: UploadFile) => {
  dialogVideoUrl.value = file;
  dialogVideoVisible.value = true;
};
const rest = (i) => {
  return i ? 'picture-card' : ''
};

// 获取索引
const getIndex = (i: Number, item) => {
  itemIndex.value = i;
};
let {ctx:that, proxy} = getCurrentInstance()
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
      formRef.value[itemIndex.value] && formRef.value[itemIndex.value].validate(() => true);
	    proxy.$forceUpdate()
    })
    .catch(function (error) {
      console.log(error);
    });
};
/**
 * 上传视频
 */
 const videoBeforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  let FormData = require("form-data");
  upLoadData.upload = new FormData();
  upLoadData.upload.file = rawFile; // file 即选中的文件
  upLoadData.upload.userId = window.localStorage;
  upLoadData.upload.type = "video";
};
const videoSuccess = (res) => {
  console.log('videoSuccess---', res);
  state.formConfig[itemIndex.value][
      state.formConfig[itemIndex.value].prop
    ] = res;
    formRef.value[itemIndex.value] && formRef.value[itemIndex.value].validate(() => true);
    proxy.$forceUpdate()
};
const videoProgress = (file) => {
  if(file.percent === 100) {
    file.percent = 99
  };
  return file;
};
const videoRemove = (file) => {
  state.formConfig[itemIndex.value][
        state.formConfig[itemIndex.value].prop
      ] = '';
      formRef.value[itemIndex.value] && formRef.value[itemIndex.value].validate(() => true);
      proxy.$forceUpdate()
};
</script>
<style lang="scss">
.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: var(--el-overlay-color-lighter);
  transition: opacity var(--el-transition-duration);
}
</style>
