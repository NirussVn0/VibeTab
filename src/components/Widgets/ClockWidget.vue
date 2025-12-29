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
  <div class="w-full h-full flex flex-col items-center justify-center select-none text-text-primary">
    <!-- Digital Mode -->
    <div v-if="config.style === 'digital'" class="text-center">
      <div class="text-[clamp(2rem,10vw,4rem)] font-bold tabular-nums leading-none tracking-tight">
        {{ formattedTime }}
      </div>
      <div class="text-sm md:text-base font-medium opacity-80 mt-2">
        {{ dateStr }}
      </div>
    </div>

    <!-- Placeholder Analog Mode -->
    <div v-else class="text-center opacity-70">
      Analog Clock Logic Pending
    </div>
  </div>
</template>
