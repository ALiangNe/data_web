import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables'
import { DATA_CONSOLE_PERMISSIONS } from '@/configs/sidebar'
import { useUserStore } from '@/stores'
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

    const userStore = useUserStore()
    const role = userStore.user?.role

    if (to.meta.guestOnly && isAuthed) {
        return { name: 'DashboardView' }
    }

    const permission = to.meta.permission as string | undefined
    if (permission && role != null) {
        const allowed = DATA_CONSOLE_PERMISSIONS[role] ?? []
        if (!allowed.includes(permission)) {
            return { name: 'DashboardView' }
        }
    }
})

export default router
