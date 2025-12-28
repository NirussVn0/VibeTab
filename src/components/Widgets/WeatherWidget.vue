<template>
  <div class="h-full flex flex-col justify-center items-center text-white relative">
    <div v-if="loading" class="animate-pulse">Loading...</div>
    <div v-else-if="error" class="text-red-400 text-sm center">{{ error }}</div>
    <div v-else class="text-center">
      <div class="text-5xl mb-2">{{ getIcon(currentWeather?.weathercode) }}</div>
      <div class="text-3xl font-bold tracking-tight">{{ currentWeather?.temperature }}<span class="text-xl align-top">°C</span></div>
      <div class="text-white/60 text-sm font-medium mt-1">{{ settingsStore.general.weatherLocation }}</div>
      <div class="text-white/40 text-[10px] mt-2 flex gap-3 justify-center">
        <span class="flex items-center gap-1">💨 {{ currentWeather?.windspeed }} km/h</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSettingsStore } from '../../stores/settings.store'

const loading = ref(true)
const error = ref('')
const settingsStore = useSettingsStore()
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

// Values for API
const locationMap: Record<string, {lat: number, lon: number}> = {
  'New York': { lat: 40.71, lon: -74.01 },
  'London': { lat: 51.51, lon: -0.13 },
  'Tokyo': { lat: 35.68, lon: 139.76 },
  'San Francisco': { lat: 37.77, lon: -122.42 },
  'Sydney': { lat: -33.87, lon: 151.21 },
  'Hanoi': { lat: 21.02, lon: 105.83 }
}

const fetchWeather = async () => {
  loading.value = true
  try {
    const loc = locationMap[settingsStore.general.weatherLocation] || locationMap['New York']
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true`
    )
    const data = await res.json()
    currentWeather.value = data.current_weather
  } catch (e) {
    error.value = 'Failed to load weather'
  } finally {
    loading.value = false
  }
}

onMounted(fetchWeather)
watch(() => settingsStore.general.weatherLocation, fetchWeather)
</script>
