<template>
    <section class="data-pagination">
        <div class="data-pagination__row">
            <div class="data-pagination__nav">
                <label class="data-pagination__field">
                    <select
                        class="data-pagination__input"
                        :value="pageSize"
                        :disabled="loading"
                        @change="onPageSizeChange"
                    >
                        <option v-for="size in pageSizeOptions" :key="size" :value="size">
                            {{ size }}
                        </option>
                    </select>
                </label>
                <button
                    type="button"
                    class="data-pagination__button"
                    :disabled="loading || !canPrevPage"
                    @click="emit('prev')"
                >
                    Pre page
                </button>
                <span class="data-pagination__page">
                    Page {{ page }} / {{ totalPages }}, Total {{ total }} items
                </span>
                <button
                    type="button"
                    class="data-pagination__button"
                    :disabled="loading || !canNextPage"
                    @click="emit('next')"
                >
                    Next page
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    page: number
    pageSize: number
    total: number
    loading: boolean
    pageSizeOptions: number[]
}>()

const emit = defineEmits<{
    (e: 'update:pageSize', value: number): void
    (e: 'prev'): void
    (e: 'next'): void
}>()

const canPrevPage = computed(() => props.page > 1)
const canNextPage = computed(() => props.page * props.pageSize < props.total)
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const onPageSizeChange = (event: Event) => {
    const value = Number((event.target as HTMLSelectElement).value)
    emit('update:pageSize', value)
}
</script>

<style scoped lang="scss">
.data-pagination {
    margin-top: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.data-pagination__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0.75rem 1.25rem;
}

.data-pagination__field {
    display: flex;
    align-items: center;
    width: 5rem;
    min-width: 0;
}

.data-pagination__input,
.data-pagination__button {
    box-sizing: border-box;
    height: 2.25rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    font: inherit;
    font-size: 0.8125rem;
    line-height: 1;
    transition: background 150ms ease, border-color 150ms ease;
}

.data-pagination__input {
    width: 100%;
    padding: 0 0.625rem;
    color: var(--color-text);
    cursor: pointer;

    &:hover:not(:disabled) {
        border-color: var(--color-border-strong);
    }

    &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: var(--focus-ring);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.data-pagination__nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
}

.data-pagination__page {
    display: inline-flex;
    align-items: center;
    height: 2.25rem;
    padding: 0 0.25rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;
}

.data-pagination__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;

    &:hover:not(:disabled) {
        background: var(--color-hover);
        border-color: var(--color-border-strong);
        color: var(--color-text);
    }

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
}
</style>
