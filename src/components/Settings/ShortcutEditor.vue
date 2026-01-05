<!-- ShortcutEditor.vue - Inline keyboard shortcut editor with key capture -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSettingsStore } from '../../stores/settings.store'
import { RotateCcw } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const editingId = ref<string | null>(null)

const startEdit = (id: string) => {
  editingId.value = id
  document.addEventListener('keydown', captureKey, true)
}

const captureKey = (e: KeyboardEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  const keys: string[] = []
  if (e.ctrlKey) keys.push('Ctrl')
  if (e.altKey) keys.push('Alt')
  if (e.shiftKey) keys.push('Shift')
  if (e.metaKey) keys.push('Meta')
  
  const key = e.key.toUpperCase()
  if (!['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) keys.push(key)
  
  if (keys.length > 0 && editingId.value) {
    settingsStore.updateShortcut(editingId.value, keys)
    stopEdit()
  }
}

const stopEdit = () => {
  editingId.value = null
  document.removeEventListener('keydown', captureKey, true)
}

onUnmounted(() => document.removeEventListener('keydown', captureKey, true))
</script>

<template>
  <div class="space-y-3">
    <div 
      v-for="shortcut in settingsStore.shortcuts" 
      :key="shortcut.id"
      @click="startEdit(shortcut.id)"
      :class="['shortcut-row', { editing: editingId === shortcut.id }]"
    >
      <span class="text-sm text-white/90">{{ shortcut.name }}</span>
      <div v-if="editingId === shortcut.id" class="flex items-center gap-2">
        <span class="shortcut-listening">Press keys...</span>
        <button @click.stop="stopEdit" class="text-xs text-white/50 hover:text-white">Cancel</button>
      </div>
      <div v-else class="flex gap-1">
        <span v-for="(key, idx) in shortcut.keys" :key="idx" class="shortcut-key">{{ key }}</span>
      </div>
    </div>
    <button @click="settingsStore.resetShortcuts()" class="w-full px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-sm text-amber-400 flex items-center justify-center gap-2 transition-all">
      <RotateCcw class="w-4 h-4" /> Reset to Defaults
    </button>
  </div>
</template>
