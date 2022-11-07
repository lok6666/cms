<template>
  <div class="m-complex">
    <div class="m-complex-inner">
      <!-- <div class="item-complex">
        <line-charts width="100%" height="100%" />
      </div>

      <div class="item-complex">
        <bar-charts width="100%" height="100%" />
      </div> -->
      <div style="width: 100%;height: 1000px;">
        <test-charts width="100%" height="100%" v-model:echartsOptions="state.echartsOptions"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, provide } from "vue";
import testCharts from "@/components/Charts/echarts.vue";
import LineCharts from './components/complex/line/index'
import BarCharts from './components/complex/bar/index'
const state = reactive({
  echartsOptions: {
        title: {
          text: '财税数据'
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ["product", "营业收入",  "纳税总额", '资产总额', '负债总额'],
          source: [
            { product: "2022年", '营业收入': 2987.3,  '纳税总额': 30.1 , '资产总额': 10153.9, '负债总额': 991.4 },
            { product: "2021年", '营业收入': 4512.2,  '纳税总额': 3.6, '资产总额': 10639.2, '负债总额': 1226.2},
            { product: "2020年", '营业收入': 1874.0,  '纳税总额': 71.4, '资产总额': 9591.2, '负债总额': 1361.1}    
          ],
        },
        xAxis: { type: "category" },
        yAxis: {
          name: "单位（万元）",
          axisLabel: {
            //这种做法就是在y轴的数据的值旁边拼接单位，貌似也挺方便的
            formatter: "{value} 万元",
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }, { type: "bar" }],
      }
});
</script>
<style lang="scss" scoped>
  .m-complex{
    height: 100%;
    width: 100%;
    // background-color: #030409;
    .m-complex-inner{
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
    }
  }
  .item-complex{
    width: 454px;
    height: 292px;
    background-image: url('../../assets/image/charts/1-1-bg.png');
    // background-color: #042750;
    background-size: contain;
    background-repeat: no-repeat;
  }

</style>
