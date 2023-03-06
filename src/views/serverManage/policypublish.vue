<template>
  <u-container-layout>
    <div class="inline-edit-table">
      <el-dialog
          v-model="applydialogVisible"
          :title="title"
          width="80%"
          @closed="closeDialog()"
        >
        <el-form :inline="true" :model="state" class="demo-form-inline">
          <el-form-item label="政策标题简称">
            <el-input v-model="policyPushData.policyTitle" style="width: 500px;" maxlength="20" placeholder="请输入政策标题简称,不能超过20个字"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="float: right;" @click.stop="sendMessage">推送新闻</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTableRef"
          :data="entTableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column property="entName" label="公司名称"/>
          <el-table-column property="contactsPerson" label="联系人"/>
          <el-table-column property="contactsPhone" label="电话" show-overflow-tooltip />
        </el-table>
        </el-dialog>
    <div>
      <div style="display: inline-block; padding-bottom: 10px;margin-right: 10px;">
        <el-select
          v-model="levelValue"
          filterable
          placeholder="级别"
          @change="getData(policyStatus.value)"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="display: inline-block;margin-right: 10px;">
        <el-select
          v-model="policyKind"
          filterable
          placeholder="政策分类"
          @change="getData(policyStatus.value)"
        >
          <el-option
            v-for="item in policyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="display: inline-block;margin-right: 10px;">
        <el-select
          v-model="typeValue"
          filterable
          placeholder="类型"
          @change="getData(policyStatus.value)"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="display: inline-block;margin-right: 10px;">
        <el-select
          v-model="locationValue"
          filterable
          placeholder="区域"
          @change="getData(policyStatus.value)"
        >
          <el-option
            v-for="item in locationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
<!--       <div style="display: inline-block">
        <el-select
          v-model="isRelationValue"
          filterable
          placeholder="是否关联"
          @change="getData()"
        >
          <el-option
            v-for="item in relationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div> -->
