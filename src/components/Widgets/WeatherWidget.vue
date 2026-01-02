/**
 * WeatherWidget - Displays current weather with caching and error handling
 * Uses Open-Meteo API with 30-minute localStorage cache
 */
<template>
  <div class="h-full flex flex-col justify-center items-center text-white relative">
    <div v-if="loading" class="flex flex-col items-center gap-2 animate-pulse">
      <div class="w-12 h-12 bg-white/20 rounded-full"></div>
      <div class="w-16 h-8 bg-white/20 rounded"></div>
      <div class="w-20 h-4 bg-white/10 rounded"></div>
    </div>

    <div v-else-if="error" class="text-center p-4">
      <AlertTriangle class="w-8 h-8 text-amber-400 mx-auto mb-2" />
      <p class="text-xs text-white/60">{{ error }}</p>
      <button 
        @click="fetchWeather(true)" 
        class="mt-2 px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
      >
        Retry
      </button>
    </div>

    <div v-else-if="currentWeather" class="text-center">
      <div class="text-5xl mb-2">
        <component :is="getWeatherIcon(currentWeather.weathercode)" class="w-12 h-12 mx-auto" />
      </div>
      <div class="text-3xl font-bold tracking-tight">
        {{ currentWeather.temperature }}<span class="text-xl align-top">°{{ config.unit?.toUpperCase() || 'C' }}</span>
      </div>
      <div class="text-white/60 text-sm font-medium mt-1">{{ settingsStore.general.weatherLocation }}</div>
      <div class="text-white/40 text-[10px] mt-2 flex gap-3 justify-center items-center">
        <span class="flex items-center gap-1">
          <Wind class="w-3 h-3" />
          {{ currentWeather.windspeed }} km/h
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, markRaw, type Component } from 'vue'
import { useSettingsStore } from '../../stores/settings.store'
import type { WeatherConfig } from '../../types/widget'
import { Sun, Cloud, CloudRain, AlertTriangle, Wind } from 'lucide-vue-next'

const CACHE_KEY = 'vibetab_weather_cache'
const CACHE_TTL = 30 * 60 * 1000

const { config } = withDefaults(defineProps<{ config: WeatherConfig }>(), {
  config: () => ({ unit: 'c' })
})

const loading = ref(true)
const error = ref('')
const settingsStore = useSettingsStore()
const currentWeather = ref<any>(null)

const getWeatherIcon = (code: number): Component => {
  if (code === 0) return markRaw(Sun)
  if (code <= 3) return markRaw(Cloud)
  if (code <= 70) return markRaw(CloudRain)
  return markRaw(Cloud)
}

const locationMap: Record<string, {lat: number, lon: number}> = {
  'New York': { lat: 40.71, lon: -74.01 },
  'London': { lat: 51.51, lon: -0.13 },
  'Tokyo': { lat: 35.68, lon: 139.76 },
  'San Francisco': { lat: 37.77, lon: -122.42 },
  'Sydney': { lat: -33.87, lon: 151.21 },
  'Hanoi': { lat: 21.02, lon: 105.83 }
}

const getCachedWeather = (location: string) => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const data = JSON.parse(cached)
    if (data.location !== location) return null
    if (Date.now() - data.timestamp > CACHE_TTL) return null
    return data.weather
  } catch {
    return null
  }
}

const setCachedWeather = (location: string, weather: any) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    location,
    weather,
    timestamp: Date.now()
  }))
}

const fetchWeather = async (forceRefresh = false) => {
  const location = settingsStore.general.weatherLocation || 'New York'
  
  if (!forceRefresh) {
    const cached = getCachedWeather(location)
    if (cached) {
      currentWeather.value = cached
      loading.value = false
      return
    }
  }

  loading.value = true
  error.value = ''
  
  try {
    const loc = locationMap[location] || locationMap['New York']
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true`
    )
    
    if (!res.ok) throw new Error('API Error')
    
    const data = await res.json()
    if (!data.current_weather) throw new Error('Invalid response')
    
    currentWeather.value = data.current_weather
    setCachedWeather(location, data.current_weather)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load weather'
    currentWeather.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchWeather())
watch(() => settingsStore.general.weatherLocation, () => fetchWeather(true))
</script>


