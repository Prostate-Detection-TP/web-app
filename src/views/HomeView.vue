<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <div class="cover-container">
    <h1 class="cover-title">Bienvenido a ProstaScan</h1>
    <p class="cover-subtitle">Innovación y compasión en la lucha contra el cáncer de próstata.</p>
    
    <div class="cover-content">
      <p>En <strong>ProstaScan</strong>, creemos en la detección temprana del cáncer de próstata que sea precisa, accesible y no invasiva.</p>
      <p>Nuestra plataforma utiliza IA y análisis de imágenes por resonancia magnética para una detección precisa.</p>
      <p>Únase a nuestra misión para transformar la detección del cáncer de próstata y salvar vidas.</p>
    </div>

    <button class="cover-button">Descubra Más</button>
  </div>
  </main>
</template>

<style scoped>
.cover-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  left: 55%;
}

.cover-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.cover-subtitle {
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 2rem;
}

.cover-content p {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.cover-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cover-button:hover {
  background-color: #0056b3;
}
</style>
