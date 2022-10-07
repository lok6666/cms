<template>
  <u-container-layout>
    <el-button type="primary" size="small" icon="close" @click="close" style="float: right;">
      关闭
    </el-button>
    <!-- <div style="margin-bottom: 20px;">基本信息</div> -->
    <el-descriptions
      style="margin-bottom: 20px;"
      :border="true"
      :column="2"
    >
      <el-descriptions-item
        v-for="(value, key) in baseInfo.businessMessage"
        :key="key"
        label-class-name="my-label"
        :label="baseInfo.businessConfig[key]"
        >{{ value }}</el-descriptions-item
      >
    </el-descriptions>
    <div style="width: 100%;height: 300px;display: flex;align-items: center;">
        <div style="width: 50%;display: flex;align-items: center;">
          <div style="width: 50%;">
            <div>综合评分</div>
            <div>{{state.overall}}</div>
          </div>
          <div style="width: 50%;">
            <div>评分等级</div>
            <div>{{state.overallGrade}}</div>
          </div>
        </div>
        <div id="charts" style="width: 50%; height: 300px;">22</div>
    </div>
    <el-tabs
      v-model="activeName"
      type="carid"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="i in state.tabList"
        :label="i.tabName"
        :name="i.title"
        :key="i.id">
        <div class="business-essay-content">
          <el-tabs
            class="demo-tabs"
            style="position: absolute; right: 0px"
            tab-position="right"
            @tab-click="articleHandleClick"
            v-model="i.activeName"
          >
            <el-tab-pane
              v-for="item in i.optionsList"
              :key="item.id"
              :label="item.title"
              :name="item.title"
            >
            </el-tab-pane>
          </el-tabs>
          <div
            class="business-essay-inline-edit-table"
            style="width: 87%"
          >
            <div v-for="item in i.optionsList" :key="item.id" style="width: 90%">
              <h3 :id="item.title">{{ item.title }}</h3>
                <el-tabs v-if="item.useComType === 'yearDesc'" type="carid" v-model="activeYear" @tab-click="articleHandleClick1">
                  <el-tab-pane v-for="(i, index) in item.businessMessage" :label="i.NBYEAR" :name="i['NBYEAR']" :key="index">
                    <el-descriptions
                        :border="true"
                        :column="2"
                      >
                        <el-descriptions-item
                          v-for="(value, key) in i"
                          :key="key"
                          label-class-name="my-label"
                          :label="item.businessConfig[key]"
                          >{{ value }}</el-descriptions-item
                        >
                      </el-descriptions>
                  </el-tab-pane>
                </el-tabs>
                <el-descriptions :border="true"
                        :column="2" v-if="item.useComType === 'bescInfo'">
                  <el-descriptions-item label="企业名称" name="ENTNAME">{{item.businessMessage[0].ENTNAME}}</el-descriptions-item>
                  <el-descriptions-item label="法定代表人" name="FRDB">{{item.businessMessage[0].FRDB}}</el-descriptions-item>
                  <el-descriptions-item label="统一社会信用代码" name="SHXYDM">{{item.businessMessage[0].SHXYDM}}</el-descriptions-item>
                  <el-descriptions-item label="行业门类" name="INDUSTRY_CODE">{{item.businessMessage[0].INDUSTRY_CODE}}</el-descriptions-item>
                  <el-descriptions-item label="注册资本" name="REGCAP">{{item.businessMessage[0].REGCAP}}</el-descriptions-item>
                  <el-descriptions-item label="经营状态" name="ENTSTATUS">{{item.businessMessage[0].ENTSTATUS}}</el-descriptions-item>
                  <el-descriptions-item label="成立日期" name="ESDATE">{{item.businessMessage[0].ESDATE}}</el-descriptions-item>
                  <el-descriptions-item label="核准日期" name="APPRDATE">{{item.businessMessage[0].APPRDATE}}</el-descriptions-item>
                  <el-descriptions-item label="行业门类" name="INDUSTRY">{{item.businessMessage[0].INDUSTRY}}</el-descriptions-item>
                  <el-descriptions-item label="行业门类代码" name="INDUSTRYCODE">{{item.businessMessage[0].INDUSTRYCODEPlace}}</el-descriptions-item>
                  <el-descriptions-item label="企业类型" name="ENTTYPE">{{item.businessMessage[0].ENTTYPE}}</el-descriptions-item>
                  <el-descriptions-item label="地址" name="DOM">{{item.businessMessage[0].DOM}}</el-descriptions-item>
                  <el-descriptions-item label="登记机关" name="REGORG">{{item.businessMessage[0].REGORG}}</el-descriptions-item>
                  <el-descriptions-item label="曾用名" name="OLDNAME">{{item.businessMessage[0].OLDNAME}}</el-descriptions-item>
                  <el-descriptions-item label="登记地省份" name="PROVINCE">{{item.businessMessage[0].PROVINCE}}</el-descriptions-item>
                  <el-descriptions-item label="登记地城市代码" name="CITYCODE">{{item.businessMessage[0].CITYCODE}}</el-descriptions-item>
                  <el-descriptions-item label="地理坐标" name="JWD">{{item.businessMessage[0].JWD}}</el-descriptions-item>
                  <el-descriptions-item label="组织机构代码" name="ORGID">{{item.businessMessage[0].ORGID}}</el-descriptions-item>
                  <el-descriptions-item label="ENGNAME" name="企业英文名">{{item.businessMessage[0].ENGNAME}}</el-descriptions-item>
                  <el-descriptions-item label="企业官网" name="WEBSITE">{{item.businessMessage[0].WEBSITE}}</el-descriptions-item>
                  <el-descriptions-item label="OPFROM" name="经营期限自">{{item.businessMessage[0].OPFROM}}</el-descriptions-item>
                  <el-descriptions-item label="经营期限至" name="OPTO">{{item.businessMessage[0].OPTO}}</el-descriptions-item>
                  <el-descriptions-item label="经营业务范围" name="OPSCOPE">{{item.businessMessage[0].OPSCOPE}}</el-descriptions-item>
                </el-descriptions>
                <el-descriptions :border="true" :column="2" v-if="item.useComType === 'yearInfo'">=
                  <el-descriptions-item label="企业名称" name="ENTNAME">{{item.businessMessage[0].ENTNAME}}</el-descriptions-item>
                  <el-descriptions-item label="统一社会信用代码" name="SHXYDM">{{item.businessMessage[0].SHXYDM}}</el-descriptions-item>
                  <el-descriptions-item label="企业联系电话" name="TEL">{{item.businessMessage[0].TEL}}</el-descriptions-item>
                  <el-descriptions-item label="企业经营状态" name="ENTSTATUS">{{item.businessMessage[0].ENTSTATUS}}</el-descriptions-item>
                  <el-descriptions-item label="年报年份" name="NBYEAR">{{item.businessMessage[0].NBYEAR}}</el-descriptions-item>
                  <el-descriptions-item label="年报时间" name="NBDATE">{{item.businessMessage[0].NBDATE}}</el-descriptions-item>
                  <el-descriptions-item label="注册号" name="REGNO">{{item.businessMessage[0].REGNO}}</el-descriptions-item>
                  <el-descriptions-item label="行业门类代码" name="EMPNUM">{{item.businessMessage[0].EMPNUM}}</el-descriptions-item>
                  <el-descriptions-item label="邮政编码" name="POSTCODE">{{item.businessMessage[0].POSTCODE}}</el-descriptions-item>
                  <el-descriptions-item label="企业通信地址" name="ADDR">{{item.businessMessage[0].企业通信地址}}</el-descriptions-item>
                  <el-descriptions-item label="电子邮箱" name="EMAIL">{{item.businessMessage[0].EMAIL}}</el-descriptions-item>
                  <el-descriptions-item label="是否有网站或网店" name="ISWEB">{{item.businessMessage[0].ISWEB}}</el-descriptions-item>
                  <el-descriptions-item label="有限责任公司本年度是否发生股东股权转让" name="ISGQZR">{{item.businessMessage[0].ISGQZR}}</el-descriptions-item>
                  <el-descriptions-item label="企业是否有投资信息或购买其他公司股权" name="ISGMGQ">{{item.businessMessage[0].ISGMGQ}}</el-descriptions-item>
                </el-descriptions>
              <el-descriptions
                :border="true"
                :column="2"
                v-if="item.useComType === 'singleDesc'"
              >
                <el-descriptions-item
                  v-for="(value, key) in item.businessMessage[0]"
                  :key="key"
                  label-class-name="my-label"
                  :label="item.businessConfig[key]"
                  >{{ value }}</el-descriptions-item
                >
              </el-descriptions>
              <el-table
                v-if="item.useComType === 'table'"
                :data="item.businessMessage"
                header-row-class-name="custom-header"
                :border="true"
              > 
                <el-table-column v-for='(value, key, index) of item.businessConfig' :prop="key" :label="value" :key='index'>
                  <template #default="scope"  v-if="key === 'CONRATIO'">
                    {{scope.row.CONRATIO * 100}}%
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </u-container-layout>
</template>
<script lang="ts">
export default { name: "inline-table" };
</script>
<script lang="ts" setup>
import {
  entAppraise
} from "@/config/api";
import { computed, ref, reactive, onMounted, toRefs, watch } from "vue";
import { articleSelectById } from "@/config/api";
import { businessConfig, priseConfig } from "@/config/constants";
import { get, post } from "@/utils/request";
import * as echarts from 'echarts';
import {EChartsType} from "echarts/core";
interface prop {
  tabList: {
    type: Array<Object>;
  },
  baseInfo: {
    type: Object;
  }
}
let props = defineProps<prop>();
const emit = defineEmits(["dialogClose"]);
const state = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 10,
  activeName: '工商信息',
  activeYear: '2020',
  editableTabsValue: "1",
  dialogVisible: false,
  articletype: 1,
  businessConfig,
  priseConfig,
  tabList: props.tabList,
  baseInfo: props.baseInfo
});
let chart:EChartsType;

