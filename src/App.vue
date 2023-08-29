
<template>
  <header>
    <div id="header">
      <div class="brand">
        <a  href="#name" class="name">{{ email }}</a>
      </div>
      <ul class="menu">
        <li v-for="route in routes"  :key="route.path"> <router-link :to="route.path">{{route.name}}</router-link></li>

      </ul>
    </div>
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import {useUserStore} from "@/stores/UserStore";
import {computed, reactive, ref, watch} from "vue";

const userStore = useUserStore();




const routes = useRouter().getRoutes().filter(e => e.meta.visible);
console.log({routes})

const userData = computed(() => userStore.user, {
  onTrigger(e) {
    console.log({e});
    console.log(userData.value)
  }
});
const email = computed(() => userData.value?.complementedData.displayName || 'No user');

console.log(userData.value)

</script>

<style scoped>
html,
body {
  height: 100%
}

* {
  box-sizing: border-box
}

ol,
ul {
  margin-top: 0;
  margin-bottom: 9px
}

a {
  color: #7E57C2;
  text-decoration: none;
  background: transparent;
}

body {
  line-height: 20px;
  font-family: 'Open Sans', helvetica, sans-serif;
  font-size: 13px;
  color: #333;
  background-color: #fff;
}

header {
  line-height: 60px;
  font-weight: 400;
  box-shadow: 0 1px 3px 0 #5E35B1;
  height: 60px;
  background-color: #7E57C2;
  top: 0;
  left: 0;
  position: fixed;
  right: 0;
  z-index: 10000;
}

#header {
  position: relative;
  width: 970px;
  margin: 0 auto;
  background: red;
}

#header .menu {
  float: left;
  line-height: 60px;
  margin-bottom: 0;
  font-size: 13px;
  list-style: none;
}

#header .menu li {
  display: inline-block;
}

#header .menu li a {
  display: block;
  letter-spacing: 1px;
  text-decoration: none;
  text-transform: uppercase;
  color: #fff;
  padding: 0 20px;
}

#header .menu li a:hover {
  background: #9575CD
}

#header .name {
  color: #fff;
  height: 60px;
  float: left;
  margin-right: 30px;
  margin-top: 0;
  font-size: 24px;
  font-family: 'Coiny', sans-serif;
  font-variant: small-caps;
}




</style>
