<script setup lang="ts">
/**
 * ClockWidget - Displays time and date with configurable formats
 * Supports: 12h/24h time, MM/DD/Full date formats, custom colors
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ClockConfig } from '../../types/widget'

const props = withDefaults(defineProps<{
  config: ClockConfig
}>(), {
  config: () => ({
    style: 'digital',
    format: '24h',
    dateFormat: 'full',
    showSeconds: false,
    color: undefined,
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
  const format = props.config.dateFormat || 'full'
  const d = time.value
  
  if (format === 'MM/DD') {
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
  } else if (format === 'DD/MM') {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
  } else {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }
    return new Intl.DateTimeFormat('en-US', options).format(d)
  }
})

const textColor = computed(() => props.config.color || 'inherit')
</script>

<template>
  <div 
    class="w-full h-full flex flex-col items-center justify-center select-none container-type-size"
    :style="{ color: textColor }"
  >
    <!-- Digital Mode -->
    <div v-if="config.style === 'digital'" class="text-center w-full">
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
      Analog Clock (Coming Soon)
    </div>
  </div>
</template>

<style scoped>
.container-type-size {
  container-type: size;
}
</style>

