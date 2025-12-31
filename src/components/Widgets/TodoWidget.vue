<template>
  <div class="h-full flex flex-col">
    <h3 class="text-white/70 font-medium text-sm mb-3">Tasks</h3>
    
    <!-- Input -->
    <div class="flex gap-2 mb-3">
      <input 
        v-model="newTask"
        @keydown.enter="addTask"
        type="text" 
        placeholder="Add a task..." 
        class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary-500/50 outline-none"
      />
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-2">
      <div 
        v-for="todo in todos" 
        :key="todo.id"
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
      >
        <button 
          @click="toggleTodo(todo.id)"
          class="w-4 h-4 rounded border flex items-center justify-center transition-colors"
          :class="todo.completed ? 'bg-primary-500 border-primary-500' : 'border-white/20 hover:border-primary-400'"
        >
          <svg v-if="todo.completed" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <span 
          class="flex-1 text-sm truncate"
          :class="todo.completed ? 'text-white/30 line-through' : 'text-white/90'"
        >
          {{ todo.text }}
        </span>

        <button 
          @click="deleteTodo(todo.id)"
          class="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all font-bold"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '../../composables/useStorage'

interface Todo {
  id: string
  text: string
  completed: boolean
}

const { state: todos } = useStorage<Todo[]>('vibetab_todos', [
  { id: '1', text: 'Install VibeTab', completed: true },
  { id: '2', text: 'Customize widgets', completed: false },
])

const newTask = ref('')

const addTask = () => {
  if (!newTask.value.trim()) return
  todos.value.unshift({
    id: Date.now().toString(),
    text: newTask.value,
    completed: false
  })
  newTask.value = ''
}

const toggleTodo = (id: string) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.completed = !todo.completed
}

const deleteTodo = (id: string) => {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>
