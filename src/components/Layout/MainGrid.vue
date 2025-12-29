<template>
  <div class="w-full h-full p-6 overflow-y-auto custom-scrollbar">
    <!-- Fullscreen Grid - Lego-like blocks -->
    <div 
      class="grid grid-cols-12 gap-4 auto-rows-[100px] min-h-full"
    >
      <BlockWrapper
        v-for="widget in gridStore.widgets"
        :key="widget.id"
        :style="{
          gridColumn: `span ${Math.min(widget.w, 12)}`,
          gridRow: `span ${widget.h}`
        }"
        @remove="gridStore.removeWidget(widget.id)"
      >
        <component 
          :is="WidgetFactory.getComponent(widget.type)"
          v-bind="widget.props"
        />
      </BlockWrapper>

      <!-- Add Widget Button (Edit Mode) -->
      <div 
        v-if="uiStore.isEditMode"
        class="col-span-4 row-span-2 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 hover:border-primary-400/50 transition-all duration-300"
        @click="openAddWidget"
      >
        <span class="text-white/50 hover:text-primary-400 font-medium flex items-center gap-2 transition-colors">
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
import { WidgetFactory } from '../../utils/widgetFactory'
import { useCommandPaletteStore } from '../../stores/commandPalette.store'

const uiStore = useUIStore()
const gridStore = useGridStore()
const commandStore = useCommandPaletteStore()

const openAddWidget = () => {
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
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
