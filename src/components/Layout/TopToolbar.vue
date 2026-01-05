<!-- TopToolbar.vue - Fixed toolbar with grid info, settings, edit mode, and login -->
<script setup lang="ts">
import { computed } from 'vue'
import { Settings, User, LogOut } from 'lucide-vue-next'
import { useUIStore } from '../../stores/ui.store'
import { useAuthStore } from '../../stores/auth.store'
import { useGridConfig } from '../../composables/useGridConfig'

const uiStore = useUIStore()
const authStore = useAuthStore()
const { cols, rows, cellPx } = useGridConfig()

const isEditMode = computed(() => uiStore.isEditMode)
const toggleEditMode = () => uiStore.toggleEditMode()
const zoomFactor = computed(() => cellPx.value / 16)
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex items-center gap-2">
    <span class="text-xs text-text-secondary bg-surface/80 backdrop-blur-sm px-2 py-1 rounded font-mono border border-border/50">
      {{ cols }}×{{ rows }} | {{ cellPx.toFixed(1) }}px | ×{{ zoomFactor.toFixed(2) }}
    </span>
    
    <!-- Auth Button -->
    <button
      v-if="authStore.isLoggedIn"
      @click="authStore.logout()"
      class="flex items-center gap-2 px-3 py-1.5 rounded bg-surface/80 backdrop-blur-sm border border-border/50 text-sm hover:bg-surface transition-colors group"
      title="Logout"
    >
      <span class="text-primary-400 font-medium">{{ authStore.displayName }}</span>
      <LogOut class="w-4 h-4 text-text-secondary group-hover:text-red-400 transition-colors" />
    </button>
    <button
      v-else
      @click="authStore.openAuthModal()"
      class="flex items-center gap-2 px-3 py-1.5 rounded bg-gradient-to-r from-primary-500/20 to-purple-500/20 backdrop-blur-sm border border-primary-500/30 text-sm text-white hover:border-primary-500/50 transition-colors"
    >
      <User class="w-4 h-4" />
      <span>Login</span>
    </button>

    <button
      @click="uiStore.openSettings()"
      class="p-1.5 rounded bg-surface/80 backdrop-blur-sm border border-border/50 text-text-secondary hover:text-primary hover:border-primary transition-colors"
      title="Settings"
    >
      <Settings class="w-5 h-5" />
    </button>
    <button
      @click="toggleEditMode"
      class="px-3 py-1.5 rounded bg-surface/80 backdrop-blur-sm border border-border/50 text-sm hover:bg-surface transition-colors"
      :class="{ 'text-primary border-primary': isEditMode }"
    >
      {{ isEditMode ? 'Done' : 'Edit Layout' }}
    </button>
  </div>
</template>

