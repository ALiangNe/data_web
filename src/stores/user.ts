import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
export const useUserStore = defineStore('userStore', () => {
    const user = ref<User | null>(null)

    const updateUserInfo = (userInfo: User) => {
        user.value = userInfo
    }

    const resetUserInfo = () => {
        user.value = null
    }

    return {
        user,
        updateUserInfo,
        resetUserInfo,
    }
})
