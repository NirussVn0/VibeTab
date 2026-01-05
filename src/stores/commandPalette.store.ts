/**
 * commandPalette.store.ts - Command search and execution state
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUIStore } from './ui.store'
import { useThemeStore } from './theme.store'

export interface Command {
  id: string
  title: string
  description?: string
  category: 'search' | 'navigation' | 'settings' | 'actions'
  shortcut?: string
  action?: (query?: string) => void | Promise<void>
  icon?: string
  keywords?: string[]
}

export const useCommandPaletteStore = defineStore('commandPalette', () => {
  const isOpen = ref(false)
  const searchQuery = ref('')
  const selectedIndex = ref(0)
  
  const uiStore = useUIStore()
  const themeStore = useThemeStore()

  const staticCommands: Command[] = [
    { id: 'search-google', title: 'Search Google', description: 'Search the web with Google', category: 'search', keywords: ['google', 'web', 'find'], action: (query) => { window.open(`https://google.com/search?q=${encodeURIComponent(query || '')}`, '_blank') } },
    { id: 'search-ai', title: 'Ask AI', description: 'Ask ChatGPT', category: 'search', keywords: ['ai', 'gpt', 'chat', 'bot'], action: (query) => { window.open(`https://chatgpt.com/?q=${encodeURIComponent(query || '')}`, '_blank') } },
    { id: 'open-settings', title: 'Open Settings', description: 'Configure VibeTab', category: 'settings', keywords: ['config', 'preferences', 'setup'], action: () => { uiStore.openSettings() } },
    { id: 'toggle-edit', title: 'Toggle Edit Mode', description: 'Rearrange or add widgets', category: 'actions', keywords: ['edit', 'layout', 'grid', 'move'], action: () => { uiStore.toggleEditMode() } },
    { id: 'toggle-theme', title: 'Switch Theme', description: 'Toggle between Light/Dark modes', category: 'settings', keywords: ['dark', 'light', 'mode', 'color'], action: () => { themeStore.cycleTheme() } }
  ]

  const filteredCommands = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return staticCommands
    return staticCommands.filter(cmd => 
      cmd.title.toLowerCase().includes(query) || 
      cmd.description?.toLowerCase().includes(query) || 
      cmd.keywords?.some(k => k.toLowerCase().includes(query))
    )
  })

  const groupedCommands = computed(() => {
    const groups: Record<string, Command[]> = {}
    filteredCommands.value.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  })

  const open = () => { isOpen.value = true; searchQuery.value = ''; selectedIndex.value = 0 }
  const close = () => { isOpen.value = false }
  const toggle = () => (isOpen.value ? close() : open())
  const setIndex = (index: number) => { selectedIndex.value = index }

  return { isOpen, searchQuery, selectedIndex, filteredCommands, groupedCommands, open, close, toggle, setIndex }
})
