<template>
  <u-container-layout>
    <span v-if="title">{{ state.title }}</span>
    <!--看了源码,为了required校验,必须在form标签循环-->
    <el-form
      ref="formRef"
      class="demo-dynamic"
      label-width="180px"
      label-position="right"
    >
        <el-form-item label="审核">
        <!--输入框-->
         <el-switch
                size="large"
                v-model="ruleForm.status"
                inline-prompt
                active-text="通过"
                inactive-text="驳回"
            />
      </el-form-item>
      <el-form-item label="审核意见">
        <!--输入框-->
        <el-input v-model="ruleForm.inputValue" type="textarea"/>
      </el-form-item>
    </el-form>
    <div  style="float: right">
      <el-button type="primary" @click="submitForm(formRef)">立即提交</el-button>
    </div>
  </u-container-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage, UploadProps } from "element-plus";
interface prop{
  title: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: true
  }
}
const emit = defineEmits(["handle", "dialogClose"]);
let props = defineProps<prop>();
const state = reactive(props);
const ruleForm = reactive({
    status: state.status === 1 ? true : false,
    inputValue: ''
});
const formRef = ref<FormInstance>();

/**
 * 提交表单
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    emit("handle", ruleForm);
    ElMessage.success("提交成功");
};

/**
 * 关闭弹窗
 */
const resetForm = (formEl: FormInstance | undefined) => {
  emit("dialogClose");
};

</script>
