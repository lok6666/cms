<template>
  <el-upload
      action=""
      :before-upload="beforeUploadAction"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible" width="80%" top="80px">
    <img w-full :src="dialogImageUrl" alt="预览图片" style="width: 100%"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch, defineProps, toRefs } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { upload } from "@/config/api";
import { get, post } from "@/utils/request";
import type { UploadProps, UploadUserFile } from 'element-plus'
import {ElMessage} from "element-plus";

let emit = defineEmits(['update:modelValue'])
let props = defineProps({
  modelValue:Array,
  id: String
})
let fileList = ref([

])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const beforeUploadAction = (file, fileLi)=>{
/*   var axios = require("axios");
  var FormData = require("form-data");
  var data = new FormData();
  data.append("file", file); // file 即选中的文件
  data.append("userId", 1);
  data.append("type", "image");
  // todo 查看图片链接
  var config = {
    method: "post",
    url: "http://172.16.4.62:28182/upload", //上传图片地址
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    userId: props.id,
    type: "image",
    data: data
  };
  axios.defaults.crossDomain = true;
  //Access-Control-Allow-Origin 指向前端 ip:port
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios(config)
  .then(function (res) {
    ;
    let url = res; //拼接成可浏览的图片地址
    fileList.value.push([{name: 'test', url}]);
    emit('update:modelValue',fileList.value);
  })
  .catch(function (error) {
    console.log(error);
        }); */
   return new Promise((resolve, reject) => {
  var reader = new FileReader()
     let reg = (/\.jpg$|\.jpeg$|\.gif$|\.png$/i)
     reader.readAsDataURL(file)
     let name = file.name
     if(reg.test(name)){
       reader.onload = (e:FileReader)=>{
         fileList.value.push('https://www.baidu.com/img/flexible/logo/pc/result.png')
        //  emit('update:modelValue',fileList.value)
         resolve('https://www.baidu.com/img/flexible/logo/pc/result.png')
       }
     }else{
       ElMessage.error('请上传图片')
       reject()
     }
   })
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

onMounted(()=>{
  watch(()=>props.modelValue,(value)=>{
    fileList.value = value
  })
})
</script>
