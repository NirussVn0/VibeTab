<template>
  <footer class="absolute bottom-4 w-full text-center z-10 pointer-events-none">
    <p class="text-[10px] md:text-xs text-white/20 font-light tracking-widest uppercase">
      © {{ year }} SabiOfVibe Lab.
    </p>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const year = computed(() => new Date().getFullYear())
</script>
