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
      class="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 w-full max-w-[1280px] auto-rows-[120px] relative transition-all"
      :class="{ 'ring-1 ring-border/30 rounded-xl bg-surface/5': isEditMode }"
      role="grid"
      aria-label="Widget Grid"
    >
      <GridBlock 
        v-for="block in widgets" 
        :key="block.id" 
        :block="block"
        :is-dragging="draggedId === block.id"
        @drag-start="(e: MouseEvent) => isEditMode && handleMouseDown(e, block.id, { x: block.x, y: block.y })"
        @contextmenu="(e: MouseEvent) => onContextMenu(e, block.id)"
      />

      <!-- Ghost Element -->
      <div 
        v-if="dragState && dragState.isDragging"
        class="fixed pointer-events-none z-[100] rounded-lg bg-primary/20 border-2 border-primary backdrop-blur-sm shadow-2xl"
        :style="{
          left: `${dragState.current.x - dragState.offset.x}px`,
          top: `${dragState.current.y - dragState.offset.y}px`,
          width: '200px', 
          height: '200px'
        }"
      ></div>
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