<!--       <div style="display: inline-block">
        <el-select
          v-model="personValue"
          filterable
          placeholder="人员筛选"
          @change="getData()"
        >
          <el-option
            v-for="item in personOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div> -->
      <div style="display: inline-flex;padding-bottom: 10px;">
        <el-input
          v-model="formInline.username"
          style="width: 200px;margin-right: 10px;"
          placeholder="请输入标题"
        />
        <el-input
          v-model="formInline.tagKey"
          style="width: 200px;margin-right: 10px;"
          placeholder="请输入标签关键字"
        />
        <div style="display: inline-block;margin-right: 10px;">
          <el-date-picker
            style="margin-right: 10px;"
            v-model="startTime"
            type="date"
            placeholder="开始时间"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          /><el-date-picker
            v-model="endTime"
            type="date"
            placeholder="结束时间"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </div>
        <el-button type="primary" @click.stop="onSubmit">搜索</el-button>
        <el-button type="danger" class="button-new-tag ml-1" @click.stop="reset">重置</el-button>
        <el-button type="primary" @click.stop="add">添加</el-button>
      </div>
    </div>
    <el-dialog
      class="form-dialog"
      style="color: red"
      v-model="dialogVisible"
      :title="title"
      width="80%"
      top="1vh"
      @closed="closeDialog()"
    >
      <el-form
        v-if="dialogVisible"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
      >
        <el-form-item label="标题" required prop="policyTitle">
          <el-input v-model="ruleForm.policyTitle" />
        </el-form-item>
        <el-form-item label="来源" required prop="policySource">
          <el-input v-model="ruleForm.policySource" />
        </el-form-item>
        <el-form-item label="区域" required prop="policyLocation">
          <el-select
            v-model="ruleForm.policyLocation"
            filterable
            placeholder="区域"
            @change="getData(policyStatus.value)"
          >
            <el-option
              v-for="item in locationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="级别" required prop="policyLevel">
          <el-select
            v-model="ruleForm.policyLevel"
            filterable
            placeholder="级别"
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" required prop="policyType">
          <el-select
            v-model="ruleForm.policyType"
            filterable
            placeholder="类型"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="政策类型" required prop="policyType">
          <el-select
            v-model="ruleForm.policyKind"
            filterable
            placeholder="政策类型"
          >
            <el-option
              v-for="item in kindOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请最大金额" prop="policyMaxMoney">
          <el-input v-model="ruleForm.policyMaxMoney" />
        </el-form-item>
        <el-form-item label="申报类别" prop="policyReportType">
          <el-input v-model="ruleForm.policyReportType" />
        </el-form-item>
        <el-form-item label="网址" required prop="policyUrl">
          <el-input v-model="ruleForm.policyUrl" />
        </el-form-item>
        <el-form-item label="发布时间" required prop="policyTime">
          <el-date-picker
            v-model="ruleForm.policyTime"
            type="date"
            placeholder="Pick a Date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item
          label="内容"
          required
          prop="policyContent"
          v-if="title !== '编辑'"
        >
          <div style="border: 1px solid #ccc; margin-top: 10px">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden; height: 200px"
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
              @onChange="handleChange"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click.stop="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click.stop="handleClose(ruleFormRef)"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!--政策关联弹窗-->
    <el-dialog
      class="form-dialog"
      style="color: red"
      v-model="announcementVisible"
      :title="title"
      top="1vh"
      @closed="closeRelationDialog()"
    >
      <el-form
        ref="policyRuleFormRef"
        :model="policyRuleForm"
        :rules="rules"
        class="demo-ruleForm"
        :size="formSize"
      >
        <el-form-item label="标题" width="200px">
          <div>{{ policyRuleForm.title }}</div>
        </el-form-item>
        <el-form-item label="来源">
          {{ policyRuleForm.source }}
        </el-form-item>
        <el-form-item label="时间">
          {{ policyRuleForm.time }}
        </el-form-item>
        <el-form-item label="政策文件" prop="policyLevel">
          <el-select
            style="width: 100%"
            v-model="policyRuleForm.file"
            @visible-change="visibleChange"
            filterable
            multiple
            @change="changeTag"
            @remove-tag="removeTag"
            :filter-method="fileQuery"
            placeholder="政策文件"
          >
            <el-option
              v-for="item in policyRuleForm.fileOptions"
              :key="item.id"
              :label="item.noticeTitle || item.policyTitle"
              :value="item.noticeId || item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="政策解读"
          v-if="policyKind !== '通知公告'"
          prop="policyLevel"
        >
          <el-select
            style="width: 100%"
            v-model="policyRuleForm.explain"
            filterable
            multiple
            @visible-change="visibleChange"
            @change="changeTag"
            @remove-tag="removeTag"
            :filter-method="explainQuery"
            placeholder="政策解读"
          >
            <el-option
              v-for="item in policyRuleForm.explainOptions"
              :key="item.id"
              :label="item.noticeTitle || item.policyTitle"
              :value="item.noticeId || item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="通知公告"
          v-if="policyKind !== '通知公告'"
          prop="policyLevel"
        >
          <el-select
            style="width: 100%"
            v-model="policyRuleForm.notice"
            filterable
            multiple
            @visible-change="visibleChange"
            @change="changeTag"
            @remove-tag="removeTag"
            :filter-method="noticQquery"
            placeholder="通知公告"
          >
            <!--当初始化的时候,为了获取已经获取的insert的tag的id,故先判断noticeTitle,noticeId是否存在-->
            <el-option
              v-for="item in policyRuleForm.noticeOptions"
              :key="item.id"
              :label="item.noticeTitle || item.policyTitle"
              :value="item.noticeId || item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click.stop="relationShap(ruleFormRef)"
            >确定关联</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      class="form-dialog"
      style="color: red"
      v-model="routeDialogVisible"
      width="80%"
      :append-to-body="true"
      :title="title"
      top="1vh"
      @closed="routerCloseDialog()"
    >
      <div class="dialog-btn" style="float: right; margin: 0 47px 10px 0">
        <!-- <el-button
          size="small"
          type="primary"
          v-if="policyKind !== '政策解读'"
          @click.stop="relatePolicy(detailRow)"
          >政策关联</el-button
        > -->
        <!-- <el-button
          size="small"
          type="warning"
          style="margin-top: 10px"
          @click.stop="edit(detailRow)"
          >编辑</el-button
        >
        <el-button
          size="small"
          type="info"
          style="margin-top: 10px"
          @click.stop="chnageEffect(detailRow.id, detailRow.policyType)"
          >{{ detailRow.policyType ? "失效" : "有效" }}</el-button
        >
        <el-button
          v-if="!detailRow.policyStatus"
          size="small"
          type="success"
          style="margin-top: 10px"
          @click.stop="deleteTable(detailRow.id)"
          >删除</el-button
        >
        <el-button
          v-else
          size="small"
          type="danger"
          @click.stop="resume(detailRow.id)"
          >恢复</el-button
        > -->
      </div>

      <iframe
        :src="iframeSrc"
        frameborder="0"
        style="width: 100%; height: 1000px"
      ></iframe>
    </el-dialog>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="未标注列表" name="exist"></el-tab-pane>
      <el-tab-pane label="标注列表" name="tags"></el-tab-pane>
      <el-tab-pane label="删除" name="noExist"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      scrollbar-always-on
      setScrollLeft
      @selection-change="handleSelectionChange"
    >
      <el-table-column property="id" fixed label="id" :show-overflow-tooltip="true"
          sortable width="80" />
      <el-table-column property="policyTitle" label="标题" width="400px"/>
      <el-table-column
        property="policySource"
        label="来源"
        :show-overflow-tooltip="true"
          sortable
      />
      <el-table-column label="发布时间" width="200">
        <template #default="scope">{{ scope.row.policyTime || '//' }}</template>
      </el-table-column>
      <el-table-column
        prop="lastUpdateTime"
        label="删除时间"
        v-if="policyStatus"
        :show-overflow-tooltip="true"
          sortable
      >
        <template #default="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>
      <el-table-column
        property="policyLocation"
        label="区域"
        :show-overflow-tooltip="true"
          sortable
      > 
        <template #default="scope">{{
          locationMap[scope.row.policyLocation]
        }}</template>
      </el-table-column>
      <el-table-column property="policyLevel" label="关联" :show-overflow-tooltip="true"
          sortable>
        <template #default="scope">{{
          scope.row.isRelation === 0 ? "无关联" : "关联"
        }}</template>
      </el-table-column>
      <!-- <el-table-column property="policyLevel" label="级别" :show-overflow-tooltip="true"
          sortable width="100">
        <template #default="scope">{{
          scope.row.policyLevel === 1
            ? "区级"
            : scope.row.policyLevel === 2
            ? "市级"
            : "国家级"
        }}</template>
      </el-table-column> -->
      <el-table-column property="policyType" label="状态" :show-overflow-tooltip="true"
          sortable>
        <template #default="scope">{{
          scope.row.policyType === 1 ? "有效" : "失效"
        }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="210px">
        <template #default="scope">
          <!-- <el-button
            size="small"
            type="primary"
            v-if="policyKind !== '政策解读'"
            @click.stop="relatePolicy(scope.row)"
            >政策关联</el-button
          > -->
          <el-button
            size="small"
            type="primary"
            @click.stop="routerTo(scope.$index, scope.row.id, scope.row)"
            >详情</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click.stop="message(scope.row)"
            >短信</el-button
          >
          <!-- <el-button
            size="small"
            type="warning"
            style="margin-top: 10px"
            @click.stop="edit(scope.row)"
            >编辑</el-button
          > -->
          <!-- <el-button
            size="small"
            type="info"
            style="margin-top: 10px"
            @click.stop="chnageEffect(scope.row.id, scope.row.policyType)"
            >{{ scope.row.policyType ? "失效" : "有效" }}</el-button
          > -->
          <!-- <el-button
            v-if="!scope.row.policyStatus"
            size="small"
            type="success"
            style="margin-top: 10px"
            @click.stop="deleteTable(scope.row.id)"
            >删除</el-button
          >
          <el-button
            v-else
            size="small"
            type="danger"
            @click.stop="resume(scope.row.id)"
            >恢复</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <div style="
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 20px;
        ">
      <el-pagination
        v-model:currentPage="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[10, 30, 70, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  </u-container-layout>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, reactive, shallowRef, onMounted, onBeforeUnmount, inject } from "vue";

