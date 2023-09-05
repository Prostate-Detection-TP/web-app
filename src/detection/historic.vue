<template>
  <div id="highchart-container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Highcharts from 'highcharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

onMounted(async () => {
  const data = await fetchData();
  Highcharts.chart('highchart-container', {
    chart: {
      type: 'line',
      backgroundColor: {
        linearGradient: [0, 0, 500, 500],
        stops: [
          [0, 'rgb(255, 255, 255)'],
          [1, 'rgb(240, 240, 255)']
        ]
      },
      style: {
        fontFamily: 'Futura, "Trebuchet MS", Arial, sans-serif'
      }
    },
    title: {
      text: 'Historic Predictions',
      style: {
        color: '#606060',
        fontSize: '24px'
      }
    },
    xAxis: {
      categories: data.dates,
      labels: {
        style: {
          color: '#707070'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Prediction Value',
        style: {
          color: '#707070'
        }
      }
    },
    series: [{
      name: 'Prediction',
      data: data.values,
      color: '#0078d4',
      marker: {
        fillColor: '#FFFFFF',
        lineWidth: 2,
        lineColor: '#0078d4'
      }
    }]
  });
});

const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, 'historic'));
  const dates: any[] = [];
  const values: any[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    dates.push(new Date(data.date).toLocaleDateString());
    values.push(parseFloat(data.value));
  });
  return { dates, values };
};
</script>

<style scoped>
#highchart-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
