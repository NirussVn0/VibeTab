/**
 * ColorPickerCircle - Circular color picker with preview
 * Shows a color circle that opens native color picker on click
 */
<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="relative block cursor-pointer group">
    <div 
      class="w-7 h-7 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all shadow-lg"
      :style="{ backgroundColor: modelValue }"
    />
    <input 
      type="color" 
      :value="modelValue"
      @input="handleChange"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div class="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-primary-500/50 transition-all" />
  </label>
</template>
