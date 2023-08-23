<template>
  <div class="surface-card p-4 shadow-2 border-round w-full lg:w-8 ctn">
    <div class="text-center mb-5">
      <img src="../assets/prostate-cancer.jpg" alt="Image" height="50" class="mb-3">
      <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
      <span class="text-600 font-medium line-height-3">Already have an account?</span>
      <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Log in!</a>
    </div>

    <div>
      <label for="name" class="block text-900 font-medium mb-2">Name</label>
      <InputText id="name" type="text" v-model="name" class="w-full mb-3" />

      <label for="email1" class="block text-900 font-medium mb-2">Email</label>
      <InputText id="email1" type="text" v-model="email" class="w-full mb-3" />

      <label for="password1" class="block text-900 font-medium mb-2">Password</label>
      <InputText id="password1" type="password" v-model="password" class="w-full mb-3" />

      <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <Checkbox id="rememberme1" :binary="true" v-model="checked" class="mr-2"></Checkbox>
          <label for="rememberme1">Remember me</label>
        </div>
        <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
      </div>

      <Button label="Sign In" @click="register" icon="pi pi-user" class="w-full"></Button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const checked = ref(false)

const store = useStore()
const router = useRouter()

const register = async () => {
  try {
    console.log(name.value, email.value, password.value)
    const res = await store.dispatch('register', {
      email: email.value,
      password: password.value,
      name: name.value
    })
    console.log({res})
    await router.push('/')
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<style scoped>
.ctn{
  min-width: 80vw;
}
</style>
