<template>
    <section class="data-table">
        <ElTable
            v-if="columns.length"
            :data="rows"
            :default-sort="sortField ? {
                prop: sortField,
                order: sortOrder === 'desc' ? 'descending' : 'ascending',
            } : undefined"
            :empty-text="loading ? 'Loading...' : 'No data'"
            :row-class-name="clickable ? 'data-table__row--clickable' : ''"
            class="data-table__grid"
            @row-click="clickable ? emit('rowClick', $event) : undefined"
            @sort-change="$event.prop ? emit('sortColumn', $event.prop) : undefined"
        >
            <ElTableColumn
                v-for="col in columns"
                :key="col"
                :prop="col"
                :label="col"
                :sortable="sortableFields?.includes(col) ? 'custom' : false"
                :sort-orders="['ascending', 'descending']"
            >
                <template #default="{ row }">
                    <ElTooltip
                        :content="row[col]"
                        placement="top"
                        :show-after="300"
                        :disabled="!row[col]"
                        popper-class="data-table__tooltip"
                    >
                        <div class="data-table__cell-content">{{ row[col] }}</div>
                    </ElTooltip>
                </template>
            </ElTableColumn>
            <ElTableColumn
                v-if="actions?.length"
                label="actions"
            >
                <template #default="{ row }">
                    <div class="data-table__actions">
                        <button
                            v-for="action in actions"
                            :key="action.key"
                            type="button"
                            class="data-table__action"
                            @click.stop="emit('action', { key: action.key, row })"
                        >
                            {{ action.label }}
                        </button>
                    </div>
                </template>
            </ElTableColumn>
        </ElTable>
        <p v-else class="data-table__empty">
            {{ loading ? 'Loading...' : 'No data' }}
        </p>
    </section>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn, ElTooltip } from 'element-plus'

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
    overflow: hidden;
    max-width: 100%;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.data-table__grid {
    width: 100%;
    font-size: 0.8125rem;
}

:deep(.el-table__inner-wrapper) {
    max-width: 100%;
}

:deep(.el-table__header th) {
    background: var(--color-table-head);
    color: var(--color-text-secondary);
}

:deep(.el-table__header .cell) {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
}

:deep(.el-table__cell) {
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
}

:deep(.el-table__body tr:hover > td.el-table__cell) {
    background: var(--color-table-row-hover);
}

.data-table__cell-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    line-clamp: 10;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-break: break-word;
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
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    font: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    white-space: nowrap;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;

    &:hover:not(:disabled) {
        background: var(--color-hover);
        border-color: var(--color-border-strong);
        color: var(--color-text);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

:deep(.data-table__row--clickable) {
    cursor: pointer;
}

.data-table__empty {
    margin: 0;
    padding: 2rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-align: center;
}

:global(.data-table__tooltip) {
    max-width: 24rem;
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
