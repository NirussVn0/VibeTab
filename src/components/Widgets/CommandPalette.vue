<template>
  <transition name="fade-blur">
    <div 
      v-if="store.isOpen"
      class="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
    >
      <!-- Backdrop -->
      <div 
        @click="store.close()" 
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
      ></div>

      <!-- Modal -->
      <div 
        class="relative w-full max-w-2xl bg-surface-dark/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-spring"
      >
        <!-- Search Input -->
        <div class="flex items-center px-4 py-4 border-b border-white/10">
          <svg class="w-5 h-5 text-text-tertiary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            v-model="store.searchQuery"
            ref="inputRef"
            type="text" 
            placeholder="Type a command or search..."
            class="w-full bg-transparent border-none outline-none text-xl text-white placeholder-text-tertiary"
            autofocus
          />
          <button 
            @click="store.close()"
            class="p-1 px-2 text-xs bg-white/10 rounded text-text-tertiary"
          >
            ESC
          </button>
        </div>

        <!-- content -->
        <div class="max-h-[60vh] overflow-y-auto px-2 py-2">
          
          <div v-if="store.filteredCommands.length === 0" class="p-8 text-center text-text-tertiary">
            No results found.
          </div>

          <div v-for="(category, name) in store.groupedCommands" :key="name" class="mb-2">
            <h3 class="px-3 py-2 text-xs font-bold text-text-tertiary uppercase tracking-wider sticky top-0 bg-surface-dark/95 backdrop-blur z-10">
              {{ name }}
            </h3>
            <div class="space-y-1">
              <button
                v-for="cmd in category"
                :key="cmd.id"
                @click="execute(cmd)"
                @mouseenter="setActive(cmd.id)"
                class="w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-75 group"
                :class="[
                  isSelected(cmd.id) 
                    ? 'bg-primary-500/20 text-white shadow-lg shadow-primary-500/10' 
                    : 'text-text-secondary hover:bg-white/5'
                ]"
              >
                <!-- Icon (Placeholder) -->
                <div 
                  class="w-8 h-8 rounded-md flex items-center justify-center mr-3 bg-white/5 group-hover:bg-white/10 text-lg transition-colors"
                  :class="{ 'bg-primary-500/20 text-primary-300': isSelected(cmd.id) }"
                >
                  ⚡
                </div>
                
                <div class="flex-1">
                  <div class="font-medium" :class="{ 'text-primary-300': isSelected(cmd.id) }">
                    {{ cmd.title }}
                  </div>
                  <div class="text-sm text-text-tertiary truncate">
                    {{ cmd.description }}
                  </div>
                </div>

                <div v-if="cmd.shortcut" class="text-xs text-text-tertiary bg-white/5 px-2 py-1 rounded">
                  {{ cmd.shortcut }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between text-xs text-text-tertiary">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> to select
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd> to navigate
            </span>
          </div>
          <div>
            VibeTab
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useCommandPaletteStore, type Command } from '../../stores/commandPalette.store'

const store = useCommandPaletteStore()
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => store.isOpen, async (val) => {
  if (val) {
    await nextTick()
    inputRef.value?.focus()
  }
})

const isSelected = (id: string) => {
  const selected = store.filteredCommands[store.selectedIndex]
  return selected && selected.id === id
}

const setActive = (id: string) => {
  const index = store.filteredCommands.findIndex(c => c.id === id)
  if (index !== -1) store.setIndex(index)
}

const execute = async (cmd: Command) => {
  if (cmd.action) {
    await cmd.action(store.searchQuery)
  }
  store.close()
}
</script>

<style scoped>
.animate-spring {
  animation: spring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes spring {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
