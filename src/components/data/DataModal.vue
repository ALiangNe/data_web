<template>
    <div v-if="open" class="data-modal" @click.self="emit('close')">
        <div class="data-modal__panel" role="dialog" aria-modal="true">
            <div class="data-modal__header">
                <h2 v-if="title" class="data-modal__title">{{ title }}</h2>
                <button type="button" class="data-modal__close" aria-label="Close" @click="emit('close')">
                    ×
                </button>
            </div>
            <div class="data-modal__body">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    open: boolean
    title?: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()
</script>

<style scoped lang="scss">
.data-modal {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--content-padding);
    background: rgb(15 23 42 / 45%);
}

.data-modal__panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 32rem;
    max-height: calc(100vh - 2 * var(--content-padding));
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.data-modal__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 3rem;
    border-bottom: 1px solid var(--color-border);
}

.data-modal__title {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.3;
    text-align: center;
    color: var(--color-text-secondary);
}

.data-modal__close {
    position: absolute;
    top: 50%;
    right: 1rem;
    flex-shrink: 0;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    font-size: 1rem;
    line-height: 1;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;

    &:hover {
        background: var(--color-hover);
        border-color: var(--color-border-strong);
        color: var(--color-text);
    }
}

.data-modal__body {
    display: flex;
    flex-direction: column;
    padding: 0.875rem 1.25rem 1.25rem;
}
</style>
