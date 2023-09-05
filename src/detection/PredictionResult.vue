<template>
    <div class="card-container">
        <div class="surface-card">
            <!-- Mensaje -->
            <div class="message-section">
                <span class="message-text">{{ props.message }}</span>
            </div>

            <!-- Gráficos -->
            <div class="charts-section">
                <DonnnutChart :data-value="progressValue" />
                <ProgressBar :value="progressValue">{{ progressValue }}/100 </ProgressBar>
            </div>

            <!-- Predicción -->
            <div class="prediction-section">
                <span :class="predictionClass">{{ predictionFormated }}</span>
            </div>

            <br>
            <Button label="Save" @click="saveInfo" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DonnnutChart from './DonnutChart.vue'
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { addDoc, collection } from "firebase/firestore";
import historic from './historic.vue'

const emits = defineEmits<{
    (e: 'resultSaved'): void
}>()

const saveInfo = async () => {
    const historicCollection = collection(db, 'historic');
    const docRef = await addDoc(historicCollection, {
        value: props.prediction,
        date: Date.now()
    });
    console.log("Document written with ID: ", docRef.id);
    emits('resultSaved');
}

const props = defineProps<{
    prediction: string,
    predictionFormated: string,
    message: string,
    significant: boolean
}>();

const progressValue = parseFloat(props.prediction) * 100;

// Clase dinámica para la predicción
const predictionClass = computed(() => {
    return props.significant ? 'text-red-500 font-medium' : 'text-green-500 font-medium';
});

</script>

<style scoped>
.card-container {
    grid-column: span 12/span 3;
    display: flex;
    justify-content: center;
    align-items: center;
}

.surface-card {
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.message-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.message-text {
    font-weight: 500;
}

.charts-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.prediction-section {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
