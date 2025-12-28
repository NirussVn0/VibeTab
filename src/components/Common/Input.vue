<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const inputClasses = computed(() => {
  return [
    'w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border transition-colors duration-200 outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)]',
    props.error 
      ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-1 focus:ring-[var(--color-error)]' 
      : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
    props.disabled ? 'opacity-50 cursor-not-allowed bg-[var(--color-background)]' : '',
    props.icon ? 'pl-10' : ''
  ].join(' ');
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-sm font-medium text-[var(--color-text-secondary)]">
      {{ label }}
    </label>
    
    <div class="relative">
      <div v-if="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
        <i :class="icon"></i>
      </div>
      
      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @input="handleInput"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
    </div>
    
    <span v-if="error" class="text-xs text-[var(--color-error)] mt-1">
      {{ error }}
    </span>
  </div>
</template>
