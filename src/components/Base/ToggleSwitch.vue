/**
 * ToggleSwitch - Smooth animated toggle component
 * Uses cubic-bezier easing for premium feel
 */
<template>
  <button 
    class="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
    :class="modelValue ? 'bg-primary-500 shadow-lg shadow-primary-500/30' : 'bg-white/10 hover:bg-white/15'"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span 
      class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200"
      :style="{ 
        transform: modelValue ? 'translateX(1.25rem) scale(1.05)' : 'translateX(0.25rem) scale(1)',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
</script>

