<template>
  <div class="flex flex-col items-center justify-center h-full text-white">
    <div class="text-6xl md:text-8xl font-bold tracking-tighter font-mono filter drop-shadow-lg">
      {{ time }}
    </div>
    <div class="text-lg md:text-xl font-light text-white/80 mt-2">
      {{ date }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNow, useDateFormat } from '@vueuse/core'

const now = useNow()
const time = useDateFormat(now, 'HH:mm')
const date = useDateFormat(now, 'dddd, MMMM Do')
</script>
