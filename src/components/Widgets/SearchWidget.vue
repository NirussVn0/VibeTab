<script setup lang="ts">
import { ref } from 'vue'
import type { SearchConfig } from '../../types/widget'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(defineProps<{
  config: SearchConfig
}>(), {
  config: () => ({
    provider: 'google',
    aiMode: false
  })
})

const query = ref('')

const searchProviders = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q='
}

const handleSearch = () => {
  if (!query.value.trim()) return
  const url = `${searchProviders[props.config.provider]}${encodeURIComponent(query.value)}`
  window.location.href = url
}
</script>

<template>
  <div class="w-full h-full flex items-center justify-center p-4">
    <div class="relative w-full max-w-2xl group">
      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50 group-focus-within:text-primary transition-colors">
        <MagnifyingGlassIcon class="h-5 w-5" />
      </div>

      <!-- Input -->
      <input
        v-model="query"
        type="text"
        placeholder="Search..."
        class="w-full pl-11 pr-4 py-3 bg-surface/40 backdrop-blur-md rounded-xl border border-border/10 outline-none text-text-primary placeholder:text-text-secondary/50 focus:bg-surface/60 focus:ring-2 focus:ring-primary/20 transition-all shadow-lg"
        @keydown.enter="handleSearch"
      />
      
      <!-- Provider Badge (Optional visual) -->
      <div v-if="config.aiMode" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
         <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-background uppercase tracking-wider">AI</span>
      </div>
    </div>
  </div>
</template>
