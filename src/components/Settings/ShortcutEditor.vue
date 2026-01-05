<!-- ShortcutEditor.vue - Multi-key shortcut editor with press-again-to-confirm -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useSettingsStore } from '../../stores/settings.store'
import { RotateCcw } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const editingId = ref<string | null>(null)
const pendingKeys = ref<string[]>([])
const awaitingConfirm = ref(false)

const pendingKeysDisplay = computed(() => pendingKeys.value.join(' + ') || 'Press keys...')

const startEdit = (id: string) => {
  editingId.value = id
  pendingKeys.value = []
  awaitingConfirm.value = false
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

  if (keys.length === 0) return

  const newCombo = keys.join('+')
  const currentCombo = pendingKeys.value.join('+')

  if (awaitingConfirm.value && newCombo === currentCombo) {
    settingsStore.updateShortcut(editingId.value!, pendingKeys.value)
    stopEdit()
  } else {
    pendingKeys.value = keys
    awaitingConfirm.value = true
  }
}

const stopEdit = () => {
  editingId.value = null
  pendingKeys.value = []
  awaitingConfirm.value = false
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
        <div class="flex gap-1">
          <span v-for="(key, idx) in pendingKeys" :key="idx" class="shortcut-key bg-red-500/30 border-red-500/50">{{ key }}</span>
        </div>
        <span v-if="awaitingConfirm" class="shortcut-listening">Press again to confirm</span>
        <span v-else class="shortcut-listening">{{ pendingKeysDisplay }}</span>
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
