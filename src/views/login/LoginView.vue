<template>
    <div class="login-view">
        <LoginForm @submit="onSubmit" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAlert, useAuth } from '@/composables'
import { resolveDefaultRoute } from '@/configs/sidebar'
import { useUserStore } from '@/stores'
import LoginForm from '@/components/auth/LoginForm.vue'
import { ApiError } from '@/types/api'

const router = useRouter()
const { login } = useAuth()
const { show } = useAlert()
const userStore = useUserStore()

const onSubmit = async (email: string, password: string) => {
    try {
        await login(email, password)
        show('Login successful.', 'success')
        const name = resolveDefaultRoute(userStore.user!.role) ?? 'BotsView'
        await router.push({ name: name })
    } catch (error) {
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Login failed. Please try again.'
        show(message, 'error')
    }
}
</script>

<style scoped lang="scss">
.login-view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 2rem 1.25rem;
    box-sizing: border-box;
}
</style>
