<template>
  <u-container-layout >
    <!--看了源码,为了required校验,必须在form标签循环-->
    <el-form
      ref="formRef"
      v-for="(item, i) in state.formConfig"
      :key="i"
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
          v-if="item.showSelect"
        >
          <el-option
            v-for="i in item.options"
            :key="i.value"
            :label="i.label"
            :value="i.value"
            :disabled="i.disabled"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </div>
  </u-container-layout>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
const mqtt = require("mqtt");
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
});


const emit = defineEmits(["handle", "dialogClose"]);
let props = defineProps({
  formConfig: {
    type: Object,
  },
});
const state = reactive(props);
console.log("state----", state.formConfig);
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
</script>
