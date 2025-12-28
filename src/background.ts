/**
 * VibeTab Background Service Worker
 * Handles extension lifecycle and background optimization tasks
 */

// Extension Install/Update Handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[VibeTab] Extension installed')
    // Set default settings on first install
    chrome.storage.local.set({
      vibetab_installed: Date.now(),
      vibetab_version: chrome.runtime.getManifest().version
    })
  } else if (details.reason === 'update') {
    console.log('[VibeTab] Extension updated to', chrome.runtime.getManifest().version)
  }
})

// Background Weather Cache (Optimizer)
const WEATHER_CACHE_KEY = 'vibetab_weather_cache'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

interface WeatherCache {
  data: any
  timestamp: number
  location: string
}

async function fetchAndCacheWeather(lat: number, lon: number, location: string) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    )
    const data = await res.json()
    
    const cache: WeatherCache = {
      data: data.current_weather,
      timestamp: Date.now(),
      location
    }
    
    await chrome.storage.local.set({ [WEATHER_CACHE_KEY]: cache })
    console.log('[VibeTab] Weather cached for', location)
    return cache
  } catch (error) {
    console.error('[VibeTab] Weather fetch failed:', error)
    return null
  }
}

// Message handler for communication with popup/newtab
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_WEATHER_CACHE') {
    chrome.storage.local.get(WEATHER_CACHE_KEY, (result) => {
      const cache = result[WEATHER_CACHE_KEY] as WeatherCache | undefined
      
      if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
        sendResponse({ success: true, data: cache })
      } else {
        sendResponse({ success: false, expired: true })
      }
    })
    return true // Keep channel open for async response
  }
  
  if (message.type === 'REFRESH_WEATHER') {
    const { lat, lon, location } = message
    fetchAndCacheWeather(lat, lon, location).then((cache) => {
      sendResponse({ success: !!cache, data: cache })
    })
    return true
  }
})

// Periodic alarm for background tasks (optional optimization)
chrome.alarms?.create('vibetab-bg-sync', { periodInMinutes: 30 })

chrome.alarms?.onAlarm.addListener((alarm) => {
  if (alarm.name === 'vibetab-bg-sync') {
    console.log('[VibeTab] Background sync triggered')
    // Could pre-fetch weather, bookmarks, etc.
  }
})

export {}
