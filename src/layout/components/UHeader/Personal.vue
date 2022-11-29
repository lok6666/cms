<template>
  <el-dialog
      v-model="dialogVisible"
      title="修改密码"
      width="60%"
  >
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
    >
      <el-form-item label="原密码" prop="passwordo">
        <el-input v-model="ruleForm.passwordo" type="password" ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordn">
        <el-input v-model="ruleForm.passwordn" type="password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.stop="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click.stop="submitForm(ruleFormRef)"
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import {
    reset
  } from "@/config/api";
  // import { formConfigItem } from "@/utils/interface";
  import { deleteItem, post, get } from "@/utils/request";
  import { ref,defineExpose,reactive, } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import type { ElForm } from 'element-plus'
  import {useStore} from "vuex";
  import {useRouter} from 'vue-router'
  const dialogVisible = ref(false)
  const show = ()=>{
    dialogVisible.value = true
  }
  const hide = ()=>{
    dialogVisible.value = false
  }
  type FormInstance = InstanceType<typeof ElForm>

  const formSize = ref('')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    username: localStorage.defaultName,
    passwordo: '',
    password: '',
    passwordn: ''
  })
  const store = useStore()
  const router = useRouter()
  const rules = reactive({
    passwordo: [
      {
        required: true,
        message: '请输入原密码',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入新密码',
        trigger: 'blur',
      },
    ],
    passwordn: [
      {
        required: true,
        validator: (r, v, c) => {
          if(!v) {
            c('请输入确认密码')
          }
          if(v !== ruleForm.password) {
            c('确认密码与新密码不一致')
          } else {
            c()
          }
        },
        trigger: 'blur',
      },
    ],
  })
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        console.log('submit!', ruleForm)
        post(`${reset}`, {
          ...ruleForm
        }).then(async e => {
          if(!e) {
            ElMessage({
                message: '用户名或密码错误',
                type: 'error'
            })
          } else {
            ElMessage({
                message: '修改成功',
                type: 'success'
            })
            await store.dispatch('user/logout')
            router.push({path:'/login'})
            store.dispatch('permission/clearRoutes')
            store.dispatch('tagsView/clearVisitedView')
          }         
        })
      } else {
        console.log('error submit!')
        return false
      }
    })
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  defineExpose({
    show,
  })
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
