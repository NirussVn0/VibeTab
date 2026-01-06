/**
 * PomodoroContainer - Focus Mode with editable grid layout.
 * Uses vue-grid-layout-v3 for drag/resize with 16px grid snap.
 */
<script setup lang="ts">
import { computed } from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout-v3'
import { usePomodoroStore } from '../../stores/pomodoro.store'
import { useUIStore } from '../../stores/ui.store'
import { useEditableGrid } from '../../composables/useEditableGrid'
import { Play, Pause, RotateCcw, SkipForward, Settings, Move } from 'lucide-vue-next'

const pomodoro = usePomodoroStore()
const uiStore = useUIStore()

const GRID_COLS = Math.floor(window.innerWidth / 16)

const {
  layout,
  isEditMode,
  gridLayoutProps,
  gridBackgroundStyle,
  toggleEditMode
} = useEditableGrid({
  storageKey: 'vibetab_pomodoro_layout',
  defaultLayout: [
    { i: 'timer', x: Math.floor((GRID_COLS - 20) / 2), y: 8, w: 20, h: 14, static: false },
    { i: 'controls', x: Math.floor((GRID_COLS - 16) / 2), y: 24, w: 16, h: 4, static: false }
  ],
  cellSize: 16,
  preventCollision: true,
  verticalCompact: false
})

const modeColors = computed(() => {
  const colors: Record<string, { bg: string; text: string; ring: string }> = {
    focus: { bg: 'bg-rose-500/20', text: 'text-rose-400', ring: 'ring-rose-500/30' },
    shortBreak: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
    longBreak: { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/30' },
    prepare: { bg: 'bg-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500/30' }
  }
  return colors[pomodoro.mode] || colors.focus
})

const modeLabel = computed(() => {
  const labels: Record<string, string> = {
    focus: 'FOCUS',
    shortBreak: 'SHORT BREAK',
    longBreak: 'LONG BREAK',
    prepare: 'PREPARE'
  }
  return labels[pomodoro.mode] || 'FOCUS'
})

const openSettings = () => {
  uiStore.openSettings()
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center relative">
    <div 
      class="absolute top-4 right-4 flex gap-2 z-50"
      :class="{ 'opacity-100': isEditMode, 'opacity-0 hover:opacity-100': !isEditMode }"
    >
      <button
        @click="toggleEditMode"
        class="p-2 rounded-lg transition-all"
        :class="isEditMode 
          ? 'bg-primary-500 text-white' 
          : 'bg-white/10 hover:bg-white/20 text-white/70'"
        :title="isEditMode ? 'Exit Edit Mode' : 'Edit Layout'"
      >
        <Move class="w-5 h-5" />
      </button>
      <button
        @click="openSettings"
        class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-all"
        title="Settings"
      >
        <Settings class="w-5 h-5" />
      </button>
    </div>

    <div 
      v-if="isEditMode" 
      class="absolute inset-0 pointer-events-none z-40"
      :style="gridBackgroundStyle"
    />

    <GridLayout
      v-model:layout="layout"
      v-bind="gridLayoutProps"
      class="w-full h-full"
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        :i="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :static="item.static"
        class="transition-shadow duration-200"
        :class="{ 
          'ring-2 ring-white/20 rounded-xl cursor-move': isEditMode,
          'hover:ring-white/40': isEditMode
        }"
      >
        <div 
          v-if="item.i === 'timer'" 
          class="w-full h-full flex flex-col items-center justify-center"
        >
          <span 
            class="text-xs uppercase tracking-[0.3em] font-medium mb-4"
            :class="modeColors.text"
          >
            {{ modeLabel }}
          </span>
          
          <div 
            class="text-8xl md:text-9xl font-extralight tracking-tight text-white tabular-nums"
            style="font-feature-settings: 'tnum'"
          >
            {{ pomodoro.formattedTime }}
          </div>
          
          <div class="mt-4 text-white/40 text-sm">
            Cycle {{ pomodoro.cycles + 1 }}
          </div>
        </div>

        <div 
          v-else-if="item.i === 'controls'" 
          class="w-full h-full flex items-center justify-center gap-4"
        >
          <button
            v-if="!pomodoro.isRunning"
            @click="pomodoro.start"
            class="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            :class="[modeColors.bg, modeColors.text, 'ring-1', modeColors.ring, 'hover:scale-110']"
            title="Start"
          >
            <Play class="w-6 h-6 ml-1" />
          </button>
          
          <button
            v-else
            @click="pomodoro.pause"
            class="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            :class="[modeColors.bg, modeColors.text, 'ring-1', modeColors.ring, 'hover:scale-110']"
            title="Pause"
          >
            <Pause class="w-6 h-6" />
          </button>
          
          <button
            @click="pomodoro.reset"
            class="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center transition-all hover:scale-110"
            title="Reset"
          >
            <RotateCcw class="w-5 h-5" />
          </button>
          
          <button
            @click="pomodoro.skip"
            class="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center transition-all hover:scale-110"
            title="Skip"
          >
            <SkipForward class="w-5 h-5" />
          </button>
        </div>
      </GridItem>
    </GridLayout>
  </div>
</template>

<style scoped>
:deep(.vue-grid-layout) {
  position: relative;
}

:deep(.vue-grid-item) {
  transition: transform 200ms ease, box-shadow 200ms ease;
}

:deep(.vue-grid-item.vue-grid-placeholder) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 2px dashed rgba(255, 255, 255, 0.3) !important;
  border-radius: 12px;
}

:deep(.vue-resizable-handle) {
  opacity: 0;
  transition: opacity 200ms ease;
}

:deep(.vue-grid-item:hover .vue-resizable-handle) {
  opacity: 0.5;
}
</style>
