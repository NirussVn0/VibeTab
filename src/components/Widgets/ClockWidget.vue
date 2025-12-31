<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ClockConfig } from '../../types/widget'

const props = withDefaults(defineProps<{
  config: ClockConfig
}>(), {
  config: () => ({
    style: 'digital',
    format: '24h',
    showSeconds: false,
    timezone: undefined
  })
})

const time = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  time.value = new Date()
}

onMounted(() => {
  timer = setInterval(updateTime, 1000)
  updateTime()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const formattedTime = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    second: props.config.showSeconds ? '2-digit' : undefined,
    hour12: props.config.format === '12h',
    timeZone: props.config.timezone
  }
  return new Intl.DateTimeFormat('en-US', options).format(time.value)
})

const dateStr = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }
  return new Intl.DateTimeFormat('en-US', options).format(time.value)
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center select-none text-text-primary container-type-size">
    <!-- Digital Mode -->
    <div v-if="config.style === 'digital'" class="text-center w-full">
      <!-- Responsive font size relative to container height (cqh) and width (cqw) -->
      <div 
        class="font-bold tabular-nums leading-none tracking-tight"
        style="font-size: clamp(1rem, 25cqw, 8rem);"
      >
        {{ formattedTime }}
      </div>
      <div 
        class="font-medium opacity-80 mt-[2cqh]"
        style="font-size: clamp(0.75rem, 8cqw, 2rem);"
      >
        {{ dateStr }}
      </div>
    </div>

    <!-- Placeholder Analog Mode -->
    <div v-else class="text-center opacity-70">
      Analog Clock Logic Pending
    </div>
  </div>
</template>

<style scoped>
.container-type-size {
  container-type: size;
}
</style>
