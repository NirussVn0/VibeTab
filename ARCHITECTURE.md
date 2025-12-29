# VibeTab Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| Styling | Tailwind CSS (Dark Theme) |
| State | Pinia |
| Build | Vite + CRXJS |
| Storage | localStorage + Chrome Storage API |

## Directory Structure

```
src/
├── components/
│   ├── Base/           # ToggleSwitch, Button
│   ├── Effects/        # AnimatedBackground, Toast, Loading
│   ├── Layout/         # TopBar, MainGrid, BlockWrapper, SettingsPanel, Footer
│   └── Widgets/        # Clock, Search, Weather, Todo, Bookmarks, CommandPalette
├── composables/        # useStorage, useCommandPalette
├── stores/             # ui, grid, settings, theme, background, commandPalette
├── services/storage/   # indexedDB.service.ts
├── utils/              # widgetFactory.ts
├── constants/          # colors.ts, theme.ts
├── App.vue
├── main.ts
├── manifest.ts         # Chrome Extension Manifest V3
└── background.ts       # Service Worker
```

## Design Patterns

- **Factory Pattern**: `WidgetFactory` for dynamic component resolution
- **Composable Pattern**: Reusable logic (`useStorage`, `useCommandPalette`)
- **Store Pattern**: Centralized state with Pinia + persistence

## Build Commands

```bash
# Development
npm run dev

# Production Build (Web + Extension)
npm run build

# Load in Chrome: chrome://extensions → Load Unpacked → /dist
```

## Color System

- Background: `#0f172a` (Dark Navy)
- Surface: `#1e293b`
- Primary: `#60a5fa` (Blue)
- Text: `#f1f5f9`

---

© 2025 SabiOfVibe Lab.
