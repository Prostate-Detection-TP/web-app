<template>
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading">Loading...</div>
    </div>
  <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet">
  <form class="form-container" enctype='multipart/form-data'>
    <div class="upload-files-container" v-if="!loading">
      <div v-if="!showPrevImg" class="drag-file-area">
        <span class="material-icons-outlined upload-icon"> file_upload </span>
        <h3 class="dynamic-message"> Drag & drop any file here </h3>
        <label class="label"> or <span class="browse-files"> <input type="file" class="default-file-input" /> <span
              class="browse-files-text">browse file</span> <span>from device</span> </span> </label>
      </div>
      <div v-if="showPrevImg">
        <Skeleton v-if="loading" width="100%" height="150px"></Skeleton>
        <div class="">
          <div class="">
            <Image :src="prevImgUrl[currentIndex]" alt="Image" width="250" />
            <div class="slider-controls">
              <button @click="prevImage" :disabled="currentIndex === 0" type="button"><i class="pi pi-chevron-left" style="color: slateblue"></i></button>
              <span>{{ currentIndex + 1 }} / {{ prevImgUrl.length }}</span>
              <button @click="nextImage" :disabled="currentIndex === prevImgUrl.length - 1"
                type="button"><i class="pi pi-chevron-right" style="color: slateblue"></i></button>
            </div>
          </div>
        </div>
      </div>
      <span class="cannot-upload-message"> <span class="material-icons-outlined">error</span> Please select a file first
        <span class="material-icons-outlined cancel-alert-button">cancel</span> </span>
      <div class="file-block">
        <div class="file-info"> <span class="material-icons-outlined file-icon">description</span> <span
            class="file-name"> </span> | <span class="file-size"> </span> </div>
        <span class="material-icons remove-file-icon">delete</span>
        <div class="progress-bar"> </div>
      </div>
      <input ref="fileInput" type="file" style="display: none" accept=".jpg, .jpeg, .png" @change="onFileSelected"
        multiple />
      <button v-if="!showPrevImg" type="button" class="upload-button" @click="$refs.fileInput.click()"> Upload </button>
      <button v-if="showPrevImg" type="button" class="upload-button" @click="onAnalyzeImages()"> Analyze </button>
    </div>
    <div v-else>
      <Skeleton width="100%" height="150px"></Skeleton>
    </div>

    <Dialog v-model:visible="openModal" modal header="Result" :style="{ width: '50vw' }">
      <PredictionResultVue :predictions="predictions" :data="compleatePredictions[currentIndextSinglePrediction]" @result-saved="onResultSave" />
      <div class="slider-controls">
              <button @click="prevPrediction" :disabled="currentIndextSinglePrediction === 0" type="button"><i class="pi pi-chevron-left" style="color: slateblue"></i></button>
              <span>{{ currentIndextSinglePrediction + 1 }} / {{ compleatePredictions.length }}</span>
              <button @click="nextPrediction" :disabled="currentIndextSinglePrediction === compleatePredictions.length - 1"
                type="button"><i class="pi pi-chevron-right" style="color: slateblue"></i></button>
            </div>
      <!-- <ImageAnalysis :predictions="predictions" v-if="showPrevImg && predictions.length > 0" /> -->

    </Dialog>
    <Toast style="margin-top: 80px;" />
  </form>
</div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PredictionResultVue from "./PredictionResult.vue";
import ImageAnalysis from './ImageAnalysis.vue';
import { SinglePrediction } from '../models/singlePrediction';

const toast = useToast();
const loading = ref(false);
const openModal = ref(false);
const isLoading = ref(false);


const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const showPrevImg = ref(false);
const prevImgUrl = ref(['']);
const prediction = ref('');
const predictionAsIt = ref('');
const messagePrediction = ref('');
const significant = ref(false);
const predictions: any = ref([]);

const compleatePredictions: Ref<Array<SinglePrediction>> = ref([])

const currentIndex = ref(0);
const currentIndextSinglePrediction = ref(0);

const onRemoveTemplatingFile = (file: any, removeFileCallback: any, index: any) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onResultSave = () => {
  toast.add({ severity: "info", summary: "Success", detail: 'Saved successfully', life: 3000 });
  openModal.value = false;
}

const onClearTemplatingUpload = (clear: any) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

let uploadedFiles: any[] = [];
const onFileSelected = async (event: any) => {
  const selectedFiles = event.target.files;
  files.value = event.target.files;
  console.log(files.value)
  showPrevImg.value = true;
  prevImgUrl.value.pop();

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    prevImgUrl.value.push(URL.createObjectURL(file));

    // Realiza la solicitud para analizar el archivo
    await analyzeImage(file);
  }
  console.log(prevImgUrl)
};