import {
  policyUpdate,
  policyInsert,
  policyList,
  policyUpload,
  policyTagList,
  policyTagInsert,
  policyRelationList,
  policyFileInsert,
  host,
  entInfoAll,
  policyPush,
  upLoad
} from "@/config/api";
import {
  levelMap,
  typeMap,
  locationMap,
  levelOptions,
  kindOptions,
  policyOptions,
  typeOptions,
  locationOptions,
  relationOptions,
  personOptions,
  policyPulishDetail
} from "./constant";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import formData from "form-data";
import axios from "axios";
import "@wangeditor/editor/dist/css/style.css";

interface User{
  entName: string,
  contactsPerson: string,
  contactsPhone: string
}
interface policyPush{
  policyTitle: string,
  policyAgency: string,
  policyTime: string
}
// http request 拦截器
axios.interceptors.request.use(function (config) {
  // 配置config
  config.headers["Content-Encoding"] = "gzip";
  // 判断是否是
  return config;
});
const renovate = inject("reload");
const activeName = ref("exist");
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const ruleFormRef = ref();
const policyRuleFormRef = ref();
const iframeSrc = ref("");
const policyTitleDesc = ref("");
const policyRuleForm = ref({
  title: "",
  source: "",
  time: "",
  explain: [],
  notice: [], // 通知公告
  file: [],
});
const title = ref("添加");
let ruleForm = reactive({
  policyTitle: "",
  policyLocation: "",
  policyType: "",
  policyMaxMoney: "",
  policyReportType: "",
  policyLevel: "",
  policyTags: "",
  policySource: "",
  policyContent: "",
  policyUrl: "",
  policyStatus: 0,
  policyTime: "",
  policyKind: "",
});
// 是否删除
const policyStatus = ref(0);
// 模糊匹配
const policyTags = ref("");
const isTag = ref(0);
const startTime = ref('');
const endTime = ref('');
const router = useRouter();
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const tableData = ref([]);
const entTableData = ref([]);
const entTotal = ref(0);
const levelValue = ref("");
const typeValue = ref("有效");
const policyKind = ref("通知公告");
const dialogVisible = ref(false);
const routeDialogVisible = ref(false);
const applydialogVisible = ref(false);
const detailRow = ref();
const announcementVisible = ref(false);
const locationValue = ref("shijingshan");
const isRelationValue = ref('');
const policyPushData: policyPush = reactive({
policyTitle: '',
policyAgency: '',
policyTime: ''
});
const personValue = ref("");
const inputName = ref("");
const tagName = ref("");
const formInline = reactive({
  username: "",
  tagKey: "",
});

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const url = ref("");
// 内容 HTML
const valueHtml = ref("");

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    // valueHtml.value = state.content;
  }, 1500);
});
//  文章内容列表
const getentInfoAll = () => {
  axios.post(`${entInfoAll}`, {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    attestationStatus: 1,
  }).then(function (res) {
    entTableData.value = res.data.list;
    entTotal.value = res.data.total;
  });
};

