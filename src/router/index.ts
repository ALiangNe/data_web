import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables'
import { routes } from './routes'

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0, left: 0 }
    },
})

router.beforeEach((to) => {
    const { loggedIn } = useAuth()
    const hasToken = !!localStorage.getItem('accessToken')
    const isAuthed = loggedIn.value || hasToken

    if (to.meta.requiresAuth && !isAuthed) {
        return { name: 'LoginView' }
    }

    if (to.meta.guestOnly && isAuthed) {
        return { name: 'AuthProvidersView' }
    }
})

export default router
