<template>
  <div style="border: 1px solid #ccc; margin-top: 10px">    <Toolbar
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
    <!-- <Editor1 v-model="valueHtml" :api-key="tiny.apiKey" :init="tiny.init"/> -->
</div>
</template>

<script lang="ts" setup>
import Editor1 from "@tinymce/tinymce-vue";
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, watchEffect, ref, toRefs, shallowRef, onUpdated, onMounted, reactive, defineProps, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { get, post } from "@/utils/request";
import { upLoad } from "@/config/api";
import formData from "form-data";

const emit = defineEmits(['handle']);
const props = defineProps({
    content:String
});
watch(
    () => props.content,
    (val, prevVal) => {
        valueHtml.value =  val;
    }
)

const state = reactive(props);
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const url = ref("");
// 内容 HTML
// const valueHtml = ref("<p>hello</p>");
const valueHtml = ref("");

// 模拟 ajax 异步获取内容
 onMounted(() => {
   setTimeout(() => {
    valueHtml.value = state.content;
    }, 1500);
 });

 const tiny = reactive({
  apiKey: "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc", //https://github.com/tinymce/tinymce-vue/blob/main/src/demo/views/Iframe.vue
  init: {
    language: "zh_CN", //语言类型
    placeholder: "在这里输入文字", //textarea中的提示信息
    // skin_url: '../tinymce/skins/ui/oxide', // 皮肤：浅色
/*     content_css: './tinymce/index.css', // 以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
    moticons_database_url: './tinymce/emoticons/js/emojis.js', */
    min_width: 320,
    min_height: 220,
    height: 500, //注：引入autoresize插件时，此属性失效
    resize: "both", //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
    branding: false, //tiny技术支持信息是否显示
    // statusbar: false,  //最下方的元素路径和字数统计那一栏是否显示
    // elementpath: false, //元素路径是否显示

    font_formats:
      "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;", //字体样式
    plugins:
      "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave emoticons", //插件配置 axupimgs indent2em
    toolbar: [
      "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat ",
      "styleselect formatselect fontselect fontsizeselect |  table image axupimgs media emoticons charmap hr pagebreak insertdatetime  selectall visualblocks searchreplace | code print preview | indent2em lineheight formatpainter",
    ], //工具栏配置，设为false则隐藏
    // menubar: "file edit my1", //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”

    // images_upload_url: '/apib/api-upload/uploadimg',  //后端处理程序的url，建议直接自定义上传函数image_upload_handler，这个就可以不用了
    // images_upload_base_path: '/demo',  //相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
    paste_data_images: true, //图片是否可粘贴
    //此处为图片上传处理函数
/*     images_upload_handler: (blobInfo, success, failure) => {
      // 这里用base64的图片形式上传图片,
      debugger;

      // let reader = new FileReader(); //本地预览
      // reader.readAsDataURL(blobInfo.blob());
      // reader.onloadend = function () {
      //   const imgbase64 = reader.result;
        success('https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png');
      // };
      return new Promise((resolve, reject) => {
        resolve('https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png');
      });
    }, */

    file_picker_types: "file image media", //file image media分别对应三个类型文件的上传：link插件，image和axupimgs插件，media插件。想屏蔽某个插件的上传就去掉对应的参数
    // 文件上传处理函数
    file_picker_callback: function (callback, value, meta) {
      debugger;
      // 使用案例http://tinymce.ax-z.cn/general/upload-images.php
      // meta.filetype  //根据这个判断点击的是什么file image media
      let filetype; //限制文件的上传类型,需要什么就添加什么的后缀
      if (meta.filetype == "image") {
        filetype = ".jpg, .jpeg, .png, .gif, .ico, .svg";
      } else if (meta.filetype == "media") {
        filetype = ".mp3, .mp4, .avi, .mov";
      } else {
        filetype =
          ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg, .jpeg, .png, .gif, .ico, .svg";
      }
      let inputElem = document.createElement("input"); //创建文件选择
      inputElem.setAttribute("type", "file");
      inputElem.setAttribute("accept", filetype);
      inputElem.click();
      inputElem.onchange = () => {
        let file = inputElem.files[0];
        var axios = require("axios");
        var FormData = require("form-data");
        var data = new FormData();
        data.append("file", file); // file 即选中的文件
        data.append("userId", 1);
        data.append("type", meta.filetype == "image" ? "image" : meta.filetype == "media" ? "video"  : "file");
        // todo 查看图片链接
        var config = {
          method: "post",
          url: `${upLoad}`, //上传图片地址
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
          callback(url, { title: file.name }); //插入图片
        })
        .catch(function (error) {
          console.log(error);
        });
      };
    },
  },
});
//base64转成blob 
const dataURLtoFile = (dataURI) => {
  let binary = atob(dataURI.split(",")[1]);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png'});
};
//将blob转为file
const uploadImg = (fileData) => {
  let formData = new FormData();
  let fileOfBlob = new File([fileData], new Date() + ".png"); // 命名图片名
  return fileOfBlob
}
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
        data.append("userId", window.localStorage);
        data.append("type", "file");
        // 插入节点
        const editor = editorRef.value;
         var config = {
          method: "post",
          url: `${upLoad}`, //上传图片地址
          data,
        };
        axios(config)
          .then(function (res) {
            const node = { type: 'link', url: res, children: [{ text: `${res.substring(res.lastIndexOf('/') + 1)}` }] }
            editor.insertNode(node);
          })
          .catch(function (error) {
            console.log(error);
            ElMessage({
                message: '上传文件过大,最大为100MB',
                type: 'error'
            })
          });
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
          url: `${upLoad}`, //上传图片地址
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
          url: `${upLoad}`, //上传图片地址
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
            const video1 = document.createElement('video');
            video1.src = res;
            video1.id = 'getPoster';
            video1.autoplay=true;
            video1.crossOrigin = 'Anonymous';
            document.getElementById('app').appendChild(video1);
            setTimeout(() => {
              const video = document.getElementById('getPoster');
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const fill = canvas.getContext('2d');
              fill.drawImage(video, 0, 0, canvas.width, canvas.height);
              const img = canvas.toDataURL("image/png");
              let blob = dataURLtoFile(img);
              let file = uploadImg(blob);
              var axios = require("axios");
              var FormData = require("form-data");
              var data = new FormData();
              data.append("file", file); // file 即选中的文件
              data.append("userId", window.localStorage);
              data.append("type", "file");
              var config = {
                method: "post",
                url: `${upLoad}`, //上传图片地址
                type: 'file',
                data: data
              };
              axios.defaults.crossDomain = true;
              axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
              axios(config)
                .then(function (res) {
                  video.poster= res;
                  document.getElementById('app').removeChild(document.getElementById('getPoster'));
                  insertFn(url, res, url); //插入图片 */
                })
                .catch(function (error) {
                  console.log(error);
                });
          }, 1000);
            let url = res; //拼接成可浏览的图片地址
          })
          .catch(function (error) {
            // console.log(error);
            ElMessage({
                message: '上传文件过大,最大为100MB',
                type: 'error'
            })
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
/* onUpdated(() => {
  emit('handle', valueHtml.value) 
}); */
// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  const video = Array.from(document.getElementsByTagName('video'));
  video.forEach(e => {
    const source = e.getElementsByTagName('source')[0];
    if(source) {
      e.src= source.src;
      e.removeChild(e.childNodes[0]);
    };
  });
/*   video.forEach(e => {
    e.crossOrigin="Anonymous";
    if(e.poster.includes('needUpdateposter')) {
      debugger;
      const canvas = document.createElement('canvas');
      canvas.width = e.videoWidth;
      canvas.height = e.videoHeight;
      const fill = canvas.getContext('2d');
      fill.drawImage(e, 0, 0, canvas.width, canvas.height);
      const img = canvas.toDataURL("image/png");
      console.log('img---', img);
      e.poster = img;
    };
  }); */
  emit('handle', editor.getHtml());
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
