<template>
    <div class="card-container">
        <div class="surface-card">
            <div v-if="!showAll">


                <!-- Mensaje -->
                <div class="message-section">
                    <span class="message-text">{{ props.data.message }}</span>
                </div>

                <!-- Gráficos -->
                <div class="charts-section">
                    <!-- <DonnnutChart :data-value="progressValue" /> -->
                    <Image :src="props.data.imageUrl" alt="Image" width="250" />
                    <ProgressBar :value="progressValue">{{ progressValue }}/100 </ProgressBar>
                </div>

                <!-- Predicción -->
                <div class="prediction-section">
                    <span :class="predictionClass">{{ props.data.predictionFormated }}</span>
                </div>

                <br>
            </div>
            <div v-else>
      <ImageAnalysis :predictions="predictions" />
            </div>
            <Button label="Share" @click="startShare" />
            <Button label="Save" @click="saveInfo" />
            <Button :label="message" @click=" showAll = !showAll " />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import DonnnutChart from './DonnutChart.vue'
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { addDoc, collection } from "firebase/firestore";
import historic from './historic.vue'
import { useShare } from '@vueuse/core'
import { isClient } from '@vueuse/shared'
import { type SinglePrediction } from '../models/singlePrediction';
import ImageAnalysis from './ImageAnalysis.vue';

const emits = defineEmits<{
    (e: 'resultSaved'): void
}>();

const props = defineProps<{
    data: SinglePrediction,
    predictions: any
}>();

const showAll = ref(false);
const message = computed(() => !showAll.value ? 'View Resume' : 'View Details');

const options = ref({
    title: 'Result',
    text: `Prediction for analisis is ${props.data.predictionFormated} - equivalent to: ${props.data.message}`,
    url: isClient ? location.href : '',
})
const { share, isSupported } = useShare(options)

function startShare() {
    return share().catch(err => err)
}

const saveInfo = async () => {
    const historicCollection = collection(db, 'historic');
    const docRef = await addDoc(historicCollection, {
        value: props.data.prediction,
        date: Date.now()
    });
    console.log("Document written with ID: ", docRef.id);
    emits('resultSaved');
}

const abr = toRef(props, 'data')

const progressValue = ref(parseFloat(abr.value.prediction) * 100);

// Clase dinámica para la predicción
const predictionClass = computed(() => {
    return props.data.significant ? 'text-red-500 font-medium' : 'text-green-500 font-medium';
});
// Observa cambios en props.data y actualiza progressValue cuando cambia
watch(() => props.data, (newData) => {
    progressValue.value = parseFloat(newData.prediction) * 100;
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
    min-width: 30%;
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
