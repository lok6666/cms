<template>
    <!-- 可编辑表格V2 -->
    <div id="detail" style="background-color:#fff;">
      <!-- <iframe src="http://merchant.serviceshare.com/home"></iframe> -->
      <div class="Md-zcxx" style="width: 72%">
        <!-- <iframe :src="data.policyUrl" frameborder="0" style="min-width: 860px; height: 1000px;"></iframe> -->
        <div
          v-html="data.policyContent.replace('扫一扫在手机打开当前页', '')"
          class="detail-policyContent"
          style="font-size: 18px"
        ></div>
        <div style="height: 300px">
          <span>政策关联信息</span>
          <ul
            class="polic-relation"
            style="overflow: auto; overflow-x: scroll; width: fit-content"
          >
            <li
              v-for="i in count"
              :key="i"
              class="polic-relation-item"
              @click.stop="
                routeTo(policyKind === '通知公告' ? i.policyId : i.noticeId)
              "
            >
              {{ i.noticeTitle }}
            </li>
          </ul>
        </div>
      </div>
      <div style="height: 100%; margin-left: 10px; padding-right: 10px">
        <div style="height: 300px; position: fixed; top: 0px">
          <!-- <div style="height: 100%;">
        <div> -->
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            class="mx-1"
            style="margin-right: 10px"
            :closable="isClosable(tag)"
            :disable-transitions="false"
            @close="handleClose(tag)"
            @click.stop="handleClick(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="ml-1 w-20"
            size="small"
            type="textarea"
            @keyup.enter="handleInputConfirm"
          />
          <!-- <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click.stop="showInput"
            >新增标签
          </el-button>
          <el-input
            style="width: 400px; display: block; margin-top: 10px"
            v-model="descInputValue"
            class="ml-1 w-20"
            size="small"
            placeholder="请输入行业名称"
            @input="handleDesc"
          /> -->
          <div class="demo-collapse" v-if="descList.length !== 0">
            <el-table
              :key="i"
              :data="descList"
              max-height="500"
              stripe
              style="width: 100%"
            >
              <el-table-column prop="indType" label="类别" width="80" />
              <el-table-column prop="indName" label="名称" width="150" />
              <el-table-column prop="indOne" label="大类" width="150" />
              <el-table-column prop="indFile" label="行业" width="150" />
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  import axios from "axios";
  import urltest from "url";
  import { ref, onMounted, nextTick } from "vue";
  import {
    policyUpdate,
    policyDetail,
    industryCodeList,
    policyRelationList,
    policyFilelistByNoticeId,
  } from "@/config/api";
  import { tagMap } from "./constant";
  const inputValue = ref("");
  const descList = ref([]);
  const url = urltest;
  const descInputValue = ref("");
  const dynamicTags = ref([]);
  const editDynamicTags = ref(Object.keys(tagMap));
  const inputVisible = ref(false);
  const isExist = ref(false);
  const index = ref(0);
  const InputRef = ref("");
  const router = useRouter();
  const count = ref([]);
  const {
    id = window.localStorage.id,
    policyKind = window.localStorage.policyKind,
  } = router.currentRoute.value.params;
  window.localStorage.id = id;
  window.localStorage.policyKind = policyKind;
  let data = ref({});
  // 获取关联信息
  policyKind === "通知公告" &&
    axios
      .post(`${policyFilelistByNoticeId}`, {
        noticeId: id,
        relationType: "通知公告",
      })
      .then(async function ({ data }) {
        count.value = data.data.list;
      });
  
  policyKind !== "通知公告" &&
    axios
      .post(`${policyRelationList}`, {
        policyId: id,
        relationType: "政策解读",
      })
      .then(async function ({ data }) {
        count.value = count.value.concat(data.data.list);
      }) &&
    axios
      .post(`${policyRelationList}`, {
        policyId: id,
        relationType: "通知公告",
      })
      .then(async function ({ data }) {
        count.value = count.value.concat(data.data.list);
      });
  
  // 跳转关联详情
  const routeTo = (id) => {
    window.localStorage.noticeId = id;
    window.open(`#/notice-detail?noticeid=${id}`);
    // router.push({
    //   name: "notice",
    //   params: { id },
    // });
  };
  const isClosable = (tag) => {
    // 默认列表不增加删除按钮
    return tag.match(/\S*[\:|\：]/gi) &&
      editDynamicTags.value.indexOf(tag.match(/\S*[\:|\：]/gi)[0]) !== -1
      ? false
      : true;
  };
  axios
    .get(`${policyDetail}/${id}`, {})
    .then(function (res) {
      data.value = res.data;
      nextTick(() => {
        let {href} = url.parse(data.value.policyUrl);
        // // 附件链接替换
        // document.querySelectorAll(".detail-policyContent .fujian a").forEach((e) => {
        //   if (e.href && e.href.includes(location.origin)) {
        //     console.log('detail-policyContent', e.href, location.origin);
        //     e.href = e.href.replace(location.origin, href.substring(href.lastIndexOf('/'), -1));
        //   }
        // });
        // // 附件链接替换
        // document.querySelectorAll(".rightbox a").forEach((e) => {
        //   console.log('detail-policyContent', e, url.parse(data.value.policyUrl));
        //   // if (e.href && e.href.includes(location.origin)) {
        //   //   console.log('detail-policyContent', e.href, location.origin, );
        //   //   e.href = e.href.replace(location.origin, href.substring(href.lastIndexOf('/'), -1));
        //   // }
        // });
      });
      dynamicTags.value = data.value.policyTags
        ? data.value.policyTags.split(",")
        : Object.keys(tagMap);
    })
    .catch(function (error) {
      console.log(error);
    });
  
  const handleClose = (tag) => {
    let isTag = dynamicTags.value.length === 1 ? 0 : 1;
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
    axios.post(`${policyUpdate}`, {
      id,
      policyTags: dynamicTags.value
        .map((e) => (tagMap[e] ? tagMap[e] : e))
        .join(),
      isTag,
    });
  };
  
  const handleClick = (tag) => {
    inputVisible.value = true;
    inputValue.value = tag;
    isExist.value = true;
    index.value = dynamicTags.value.indexOf(tag);
  };
  
  const showInput = () => {
    inputVisible.value = true;
    isExist.value = false;
  };
  const handleDesc = () => {
    console.log("handleDesc");
    descList.value = [];
    // descInputValue.value = 请求列表
    axios
      .post(`${industryCodeList}`, {
        indName: descInputValue.value,
      })
      .then(async function ({ data }) {
        descList.value = data.data.list;
        nextTick(() => {
          //代码
          const cell = document.querySelectorAll(
            ".el-table__body tbody tr td:nth-child(2)"
          );
          cell.forEach((dom) => {
            dom.innerHTML = dom.innerHTML.replace(
              descInputValue.value,
              `<span style="color: red;">${descInputValue.value}</span>`
            );
          });
        });
      });
  };
  
  const handleInputConfirm = () => {
    inputValue.value = inputValue.value.replace("\n", "");
    if (inputValue.value && isExist.value) {
      dynamicTags.value[index.value] = inputValue.value;
    } else if (inputValue.value) {
      dynamicTags.value.push(inputValue.value);
    }
  
    inputVisible.value = false;
    inputValue.value = "";
    axios.post(`${policyUpdate}`, {
      id,
      policyTags: dynamicTags.value
        .map((e) => (tagMap[e] ? tagMap[e] : e))
        .join(),
      isTag: 1,
    });
  };
  </script>
  <style lang="scss" scoped>
  #detail {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .wraper {
    // background-image: url(../assets/bg.jpg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  #contextmenu {
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    width: 120px;
    border-radius: 3px;
    border: 1px solid #999999;
    background-color: #f4f4f4;
    padding: 10px;
    z-index: 12;
    button {
      display: block;
      margin: 0 0 5px;
    }
  }
  .hideContextMenu {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  #editInput,
  #headereditInput {
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    min-width: 200px;
    max-width: 400px;
    padding: 0;
    z-index: 12;
  }
  #editInput .el-input,
  #headereditInput .el-input {
    outline: 0;
    border: 1px solid #c0f2f9;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px #c0f2f9;
  }
  .MD-fcje1 {
    // border: solid;
  }
  @media screen and (max-width: 900px) {
    .MD-pan1 {
      width: 80%;
    }
  }
  .form-item-inline :first-child {
    display: flex;
  }
  .el-tag {
    white-space: normal;
    height: auto;
    max-width: 220px;
    word-wrap: break-word;
  }
  
  .polic-relation {
    margin: 10px;
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-flow: column;
    overflow-x: hidden;
    border: #e8e8e8 solid;
    border-radius: 6px;
  }
  .polic-relation ul {
    overflow-x: hidden;
    border: var(--el-color-primary-light-9) solid 0.5px;
  }
  .polic-relation ul::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    background-color: #f5f5f5;
  }
  .polic-relation .polic-relation-item {
    display: flex;
    align-items: center;
    height: 50px;
    color: var(--el-color-primary);
  }
  .polic-relation .polic-relation-item:hover {
    background: var(--el-color-primary-light-9);
  }
  .polic-relation .polic-relation-item + .list-item {
    margin-top: 10px;
  }
  // @media screen and (min-width: 1681px) {
  //         .Md-zcxx {
  //           iframe {
  //               width: 1300px;
  //           }
  
  //       }
  // }
  </style>