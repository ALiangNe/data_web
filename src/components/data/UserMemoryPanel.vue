<template>
    <div class="user-memory-panel">
        <div class="user-memory-panel__content">
            <p v-if="loading" class="user-memory-panel__status">Loading...</p>
            <p v-else-if="!memory" class="user-memory-panel__status">No user memory.</p>
            <div v-else class="user-memory-panel__item">
                <p class="user-memory-panel__text">{{ memory }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    loading: boolean
    memory: string
}>()
</script>

<style scoped lang="scss">
.user-memory-panel {
    display: flex;
    flex-direction: column;
}

.user-memory-panel__content {
    display: flex;
    flex-direction: column;
    height: 28rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.user-memory-panel__status {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 1.5rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
}

.user-memory-panel__item {
    margin: 1.25rem;
    padding: 0.875rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-hover);
}

.user-memory-panel__text {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--color-text);
}
</style>
