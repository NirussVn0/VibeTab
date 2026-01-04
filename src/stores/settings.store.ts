import { defineStore } from 'pinia'
import { useStorage } from '../composables/useStorage'

export type AIProvider = 'chatgpt' | 'perplexity' | 'google'

export interface KeyboardShortcut {
  id: string
  name: string
  keys: string[]
}

const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { id: 'open-settings', name: 'Open Settings', keys: ['S'] },
  { id: 'edit-layout', name: 'Toggle Edit Mode', keys: ['Ctrl', 'E'] },
  { id: 'toggle-pomodoro', name: 'Toggle Focus Mode', keys: ['Alt', 'P'] },
  { id: 'command-palette', name: 'Command Palette', keys: ['Ctrl', 'K'] },
  { id: 'ai-search', name: 'AI Search', keys: ['Ctrl', 'Shift', 'K'] },
]

export const useSettingsStore = defineStore('settings', () => {
  const general = useStorage('vibetab_settings_general', {
    showClock: true,
    showWeather: true,
    showGreeting: true,
    weatherLocation: 'New York',
    focusDuration: 25,
    breakDuration: 5,
    pomodoroDim: true,
    pomodoroSound: true,
    aiProvider: 'chatgpt' as AIProvider
  })

  const autoHide = useStorage('vibetab_settings_autohide', {
    enabled: false,
    timeout: 60,
    keepClockVisible: true,
    dimBackground: true,
    dimColor: '#000000',
    dimOpacity: 0.6
  })

  const shortcuts = useStorage('vibetab_keyboard_shortcuts', [...DEFAULT_SHORTCUTS])

  const resetShortcuts = () => {
    shortcuts.value = [...DEFAULT_SHORTCUTS]
  }

  const updateShortcut = (id: string, keys: string[]) => {
    const shortcut = shortcuts.value.find(s => s.id === id)
    if (shortcut) {
      shortcut.keys = keys
    }
  }

  const getShortcut = (id: string): string[] => {
    return shortcuts.value.find(s => s.id === id)?.keys || []
  }

  return {
    general,
    autoHide,
    shortcuts,
    resetShortcuts,
    updateShortcut,
    getShortcut,
    DEFAULT_SHORTCUTS
  }
})
