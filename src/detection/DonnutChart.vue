<template>
    <div class="card flex justify-content-center">
      <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  onMounted(() => {
    chartData.value = setChartData();
  });
  const props = defineProps(['dataValue']);
  const chartData = ref();
  const chartOptions = ref({
    cutoutPercentage: 60,
  });
  
  const setChartData = () => {
    return {
      labels: ['Value', 'Rest'],
      datasets: [
        {
          data: [props.dataValue, 100 - props.dataValue],
          backgroundColor: ['#FF6384', '#F8F5E0'],
          hoverBackgroundColor: ['#FF6384', '#F8F5E0'],
        },
      ],
    };
  };
  </script>
  
  <style scoped>
  </style>
  