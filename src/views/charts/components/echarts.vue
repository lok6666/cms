<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="state.title" placeholder="请输入公司名称"/>
        </el-form-item>
        <el-form-item label="标题">
          <el-select v-model="state.region" placeholder="年份">
            <el-option label="2022" value="2022" />
            <el-option label="2021" value="2021" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
  </el-form>
  <div :id="id" :class="className" :style="{height:height,width:width}" ref="chartsRef"/>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import { onMounted, ref, reactive } from 'vue'
import {
  fincialDataStatistics
} from "@/config/api";
// import { formConfigItem } from "@/utils/interface";
import { deleteItem, get, post } from "@/utils/request";
const chartsRef = ref<HTMLElement|null>()
const props = defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  xAxisData: {
    type: Array,
    default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  config: {
    type: Object,
    default: () => {}
  },
  seriesData: {
    type: Array,
    default: () => [150, 230, 224, 218, 135, 147, 260]
  },
  id: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '200px'
  },
  height: {
    type: String,
    default: '200px'
  }
})
const colors = ['#5470C6', '#91CC75', '#EE6666', '#483D8B', '#F08080', '#FFFF00'];
const options = {
  color: colors,
  tooltip: {
    trigger: 'item',
    triggerOn: 'click'
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  legend: {
    data: ['营业收入', '纳税总额', '资产总额', '负债总额', '申请扶持资金', '获得融资']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      // prettier-ignore
      data: ['1月', '1-2月', '1-3月', '1-4月', '1-5月', '1-6月', '1-7月', '1-8月', '1-9月', '1-10月', '1-11月', '1-12月']
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '财税数据(万元)',
      position: 'left',
      alignTicks: true,
      axisLine: {
        show: true
      },
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: []
};
const state = reactive({
  options,
  title: '北京文投大数据有限公司',
  region: 2022
});
let chart:EChartsType
const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  chart.setOption(state.options)
  return chart
}
//  文章内容列表
const getactivityApplyAll = () => {
  get(`${fincialDataStatistics}/${state.title}/${state.region}`).then(function (data) {
    state.options.series = data.map(e => {
      if(e.type === 'scatter') {
        e.tooltip = {
          trigger: 'item',
          axisPointer: {
            type: 'cross'
          },
          formatter: function(params) {
            console.log('params', params);
            return `<p>${params.seriesName}${params.value}元</p>`
          }
        }
      };
      return e;
    });
    chart = initChart()
    window.addEventListener('resize', function () {
      chart && chart.resize()
    })
  });
};
const onSubmit = () => {
  getactivityApplyAll();
};
getactivityApplyAll();
</script>

<style>

</style>
