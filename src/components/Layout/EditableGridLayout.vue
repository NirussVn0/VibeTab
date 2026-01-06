<!--
  EditableGridLayout.vue - Unified grid layout wrapper for drag/resize editing
  Uses vue-grid-layout with standardized 16x16px grid configuration
-->
<script setup lang="ts" generic="T extends LayoutItem">
import { computed, type PropType } from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout-v3'
import type { LayoutItem } from '../../stores/pomodoroLayout.store'
import { useEditableGrid, type EditableGridConfig } from '../../composables/useEditableGrid'

const props = defineProps({
  layout: {
    type: Array as PropType<T[]>,
    required: true
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object as PropType<EditableGridConfig>,
    default: () => ({})
  }
})

const emit = defineEmits<{
  'update:layout': [value: T[]]
}>()

const layoutModel = computed({
  get: () => props.layout,
  set: (value) => emit('update:layout', value)
})

const { gridConfig } = useEditableGrid(layoutModel, props.config)

const gridProps = computed(() => ({
  ...gridConfig.value,
  isDraggable: props.isEditMode,
  isResizable: props.isEditMode
}))
</script>

<template>
  <GridLayout
    v-model:layout="layoutModel"
    v-bind="gridProps"
    class="editable-grid-layout"
  >
    <GridItem
      v-for="item in layout"
      :key="item.i"
      :i="item.i"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :min-w="item.minW"
      :min-h="item.minH"
      class="editable-grid-item"
    >
      <slot :item="item" />
    </GridItem>
  </GridLayout>
</template>

<style>
.editable-grid-layout {
  width: 100%;
  height: 100%;
}

.editable-grid-item {
  transition: all 200ms ease;
  transition-property: left, top, width, height;
}

.vue-grid-item.vue-grid-placeholder {
  background: rgba(59, 130, 246, 0.15);
  opacity: 0.3;
  transition-duration: 100ms;
  z-index: 2;
  border-radius: 12px;
  border: 2px dashed rgba(59, 130, 246, 0.5);
}

.vue-grid-item > .vue-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMjAgTCAyMCAyMCBaIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMykiLz48L3N2Zz4=");
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.vue-grid-item:hover > .vue-resizable-handle {
  opacity: 1;
}
</style>