const multipleSelection = ref<User []>([])
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
}
const message = (row) => {
  title.value = row.policyTitle;
  // policyPushData.policyTitle = row.policyTitle;
  policyPushData.policyAgency = row.policyAgency;
  policyPushData.policyTime = row.policyTime;
  applydialogVisible.value = true;
  getentInfoAll();
};
const sendMessage = () => {
  
  console.log('multipleSelection---', multipleSelection.value);
  axios.post(`${policyPush}`, multipleSelection.value.map(e => {
    return {
      receiver: e.contactsPhone,
      ...policyPushData,
    }
  })).then(e => {
    applydialogVisible.value = false;
  });
};
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
        var data = new formData();
        data.append("file", file); // file 即选中的文件
        data.append("userId", 1);
        data.append("type", "file");
        // 插入节点
        const editor = editorRef.value;
        var config = {
          method: "post",
          url: `${policyUpload}`, //上传图片地址
          data,
        };
        axios(config)
          .then(function (res) {
            const node = {
              type: "link",
              url: res.data,
              children: [{ text: res.data.split("/").pop() }],
            };
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
        var data = new formData();
        data.append("file", file); // file 即选中的文件
        data.append("userId", 1);
        data.append("type", "image");
        // todo 查看图片链接
        var config = {
          method: "post",
          url: `${policyUpload}`, //上传图片地址
          userId: 1,
          type: "image",
          data: data,
        };
        axios.defaults.crossDomain = true;
        //Access-Control-Allow-Origin 指向前端 ip:port
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios(config)
          .then(function (res) {
            let url = res.data; //拼接成可浏览的图片地址
            insertFn(url, "使用说明", url); //插入图片
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
    uploadVideo: {
      customUpload(file, insertFn) {
        var axios = require("axios");
        var data = new formData();
        data.append("file", file); // file 即选中的文件
        data.append("userId", 1);
        data.append("type", "video");
        var config = {
          method: "post",
          url: `${policyUpload}`, //上传图片地址
          data: data,
        };
        axios.defaults.crossDomain = true;
        //Access-Control-Allow-Origin 指向前端 ip:port
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios(config)
          .then(function (res) {
            let url = res; //拼接成可浏览的图片地址
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
            // insertFn(url, "使用说明", url); //插入图片
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
  },
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});
// 移除tag
const removeTag = (e) => {
  console.log("removeTag", e);
};
// 添加tag
const changeTag = (e) => {
  console.log("changeTag", e);
};
const visibleChange = (e) => {
  policyRuleForm.value.options = [];
};
// 自定义搜索
const fileQuery = (e) => {
  query(e, "政策文件", `fileOptions`);
};
const explainQuery = (e) => {
  query(e, "政策解读", `explainOptions`);
};
const noticQquery = (e) => {
  query(e, "通知公告", `noticeOptions`);
};
const query = (e, policyKind, options) => {
  axios
    .post(`${policyTagList}`, {
      policyKind: policyKind,
      policyTitle: e,
    })
    .then(({ data }) => {
      policyRuleForm.value[options] = data.data;
    });
};

// 政策关联
const relatePolicy = (row) => {
  policyRuleForm.value = {
    title: row.policyTitle,
    source: row.policySource,
    time: row.policyTime,
    policyId: row.id,
    explain: [],
    selectOptions: [],
  };
  // 政策文件或政策解读 政策关联弹窗展示 政策解读 和 通知公告
  policyKind.value !== "通知公告" &&
    axios
      .all([
        axios.post(`${policyRelationList}`, {
          policyId: row.id,
          relationType: "政策解读",
        }),
        axios.post(`${policyRelationList}`, {
          policyId: row.id,
          relationType: "通知公告",
        }),
        axios.post(`${policyRelationList}`, {
          policyId: row.id,
          relationType: "政策文件",
        }),
      ])
      .then(([explain, notice, file]) => {
        policyRuleForm.value.explain = explain.data.data.list.map(
          (e) => e.noticeId
        );
        policyRuleForm.value.explainOptions = explain.data.data.list;

        policyRuleForm.value.notice = notice.data.data.list.map(
          (e) => e.noticeId
        );
        policyRuleForm.value.noticeOptions = notice.data.data.list;

        policyRuleForm.value.file = file.data.data.list.map((e) => e.noticeId);
        policyRuleForm.value.fileOptions = file.data.data.list;
        announcementVisible.value = true;
      });

  // 通知公告 政策关联弹窗展示 政策文件
  policyKind.value === "通知公告" &&
    axios
      .post(`${policyTagList}`, {
        policyKind: "政策文件",
      })
      .then(({ data }) => {
        // policyRuleForm.value.selectOptions = data.data;
        // 获取关联信息
        axios
          .post(`${policyRelationList}`, {
            noticeId: row.id,
            relationType: "通知公告",
          })
          .then(async function ({ data }) {
            policyRuleForm.value.file = data.data.list.map(
              (e) => e.noticeTitle
            );
            policyRuleForm.value.virtualizedFile = data.data.list;
            announcementVisible.value = true;
          });
      });
};

// 确定关联
const relationShap = async () => {
  if (policyKind.value === "通知公告") {
    await axios.post(`${policyFileInsert}`, {
      //注意入参不要更改
      noticeId: policyRuleForm.value.policyId,
      policyIds: policyRuleForm.value.file,
      relationType: "通知公告",
    });
    announcementVisible.value = false;
  } else {
    await axios.post(`${policyTagInsert}`, {
      policyId: policyRuleForm.value.policyId,
      noticeIds: policyRuleForm.value.explain,
      relationType: "政策解读",
    });
    await axios.post(`${policyTagInsert}`, {
      policyId: policyRuleForm.value.policyId,
      noticeIds: policyRuleForm.value.notice,
      relationType: "通知公告",
    });
    await axios.post(`${policyTagInsert}`, {
      policyId: policyRuleForm.value.policyId,
      noticeIds: policyRuleForm.value.file,
      relationType: "政策文件",
    });
    announcementVisible.value = false;
  }
};
// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  ruleForm.policyContent = editor.getHtml();
};
const customPaste = (editor, event, callback) => {
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

const disable = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.disable();
};
const closeDialog = () => {
  dialogVisible.value = false;
  applydialogVisible.value = false;
  for (const i in ruleForm) {
    ruleForm[i] = "";
  }
};
const routerCloseDialog = () => {
  iframeSrc.value = "";
  routeDialogVisible.value = false;
  getData();
};
// 添加
const add = () => {
  title.value = "添加";
  dialogVisible.value = true;
};
// 编辑
const edit = (row) => {
  title.value = "编辑";
  for (const i in row) {
    if (i === "policyType") {
      ruleForm[i] = row[i] === 1 ? "区级" : row[i] === 2 ? "市级" : "国家级";
    } else if (i === "policyLevel") {
      ruleForm[i] = levelMap[row[i]];
      ruleForm[i] = row[i] === 0 ? "失效" : "有效";
    } else {
      ruleForm[i] = row[i];
    }
  }
  dialogVisible.value = true;
};
// 失效
const chnageEffect = (id, policyType) => {
  axios
    .post(`${policyUpdate}`, {
      id,
      policyType: !policyType,
    })
    .then((e) => {
      getData();
    });
};
const closeRelationDialog = () => {
  policyRuleForm.value = {
    title: "",
    source: "",
    time: "",
    explain: [],
  };
};
const reset = () => {
  levelValue.value = "";
  policyKind.value = "";
  locationValue.value = "";
  typeValue.value = "";
  isRelationValue.value = "";
  personValue.value = "";
  formInline.username = "";
  inputName.value = "";
  tagName.value = "";
  policyStatus.value = 0;
  isTag.value = 0;
  startTime.value = "";
  endTime.value = "";
  activeName.value = 'exist';
  getData(policyStatus.value);
};

// 关闭弹窗
const handleClose = async (ruleFormRef) => {
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      let obj = {
        ...ruleForm,
        policyLevel: levelMap[ruleForm.policyLevel],
        policyType: typeMap[ruleForm.policyType]
      };
      axios
        .post(title.value === "添加" ? `${policyInsert}` : `${policyUpdate}`, {
          ...obj,
        })
        .then(function (data) {
          getData();
          // 当详情表单数据存在,修改详情数据表单
          if(detailRow.value) {
            detailRow.value = obj;
          };
          dialogVisible.value = false;
          for (const i in ruleForm) {
            ruleForm[i] = "";
          }
        })
        .catch((e) => {
          console.log("e", e);
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};
const handleClick = (tab, event) => {
  if (tab.props.name === "exist") {
    policyStatus.value = 0;
    isTag.value = 0;
  } else if (tab.props.name === "noExist") {
    policyStatus.value = 1;
  } else {
    policyStatus.value = 0;
    isTag.value = 1;
  }
  getData();
};
const getData = (status) => {
  axios
    .post(`${policyList}`, {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      policyLevel: levelMap[levelValue.value],
      // 政策解读,政策文件,通知公告
      policyKind: policyKind.value,
      policyLocation: locationValue.value,
      // 是否有效
      policyType: typeMap[typeValue.value],
      isRelation: isRelationValue.value,
      policyStatus: status || policyStatus.value,
      personName: personValue.value,
      policyTitle: inputName.value,
      policyTags: tagName.value,
      isTag: isTag.value,
      startTime: startTime.value,
      endTime: endTime.value,
    })
    .then(function ({ data }) {
      tableData.value = data.list;
      total.value = data.total;
    })
    .catch(function (error) {
      console.log(error);
    });
};
getData();
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pageSize.value = val;
  getData();
};
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  pageNum.value = val;
  getData();
};
const routerTo = (index, id, row) => {
  detailRow.value = row;
  title.value = "详情";
  window.localStorage.id = id;
  window.localStorage.policyKind = row.policyKind;
  iframeSrc.value = `${location.origin}#/policy-pulish-detail?id=${id}`;
  routeDialogVisible.value = true;
};
// 删除
const deleteTable = (id) => {
  axios
    .post(`${policyUpdate}`, {
      id,
      policyStatus: 1,
    })
    .then((e) => {
      getData(0);
    });
};
// 恢复
const resume = (id) => {
  axios
    .post(`${policyUpdate}`, {
      id,
      policyStatus: 0,
    })
    .then((e) => {
      getData(1);
    });
};

// 搜索
const onSubmit = () => {
  console.log("submit!");
  inputName.value = formInline.username;
  tagName.value = formInline.tagKey;
  setTimeout(() => {
    getData();
  }, 500);
};

// 重置
const onClear = () => {
  formInline.username = "";
  inputName.value = "";
  tagName.value = "";
  setTimeout(() => {
    getData();
  }, 500);
};
</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.inline-edit-table {
  width: 100%;
}
</style>
<style scoped>
/* .list {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.demo-pagination-block {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.12);
  margin-top: 40px;
}
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
.el-overlay-dialog {
  overflow: auto;
  margin-bottom: 16px;
} */
</style>