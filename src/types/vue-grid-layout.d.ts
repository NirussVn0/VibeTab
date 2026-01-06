declare module 'vue-grid-layout-v3' {
  import { DefineComponent } from 'vue'

  export interface LayoutItem {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
    static?: boolean
  }

  export const GridLayout: DefineComponent<{
    layout: LayoutItem[]
    colNum?: number
    rowHeight?: number
    maxRows?: number
    isDraggable?: boolean
    isResizable?: boolean
    isMirrored?: boolean
    verticalCompact?: boolean
    useCssTransforms?: boolean
    responsive?: boolean
    margin?: [number, number]
    containerPadding?: [number, number]
  }>

  export const GridItem: DefineComponent<{
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
    static?: boolean
    isDraggable?: boolean
    isResizable?: boolean
  }>
}