const analyzeImage = async (file: any) => {
  loading.value = true;
  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await axios.post('https://prostata-server-app-2f18d01a3791.herokuapp.com/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Procesa la respuesta del servidor aquí
    if (data && data.prediction) {


      // Agrega la lógica para mostrar las predicciones en el componente ImageAnalysis aquí
      predictions.value.push(parseFloat(data.prediction));

      const tmpPred: SinglePrediction = data;
      data.imageUrl = URL.createObjectURL(file);
      console.log({tmpPred});
      compleatePredictions.value.push(tmpPred);
      console.log(compleatePredictions.value)
    } else {
      console.error('No se encontró una predicción válida en la respuesta del servidor.');
    }

  } catch (error) {
    console.error('Error al analizar la imagen:', error);
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const onAnalyzeImages = async () => {
  console.log('analaizin...')
  console.log(predictions.value)
  loading.value = true;
  openModal.value = true;
  // loading.value = true;
  // // Analiza todas las imágenes cargadas
  // for (let i = 0; i < uploadedFiles.length; i++) {
  //   const file = uploadedFiles[i];
  //   await analyzeImage(file);
  // }
  // // Después de analizar todas las imágenes, puedes realizar cualquier acción adicional aquí
  // // ...
  // loading.value = false;
}

const formatSize = (bytes: any) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const currentImageUrl = computed(() => {
  return prevImgUrl.value[currentIndex.value];
});

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};



const nextImage = () => {
  if (currentIndex.value < prevImgUrl.value.length - 1) {
    currentIndex.value++;
  }
};


const prevPrediction = () => {
  if (currentIndextSinglePrediction.value > 0) {
    currentIndextSinglePrediction.value--;
  }
};



const nextPrediction = () => {
  if (currentIndextSinglePrediction.value < compleatePredictions.value.length - 1) {
    currentIndextSinglePrediction.value++;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

.form-container {
  width: 100vw;
  height: 100vh;
  background-color: #7b2cbf;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-files-container {
  background-color: #f7fff7;
  width: 420px;
  padding: 30px 60px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 10px 20px, rgba(0, 0, 0, 0.28) 0px 6px 6px;
}

.drag-file-area {
  border: 2px dashed #7b2cbf;
  border-radius: 40px;
  margin: 10px 0 15px;
  padding: 30px 50px;
  width: 350px;
  text-align: center;
}

.drag-file-area .upload-icon {
  font-size: 50px;
}

.drag-file-area h3 {
  font-size: 26px;
  margin: 15px 0;
}

.drag-file-area label {
  font-size: 19px;
}

.drag-file-area label .browse-files-text {
  color: #7b2cbf;
  font-weight: bolder;
  cursor: pointer;
}

.browse-files span {
  position: relative;
  top: -25px;
}

.default-file-input {
  opacity: 0;
}

.cannot-upload-message {
  background-color: #ffc6c4;
  font-size: 17px;
  display: flex;
  align-items: center;
  margin: 5px 0;
  padding: 5px 10px 5px 30px;
  border-radius: 5px;
  color: #BB0000;
  display: none;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.cannot-upload-message span,
.upload-button-icon {
  padding-right: 10px;
}

.cannot-upload-message span:last-child {
  padding-left: 20px;
  cursor: pointer;
}

.file-block {
  color: #f7fff7;
  background-color: #7b2cbf;
  transition: all 1s;
  width: 390px;
  position: relative;
  display: none;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 15px;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
}

.file-info {
  display: flex;
  align-items: center;
  font-size: 15px;
}

.file-icon {
  margin-right: 10px;
}

.file-name,
.file-size {
  padding: 0 3px;
}

.remove-file-icon {
  cursor: pointer;
}

.progress-bar {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 4.5%;
  width: 0;
  height: 5px;
  border-radius: 25px;
  background-color: #4BB543;
}

.upload-button {
  font-family: 'Montserrat';
  background-color: #7b2cbf;
  color: #f7fff7;
  display: flex;
  align-items: center;
  font-size: 18px;
  border: none;
  border-radius: 20px;
  margin: 10px;
  padding: 7.5px 50px;
  cursor: pointer;
}

.container {
  padding: 2rem;
}

.slider__wrapper {
  position: relative;
  max-width: 48rem;
  margin: 0 auto;
  /*   background-color: blue; */
}

.slider {
  display: flex;
  aspect-ratio: 16 / 9;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  box-shadow: 0 1.5rem 3rem -0.75rem hsla(0, 0%, 0%, 0.25);
  border-radius: 1rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.slider::-webkit-scrollbar {
  display: none;
}

.slider img {
  flex: 1 0 100%;
  /* This will stretch the image*/
  scroll-snap-align: start;
  object-fit: cover;
  /* This will fix the stretch tho the image will be croppped a bit */
}

.slider__nav {
  display: flex;
  column-gap: 1rem;
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.slider__nav a {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background-color: #fff;
  opacity: 0.5;
  transition: opacity ease 0.25s;
}

.slider__nav a:hover {
  opacity: 1;
}


.slider-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  position: relative;
}

.slider-controls button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #7b2cbf;
  transition: color 0.3s;
}

.slider-controls button:hover {
  color: #4BB543;
}

.slider-controls span {
  font-size: 1.5rem;
  color: #7b2cbf;
  transition: color 0.3s;
}

.slider-controls button[disabled] {
  cursor: not-allowed;
  color: #ccc;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.loading {
  padding: 20px;
  border-radius: 10px;
  color: white;
  background-color: rgba(0, 0, 0, 0.85);
}

.slider__nav {
  display: flex;
  column-gap: 1rem;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.slider__nav a {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background-color: #fff;
  opacity: 0.5;
  transition: opacity ease 0.25s;
}

.slider__nav a:hover {
  opacity: 1;
}

.material-icons {
  font-size: 1rem;
}
</style>
