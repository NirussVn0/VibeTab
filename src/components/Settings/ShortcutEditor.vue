<!-- ShortcutEditor.vue - Simple keyboard shortcut editor with Enter/click to save -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSettingsStore } from '../../stores/settings.store'
import { RotateCcw, AlertTriangle, Keyboard } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const editingId = ref<string | null>(null)
const pendingKeys = ref<string[]>([])
const conflictWith = ref<string | null>(null)

const startEdit = (id: string) => {
  editingId.value = id
  pendingKeys.value = []
  conflictWith.value = null
  document.addEventListener('keydown', captureKey, true)
}

const captureKey = (e: KeyboardEvent) => {
  e.preventDefault()
  e.stopPropagation()

  // Enter key saves the shortcut
  if (e.key === 'Enter') {
    if (pendingKeys.value.length > 0 && !conflictWith.value) {
      settingsStore.updateShortcut(editingId.value!, pendingKeys.value)
      stopEdit()
    }
    return
  }

  // Escape cancels
  if (e.key === 'Escape') {
    stopEdit()
    return
  }

  const keys: string[] = []
  if (e.ctrlKey) keys.push('Ctrl')
  if (e.altKey) keys.push('Alt')
  if (e.shiftKey) keys.push('Shift')
  if (e.metaKey) keys.push('Meta')

  const key = e.key.toUpperCase()
  if (!['CONTROL', 'ALT', 'SHIFT', 'META', 'ESCAPE'].includes(key)) keys.push(key)

  if (keys.length === 0) return

  pendingKeys.value = keys
  
  // Check for conflicts
  const newCombo = keys.join('+')
  const conflict = settingsStore.shortcuts.find(s => 
    s.id !== editingId.value && s.keys.join('+') === newCombo
  )
  conflictWith.value = conflict ? conflict.name : null
}

const stopEdit = () => {
  editingId.value = null
  pendingKeys.value = []
  conflictWith.value = null
  document.removeEventListener('keydown', captureKey, true)
}

const saveShortcut = () => {
  if (pendingKeys.value.length > 0 && !conflictWith.value) {
    settingsStore.updateShortcut(editingId.value!, pendingKeys.value)
    stopEdit()
  }
}

const handleRowKeydown = (e: KeyboardEvent, id: string) => {
  if (e.key === 'Enter' && editingId.value !== id) {
    e.preventDefault()
    startEdit(id)
  }
}

onUnmounted(() => document.removeEventListener('keydown', captureKey, true))
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-white/60 text-xs">
      <Keyboard class="w-4 h-4" />
      <span>Click a shortcut to edit, press keys, then click Save or press Enter</span>
    </div>

    <div class="space-y-2">
      <div 
        v-for="shortcut in settingsStore.shortcuts" 
        :key="shortcut.id"
        @click="editingId !== shortcut.id && startEdit(shortcut.id)"
        @keydown="handleRowKeydown($event, shortcut.id)"
        tabindex="0"
        class="flex items-center justify-between py-3 px-4 rounded-lg transition-all cursor-pointer"
        :class="editingId === shortcut.id ? 'bg-red-500/20 border-2 border-red-500/50 ring-2 ring-red-500/30' : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'"
      >
        <span class="text-sm text-white font-medium">{{ shortcut.name }}</span>
        
        <div v-if="editingId === shortcut.id" class="flex items-center gap-3">
          <div class="flex gap-1">
            <span v-for="(key, idx) in pendingKeys" :key="idx" 
              :class="['px-2 py-1 rounded text-xs font-mono font-semibold', 
                       conflictWith ? 'bg-orange-500/30 border border-orange-500/50 text-orange-300' : 'bg-red-500/30 border border-red-500/50 text-red-300']">
              {{ key }}
            </span>
            <span v-if="pendingKeys.length === 0" class="text-xs text-red-400 animate-pulse">Press keys...</span>
          </div>
          
          <div v-if="conflictWith" class="flex items-center gap-1 text-xs text-orange-400">
            <AlertTriangle class="w-3 h-3" />
            <span>Conflicts with "{{ conflictWith }}"</span>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              v-if="pendingKeys.length > 0 && !conflictWith"
              @click.stop="saveShortcut" 
              class="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors"
            >
              Save
            </button>
            <button @click.stop="stopEdit" class="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs transition-colors">
              Cancel
            </button>
          </div>
        </div>
        
        <div v-else class="flex gap-1">
          <span v-for="(key, idx) in shortcut.keys" :key="idx" 
            class="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white/70">
            {{ key }}
          </span>
        </div>
      </div>
    </div>

    <button 
      @click="settingsStore.resetShortcuts()" 
      class="w-full px-4 py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-sm text-amber-400 flex items-center justify-center gap-2 transition-all font-medium"
    >
      <RotateCcw class="w-4 h-4" /> Reset to Defaults
    </button>
  </div>
</template>
