<template>
    <canvas ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, DoughnutController, ArcElement, CategoryScale } from 'chart.js';

Chart.register(DoughnutController, ArcElement, CategoryScale);

const canvas = ref<HTMLCanvasElement | null>(null);
const props = defineProps(['dataValue']);

onMounted(() => {
    const chartData = {
        datasets: [
            {
                data: [props.dataValue, 100 - props.dataValue],
                backgroundColor: ['#FF6384', '#F8F5E0'],
                label: 'Dataset 1'
            }
        ],
        labels: ['Probabilidad', 'Restante']
    };

    if (canvas.value) {
        const ctx = canvas.value.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: chartData
        });
    }
});
</script>
