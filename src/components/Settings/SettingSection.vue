<!-- SettingSection.vue - Reusable collapsible settings section component -->
<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  title: string
  iconColor?: string
  isExpanded?: boolean
}

withDefaults(defineProps<Props>(), {
  iconColor: 'text-primary-400',
  isExpanded: false
})

const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <div class="setting-section">
    <button @click="emit('toggle')" class="setting-section-header">
      <div class="flex items-center gap-3">
        <slot name="icon">
          <div :class="['w-5 h-5', iconColor]">
            <slot name="icon-content" />
          </div>
        </slot>
        <span class="text-sm font-medium text-white">{{ title }}</span>
      </div>
      <ChevronDown :class="['setting-section-chevron', { expanded: isExpanded }]" />
    </button>
    <Transition name="expand">
      <div v-if="isExpanded" class="setting-section-content">
        <slot />
      </div>
    </Transition>
  </div>
</template>
