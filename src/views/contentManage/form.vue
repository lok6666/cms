<template>
  <u-container-layout>
    <el-form
      ref="formRef"
      :model="dynamicValidateForm"
      label-width="80px"
      class="demo-dynamic"
    >
      <el-form-item v-for="(item, index) in formConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label">
        <el-input v-model="item.value" v-if="item.showInput"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
        <!--      <el-button @click="preview">预览</el-button>-->
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </u-container-layout>
</template>

<script lang="ts" setup>
import { watch, ref, toRefs, inject, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { get, post } from "@/utils/request";
const emit = defineEmits(['handle']);
let props = defineProps({
  formConfig:{
    type: Object,
    default: ()=>[]
  }
});
const formConfig1 = inject('formConfig1');
console.log('formConfig111', formConfig1);
let formConfig = reactive(props.formConfig);
watch(
    () => props.formConfig,
    (val, prevVal) => {
      console.log('formConfig', formConfig);
        formConfig =  val;
    }
)

const formData = {};
// watch(
//     () => props.formConfig,
//     (val, prevVal) => {
//         valueHtml.value =  val;
//     }
// )
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  formConfig.forEach((v) => {
    formData[v.prop] = v.value;
  });
  emit('handle', formData);
  ElMessage.success("保存成功");
};

const preview = () => {};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
