<!-- CommandPalette.vue - Quick actions and AI search modal (Ctrl+K) -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import Fuse from 'fuse.js'
import { useThemeStore } from '../../stores/theme.store'
import { useUIStore } from '../../stores/ui.store'
import { useSettingsStore, type AIProvider } from '../../stores/settings.store'

const themeStore = useThemeStore()
const uiStore = useUIStore()
const settingsStore = useSettingsStore()

const isOpen = ref(false)
const query = ref('')

const AI_PROVIDERS: Record<AIProvider, { name: string; url: (q: string) => string }> = {
  chatgpt: { name: 'ChatGPT', url: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}` },
  perplexity: { name: 'Perplexity', url: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}` },
  google: { name: 'Google', url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}` }
}

interface CommandAction {
  id: string
  name: string
  category: string
  shortcut?: string[]
  perform: () => void
}

const actions: CommandAction[] = [
  { id: 'theme-dark', name: 'Switch to Dark Mode', category: 'Theme', perform: () => themeStore.setTheme('dark') },
  { id: 'theme-light', name: 'Switch to Light Mode', category: 'Theme', perform: () => themeStore.setTheme('light') },
  { id: 'theme-gray', name: 'Switch to Gray Mode', category: 'Theme', perform: () => themeStore.setTheme('gray') },
  { id: 'open-settings', name: 'Open Settings', category: 'Navigation', shortcut: ['S'], perform: () => uiStore.openSettings() },
  { id: 'edit-layout', name: 'Toggle Edit Mode', category: 'Grid', shortcut: ['Ctrl', 'E'], perform: () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', ctrlKey: true })) },
  { id: 'toggle-pomodoro', name: 'Toggle Focus Mode', category: 'Navigation', shortcut: ['Alt', 'P'], perform: () => { import('../../stores/pomodoro.store').then(m => m.usePomodoroStore().toggleView()) } },
  { id: 'ai-chatgpt', name: 'Set AI Provider: ChatGPT', category: 'AI', perform: () => { settingsStore.general.aiProvider = 'chatgpt' } },
  { id: 'ai-perplexity', name: 'Set AI Provider: Perplexity', category: 'AI', perform: () => { settingsStore.general.aiProvider = 'perplexity' } },
  { id: 'ai-google', name: 'Set AI Provider: Google', category: 'AI', perform: () => { settingsStore.general.aiProvider = 'google' } },
]

const fuse = new Fuse(actions, { keys: ['name', 'category'], threshold: 0.3 })

const isAiQuery = computed(() => query.value.startsWith('>'))
const aiQueryText = computed(() => query.value.slice(1).trim())
const currentAiProvider = computed(() => AI_PROVIDERS[settingsStore.general.aiProvider])
const filteredActions = computed(() => isAiQuery.value ? [] : query.value === '' ? actions : fuse.search(query.value).map(r => r.item))

const onSelect = (action: CommandAction) => {
  isOpen.value = false
  action.perform()
  query.value = ''
}

const submitAiSearch = () => {
  if (isAiQuery.value && aiQueryText.value) {
    window.open(currentAiProvider.value.url(aiQueryText.value), '_blank')
    closeModal()
  }
}

const submitGoogleSearch = () => {
  const q = query.value.trim()
  if (q && !isAiQuery.value && filteredActions.value.length === 0) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`
    closeModal()
  }
}

const closeModal = () => {
  isOpen.value = false
  query.value = ''
}

const onKeydown = (e: KeyboardEvent) => {
  if ((e.key === 'k' || e.key === ' ') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    isOpen.value = !isOpen.value
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <TransitionRoot :show="isOpen" as="template" @after-leave="query = ''" appear>
    <Dialog as="div" class="relative z-[100]" @close="closeModal">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
          <DialogPanel class="mx-auto max-w-xl transform divide-y divide-white/10 overflow-hidden rounded-xl bg-surface-dark shadow-2xl ring-1 ring-black/5 transition-all">
            <Combobox @update:modelValue="onSelect">
              <div class="relative">
                <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                <ComboboxInput
                  class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder:text-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Search or type > for AI..."
                  @change="query = $event.target.value"
                  @keydown.enter="isAiQuery ? submitAiSearch() : submitGoogleSearch()"
                  :displayValue="(item: any) => item?.name"
                  autocomplete="off"
                />
              </div>

              <ComboboxOptions v-if="filteredActions.length > 0" static class="max-h-80 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-400">
                <ComboboxOption v-for="action in filteredActions" :key="action.id" :value="action" as="template" v-slot="{ active }">
                  <li :class="['cursor-default select-none px-4 py-2 flex items-center justify-between', active ? 'bg-primary-500/20 text-white' : 'text-gray-400']">
                    <div class="flex items-center gap-2">
                      <span class="text-xs uppercase tracking-wider opacity-50 w-16 text-right">{{ action.category }}</span>
                      <span class="font-medium">{{ action.name }}</span>
                    </div>
                    <div v-if="action.shortcut" class="flex gap-1">
                      <kbd v-for="key in action.shortcut" :key="key" class="font-sans text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">{{ key }}</kbd>
                    </div>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>

              <div v-if="isAiQuery" class="py-6 px-6 text-center text-sm sm:px-14">
                <div class="text-blue-400 font-medium mb-2 flex items-center justify-center gap-2">
                  <SparklesIcon class="w-5 h-5" />
                  <span>AI Search Mode</span>
                </div>
                <p v-if="aiQueryText" class="text-white">Press Enter to ask: "{{ aiQueryText }}"</p>
                <p v-else class="text-gray-400">Type your question after &gt;</p>
              </div>

              <div v-else-if="query !== '' && filteredActions.length === 0" class="py-6 px-6 text-center text-sm sm:px-14">
                <p class="text-gray-400">Press Enter to search Google for: <span class="text-white">"{{ query }}"</span></p>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
