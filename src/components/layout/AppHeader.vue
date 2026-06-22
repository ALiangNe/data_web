<template>
    <header class="app-header">
        <div class="app-header__spacer" />
        <span v-if="displayName" class="app-header__user">{{ displayName }}</span>
        <button type="button" class="app-header__logout" @click="onLogout">
            Sign out
        </button>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables'
import { useUserStore } from '@/stores'

const router = useRouter()
const { logout } = useAuth()
const userStore = useUserStore()

const displayName = computed(() => userStore.user?.username)

const onLogout = async () => {
    logout()
    await router.push({ name: 'LoginView' })
}
</script>

<style scoped lang="scss">
.app-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    height: var(--header-height);
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
}

.app-header__spacer {
    flex: 1 1 auto;
}

.app-header__user {
    margin-right: 0.75rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text);
}

.app-header__logout {
    padding: 0.5rem 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.2;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;

    &:hover {
        background: var(--color-hover);
        border-color: var(--color-border-strong);
        color: var(--color-text);
    }
}
</style>
