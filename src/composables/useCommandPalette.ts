import { onMounted, onUnmounted, watch } from 'vue'
import { useCommandPaletteStore } from '../stores/commandPalette.store'

export function useCommandPalette() {
  const store = useCommandPaletteStore()

  const handleKeydown = (e: KeyboardEvent) => {
    // Open/Close Shortcut (Cmd+K or Ctrl+K)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      store.toggle()
      return
    }

    if (!store.isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (store.selectedIndex < store.filteredCommands.length - 1) {
          store.setIndex(store.selectedIndex + 1)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (store.selectedIndex > 0) {
          store.setIndex(store.selectedIndex - 1)
        }
        break
      case 'Enter':
        e.preventDefault()
        executeCommand()
        break
      case 'Escape':
        e.preventDefault()
        store.close()
        break
    }
  }

  const executeCommand = async () => {
    const command = store.filteredCommands[store.selectedIndex]
    if (command) {
      if (command.action) {
        // If it's a search command, we might pass the query
        // For simple actions, we just call it
        await command.action(store.searchQuery)
      }
      store.close()
    }
  }

  // Reset selection when query changes
  watch(() => store.searchQuery, () => {
    store.setIndex(0)
  })

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    store
  }
}
