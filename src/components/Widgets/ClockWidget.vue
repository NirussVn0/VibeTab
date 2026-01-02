<script setup lang="ts">
/**
 * ClockWidget - Displays time and date with configurable formats
 * Uses dayjs for date formatting, supports custom colors
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import type { ClockConfig } from '../../types/widget'

const props = withDefaults(defineProps<{
  config: ClockConfig
}>(), {
  config: () => ({
    style: 'digital',
    format: '24h',
    dateFormat: 'Mon Jan 01',
    showSeconds: false,
    color: undefined,
    timezone: undefined
  })
})

const time = ref(dayjs())
let timer: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  time.value = dayjs()
}

onMounted(() => {
  timer = setInterval(updateTime, 1000)
  updateTime()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const formattedTime = computed(() => {
  const fmt = props.config.format === '12h' ? 'h:mm' : 'HH:mm'
  const sec = props.config.showSeconds ? ':ss' : ''
  const ampm = props.config.format === '12h' ? ' A' : ''
  return time.value.format(fmt + sec + ampm)
})

const dateStr = computed(() => {
  const format = props.config.dateFormat || 'Mon Jan 01'
  
  const formatMap: Record<string, string> = {
    'MM/DD/YYYY': 'MM/DD/YYYY',
    'DD/MM/YYYY': 'DD/MM/YYYY',
    'Mon Jan 01': 'ddd, MMM D',
    'YYYY-MM-DD': 'YYYY-MM-DD',
    'none': '',
    'full': 'ddd, MMM D',
    'MM/DD': 'MM/DD',
    'DD/MM': 'DD/MM'
  }
  
  const dayjsFormat = formatMap[format] || 'ddd, MMM D'
  if (!dayjsFormat) return ''
  return time.value.format(dayjsFormat)
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

