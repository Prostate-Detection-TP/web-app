<script setup lang="ts">
import {computed, ref} from "vue";
import {useUserStore} from "@/stores/UserStore";
import {doc, setDoc, updateDoc } from "firebase/firestore";
const userStore = useUserStore();
import { db } from '@/firebaseConfig';
import {useToast} from "primevue/usetoast";
import axios from "axios";
const PK='be5b07f7e7a08942b1318f8d6905fcac';
const SC ='d447464d15c4f1ac11601a7603beec1b'
const toast = useToast();
const userData = computed(() => userStore.user, {
  onTrigger(e) {
  }
});

const user = computed(() => userData.value);
console.log(user.value, 'dddd')


const description = ref(user.value.complementedData.description ?? 'no description');

const updateData = async () => {
  if (user.value && user.value.uid) {
    try {
      const userDocRef = doc(db, 'users', user.value.uid);
      await updateDoc(userDocRef, { description: description.value });
      await userStore.fetchComplementedData(user.value.uid)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Updated succesfully', life: 3000 });
      try {
        await sendEmail(user.value.email,'Information updated', 'Hemos actualizado tus datos en nuestra plataforma.');
      }
      catch (e) {
        console.log({e})
      }
    }
    catch (e) {
      toast.add({ severity: 'error', summary: 'Error', detail: `${e}`, life: 3000 });
    }

  } else {
    console.error("User is not defined or doesn't have a UID.");
  }

}

const base64Encode = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
}
const sendEmail = async (to: string, subject: string, text: string) => {
  const url = '/api/v3.1/send';

  const data = {
    Messages: [
      {
        From: {Email: 'u20181e790@upc.edu.pe', Name: 'Prostate detection APP'},
        To: [{Email: to}],
        Subject: subject,
        TextPart: text
      }
    ]
  };

  const headers = {
    'Authorization': `Basic ${base64Encode(`${PK}:${SC}`)}`
  };

  try {
    const response = await axios.post(url, data, {headers: headers});
    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
</script>
<template>
  <div class="card">
    <Toast style="margin-top: 50px" />
    <img src="https://www.endocrine.org/-/media/endocrine/images/featured-images/1796x943_image_endocrine_cancer_and_neoplasia.jpg" alt="Background" class="card_background_img">
    <img :src="user.photoURL || user.complementedData.photoURL" alt="Profile" class="card_profile_img">
    <div class="user_details">
      <h3>{{user.displayName}}</h3>
      <p>{{user.email}}</p>
    </div>
    <div class="card_count">
      <div class="count" v-if="description">
        <label for="name"  class=" text-900 font-medium mb-2">Description</label>

        <InputText id="name" style="margin: 10px" type="text" v-model="description" class=" mb-3" />
      </div>
      <div @click="updateData" class="btn">Save</div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #e1e7ed;
  text-align: center;
}

h3 {
  font-size: 18px;
  font-weight: 500;
  color: #33363b;
}

p{
  font-size: 14px;
  color: #868d9b;
}

.card {
  width: 360px;
  height: auto;
  background-color: #ffffff;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.15);
  position: relative;
  margin: auto auto 0 35vw;

}

.card_profile_img {
  width: 120px;
  height: 120px;
  border: 2px solid #ffffff;
  border-radius: 120px;
  margin: -60px auto 0 8vw;
}

.card_background_img {
  width: 100%;
  height: 180px;
  display: block;
}

.user_details p {
  margin-bottom: 20px;
  margin-top: -5px;
  margin-left: 7vw;
}

.user_details h3 {
  margin-top: 10px;
}

.card_count {
  padding: 30px;
  border-top: 1px solid #dde1e7;
}

.count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.count p {
  margin-top: -10px;
}

.btn {
  padding: 16px;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 4px;
  background-color: #24c5a1;
  color: #ffffff;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>