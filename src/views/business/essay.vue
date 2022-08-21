<template>
  <u-container-layout>
     <el-button type="primary" size="small" icon="close" @click="close">
          关闭
      </el-button>
    <el-tabs
      class="demo-tabs"
      style="position: absolute;right: 40px;"
      tab-position="right"
      @tab-click="articleHandleClick"
      v-model="state.activeName"
    >
      <el-tab-pane
        v-for="item in state.optionsList"
        :key="item.id"
        :label="item.title"
        :name="item.title"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="business-essay-inline-edit-table" style="max-width: 1500px;">
      <div
        v-for="item in state.optionsList"
        :key="item.id"
      >
        <h3 :id="item.title">{{item.title}}</h3>
        <el-descriptions
          :border="true"
          :column="2"
          v-if="item.useComType === 'desc'"
        >
          <el-descriptions-item
            v-for="(value, key) in item.businessMessage"
            :key="key"
            :label="item.businessConfig[key]"
            >{{ value }}</el-descriptions-item
          >
        </el-descriptions>
        <el-descriptions
          :border="true"
          :column="2"
          v-if="item.useComType === 'spDesc'"
        >
          <el-descriptions-item
            v-for="(i, index) in item.businessMessage"
            :key="index"
            :label="i.position"
            >{{ i.personName }}</el-descriptions-item
          >
        </el-descriptions>
        <el-table
          v-if="item.useComType === 'table'"
          :data="item.businessMessage"
          style="width: 100%"
          :border="true"
          v-loading="loading"
        >
          <el-table-column prop="changeDate" label="修改日期" />
          <el-table-column prop="changeItem" label="修改事项" />
          <el-table-column prop="contentBefore" label="修改前" />
          <el-table-column prop="contentAfter" label="修改后" />
        </el-table>
      </div>
    </div>
  </u-container-layout>
</template>
<script lang="ts">
export default { name: "inline-table" };
</script>
<script lang="ts" setup >
import { computed, ref, reactive, onMounted, toRefs } from "vue";
import {
  articleSelectById,
} from "@/config/api";
import { businessConfig } from "@/config/constants";
import { get, post } from "@/utils/request";
interface prop{
   optionsList: {
    type: Array<Object>
  }
}
let props = defineProps<prop>();
const emit = defineEmits(['dialogClose'])
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  activeName: 0,
  editableTabsValue: "1",
  dialogVisible: false,
  articletype: 1,
  businessConfig,
  optionsList: props.optionsList
});

const articleHandleClick = (tab, event) => {
  state.activeName = tab.props.title;
  document.querySelector(`#${tab.props.label}`).scrollIntoView({
      behavior: "smooth",
      block: 'start'
  });           
};

// 关闭弹窗
const close = (): void => {
  emit('dialogClose');
};

// Mounted 生命周期 querySelectorAll 才生效
onMounted(() => {
  var Observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
          // 进入可视区域 
          if (entry.isIntersecting) {
              state.activeName = entry.target.innerHTML;
          }
      });
  });
  // 观察标题元素
  document.querySelectorAll('h3').forEach(function (ele) {
      Observer.observe(ele);
});

});
</script>

<style scoped lang="scss">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.business-essay-inline-edit-table {
  width: 95%;
  h3 {
    height: 26px;
    border-left: 4px solid #3085d5;
    padding-left: 10px;
    color: #333;
    line-height: 24px;
    margin: 22px 0 22px 0;
  }
}
</style>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
