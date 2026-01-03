/**
 * WeatherWidget - Displays weather with multiple format modes
 * Supports: default (icon+temp), compact (stats list), detailed (full info)
 * Uses Open-Meteo API with 30-minute localStorage cache
 */
<template>
  <div class="h-full flex flex-col justify-center items-center text-white relative p-2">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="flex flex-col items-center gap-2 animate-pulse">
      <div class="w-12 h-12 bg-white/20 rounded-full"></div>
      <div class="w-16 h-6 bg-white/20 rounded"></div>
      <div class="w-20 h-4 bg-white/10 rounded"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center p-3">
      <AlertTriangle class="w-8 h-8 text-amber-400 mx-auto mb-2" />
      <p class="text-xs text-white/60 mb-2">{{ error }}</p>
      <button 
        @click="fetchWeather(true)" 
        class="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors interactive"
      >
        Retry
      </button>
    </div>

    <!-- Default Mode: Icon + Temperature -->
    <div v-else-if="currentWeather && displayMode === 'default'" class="text-center">
      <component :is="getWeatherIcon(currentWeather.weathercode)" class="w-12 h-12 mx-auto mb-2 text-white/90" />
      <div class="text-3xl font-bold tracking-tight">
        {{ Math.round(currentWeather.temperature) }}<span class="text-xl align-top">°C</span>
      </div>
      <div class="text-white/60 text-sm font-medium mt-1">{{ location }}</div>
      <div class="text-white/40 text-[10px] mt-2 flex gap-3 justify-center items-center">
        <span class="flex items-center gap-1">
          <Wind class="w-3 h-3" />
          {{ currentWeather.windspeed }} km/h
        </span>
        <span v-if="humidity !== null" class="flex items-center gap-1">
          <Droplets class="w-3 h-3" />
          {{ humidity }}%
        </span>
      </div>
    </div>

    <!-- Compact Mode: Stats List Only -->
    <div v-else-if="currentWeather && displayMode === 'compact'" class="w-full px-2 space-y-1.5">
      <div class="flex justify-between items-center text-xs">
        <span class="text-white/60">Temperature</span>
        <span class="font-medium">{{ Math.round(currentWeather.temperature) }}°C</span>
      </div>
      <div class="flex justify-between items-center text-xs">
        <span class="text-white/60">Wind</span>
        <span class="font-medium">{{ currentWeather.windspeed }} km/h</span>
      </div>
      <div v-if="humidity !== null" class="flex justify-between items-center text-xs">
        <span class="text-white/60">Humidity</span>
        <span class="font-medium">{{ humidity }}%</span>
      </div>
      <div class="flex justify-between items-center text-xs">
        <span class="text-white/60">Location</span>
        <span class="font-medium truncate max-w-[80px]">{{ location }}</span>
      </div>
    </div>

    <!-- Detailed Mode: Full Info with Forecast -->
    <div v-else-if="currentWeather && displayMode === 'detailed'" class="w-full px-2 text-center">
      <div class="flex items-center justify-center gap-3 mb-2">
        <component :is="getWeatherIcon(currentWeather.weathercode)" class="w-10 h-10 text-white/90" />
        <div class="text-2xl font-bold">{{ Math.round(currentWeather.temperature) }}°C</div>
      </div>
      <div class="text-white/70 text-sm font-medium mb-3">{{ location }}</div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-white/5 rounded-lg p-2">
          <Wind class="w-4 h-4 mx-auto mb-1 text-white/60" />
          <div class="font-medium">{{ currentWeather.windspeed }} km/h</div>
          <div class="text-white/40">Wind</div>
        </div>
        <div class="bg-white/5 rounded-lg p-2">
          <Droplets class="w-4 h-4 mx-auto mb-1 text-white/60" />
          <div class="font-medium">{{ humidity ?? '--' }}%</div>
          <div class="text-white/40">Humidity</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, markRaw, type Component } from 'vue'
import { useSettingsStore } from '../../stores/settings.store'
import type { WeatherConfig } from '../../types/widget'
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, AlertTriangle, Wind, Droplets } from 'lucide-vue-next'

const CACHE_KEY = 'vibetab_weather_cache'
const CACHE_TTL = 30 * 60 * 1000

const props = withDefaults(defineProps<{ config: WeatherConfig }>(), {
  config: () => ({ unit: 'c', displayMode: 'default' })
})

const loading = ref(true)
const error = ref('')
const settingsStore = useSettingsStore()
const currentWeather = ref<any>(null)
const humidity = ref<number | null>(null)

const location = computed(() => settingsStore.general.weatherLocation || 'New York')
const displayMode = computed(() => props.config.displayMode || 'default')

const getWeatherIcon = (code: number): Component => {
  if (code === 0) return markRaw(Sun)
  if (code <= 3) return markRaw(Cloud)
  if (code <= 48) return markRaw(Cloud)
  if (code <= 67) return markRaw(CloudRain)
  if (code <= 77) return markRaw(CloudSnow)
  if (code <= 99) return markRaw(CloudLightning)
  return markRaw(Cloud)
}

const locationMap: Record<string, {lat: number, lon: number}> = {
  'New York': { lat: 40.71, lon: -74.01 },
  'London': { lat: 51.51, lon: -0.13 },
  'Tokyo': { lat: 35.68, lon: 139.76 },
  'San Francisco': { lat: 37.77, lon: -122.42 },
  'Sydney': { lat: -33.87, lon: 151.21 },
  'Hanoi': { lat: 21.02, lon: 105.83 },
  'Ho Chi Minh': { lat: 10.82, lon: 106.63 },
  'Paris': { lat: 48.85, lon: 2.35 },
  'Berlin': { lat: 52.52, lon: 13.40 },
  'Singapore': { lat: 1.35, lon: 103.82 }
}

interface CachedData {
  location: string
  weather: any
  humidity: number | null
  timestamp: number
}

const getCachedWeather = (loc: string): CachedData | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const data: CachedData = JSON.parse(cached)
    if (data.location !== loc) return null
    if (Date.now() - data.timestamp > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

const setCachedWeather = (loc: string, weather: any, hum: number | null) => {
  const data: CachedData = {
    location: loc,
    weather,
    humidity: hum,
    timestamp: Date.now()
  }
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
}

const fetchWeather = async (forceRefresh = false) => {
  const loc = location.value
  
  if (!forceRefresh) {
    const cached = getCachedWeather(loc)
    if (cached) {
      currentWeather.value = cached.weather
      humidity.value = cached.humidity
      loading.value = false
      return
    }
  }

  loading.value = true
  error.value = ''
  
  try {
    const coords = locationMap[loc] || locationMap['New York']
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=relative_humidity_2m`
    )
    
    if (!res.ok) throw new Error('Network error')
    
    const data = await res.json()
    if (!data.current_weather) throw new Error('Invalid data')
    
    currentWeather.value = data.current_weather
    
    // Extract current humidity from hourly data
    if (data.hourly?.relative_humidity_2m?.length > 0) {
      const currentHour = new Date().getHours()
      humidity.value = data.hourly.relative_humidity_2m[currentHour] ?? null
    }
    
    setCachedWeather(loc, data.current_weather, humidity.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load'
    currentWeather.value = null
    humidity.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchWeather())
watch(() => settingsStore.general.weatherLocation, () => fetchWeather(true))
</script>
