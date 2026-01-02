/**
 * TopToolbar - Fixed toolbar that stays visible across all view modes
 * Contains grid info, settings button, and edit mode toggle
 */
<script setup lang="ts">
import { computed } from 'vue'
import { Settings } from 'lucide-vue-next'
import { useUIStore } from '../../stores/ui.store'
import { useGridConfig } from '../../composables/useGridConfig'

const uiStore = useUIStore()
const { cols, rows, cellPx } = useGridConfig()

const isEditMode = computed(() => uiStore.isEditMode)
const toggleEditMode = () => uiStore.toggleEditMode()

const zoomFactor = computed(() => {
  const base = 16
  return cellPx.value / base
})
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex items-center gap-2">
    <span class="text-xs text-text-secondary bg-surface/80 backdrop-blur-sm px-2 py-1 rounded font-mono border border-border/50">
      {{ cols }}×{{ rows }} | {{ cellPx.toFixed(1) }}px | ×{{ zoomFactor.toFixed(2) }}
    </span>
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
