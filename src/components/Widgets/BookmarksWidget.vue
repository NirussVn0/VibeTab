<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white/70 font-medium text-sm">Bookmarks</h3>
      <button 
        @click="addBookmark" 
        class="text-white/50 hover:text-primary-400 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
      <div class="grid grid-cols-4 gap-2">
        <a 
          v-for="bookmark in bookmarks" 
          :key="bookmark.id"
          :href="bookmark.url"
          class="aspect-square flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all group relative"
        >
          <img 
            :src="`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=32`" 
            class="w-6 h-6 mb-1 opacity-70 group-hover:opacity-100 transition-opacity"
            loading="lazy"
          />
          <span class="text-[10px] text-white/50 truncate w-full text-center px-1">{{ bookmark.title }}</span>

          <div 
            v-if="uiStore.isEditMode"
            @click.prevent="removeBookmark(bookmark.id)"
            class="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 shadow-sm cursor-pointer"
          >
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '../../composables/useStorage'
import { useUIStore } from '../../stores/ui.store'

const uiStore = useUIStore()

interface Bookmark {
  id: string
  title: string
  url: string
}

const { state: bookmarks } = useStorage<Bookmark[]>('vibetab_bookmarks', [
  { id: '1', title: 'GitHub', url: 'https://github.com' },
  { id: '2', title: 'YouTube', url: 'https://youtube.com' },
  { id: '3', title: 'Gmail', url: 'https://mail.google.com' },
  { id: '4', title: 'ChatGPT', url: 'https://chat.openai.com' },
])

const addBookmark = () => {
  const url = prompt('Enter URL:')
  if (!url) return
  
  let title = prompt('Enter Title:')
  if (!title) {
    try {
      title = new URL(url).hostname
    } catch {
      title = 'Link'
    }
  }

  bookmarks.value.push({
    id: Date.now().toString(),
    title,
    url
  })
}

const removeBookmark = (id: string) => {
  bookmarks.value = bookmarks.value.filter(b => b.id !== id)
}
</script>
