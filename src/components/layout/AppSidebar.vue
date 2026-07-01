<template>
    <aside class="app-sidebar" aria-label="主导航">
        <div class="app-sidebar__brand">
            <span class="app-sidebar__title">Data Console</span>
        </div>
        <ElMenu
            v-if="groups.length"
            class="app-sidebar__menu"
            :default-openeds="groups.map((g) => g.key)"
            router
        >
            <ElSubMenu
                v-for="group in groups"
                :key="group.key"
                :index="group.key"
            >
                <template #title>{{ group.label }}</template>
                <ElMenuItem
                    v-for="item in group.children"
                    :key="item.name"
                    :index="`/${item.permission}`"
                >
                    {{ item.label }}
                </ElMenuItem>
            </ElSubMenu>
        </ElMenu>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { APP_SIDEBAR, DATA_CONSOLE_PERMISSIONS } from '@/configs/sidebar'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const groups = computed(() => {
    const role = userStore.user?.role
    if (role == null) return []
    const permissions = DATA_CONSOLE_PERMISSIONS[role] ?? []
    return APP_SIDEBAR
        .map((group) => ({
            ...group,
            children: group.children.filter((item) => permissions.includes(item.permission)),
        }))
        .filter((group) => group.children.length > 0)
})
</script>

<style scoped lang="scss">
.app-sidebar {
    flex: 0 0 var(--sidebar-width);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0 0 1.25rem;
    border-right: 1px solid var(--color-border);
    background: var(--color-surface);
}

.app-sidebar__brand {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: var(--header-height);
    padding: 0 1.5rem;
    box-sizing: border-box;
    border-bottom: 1px solid var(--color-border);
}

.app-sidebar__title {
    display: block;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-text);
}

.app-sidebar__menu {
    --el-menu-bg-color: transparent;
    --el-menu-hover-bg-color: var(--color-hover);
    --el-menu-active-color: var(--color-primary);
    --el-menu-text-color: var(--color-text-secondary);
    --el-menu-hover-text-color: var(--color-text);

    flex: 1;
    padding: 0.5rem 0.75rem 0;
    border-right: none;

    :deep(.el-sub-menu__title) {
        height: auto;
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-sm);
        font-size: 0.8125rem;
        font-weight: 600;
        line-height: 1.3;
        color: var(--color-text);
    }

    :deep(.el-menu-item) {
        height: auto;
        min-height: 2rem;
        padding: 0.5rem 0.75rem 0.5rem 1.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.8125rem;
        font-weight: 500;
        line-height: 1.3;
    }

    :deep(.el-menu-item.is-active) {
        background: var(--color-primary-soft);
        color: var(--color-primary);
        font-weight: 600;
    }
}
</style>
