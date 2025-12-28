<template>
  <div class="w-full h-full flex items-center justify-center">
    <div 
      class="w-full max-w-2xl h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center px-6 transition-all duration-300 border border-white/10 focus-within:border-primary-400 focus-within:bg-white/15 focus-within:shadow-lg focus-within:shadow-primary-500/20"
    >
      <svg class="w-5 h-5 text-white/50 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input 
        type="text" 
        v-model="query"
        @keydown.enter="handleSearch"
        placeholder="Search Google..."
        class="w-full bg-transparent border-none outline-none text-white placeholder-white/50 text-lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')

const handleSearch = () => {
  if (!query.value.trim()) return
  window.open(`https://google.com/search?q=${encodeURIComponent(query.value)}`, '_blank')
  query.value = ''
}
</script>
