<template>
    <main class="error-view">
        <h1 class="error-view__title">{{ status }}</h1>
        <p class="error-view__text">Request failed. Please try again later.</p>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const status = computed(() => String(route.params.status ?? 500))
</script>

<style scoped lang="scss">
.error-view {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: var(--color-bg);
    color: var(--color-text);
}

.error-view__title {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.2;
}

.error-view__text {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
}
</style>
