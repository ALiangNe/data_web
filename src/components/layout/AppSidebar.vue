<template>
    <aside class="app-sidebar" aria-label="主导航">
        <div class="app-sidebar__brand">
            <span class="app-sidebar__title">Data Console</span>
        </div>
        <nav class="app-sidebar__nav">
            <RouterLink
                v-for="item in APP_NAV"
                :key="item.name"
                :to="{ name: item.name }"
                class="app-sidebar__link"
                active-class="app-sidebar__link--active"
            >
                {{ item.label }}
            </RouterLink>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const APP_NAV = [
    { name: 'BotsView', label: 'Bots' },
    { name: 'KnowledgeView', label: 'Knowledge' },
    { name: 'McpCapabilitiesView', label: 'McpCapabilities' },
    { name: 'MonitorLogsView', label: 'MonitorLogs' },
    { name: 'UserBehaviorLogsView', label: 'UserBehaviorLogs' },
    { name: 'UsersView', label: 'Users' },
] as const
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

.app-sidebar__nav {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.5rem 0.75rem 0;
}

.app-sidebar__link {
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.3;
    color: var(--color-text-secondary);
    transition: background 150ms ease, color 150ms ease;

    &:hover {
        background: var(--color-hover);
        color: var(--color-text);
    }

    &--active {
        background: var(--color-primary-soft);
        color: var(--color-primary);
        font-weight: 600;
    }
}
</style>
