<template>
  <div class="container mx-auto px-4 py-8 h-full overflow-y-auto custom-scrollbar">
    <div 
      class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[120px]"
    >
      <!-- Placeholder for widgets -->
      <div class="col-span-12 flex items-center justify-center h-32 text-white/50 border-2 border-dashed border-white/20 rounded-xl">
        Grid Area (Widgets coming soon)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
