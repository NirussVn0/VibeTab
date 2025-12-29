<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('VibeTab Initialized')
})
</script>

<template>
  <div class="u-fullscreen u-center bg-background text-text-primary">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-primary mb-4">VibeTab</h1>
      <p class="text-text-secondary">Initializing...</p>
    </div>
  </div>
</template>
