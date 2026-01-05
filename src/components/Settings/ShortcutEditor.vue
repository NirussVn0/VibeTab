<!-- ShortcutEditor.vue - Inline keyboard shortcut editor with multi-key support and confirmation -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useSettingsStore } from '../../stores/settings.store'
import { RotateCcw, AlertTriangle } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const editingId = ref<string | null>(null)
const pendingKeys = ref<string[]>([])
const awaitingConfirm = ref(false)
const conflictWith = ref<string | null>(null)

const pendingKeysDisplay = computed(() => pendingKeys.value.join(' + ') || 'Press keys...')

const startEdit = (id: string) => {
  editingId.value = id
  pendingKeys.value = []
  awaitingConfirm.value = false
  conflictWith.value = null
  document.addEventListener('keydown', captureKey, true)
}

const captureKey = (e: KeyboardEvent) => {
  e.preventDefault()
  e.stopPropagation()

  if (e.key === 'Enter') {
    if (awaitingConfirm.value && !conflictWith.value) {
      settingsStore.updateShortcut(editingId.value!, pendingKeys.value)
      stopEdit()
    }
    return
  }

  const keys: string[] = []
  if (e.ctrlKey) keys.push('Ctrl')
  if (e.altKey) keys.push('Alt')
  if (e.shiftKey) keys.push('Shift')
  if (e.metaKey) keys.push('Meta')

  const key = e.key.toUpperCase()
  if (!['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) keys.push(key)

  if (keys.length === 0) return

  const newCombo = keys.join('+')
  const currentCombo = pendingKeys.value.join('+')

  if (awaitingConfirm.value && newCombo === currentCombo && !conflictWith.value) {
    settingsStore.updateShortcut(editingId.value!, pendingKeys.value)
    stopEdit()
  } else {
    pendingKeys.value = keys
    awaitingConfirm.value = true
    
    const conflict = settingsStore.shortcuts.find(s => 
      s.id !== editingId.value && s.keys.join('+') === newCombo
    )
    conflictWith.value = conflict ? conflict.name : null
  }
}

const stopEdit = () => {
  editingId.value = null
  pendingKeys.value = []
  awaitingConfirm.value = false
  conflictWith.value = null
  document.removeEventListener('keydown', captureKey, true)
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
  <div class="space-y-3">
    <div 
      v-for="shortcut in settingsStore.shortcuts" 
      :key="shortcut.id"
      @click="editingId !== shortcut.id && startEdit(shortcut.id)"
      @keydown="handleRowKeydown($event, shortcut.id)"
      tabindex="0"
      :class="['shortcut-row', { editing: editingId === shortcut.id }]"
    >
      <span class="text-sm text-white/90 font-medium">{{ shortcut.name }}</span>
      <div v-if="editingId === shortcut.id" class="flex items-center gap-2">
        <div class="flex gap-1">
          <span v-for="(key, idx) in pendingKeys" :key="idx" 
            :class="['shortcut-key', conflictWith ? 'bg-orange-500/30 border-orange-500/50' : 'bg-red-500/30 border-red-500/50']">
            {{ key }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="conflictWith" class="text-xs text-orange-400 flex items-center gap-1">
            <AlertTriangle class="w-3 h-3" />
            Conflicts with "{{ conflictWith }}"
          </span>
          <span v-else-if="awaitingConfirm" class="shortcut-listening">Press again or Enter to confirm</span>
          <span v-else class="shortcut-listening">{{ pendingKeysDisplay }}</span>
        </div>
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
