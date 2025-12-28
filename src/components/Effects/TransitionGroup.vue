<template>
  <!-- Page Load -->
  <transition name="fade-scale" mode="out-in">
    <slot name="pageLoad" />
  </transition>

  <!-- Widget Appear -->
  <transition-group name="slide-up" tag="div" class="contents">
    <slot name="widgets" />
  </transition-group>

  <!-- Modal/Overlay -->
  <transition name="fade-blur">
    <slot name="modal" />
  </transition>
</template>

<script setup lang="ts">
// Logic is handled via CSS classes
</script>

<style scoped>
/* Fade Scale */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Slide Up Stagger */
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-move {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Fade Blur Modal */
.fade-blur-enter-active, .fade-blur-leave-active {
  transition: all 0.3s ease;
}

.fade-blur-enter-from {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.fade-blur-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}
</style>
