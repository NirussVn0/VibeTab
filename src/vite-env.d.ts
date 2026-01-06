/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-grid-layout-v3' {
  import { DefineComponent } from 'vue'
  export const GridLayout: DefineComponent<any>
  export const GridItem: DefineComponent<any>
}
