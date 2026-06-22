import { createApp } from 'vue'
import App from '@/App.vue'
import 'element-plus/dist/index.css'
import '@/styles/variables.css'
import '@/styles/global.scss'
import { pinia } from '@/stores/pinia'
import { useAuth } from '@/composables'
import router from '@/router'
import { initApiClient } from '@/api'

const app = createApp(App).use(pinia)

app.use(router)

const { refreshToken, logout } = useAuth()
initApiClient({ router, refreshToken, logout })

app.mount('#app')
