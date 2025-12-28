# ⚡ VibeTab

> **A clean, modern, and aesthetically pleasing new tab extension for pro developers.**
> Built with Vue 3, TypeScript, and a focus on performance and visual "vibe".

![VibeTab Banner](https://placehold.co/1200x400/0f172a/60a5fa?text=VibeTab+Preview)

## ✨ Features

- **🎨 Modern Aesthetics**: Glassmorphism UI, smooth animations, and dynamic backgrounds.
- **⚡ Super Fast**: Built on Vite with zero-runtime CSS overhead (Tailwind).
- **🔋 Battery Efficient**: Optimized background video/image loading.
- **🧩 Widgets**:
    - **Clock**: Customizable minimal clock.
    - **Search**: Focused search bar.
    - **Grid**: Drag-and-drop widget layout (In Progress).
- **⌨️ Command Palette**: `Cmd+K` access to everything (Search, Tabs, Bookmarks).
- **💾 Persistence**: Instant state saving via local storage & Chrome Sync.

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) + [CRXJS](https://crxjs.dev/vite-plugin)
- **Storage**: IndexedDB & Chrome Storage API

## 🧑‍💻 Architecture

The project follows a strict feature-based architecture:

```
src/
├── components/     # UI Components (Presentational)
│   ├── Effects/    # Visual effects (Background, Toasts)
│   ├── Layout/     # Structural components (Grid, Shell)
│   └── Widgets/    # Proper widgets (Clock, Search)
├── composables/    # Logic & State Composables (useStorage, useCommandPalette)
├── stores/         # Global State (Pinia)
├── services/       # External Integrations (IndexedDB, Chrome API)
└── utils/          # Helpers & Factories
```

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sabiofvibelab/vibetab.git
    cd vibetab
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```
    To load in Chrome: Go to `chrome://extensions`, enable **Developer Mode**, click **Load Unpacked**, and select the `dist` folder.

## 🤝 Contributing

Contributions are welcome! Please follow the code style (ESLint/Prettier configured).

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <span style="color: #64748b; font-size: 0.8rem;">
    © 2025 SabiOfVibe Lab.
  </span>
</p>
