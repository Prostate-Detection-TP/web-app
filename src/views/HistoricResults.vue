<template>
    <div class="container">
      <historic />
    </div>
  </template>
  
  <script setup lang="ts">
  import historic from '../detection/historic.vue'
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    width: 90vw;
    padding: 2rem;
  }
  </style>