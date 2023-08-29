<template>
  <div class="surface-card p-4 shadow-2 border-round w-full lg:w-8 ctn">
    <div class="text-center mb-5">
      <img src="../assets/prostate-cancer.jpg" alt="Image" height="50" class="mb-3">
      <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
      <span class="text-600 font-medium line-height-3">Already have an account?</span>
      <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Log in!</a>
    </div>

    <div>


      <label for="email1" class="block text-900 font-medium mb-2">Email</label>
      <InputText id="email1" type="text" v-model="email" class="w-full mb-3" />

      <label for="password1" class="block text-900 font-medium mb-2">Password</label>
      <InputText id="password1" type="password" v-model="password" class="w-full mb-3" />

      <div class="block">
        <label for="name" class=" text-900 font-medium mb-2">Name</label>
        <InputText id="name" style="margin: 10px"  type="text" v-model="name" class=" mb-3" />

        <label for="name"  class=" text-900 font-medium mb-2">Description</label>

        <InputText id="name" style="margin: 10px" type="text" v-model="descripcion" class=" mb-3" />

        <label for="name" class=" text-900 font-medium mb-2">Code</label>
        <InputText id="name" style="margin: 10px" type="text" v-model="code" class="w mb-3" />
      </div>


      <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <Checkbox id="rememberme1" :binary="true" v-model="checked" class="mr-2"></Checkbox>
          <label for="rememberme1">Remember me</label>
        </div>
        <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
      </div>
      <Button style="background-color: aliceblue; color: black; margin-bottom: 10px " label="Sign In with Google" @click="signInWithGoogle" icon="pi pi-google" class="w-full"></Button>
      <br>
      <Button label="Sign In" @click="register" icon="pi pi-user" class="w-full"></Button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import {useUserStore} from "@/stores/UserStore";
import {useRouter} from "vue-router";

const name = ref('')
const descripcion = ref('')
const code = ref('')
//const descripcion = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const checked = ref(false)
const userStore = useUserStore();

const router = useRouter();

const register = async () => {
  try {
    await  userStore.register({
      email: email.value,
      password: password.value,
      name: name.value,
      displayName: name.value,
      description: 'Hola, soy nuevo',
      code: '41552325',
      photoURL: 'https://static.vecteezy.com/system/resources/previews/005/520/145/original/cartoon-drawing-of-a-doctor-vector.jpg'
    });
    await router.push('/detect');
  } catch (err) {
    error.value = err.message;
  }
};

const signInWithGoogle = async () => {
  try {
    await userStore.signInWithGoogle();
    await router.push('/detect');
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style scoped>
.ctn{
  min-width: 80vw;
}
</style>
