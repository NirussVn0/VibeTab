<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGridStore } from '../../stores/grid.store'
import GridBlock from './GridBlock.vue'

const gridStore = useGridStore()
const { widgets } = storeToRefs(gridStore)

</script>

<template>
  <div class="container mx-auto px-4 h-full flex items-center justify-center">
    <div class="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 w-full max-w-[1280px] auto-rows-[120px]">
      <GridBlock 
        v-for="block in widgets" 
        :key="block.id" 
        :block="block"
      />
    </div>
  </div>
</template>
