import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/globals.scss'
import './styles/utilities.scss'
import './styles/animations.scss'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
