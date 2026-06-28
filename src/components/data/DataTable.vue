<template>
    <section class="data-table">
        <p v-if="loading" class="data-table__status">Loading...</p>
        <table v-else-if="columns.length" class="data-table__grid">
            <thead>
                <tr>
                    <th v-for="col in columns" :key="col" class="data-table__head">
                        <button
                            v-if="sortableFields?.includes(col)"
                            type="button"
                            class="data-table__sort"
                            :disabled="loading"
                            @click="emit('sortColumn', col)"
                        >
                            <span class="data-table__sort-field">{{ col }}</span>
                            <span v-if="col === sortField" class="data-table__sort-icon">
                                {{ sortOrder === 'desc' ? '↓' : '↑' }}
                            </span>
                        </button>
                        <template v-else>{{ col }}</template>
                    </th>
                    <th v-if="actions?.length" class="data-table__head">actions</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, index) in rows"
                    :key="index"
                    class="data-table__row"
                    :class="{ 'data-table__row--clickable': clickable }"
                    @click="clickable ? emit('rowClick', row) : undefined"
                >
                    <td v-for="col in columns" :key="col" class="data-table__cell">
                        {{ row[col] }}
                    </td>
                    <td v-if="actions?.length" class="data-table__cell">
                        <div class="data-table__actions">
                            <button
                                v-for="action in actions"
                                :key="action.key"
                                type="button"
                                class="data-table__action"
                                @click="emit('action', { key: action.key, row })"
                            >
                                {{ action.label }}
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-else class="data-table__empty">No data</p>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    columns: string[]
    rows: Record<string, string>[]
    sortableFields?: string[]
    sortField?: string
    sortOrder?: 'asc' | 'desc'
    loading: boolean
    clickable?: boolean
    actions?: {
        key: string
        label: string
    }[]
}>()

const emit = defineEmits<{
    (e: 'sortColumn', col: string): void
    (e: 'rowClick', row: Record<string, string>): void
    (e: 'action', payload: { key: string; row: Record<string, string> }): void
}>()
</script>

<style scoped lang="scss">
.data-table {
    overflow: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.data-table__grid {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
}

.data-table__head {
    padding: 0.625rem 0.875rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-table-head);
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    white-space: nowrap;
}

.data-table__sort {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0;
    border: none;
    background: transparent;
    font: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    cursor: pointer;
    border-radius: var(--radius-sm);

    &:hover:not(:disabled) {
        color: var(--color-primary);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.data-table__sort-field,
.data-table__sort-icon {
    pointer-events: none;
}

.data-table__sort-icon {
    font-size: 0.75rem;
    line-height: 1;
    color: var(--color-primary);
}

.data-table__cell {
    padding: 0.625rem 0.875rem;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    vertical-align: top;
    max-width: 18rem;
    color: var(--color-text);
    word-break: break-word;
    white-space: pre-line;
    font-variant-numeric: tabular-nums;
}

.data-table__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
}

.data-table__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-sm);
    background: var(--color-primary);
    font: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease;

    &:hover:not(:disabled) {
        background: var(--color-primary-hover);
        border-color: var(--color-primary-hover);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.data-table__row:hover .data-table__cell {
    background: var(--color-table-row-hover);
}

.data-table__row--clickable {
    cursor: pointer;
}

.data-table__row:last-child .data-table__cell {
    border-bottom: none;
}

.data-table__empty,
.data-table__status {
    margin: 0;
    padding: 2rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-align: center;
}
</style>
