<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGridStore } from '../../stores/grid.store'
import { useGridDrag } from '../../composables/useGridDrag'
import GridBlock from './GridBlock.vue'
import ContextMenu from '../UI/ContextMenu.vue'

// --- Store ---
const gridStore = useGridStore()
const { widgets } = storeToRefs(gridStore)

// --- State ---
const isEditMode = ref(false)
const contextMenu = ref<{ x: number; y: number; blockId: string } | null>(null)

// --- Drag & Drop ---
// 120px cell + 16px gap
const { handleMouseDown, dragState, draggedId } = useGridDrag(120, 16, (id, newPos) => {
  gridStore.updateWidgetPosition(id, newPos)
})

// --- Logic ---
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const onContextMenu = (e: MouseEvent, blockId: string) => {
  e.preventDefault()
  contextMenu.value = { x: e.clientX, y: e.clientY, blockId }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'e') {
    e.preventDefault()
    toggleEditMode()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const menuItems = [
  { 
    label: 'Edit Widget', 
    action: () => { 
      if (contextMenu.value) console.log('Edit', contextMenu.value.blockId) 
    } 
  },
  { 
    label: 'Duplicate', 
    action: () => { 
      if (contextMenu.value) console.log('Duplicate', contextMenu.value.blockId) 
    } 
  },
  { 
    label: 'Delete', 
    destructive: true, 
    action: () => {
      if (contextMenu.value?.blockId) {
        gridStore.removeWidget(contextMenu.value.blockId)
      }
    }
  }
]
</script>

<template>
  <div class="container mx-auto px-4 h-full flex items-center justify-center select-none relative">
    
    <!-- Edit Mode Toggle -->
    <div class="absolute top-4 right-4 z-50">
      <button 
        @click="toggleEditMode"
        class="px-3 py-1 rounded bg-surface border border-border text-sm hover:bg-surface/80"
        :class="{ 'text-primary border-primary': isEditMode }"
      >
        {{ isEditMode ? 'Done' : 'Edit Layout' }}
      </button>
    </div>

    <!-- Grid Area -->
    <div 
      class="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-4 w-full h-full max-w-none px-4 md:px-8 lg:px-12 auto-rows-[120px] relative transition-all"
      :class="{ 'ring-1 ring-border/30 rounded-xl bg-surface/5': isEditMode }"
      role="grid"
      aria-label="Widget Grid"
    >
      <GridBlock 
        v-for="block in widgets" 
        :key="block.id" 
        :block="block"
        :is-dragging="draggedId === block.id"
        @drag-start="(e: MouseEvent) => isEditMode && handleMouseDown(e, block.id, { x: block.x, y: block.y }, { w: block.w, h: block.h })"
        @contextmenu="(e: MouseEvent) => onContextMenu(e, block.id)"
      />

      <!-- DROP SHADOW (Ghost) -->
      <div 
        v-if="dragState && dragState.dropTarget"
        class="pointer-events-none rounded-lg bg-text-primary/10 border-2 border-dashed border-text-primary/20 transition-all duration-100 ease-out"
        :style="{
          gridColumnStart: dragState.dropTarget.x + 1,
          gridColumnEnd: `span ${widgets.find(w => w.id === draggedId)?.w || 1}`,
          gridRowStart: dragState.dropTarget.y + 1,
          gridRowEnd: `span ${widgets.find(w => w.id === draggedId)?.h || 1}`,
        }"
      ></div>

      <!-- DRAGGING PREVIEW (Flying Widget) -->
      <div 
        v-if="dragState && dragState.isDragging"
        class="fixed pointer-events-none z-[100] origin-top-left"
        :style="{
          left: `${dragState.current.x - dragState.offset.x}px`,
          top: `${dragState.current.y - dragState.offset.y}px`,
          width: 'calc(100% / 12 * ' + (widgets.find(w => w.id === draggedId)?.w || 1) + ')', 
          height: (widgets.find(w => w.id === draggedId)?.h || 1) * 120 + 'px',
          transform: 'scale(1.05) rotate(2deg)',
        }"
      >
        <div class="w-full h-full rounded-lg bg-surface/90 backdrop-blur-md border border-primary shadow-2xl flex items-center justify-center text-text-primary">
            <!-- Simple preview content since we can't easily clone the full component state here without slots -->
            <span class="font-bold text-lg">Active Widget</span>
        </div>
      </div>
    </div>

    <!-- Context Menu -->
    <ContextMenu 
      v-if="contextMenu"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :items="menuItems"
      @close="contextMenu = null"
    />
  </div>
</template>
