<template>
  <u-container-layout >
    <span v-if="title">{{state.title}}</span>
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
        :rules="[
          { required: item.required, message: `${item.label}为必填项` }
        ]"
        :prop="item.prop"
        :label="item.label"
      >
        {{ item[i] }}
        <!--输入框-->
        <el-input v-model="item[item.prop]" v-if="item.showInput" />
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
          @click="getIndex(i)"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="item.picture"
            :src="item.picture"
            style="width: 50px; height: 50px;"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
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
    <div v-if="state.showBtn">
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
import {upLoad} from "@/config/api";

/* const mqtt = require("mqtt");
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
const host = 'ws://172.16.130.92:15675/ws'
const topic = 'push_message_topic'
const options = {
keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  username: 'admin',
  password: 'Ip0s0cKw2p1ua0wugyUkmHkTIlQ6tjsQ',
   clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: topic,
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
};
const client = mqtt.connect(host, options);
client.on("connect", function (e) {
  console.log('e----------', e);
  client.subscribe("push_message_topic", function (err) {
    if (!err) {
      console.log('presence');
      client.publish("push_message_topic", "Hello mqtt");
    }
  });
});
client.on("message", function (topic, message) {
  // message is Buffer
  console.log('topic', topic, message.toString());
  client.end();
});
client.on("packetsend", function (topic, message) {
  // message is Buffer
 console.log('topic', topic, message);
  // client.end();
}); */


const emit = defineEmits(["handle", "dialogClose"]);
let props = defineProps({
  formConfig: {
    type: Object
  },
  title: {
    type: String,
    default: ''
  },
  showBtn: {
    type: Boolean,
    default: true
  }
});
const state = reactive(props);
const itemIndex = ref();
const content = ref('');
console.log("state----", state);
// watch(
//     () => props.formConfig,
//     (val, prevVal) => {
//         // state.formConfig = val;
//         console.log('formConfig----', val);
//     }
// )
const formData = {};
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  state.formConfig.forEach((v) => {
    formData[v.prop] = v[v.prop];
  });
  emit("handle", formData);
  ElMessage.success("保存成功");
};

const preview = () => {};

const resetForm = (formEl: FormInstance | undefined) => {
  emit("dialogClose");
};

//富文本编辑emit事件
const changeContent = (HTML:　String) => {
  // todo 记得封装一下
  console.log('changeContent', HTML);
  state.formConfig[itemIndex.value].sersynopsis = HTML;
};

const getIndex = (i: Number) => {
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
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          type: "image",
          data: data
        };
        axios.defaults.crossDomain = true;
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios(config)
        .then(function (res) {
          state.formConfig[itemIndex.value].picture = res;
        })
        .catch(function (error) {
          console.log(error);
        });
};
</script>