const articleHandleClick = (tab, event) => {
  state.activeName = tab.props.title;
  document.querySelector(`#${tab.props.label}`).scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
const articleHandleClick1 = (tab) => {
  state.activeYear
};
// 关闭弹窗
const close = (): void => {
  emit("dialogClose");
};
const initChart = (data): void => {
  let chart = echarts.init(document.getElementById('charts'))
  chart.setOption({
      radar: [
        {
          indicator: [
            { text: '竞争实力', max: 1000 },
            { text: '创新能力', max: 1000 },
            { text: '发展潜力', max: 1000 },
            { text: '身份特征', max: 1000 },
            { text: '经营风险', max: 1000 },
            { text: '活跃程度', max: 1000 }
          ],
          // radius: 80,
          // center: ['50%', '60%']
        }
      ],
      series: [
        {
          type: 'radar',
          symbol: 'none',
          areaStyle: {},
          data: [
            {
              value: data
            }
          ]
        }
      ]
    })
  return chart
}
//  文章内容列表
const getTestAll = (busneissName) => {
  let list = [];
  get(`${entAppraise}/${state.baseInfo.businessMessage.ENTNAME}`, {

  }).then(function (data) {
    state.overall = data.overall;
    state.overallGrade = data.overallGrade;
    chart = initChart(state.priseConfig.map(e => data[e])); 
  });
};
getTestAll();

// Mounted 生命周期 querySelectorAll 才生效
onMounted(() => {
  window.addEventListener('resize',function (){
    chart&&chart.resize()
  })
  var Observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // 进入可视区域
      if (entry.isIntersecting) {
        state.activeName = entry.target.innerHTML;
      }
    });
  });
  // 观察标题元素
  document.querySelectorAll("h3").forEach(function (ele) {
    Observer.observe(ele);
  });
});
</script>

<style lang="scss">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.business-essay-content {
  overflow-x: hidden;
  height: 600px;
  &::-webkit-scrollbar {
    display: none;
  }
  .my-label {
      width: 200px;
    }
  .business-essay-inline-edit-table {
    width: 92%;
    .custom-header {
      background: gray;
      th.el-table__cell {
        background: var(--el-fill-color-light);
      }
    }
    h3 {
      height: 26px;
      border-left: 4px solid #3085d5;
      padding-left: 10px;
      color: #333;
      line-height: 24px;
      margin: 22px 0 22px 0;
    }
    .my-label {
      width: 200px;
    }
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
