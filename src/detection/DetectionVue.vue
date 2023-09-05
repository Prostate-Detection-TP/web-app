<template>
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
          <Image :src="prevImgUrl" alt="Image" width="250" />
        </div>
        <span class="cannot-upload-message"> <span class="material-icons-outlined">error</span> Please select a file first
          <span class="material-icons-outlined cancel-alert-button">cancel</span> </span>
        <div class="file-block">
          <div class="file-info"> <span class="material-icons-outlined file-icon">description</span> <span
              class="file-name"> </span> | <span class="file-size"> </span> </div>
          <span class="material-icons remove-file-icon">delete</span>
          <div class="progress-bar"> </div>
        </div>
        <input ref="fileInput" type="file" style="display: none" accept=".jpg, .jpeg, .png" @change="onFileSelected">
        <button v-if="!showPrevImg" type="button" class="upload-button" @click="$refs.fileInput.click()"> Upload </button>
        <button v-if="showPrevImg" type="button" class="upload-button" @click="onAnalizeImage()"> Analize </button>
      </div>
      <div v-else>
        <Skeleton width="100%" height="150px"></Skeleton>
      </div>

      <Dialog v-model:visible="openModal" modal header="Result" :style="{ width: '50vw' }">
        <PredictionResultVue @result-saved="onReultSave" :significant="significant" :prediction="predictionAsIt" :prediction-formated="prediction" :message="messagePrediction" />
      </Dialog>
    </form>
    <Toast style="margin-top: 80px;" />
</template>


<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import  PredictionResultVue from "./PredictionResult.vue";

const toast = useToast();
const loading = ref(false);
const openModal = ref(false);

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const showPrevImg = ref(false);
const prevImgUrl = ref('');
const prediction = ref('');
const predictionAsIt = ref('');
const messagePrediction = ref('');
const significant = ref(false);

const onRemoveTemplatingFile = (file: any, removeFileCallback: any, index: any) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onReultSave = () => {
  toast.add({ severity: "info", summary: "Success", detail: 'Saved succesfully', life: 3000 });
  openModal.value = false;
}

const onClearTemplatingUpload = (clear: any) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

let uploadedFile: any;
const onFileSelected = async (event: any) => {
  showPrevImg.value = true;
  prevImgUrl.value = URL.createObjectURL(event.target.files[0]);
  console.log({ event });
  console.log('cr7');
  uploadedFile = event.target.files[0];
  //loading.value = true;
  // onSelectedFiles(event);
}

const onAnalizeImage = async () => {
  loading.value = true;
  const { data } = await axios.post('http://127.0.0.1:5000/predict', {
    image: uploadedFile
  }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  )
 // toast.add({ severity: "info", summary: "Success", detail: `Prediction: ${data.prediction}`, life: 3000 });
  loading.value = false;
  prediction.value = (parseFloat(data.prediction) * 100).toFixed(15) + "%";
  messagePrediction.value = data.prediction > 0.5 ? 'SIGNIFICANT' : 'NOT - SIGNIFICANT';
  predictionAsIt.value = data.prediction;
  significant.value = data.prediction > 0.5 ? true : false;
  console.log(prediction.value)
  openModal.value = true;
  showPrevImg.value = false;
}
const onSelectedFiles = (event: any) => {
  console.log(files)
  files.value = event.files;
  files.value.forEach((file: any) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const uploadEvent = (callback: any) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const onTemplatedUpload = () => {
  toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

const formatSize = (bytes: any) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
}</style>