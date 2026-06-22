<template>
    <div class="login-view">
        <LoginForm @submit="onSubmit" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAlert, useAuth } from '@/composables'
import LoginForm from '@/components/auth/LoginForm.vue'
import { ApiError } from '@/types/api'

const router = useRouter()
const { login } = useAuth()
const { show } = useAlert()

const onSubmit = async (email: string, password: string) => {
    try {
        await login(email, password)
        await router.push({ name: 'AuthProvidersView' })
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
