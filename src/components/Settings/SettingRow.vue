<!-- SettingRow.vue - Reusable setting row with label and control slot -->
<script setup lang="ts">
interface Props {
  label: string
}

defineProps<Props>()
</script>

<template>
  <div class="setting-row">
    <span class="text-sm text-white/90">{{ label }}</span>
    <slot />
  </div>
</template>
