<template>
  <header class="w-full px-6 py-4 flex items-center justify-between z-10 text-white">
    <!-- Left: Logo / Branding -->
    <div class="flex items-center gap-2">
      <h1 class="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
        VibeTab
      </h1>
    </div>

    <!-- Center: Clock (Simple) -->
    <div class="absolute left-1/2 transform -translate-x-1/2">
      <span class="text-white/80 font-mono text-sm">{{ currentTime }}</span>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-3">
      <button 
        @click="uiStore.toggleEditMode"
        class="p-2 rounded-full hover:bg-white/10 transition-colors"
        :class="{ 'text-primary-400 bg-white/10': uiStore.isEditMode }"
        title="Edit Layout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <button 
        @click="uiStore.toggleSettings"
        class="p-2 rounded-full hover:bg-white/10 transition-colors"
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUIStore } from '../../stores/ui.store'
import { useNow, useDateFormat } from '@vueuse/core'

const uiStore = useUIStore()
const currentTime = useDateFormat(useNow(), 'HH:mm')
</script>
