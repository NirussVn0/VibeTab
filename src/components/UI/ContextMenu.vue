<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ArrowsPointingInIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  TrashIcon,
  Bars3Icon,
  Bars2Icon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  items: { label: string; action: () => void; icon?: string; destructive?: boolean }[]
  x: number
  y: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const iconComponents: Record<string, typeof ArrowsPointingInIcon> = {
  center: ArrowsPointingInIcon,
  centerH: Bars3Icon,
  centerV: Bars2Icon,
  left: ArrowLeftIcon,
  right: ArrowRightIcon,
  up: ArrowUpIcon,
  down: ArrowDownIcon,
  trash: TrashIcon,
  settings: Cog6ToothIcon
}

// Close on click outside
const menuRef = ref<HTMLElement | null>(null)
const handleClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    emit('close')
  }
}

onMounted(() => {
  setTimeout(() => window.addEventListener('click', handleClickOutside), 0)
})
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div 
    ref="menuRef"
    class="fixed z-context-menu min-w-[160px] bg-background border border-border rounded-lg shadow-xl overflow-hidden glass-panel"
    :style="{ top: `${y}px`, left: `${x}px` }"
  >
    <div class="py-1">
      <button 
        v-for="item in items" 
        :key="item.label"
        @click="() => { item.action(); emit('close') }"
        class="w-full px-4 py-2 text-left text-sm hover:bg-surface transition-colors flex items-center gap-2"
        :class="item.destructive ? 'text-error hover:bg-error/10' : 'text-text-primary'"
      >
        <component 
          v-if="item.icon && iconComponents[item.icon]" 
          :is="iconComponents[item.icon]" 
          class="w-4 h-4" 
        />
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
