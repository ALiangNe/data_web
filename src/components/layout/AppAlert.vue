<template>
    <div v-if="visible" class="app-alert">
        <div class="app-alert__card" :class="`app-alert__card--${type}`">
            <p class="app-alert__message">{{ message }}</p>
            <button type="button" class="app-alert__close" @click="close">
                ×
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAlert } from '@/composables'

const { visible, message, type, close } = useAlert()
</script>

<style scoped lang="scss">
.app-alert {
    position: fixed;
    top: 1rem;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    padding: 0 var(--content-padding);
}

.app-alert__card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    max-width: 28rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.app-alert__card--info {
    border-color: rgb(37 99 235 / 25%);
    background: var(--color-primary-soft);
}

.app-alert__card--error {
    border-color: #fecaca;
    background: var(--color-error-soft);
}

.app-alert__message {
    flex: 1 1 auto;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
    color: var(--color-text);
    word-break: break-word;
}

.app-alert__card--error .app-alert__message {
    color: var(--color-error);
}

.app-alert__close {
    flex: 0 0 auto;
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
</style>
