<!-- AuthModal.vue - Login/Signup modal with glassmorphism design -->
<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { X, User, Mail, Lock, LogIn, UserPlus } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth.store'

const authStore = useAuthStore()
const activeTab = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const name = ref('')

const handleSubmit = () => {
  authStore.mockLogin()
}
</script>

<template>
  <TransitionRoot :show="authStore.isAuthModalOpen" as="template">
    <Dialog as="div" class="relative z-[100]" @close="authStore.closeAuthModal">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-md" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl transition-all">
              
              <!-- Header -->
              <div class="relative p-6 pb-0">
                <button @click="authStore.closeAuthModal" class="absolute right-4 top-4 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                  <X class="w-5 h-5" />
                </button>
                <div class="text-center mb-6">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <User class="w-8 h-8 text-white" />
                  </div>
                  <h2 class="text-2xl font-bold text-white">Welcome to VibeTab</h2>
                  <p class="text-sm text-white/60 mt-1">Sign in to sync your settings</p>
                </div>
              </div>

              <!-- Tabs -->
              <div class="flex mx-6 mb-4 bg-white/5 rounded-xl p-1">
                <button 
                  @click="activeTab = 'login'"
                  class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all"
                  :class="activeTab === 'login' ? 'bg-white/10 text-white shadow' : 'text-white/50 hover:text-white'"
                >
                  <LogIn class="w-4 h-4 inline mr-2" />Login
                </button>
                <button 
                  @click="activeTab = 'signup'"
                  class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all"
                  :class="activeTab === 'signup' ? 'bg-white/10 text-white shadow' : 'text-white/50 hover:text-white'"
                >
                  <UserPlus class="w-4 h-4 inline mr-2" />Sign Up
                </button>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="p-6 pt-2 space-y-4">
                <div v-if="activeTab === 'signup'" class="relative">
                  <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input v-model="name" type="text" placeholder="Full Name" class="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                </div>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input v-model="email" type="email" placeholder="Email Address" class="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                </div>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input v-model="password" type="password" placeholder="Password" class="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                </div>

                <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {{ activeTab === 'login' ? 'Sign In' : 'Create Account' }}
                </button>

                <p v-if="activeTab === 'login'" class="text-center text-xs text-white/40">
                  Don't have an account? <button type="button" @click="activeTab = 'signup'" class="text-primary-400 hover:underline">Sign up</button>
                </p>
                <p v-else class="text-center text-xs text-white/40">
                  Already have an account? <button type="button" @click="activeTab = 'login'" class="text-primary-400 hover:underline">Sign in</button>
                </p>
              </form>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
