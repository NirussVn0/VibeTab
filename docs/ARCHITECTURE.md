# VibeTab - Architecture & Technical Design (Vue 3 Edition)

**Version:** 1.0.0  
**Framework:** Vue 3 + TypeScript + Pinia  
**Last Updated:** December 29, 2025

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Directory Structure](#directory-structure)
3. [Component Architecture](#component-architecture)
4. [Composition API Composables](#composition-api-composables)
5. [Pinia Store Architecture](#pinia-store-architecture)
6. [Data Flow & State Management](#data-flow--state-management)
7. [Module Dependencies](#module-dependencies)
8. [Chrome Extension Integration](#chrome-extension-integration)
9. [Styling Architecture](#styling-architecture)
10. [Performance Optimization](#performance-optimization)
11. [Error Handling & Logging](#error-handling--logging)
12. [Testing Architecture](#testing-architecture)

---

## SYSTEM OVERVIEW

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│     Chrome Extension (Manifest v3)      │
├─────────────────────────────────────────┤
│  App.vue (Root Component)               │
├─────────────────────────────────────────┤
│  Pinia Store Layer                      │
│  ├─ gridStore                           │
│  ├─ settingsStore                       │
│  ├─ backgroundStore                     │
│  └─ uiStore                             │
├─────────────────────────────────────────┤
│  Component Layer                        │
│  ├─ Layout Components (BackgroundLayer) │
│  ├─ Grid Components (GridContainer)     │
│  ├─ Widget Components (Clock, Search)   │
│  └─ UI Components (Button, Modal, etc)  │
├─────────────────────────────────────────┤
│  Composition API Layer (Composables)    │
│  ├─ useGridDragDrop                     │
│  ├─ useClock                            │
│  ├─ useTheme                            │
│  └─ useStorage                          │
├─────────────────────────────────────────┤
│  Utility & Helper Layer                 │
│  ├─ validators                          │
│  ├─ formatters                          │
│  ├─ calculations                        │
│  └─ constants                           │
├─────────────────────────────────────────┤
│  Chrome API Integration Layer           │
│  ├─ chrome.storage.sync                 │
│  ├─ chrome.tabs                         │
│  ├─ chrome.bookmarks                    │
│  └─ chrome.history                      │
└─────────────────────────────────────────┘
```

### Technology Stack

**Frontend Framework:**
- Vue 3.4+ (Composition API with script setup)
- TypeScript 5.0+ (strict mode)
- Vite 5.0+ (build tool)

**State Management:**
- Pinia 2.1+ (Vue state management)
- Chrome Storage API (persistence)
- IndexedDB (for large files)

**Styling:**
- Tailwind CSS 3.3+
- CSS Modules (component scoping)
- SCSS (mixins, variables)
- PostCSS (autoprefixer)

**Animations:**
- Vue Transitions (native)
- CSS animations/keyframes
- requestAnimationFrame (timing)
- GSAP (optional, for complex)

**UI Components:**
- Headless UI Vue 4.0+ (Dialog, Menu, Tabs)
- Radix Vue (alternative options)
- Custom components (Button, Input, Modal)

**Development:**
- ESLint 8.0+ (Vue plugin)
- Prettier 3.0+ (formatting)
- Vitest 1.0+ (unit tests)
- Playwright 1.40+ (E2E tests)
- TypeDoc (API docs)
- Husky (pre-commit hooks)

---

## DIRECTORY STRUCTURE

```
vibetab/
├── src/
│   ├── main.ts                 # App entry point
│   ├── App.vue                 # Root component
│   ├── App.module.scss         # Root styles
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BackgroundLayer.vue
│   │   │   ├── GridContainer.vue
│   │   │   ├── ControlBar.vue
│   │   │   └── ContextMenu.vue
│   │   │
│   │   ├── widgets/
│   │   │   ├── clock/
│   │   │   │   ├── ClockWidget.vue
│   │   │   │   ├── DigitalClock.vue
│   │   │   │   ├── AnalogClock.vue
│   │   │   │   └── ClockWidget.module.scss
│   │   │   ├── search/
│   │   │   │   ├── SearchWidget.vue
│   │   │   │   └── SearchWidget.module.scss
│   │   │   ├── weather/
│   │   │   │   ├── WeatherWidget.vue
│   │   │   │   └── WeatherWidget.module.scss
│   │   │   └── ...
│   │   │
│   │   ├── common/
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Toast.vue
│   │   │   ├── Tooltip.vue
│   │   │   ├── ColorPicker.vue
│   │   │   ├── Slider.vue
│   │   │   └── ...
│   │   │
│   │   ├── panels/
│   │   │   ├── SettingsPanel.vue
│   │   │   ├── CommandPalette.vue
│   │   │   └── ...
│   │   │
│   │   └── grid/
│   │       ├── GridBlock.vue
│   │       ├── GridGhostBlock.vue
│   │       └── GridBlock.module.scss
│   │
│   ├── stores/
│   │   ├── index.ts           # Export all stores
│   │   ├── gridStore.ts       # Grid state management
│   │   ├── settingsStore.ts   # Settings state
│   │   ├── backgroundStore.ts # Backgrounds state
│   │   └── uiStore.ts         # UI state
│   │
│   ├── composables/
│   │   ├── index.ts
│   │   ├── useGridDragDrop.ts # Drag-drop logic
│   │   ├── useClock.ts        # Clock timing
│   │   ├── useTheme.ts        # Theme detection
│   │   ├── useStorage.ts      # Chrome storage
│   │   ├── useKeyboard.ts     # Keyboard shortcuts
│   │   ├── useSearch.ts       # Search logic
│   │   └── useWindowSize.ts   # Responsive
│   │
│   ├── utils/
│   │   ├── index.ts
│   │   ├── validators.ts      # Input validation
│   │   ├── formatters.ts      # Text formatting
│   │   ├── calculations.ts    # Math functions
│   │   ├── chrome-api.ts      # Chrome API wrapper
│   │   └── collision.ts       # Grid collision
│   │
│   ├── constants/
│   │   ├── index.ts
│   │   ├── animations.ts      # Animation timings
│   │   ├── colors.ts          # Color palette
│   │   ├── spacing.ts         # Spacing scale
│   │   ├── storage.ts         # Storage keys
│   │   └── defaults.ts        # Default values
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── grid.ts            # Grid types
│   │   ├── widget.ts          # Widget types
│   │   ├── background.ts      # Background types
│   │   ├── settings.ts        # Settings types
│   │   ├── chrome.ts          # Chrome API types
│   │   └── common.ts          # Shared types
│   │
│   ├── styles/
│   │   ├── globals.scss       # Global styles
│   │   ├── reset.scss         # CSS reset
│   │   ├── animations.scss    # Keyframes
│   │   ├── variables.scss     # CSS variables
│   │   └── utilities.scss     # Utility classes
│   │
│   └── pages/
│       ├── newtab.ts          # New tab entry
│       └── settings.ts        # Settings entry
│
├── public/
│   ├── manifest.json          # Extension manifest
│   ├── newtab.html            # New tab HTML
│   ├── settings.html          # Settings HTML
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   ├── icon-128.png
│   │   └── icon-512.png
│   └── fonts/
│       └── ...
│
├── tests/
│   ├── unit/
│   │   ├── composables/
│   │   ├── stores/
│   │   ├── utils/
│   │   └── components/
│   ├── integration/
│   │   ├── grid-system.test.ts
│   │   ├── settings-flow.test.ts
│   │   └── ...
│   └── e2e/
│       ├── drag-drop.spec.ts
│       ├── search.spec.ts
│       └── ...
│
├── .github/
│   └── workflows/
│       ├── lint.yml           # ESLint CI
│       ├── test.yml           # Vitest CI
│       ├── build.yml          # Build CI
│       └── release.yml        # Release CI
│
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript config
├── vitest.config.ts           # Vitest config
├── playwright.config.ts       # Playwright config
├── tailwind.config.ts         # Tailwind config
├── postcss.config.ts          # PostCSS config
├── eslint.config.js           # ESLint config
├── prettier.config.js         # Prettier config
├── package.json               # Dependencies
└── README.md                  # Documentation
```

---

## COMPONENT ARCHITECTURE

### Component Hierarchy & Relationships

```
App.vue (root, 100% viewport)
├── BackgroundLayer.vue
│   ├── StaticBackground.vue        (image, static)
│   ├── GifBackground.vue           (animated gif)
│   ├── VideoBackground.vue         (video file)
│   └── BlurOverlay.vue             (semi-transparent overlay)
│
├── GridContainer.vue                (CSS Grid, responsive)
│   └── GridBlock.vue (×N)          (individual widget container)
│       ├── ClockWidget.vue         (clock widget)
│       │   ├── DigitalClock.vue    (time display)
│       │   └── AnalogClock.vue     (circular dial)
│       ├── SearchWidget.vue        (search bar)
│       │   ├── SearchInput.vue     (input field)
│       │   ├── GoogleButton.vue    (google search)
│       │   └── AIButton.vue        (ai search)
│       ├── WeatherWidget.vue       (weather display)
│       └── [Other Widgets]
│       └── GridGhostBlock.vue      (drag preview, conditional)
│
├── ControlBar.vue                  (top bar with controls)
│   ├── EditModeToggle.vue          (edit mode button)
│   ├── UndoRedoButtons.vue         (undo/redo)
│   ├── ThemeToggle.vue             (light/dark toggle)
│   └── SettingsButton.vue          (open settings)
│
├── ContextMenu.vue (portal)        (right-click menu, conditional)
│   └── MenuItem.vue (×N)           (menu options)
│
├── SettingsPanel.vue (portal)      (settings modal, conditional)
│   ├── AppearanceTab.vue           (theme, colors)
│   ├── BackgroundsTab.vue          (background management)
│   ├── AdvancedTab.vue             (advanced options)
│   └── AboutTab.vue                (info, links)
│
├── CommandPalette.vue (portal)     (cmd palette, conditional)
│   ├── SearchInput.vue             (search input)
│   └── ResultsList.vue             (search results)
│       └── ResultItem.vue (×N)     (individual result)
│
└── Common Components               (shared, reusable)
    ├── Button.vue                  (all buttons)
    ├── Input.vue                   (all inputs)
    ├── Modal.vue                   (modals)
    ├── Toast.vue                   (notifications)
    ├── Tooltip.vue                 (tooltips)
    ├── ColorPicker.vue             (color selection)
    ├── Slider.vue                  (range slider)
    └── ...
```

### Component Pattern: Script Setup

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGridStore } from '@/stores'
import type { GridBlock } from '@/types'

// Props
interface Props {
  title: string
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

// Emits
const emit = defineEmits<{
  click: [value: string]
  update: [block: GridBlock]
}>()

// Reactive State
const store = useGridStore()
const isLoading = ref(false)

// Computed
const gridBlocks = computed(() => store.blocks)

// Methods
const handleClick = () => {
  emit('click', 'value')
}

// Lifecycle
onMounted(() => {
  // Setup logic
})
</script>

<template>
  <div class="component">
    <button :disabled="props.disabled" @click="handleClick">
      {{ props.title }}
    </button>
  </div>
</template>

<style module lang="scss">
.component {
  // Component styles
}
</style>
```

---

## COMPOSITION API COMPOSABLES

### useGridDragDrop.ts

```typescript
export const useGridDragDrop = () => {
  const store = useGridStore()
  const draggedBlock = ref<GridBlock | null>(null)
  const dragOffset = ref({ x: 0, y: 0 })
  
  const onDragStart = (e: DragEvent, block: GridBlock) => {
    draggedBlock.value = block
    dragOffset.value = calculateOffset(e)
  }
  
  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    const pos = calculateGridPosition(e, dragOffset.value)
    // Visual feedback
  }
  
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    if (!draggedBlock.value) return
    
    const newPos = calculateGridPosition(e, dragOffset.value)
    
    // Check collision
    if (checkCollision(newPos, draggedBlock.value)) {
      showToast('Cannot place block here', 'error')
      return
    }
    
    // Update store
    store.moveBlock(draggedBlock.value.id, newPos.x, newPos.y)
    draggedBlock.value = null
  }
  
  return { draggedBlock, onDragStart, onDragOver, onDrop }
}
```

### useClock.ts

```typescript
export const useClock = () => {
  const settings = useSettingsStore()
  const time = ref<Date>(new Date())
  let intervalId: number
  
  const currentTime = computed(() => time.value)
  
  const formattedTime = computed(() => {
    const format = settings.timeFormat === '12h' ? 12 : 24
    return formatTime(time.value, format)
  })
  
  const startClock = () => {
    intervalId = window.setInterval(() => {
      time.value = new Date()
    }, 1000)
  }
  
  const stopClock = () => {
    clearInterval(intervalId)
  }
  
  onMounted(() => startClock())
  onUnmounted(() => stopClock())
  
  return { currentTime, formattedTime, startClock, stopClock }
}
```

### useTheme.ts

```typescript
export const useTheme = () => {
  const settings = useSettingsStore()
  const systemPreference = ref<'light' | 'dark'>('light')
  
  const isDark = computed(() => {
    if (settings.theme === 'auto') {
      return systemPreference.value === 'dark'
    }
    return settings.theme === 'dark'
  })
  
  const detectSystemPreference = () => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    systemPreference.value = isDarkMode ? 'dark' : 'light'
  }
  
  const toggleTheme = () => {
    const modes = ['light', 'dark', 'auto'] as const
    const current = settings.theme
    const nextIndex = (modes.indexOf(current) + 1) % modes.length
    settings.setTheme(modes[nextIndex])
  }
  
  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }
  
  onMounted(() => {
    detectSystemPreference()
    applyTheme()
    watch(isDark, applyTheme)
  })
  
  return { isDark, toggleTheme, detectSystemPreference }
}
```

### useStorage.ts

```typescript
export const useStorage = () => {
  const getItem = async <T>(key: string): Promise<T | null> => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key], (result) => {
        resolve(result[key] ?? null)
      })
    })
  }
  
  const setItem = async (key: string, value: any): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, resolve)
    })
  }
  
  const removeItem = async (key: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.sync.remove([key], resolve)
    })
  }
  
  return { getItem, setItem, removeItem }
}
```

---

## PINIA STORE ARCHITECTURE

### gridStore.ts Pattern

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GridBlock, GridState } from '@/types'

export const useGridStore = defineStore('grid', () => {
  // State
  const blocks = ref<GridBlock[]>([])
  const selectedBlockId = ref<string | null>(null)
  const history = ref<GridState[]>([])
  const historyIndex = ref(0)
  
  // Getters (computed)
  const blockById = computed(() => (id: string) => 
    blocks.value.find(b => b.id === id)
  )
  
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  
  // Actions
  const addBlock = (config: BlockConfig) => {
    const newBlock: GridBlock = {
      id: generateId(),
      type: config.type,
      x: config.x ?? 0,
      y: config.y ?? 0,
      width: config.width ?? 2,
      height: config.height ?? 2,
      config: config.config ?? {},
      isLocked: false,
      zIndex: Math.max(...blocks.value.map(b => b.zIndex), 0) + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    blocks.value.push(newBlock)
    pushToHistory()
    saveToStorage()
  }
  
  const removeBlock = (id: string) => {
    blocks.value = blocks.value.filter(b => b.id !== id)
    pushToHistory()
    saveToStorage()
  }
  
  const moveBlock = (id: string, x: number, y: number) => {
    const block = blockById.value(id)
    if (block) {
      block.x = x
      block.y = y
      block.updatedAt = Date.now()
      pushToHistory()
      debouncedSave()
    }
  }
  
  const undo = () => {
    if (canUndo.value) {
      historyIndex.value--
      restoreFromHistory()
    }
  }
  
  const redo = () => {
    if (canRedo.value) {
      historyIndex.value++
      restoreFromHistory()
    }
  }
  
  const pushToHistory = () => {
    // Remove future history on new action
    history.value = history.value.slice(0, historyIndex.value + 1)
    // Add current state
    history.value.push({ blocks: JSON.parse(JSON.stringify(blocks.value)) })
    historyIndex.value = history.value.length - 1
    // Keep only last 10 states
    if (history.value.length > 10) {
      history.value.shift()
      historyIndex.value--
    }
  }
  
  const restoreFromHistory = () => {
    const state = history.value[historyIndex.value]
    if (state) {
      blocks.value = JSON.parse(JSON.stringify(state.blocks))
    }
  }
  
  const loadFromStorage = async () => {
    const storage = useStorage()
    const saved = await storage.getItem<GridState>('grid-state')
    if (saved) {
      blocks.value = saved.blocks
    }
  }
  
  const saveToStorage = async () => {
    const storage = useStorage()
    await storage.setItem('grid-state', { blocks: blocks.value })
  }
  
  const debouncedSave = debounce(saveToStorage, 500)
  
  return {
    // State
    blocks,
    selectedBlockId,
    // Getters
    blockById,
    canUndo,
    canRedo,
    // Actions
    addBlock,
    removeBlock,
    moveBlock,
    undo,
    redo,
    loadFromStorage,
    saveToStorage,
  }
})
```

### Other Stores Pattern

Similar pattern for:
- `settingsStore.ts` - Theme, UI preferences
- `backgroundStore.ts` - Background management
- `uiStore.ts` - UI state (modals, menus)

---

## DATA FLOW & STATE MANAGEMENT

### State Update Flow

```
User Interaction (e.g., drag block)
    ↓
Composable Hook (useGridDragDrop)
    ↓
Store Action (moveBlock)
    ↓
Update State (blocks array)
    ↓
Trigger Watcher (auto-save)
    ↓
Chrome Storage API
    ↓
Component Re-render (reactive update)
    ↓
DOM Update (Vue reactivity)
```

### Store Relationships

```
gridStore
├── Depends on: utils/collision.ts, useStorage
└── Used by: GridContainer, GridBlock components

settingsStore
├── Depends on: useStorage
└── Used by: Theme toggle, Settings panel

backgroundStore
├── Depends on: useStorage
└── Used by: BackgroundLayer, Backgrounds tab

uiStore
├── Depends on: none
└── Used by: SettingsPanel, CommandPalette, ContextMenu
```

---

## MODULE DEPENDENCIES

### Dependency Diagram

```
Components
├── Layout (BackgroundLayer, GridContainer, ControlBar)
│   ├── Uses: Stores (gridStore, settingsStore)
│   ├── Uses: Composables (useDragDrop, useTheme)
│   └── Uses: Common components
├── Widgets (Clock, Search, Weather)
│   ├── Uses: Composables (useClock, useSearch)
│   └── Uses: Common components
└── Panels (Settings, CommandPalette)
    ├── Uses: Stores (settingsStore, backgroundStore)
    └── Uses: Common components

Composables
├── useGridDragDrop → collision.ts, constants
├── useClock → formatters.ts
├── useTheme → no dependencies
├── useStorage → chrome-api.ts
├── useKeyboard → constants
├── useSearch → chrome-api.ts
└── useWindowSize → no dependencies

Stores
├── gridStore → useStorage, utils
├── settingsStore → useStorage
├── backgroundStore → useStorage
└── uiStore → no dependencies

Utils
├── validators → types
├── formatters → constants
├── calculations → no dependencies
├── collision → types, constants
└── chrome-api → types

No circular dependencies!
```

---

## CHROME EXTENSION INTEGRATION

### Manifest v3 Structure

```json
{
  "manifest_version": 3,
  "name": "VibeTab",
  "version": "1.0.0",
  "description": "Customize your new tab",
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "permissions": [
    "storage",
    "tabs",
    "bookmarks",
    "history",
    "commands"
  ],
  "host_permissions": [
    "https://api.openweathermap.org/*"
  ],
  "background": {
    "service_worker": "dist/service-worker.js"
  },
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  },
  "commands": {
    "open-command-palette": {
      "suggested_key": {
        "default": "Ctrl+Space",
        "mac": "Cmd+Space"
      },
      "description": "Open command palette"
    }
  },
  "action": {
    "default_title": "VibeTab Settings",
    "default_icon": "icons/icon-128.png"
  }
}
```

### Chrome API Wrapper

```typescript
// utils/chrome-api.ts
export const chromeAPI = {
  storage: {
    get: (key: string) => new Promise((resolve) => {
      chrome.storage.sync.get([key], (result) => {
        resolve(result[key] ?? null)
      })
    }),
    
    set: (key: string, value: any) => new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, resolve)
    }),
  },
  
  tabs: {
    openUrl: (url: string) => {
      chrome.tabs.create({ url })
    },
    
    getCurrent: () => new Promise((resolve) => {
      chrome.tabs.query({ active: true }, (tabs) => {
        resolve(tabs[0] ?? null)
      })
    }),
  },
  
  bookmarks: {
    getAll: () => new Promise((resolve) => {
      chrome.bookmarks.getTree((bookmarks) => {
        resolve(flattenBookmarks(bookmarks))
      })
    }),
  },
  
  history: {
    search: (query: string) => new Promise((resolve) => {
      chrome.history.search({ text: query }, (results) => {
        resolve(results)
      })
    }),
  },
}
```

---

## STYLING ARCHITECTURE

### CSS Module Pattern

```scss
// components/widgets/clock/ClockWidget.module.scss
.widget {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  &.darkMode {
    color: var(--color-text-dark);
  }
}

.clock {
  font-family: var(--font-family-mono);
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
}
```

Usage in component:
```vue
<script setup>
import styles from './ClockWidget.module.scss'

const isDark = computed(() => /* ... */)
</script>

<template>
  <div :class="[styles.widget, { [styles.darkMode]: isDark }]">
    <div :class="styles.clock">{{ formattedTime }}</div>
  </div>
</template>
```

### Tailwind + CSS Modules

Prefer CSS Modules for component-specific styles, Tailwind for utilities:

```vue
<template>
  <!-- Utility classes from Tailwind -->
  <div class="flex items-center gap-4 p-4">
    <!-- Component-specific classes from CSS Modules -->
    <div :class="styles.widget">
      Content
    </div>
  </div>
</template>
```

---

## PERFORMANCE OPTIMIZATION

### Code Splitting Strategy

```typescript
// router or dynamic imports
const SettingsPanel = defineAsyncComponent(() =>
  import('./components/panels/SettingsPanel.vue')
)
```

### Memoization & Caching

```typescript
// Use Pinia computed properties (auto-memoized)
const gridBlocks = computed(() => store.blocks)

// Debounce expensive operations
const handleResize = debounce(() => {
  // expensive calculation
}, 300)
```

### Image Optimization

- PNG: compress with pngquant
- JPG: convert to WebP
- SVG: inline for small icons
- Lazy load non-critical images

### Animation Performance

- Use `transform` and `opacity` only (GPU accelerated)
- Avoid repaints: `position: absolute`
- Use `will-change` sparingly
- Profile with DevTools Performance tab

---

## ERROR HANDLING & LOGGING

### Error Boundary Pattern

```typescript
export const useErrorHandler = () => {
  const handleError = (error: Error, context: string) => {
    console.error(`[${context}]`, error)
    
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      sendErrorReport(error, context)
    }
  }
  
  return { handleError }
}
```

### Logging Utility

```typescript
export const logger = {
  info: (msg: string, ...args: any[]) => {
    console.log(`[INFO] ${msg}`, ...args)
  },
  
  warn: (msg: string, ...args: any[]) => {
    console.warn(`[WARN] ${msg}`, ...args)
  },
  
  error: (msg: string, err?: Error) => {
    console.error(`[ERROR] ${msg}`, err)
  },
  
  debug: (msg: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${msg}`, ...args)
    }
  },
}
```

---

## TESTING ARCHITECTURE

### Unit Test Pattern (Vitest)

```typescript
// tests/unit/stores/gridStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGridStore } from '@/stores'

describe('gridStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('adds block', () => {
    const store = useGridStore()
    store.addBlock({ type: 'clock', x: 0, y: 0 })
    expect(store.blocks).toHaveLength(1)
  })
  
  it('removes block', () => {
    const store = useGridStore()
    store.addBlock({ type: 'clock', x: 0, y: 0 })
    const id = store.blocks[0].id
    store.removeBlock(id)
    expect(store.blocks).toHaveLength(0)
  })
})
```

### Component Test Pattern

```typescript
// tests/unit/components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/common/Button.vue'

describe('Button.vue', () => {
  it('emits click event', async () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### E2E Test Pattern (Playwright)

```typescript
// tests/e2e/drag-drop.spec.ts
import { test, expect } from '@playwright/test'

test('drag and drop block', async ({ page }) => {
  await page.goto('chrome-extension://...')
  
  const block = page.locator('[data-block-id="clock"]')
  await block.dragTo(page.locator('[data-grid-col="3"][data-grid-row="2"]'))
  
  await page.reload()
  const newPos = await block.getAttribute('data-position')
  expect(newPos).toBe('3,2')
})
```

---

**Document Version:** 1.0.0  
**Last Updated:** December 29, 2025  
**Framework:** Vue 3 + TypeScript + Pinia  
**Status:** Ready for Development

---

© 2025 SabiOfVibe Lab.