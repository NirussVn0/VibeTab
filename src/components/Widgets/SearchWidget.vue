<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SearchConfig } from '../../types/widget'

const props = withDefaults(defineProps<{
  config: SearchConfig
}>(), {
  config: () => ({
    provider: 'google',
    aiMode: false
  })
})

const query = ref('')
const isAiMode = ref(props.config.aiMode)

const searchProviders = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q='
}

const handleSearch = () => {
  if (!query.value.trim()) return
  
  if (isAiMode.value) {
    // AI mode - redirect to ChatGPT
    const url = `https://chatgpt.com/?q=${encodeURIComponent(query.value)}`
    window.open(url, '_blank')
  } else {
    // Regular search
    const url = `${searchProviders[props.config.provider]}${encodeURIComponent(query.value)}`
    window.location.href = url
  }
}

const toggleAiMode = () => {
  isAiMode.value = !isAiMode.value
}

const placeholderText = computed(() => 
  isAiMode.value ? 'Ask AI...' : 'Search...'
)
</script>

<template>
  <div class="w-full h-full flex items-center justify-center p-2 sm:p-4">
    <div class="relative w-full h-full max-h-[60px] group flex items-center">
      <!-- Search Icon (always black) -->
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-600" />
      </div>

      <!-- Input (always white background) -->
      <input
        v-model="query"
        type="text"
        :placeholder="placeholderText"
        class="w-full h-full pl-11 pr-20 bg-white rounded-xl outline-none text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 transition-all shadow-lg text-sm sm:text-base"
        @keydown.enter="handleSearch"
      />
      
      <!-- AI Toggle Button -->
      <button
        @click="toggleAiMode"
        class="absolute right-10 inset-y-0 px-2 flex items-center transition-colors"
        :class="isAiMode ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'"
        :title="isAiMode ? 'AI Mode ON' : 'Switch to AI Mode'"
      >
        <SparklesIcon class="h-5 w-5" />
      </button>

      <!-- AI Badge (when active) -->
      <div v-if="isAiMode" class="absolute right-2 inset-y-0 flex items-center pointer-events-none">
        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white uppercase tracking-wider">AI</span>
      </div>
    </div>
  </div>
</template>
