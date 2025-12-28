<template>
  <div class="h-full flex flex-col justify-center items-center text-white relative">
    <div v-if="loading" class="animate-pulse">Loading...</div>
    <div v-else-if="error" class="text-red-400 text-sm center">{{ error }}</div>
    <div v-else class="text-center">
      <div class="text-5xl mb-2">{{ getIcon(currentWeather?.weathercode) }}</div>
      <div class="text-3xl font-bold tracking-tight">{{ currentWeather?.temperature }}<span class="text-xl align-top">°C</span></div>
      <div class="text-white/60 text-sm font-medium mt-1">{{ locationName }}</div>
      <div class="text-white/40 text-[10px] mt-2 flex gap-3 justify-center">
        <span class="flex items-center gap-1">💨 {{ currentWeather?.windspeed }} km/h</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStorage } from '../../composables/useStorage'

const loading = ref(true)
const error = ref('')
const locationName = useStorage('vibetab_weather_location', 'New York')
const currentWeather = ref<any>(null)

// WMO Weather interpretation codes (WW)
const getIcon = (code: number) => {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌧️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

onMounted(async () => {
  try {
    // 1. Get Lat/Lon (Simplified: Defaulting to NY for demo, ideally use Geolocation API)
    // For MVP, lat/lon for New York
    const lat = 40.71;
    const lon = -74.01;

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    )
    const data = await res.json()
    currentWeather.value = data.current_weather
  } catch (e) {
    error.value = 'Failed to load weather'
  } finally {
    loading.value = false
  }
})
</script>
