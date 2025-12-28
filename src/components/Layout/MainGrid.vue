<template>
  <div class="container mx-auto px-4 py-8 h-full overflow-y-auto custom-scrollbar">
    <div 
      class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[120px]"
    >
      <BlockWrapper
        v-for="widget in gridStore.widgets"
        :key="widget.id"
        :style="{
          gridColumn: `span ${widget.w}`,
          gridRow: `span ${widget.h}`
        }"
        @remove="gridStore.removeWidget(widget.id)"
      >
        <!-- Dynamic Component loader -->
        <component 
          :is="getComponent(widget.type)"
          v-bind="widget.props"
        />
      </BlockWrapper>

      <!-- Add Widget Button (Edit Mode) -->
      <div 
        v-if="uiStore.isEditMode"
        class="col-span-2 md:col-span-3 lg:col-span-4 h-[240px] rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
        @click="openAddWidget"
      >
        <span class="text-white/50 font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Widget
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '../../stores/ui.store'
import { useGridStore } from '../../stores/grid.store'
import BlockWrapper from './BlockWrapper.vue'
import ClockWidget from '../Widgets/ClockWidget.vue'
import SearchBar from '../Widgets/SearchBar.vue'
import { useCommandPaletteStore } from '../../stores/commandPalette.store'

const uiStore = useUIStore()
const gridStore = useGridStore()
const commandStore = useCommandPaletteStore()

const getComponent = (type: string) => {
  switch (type) {
    case 'clock': return ClockWidget
    case 'search': return SearchBar
    default: return 'div'
  }
}

const openAddWidget = () => {
    // Open command palette filtered to "Widgets" (future improvement)
    commandStore.open()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
