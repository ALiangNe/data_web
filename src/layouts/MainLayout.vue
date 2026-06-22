<template>
    <div class="main-layout">
        <AppSidebar />
        <div class="main-layout__content">
            <AppHeader />
            <main class="main-layout__main">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<style scoped lang="scss">
.main-layout {
    display: flex;
    align-items: stretch;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--color-bg);
}

.main-layout__content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 100%;
}

.main-layout__main {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow: auto;
}
</style>
