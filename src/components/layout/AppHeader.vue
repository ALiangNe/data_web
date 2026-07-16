<template>
    <header class="app-header">
        <ElSelect
            :model-value="regionStore.region"
            class="app-header__region"
            size="default"
            @update:model-value="onRegionChange"
        >
            <ElOption
                v-for="region in DATA_REGIONS"
                :key="region.value"
                :label="region.label"
                :value="region.value"
            />
        </ElSelect>
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
import { ElOption, ElSelect } from 'element-plus'
import { useAuth } from '@/composables'
import { DATA_REGIONS } from '@/configs/data'
import { useRegionStore, useUserStore } from '@/stores'
import type { DataRegion } from '@/types/data'

const router = useRouter()
const { logout } = useAuth()
const userStore = useUserStore()
const regionStore = useRegionStore()

const displayName = computed(() => userStore.user?.username)

const onRegionChange = (value: DataRegion) => {
    regionStore.setRegion(value)
}

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

.app-header__region {
    width: 8.75rem;
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
