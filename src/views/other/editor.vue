<template>
  <u-container-layout>
    <el-form
      ref="formRef"
      :model="dynamicValidateForm"
      label-width="80px"
      class="demo-dynamic"
    >
      <el-form-item>
        <div style="border: 1px solid #ccc; margin-top: 10px">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
            @onChange="handleChange"
          />
        </div>
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
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { get, post } from "@/utils/request";
import { upLoad } from "@/config/api";
import formData from "form-data";;
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const url = ref("");
// 内容 HTML
const valueHtml = ref("<p>hello</p>");

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
  }, 1500);
});

const toolbarConfig = {
  // 插入哪些菜单
  insertKeys: {
    index: 0, // 自定义插入的位置
    keys: ["uploadAttachment"], // “上传附件”菜单
  },
};
const editorConfig = {
  // 在编辑器中，点击选中“附件”节点时，要弹出的菜单
  hoverbarKeys: {
    attachment: {
      menuKeys: ["downloadAttachment"], // “下载附件”菜单
    },
  },
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadAttachment: {
      customUpload(file, insertFn) {
        var axios = require("axios");
        var FormData = require("form-data");
        var data = new FormData();
        data.append("file", file); // file 即选中的文件
        data.append("userId", 1);
        data.append("type", "file");
        // 插入节点
        const editor = editorRef.value;
        const node = { type: 'link', url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', children: [{ text: 'simple text' }] }
        editor.insertNode(node);
/*         var config = {
          method: "post",
          url: "http://172.16.4.62:28182/upload", //上传图片地址
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          data,
        };
        // post(`http://172.16.4.62:28182/upload`, {
        //   headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     Authorization: "Bearer " + localStorage.getItem("token"),
        //   },
        //   data: data
        // })
        axios(config)
          .then(function (res) {
            ;
            let url = res.data; //拼接成可浏览的图片地址
            insertFn(url, "使用说明", url); //插入图片
          })
          .catch(function (error) {
            console.log(error);
          }); */
      },
    },
    uploadImage: {
      customUpload(file, insertFn) {
        var axios = require("axios");
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
          userId: 1,
          type: "image",
          data: data,
        };
        axios.defaults.crossDomain = true;
        //Access-Control-Allow-Origin 指向前端 ip:port
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios(config)
        .then(function (res) {
          let url = res; //拼接成可浏览的图片地址
          insertFn(url, "使用说明", url); //插入图片
        })
        .catch(function (error) {
          console.log(error);
        });
      },
    },
    uploadVideo: {
      customUpload(file, insertFn) {
        var axios = require("axios");
        var FormData = require("form-data");
        var data = new FormData();
        data.append("file", file); // file 即选中的文件
        data.append("userId", 1);
        data.append("type", "video");
        var config = {
          method: "post",
          url: "http://172.16.4.62:28182/upload", //上传图片地址
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          data: data,
        };
        axios.defaults.crossDomain = true;
        //Access-Control-Allow-Origin 指向前端 ip:port
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios(config)
          .then(function (res) {
            let url = res; //拼接成可浏览的图片地址
            insertFn(url, "使用说明", url); //插入图片
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    },
  },
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  console.log("created", editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  // editor.insertText('handleChange');
  console.log("change:", editor, editor.getHtml());
};
const handleDestroyed = (editor) => {
  console.log("destroyed", editor);
};
const handleFocus = (editor) => {
  console.log("focus", editor);
};
const handleBlur = (editor) => {
  console.log("blur", editor);
};
const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`);
};
const customPaste = (editor, event, callback) => {
  console.log("ClipboardEvent 粘贴事件对象", event);

  // 自定义插入内容
  editor.insertText("xxx");

  // 返回值（注意，vue 事件的返回值，不能用 return）
  callback(false); // 返回 false ，阻止默认粘贴行为
  // callback(true) // 返回 true ，继续默认的粘贴行为
};

const insertText = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.insertText("hello world");
};

const printHtml = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  console.log(editor.getHtml());
};

const disable = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.disable();
};
const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{
  title: string;
  content: string;
}>({
  title: "",
  content: "",
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    console.log("valid", valid);
    if (valid) {
      ElMessage.success("保存成功");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const preview = () => {};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
