import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { login as loginApi, getUserInfo as getUserInfoApi, refreshToken as refreshTokenApi } from '@/api/auth'

const authInited = ref(false)
const loggedIn = ref(false)
const accessTokenExpiresAt = ref(0)
export const useAuth = () => {
    const userStore = useUserStore()

    const initAuth = async () => {
        const accessToken = localStorage.getItem('accessToken')
        accessTokenExpiresAt.value = Number(localStorage.getItem('accessTokenExpiresAt') ?? 0)
        if (!accessToken) {
            authInited.value = true
            return
        }
        try {
            const res = await getUserInfoApi()
            userStore.updateUserInfo(res)
            loggedIn.value = true
        } catch {
            logout()
        } finally {
            authInited.value = true
        }
    }

    const login = async (email: string, password: string) => {
        const res = await loginApi(email, password)

        localStorage.setItem('accessToken', res.accessToken)
        localStorage.setItem('refreshToken', res.refreshToken)
        localStorage.setItem('accessTokenExpiresAt', String(res.expiresAt))

        const userInfo = await getUserInfoApi()
        userStore.updateUserInfo(userInfo)

        accessTokenExpiresAt.value = res.expiresAt
        loggedIn.value = true
    }

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken') ?? ''
        if (!refreshToken) {
            logout()
            return
        }
        const res = await refreshTokenApi(refreshToken)
        localStorage.setItem('accessToken', res.accessToken)
        localStorage.setItem('refreshToken', res.refreshToken)
        localStorage.setItem('accessTokenExpiresAt', String(res.expiresAt))
        accessTokenExpiresAt.value = res.expiresAt
        return res
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessTokenExpiresAt')
        userStore.resetUserInfo()
        loggedIn.value = false
    }

    return { authInited, loggedIn, accessTokenExpiresAt, initAuth, login, logout, refreshToken }
}
