<template>
    <div class="error-view">
        <section class="error-view__panel">
            <p class="error-view__status">{{ status }}</p>
            <h1 class="error-view__title">{{ title }}</h1>
            <p class="error-view__message">{{ message }}</p>
            <button class="error-view__button" type="button" @click="goDashboard">
                Dashboard
            </button>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const status = computed(() => String(route.params.status || 500))
const title = computed(() => {
    if (status.value === '403') return 'Access denied'
    if (status.value === '404') return 'Not found'
    if (status.value === '429') return 'Too many requests'
    return 'Request failed'
})
const message = computed(() => {
    if (status.value === '403') return 'You do not have permission to access this resource.'
    if (status.value === '404') return 'The requested resource was not found.'
    if (status.value === '429') return 'Please wait before sending another request.'
    return 'The request could not be completed.'
})

const goDashboard = () => {
    router.push({ name: 'DashboardView' })
}
</script>

<style scoped lang="scss">
.error-view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    padding: var(--content-padding);
    background: var(--color-bg);
}

.error-view__panel {
    width: min(100%, 28rem);
    padding: 2.25rem;
    border: 1px solid rgb(17 24 39 / 8%);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: 0 24px 60px rgb(17 24 39 / 10%);
    text-align: center;
}

.error-view__status {
    margin: 0 0 0.75rem;
    color: var(--color-text);
    font-size: 2.75rem;
    font-weight: 700;
    line-height: 1;
}

.error-view__title {
    margin: 0;
    color: var(--color-text);
    font-size: 1.25rem;
    font-weight: 700;
}

.error-view__message {
    margin: 0.75rem 0 1.75rem;
    color: var(--color-text-secondary);
}

.error-view__button {
    display: inline-grid;
    place-items: center;
    height: 2.5rem;
    min-width: 7.25rem;
    padding: 0 1rem;
    appearance: none;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    font-weight: 500;
    line-height: 1;
}

.error-view__button:hover {
    background: var(--color-hover);
}
</style>
