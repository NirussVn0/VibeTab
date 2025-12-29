<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

const hasSeenTour = useStorage('vibetab-tour-j', false)
const currentStep = ref(0)
const isOpen = ref(false)

const steps = [
  {
    title: 'Welcome to VibeTab',
    desc: 'Your new flow state dashboard. Minimal, fast, and completely customizable.'
  },
  {
    title: 'Edit Mode',
    desc: 'Press **Ctrl+E** or click the "Edit Layout" button to unlock widgets, drag them around, or right-click to configure.'
  },
  {
    title: 'Command Palette',
    desc: 'Press **Ctrl+K** or **Ctrl+Space** to instantly access settings, switch themes, or navigate.'
  }
]

onMounted(() => {
  if (!hasSeenTour.value) {
    // Small delay to allow fade-in
    setTimeout(() => {
      isOpen.value = true
    }, 1000)
  }
})

const next = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    finish()
  }
}

const finish = () => {
  isOpen.value = false
  setTimeout(() => {
    hasSeenTour.value = true
  }, 500) // wait for animation
}
</script>

<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="finish"></div>

      <!-- Card -->
      <div class="relative w-full max-w-md bg-surface-dark border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        <!-- Progress -->
        <div class="flex justify-center gap-2 mb-6">
          <div 
            v-for="(_, idx) in steps" 
            :key="idx" 
            class="h-1 rounded-full transition-all duration-300"
            :class="idx === currentStep ? 'w-8 bg-primary' : 'w-2 bg-white/20'"
          ></div>
        </div>

        <h2 class="text-2xl font-bold text-white mb-3">{{ steps[currentStep].title }}</h2>
        <p class="text-white/70 mb-8 leading-relaxed" v-html="steps[currentStep].desc.replace(/\*\*(.*?)\*\*/g, '<span class=\'text-primary font-bold\'>$1</span>')"></p>

        <button 
          @click="next"
          class="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        >
          {{ currentStep === steps.length - 1 ? 'Get Started' : 'Next' }}
        </button>

        <button @click="finish" class="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
