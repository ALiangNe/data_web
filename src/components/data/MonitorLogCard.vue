<template>
    <section class="monitor-log-card">
        <p v-if="loading" class="monitor-log-card__status">Loading...</p>
        <p v-else-if="!hasQueried" class="monitor-log-card__empty">Enter a TraceId and click Query.</p>
        <p v-else-if="!rows.length" class="monitor-log-card__empty">No data</p>

        <div v-else class="monitor-log-card__list">
            <ElSteps
                v-for="(group, groupIndex) in rowGroups"
                :key="groupIndex"
                align-center
                class="monitor-log-card__steps"
            >
                <ElStep
                    v-for="(row, index) in group"
                    :key="row.spanId"
                    :title="stepTitle(groupIndex * 4 + index, row)"
                    :status="stepStatus(row)"
                >
                    <template #description>
                        <ElCard shadow="hover" class="monitor-log-card__item">
                            <div
                                v-for="col in columns"
                                :key="col"
                                class="monitor-log-card__field"
                            >
                                <span class="monitor-log-card__label">{{ col }}</span>
                                <span
                                    class="monitor-log-card__value"
                                    :class="{
                                        'monitor-log-card__value--ok': col === 'status' && stepStatus(row) === 'success',
                                        'monitor-log-card__value--error': col === 'status' && stepStatus(row) === 'error',
                                    }"
                                >{{ row[col] }}</span>
                            </div>
                        </ElCard>
                    </template>
                </ElStep>
            </ElSteps>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElStep, ElSteps } from 'element-plus'

const props = defineProps<{
    columns: string[]
    rows: Record<string, string>[]
    loading: boolean
    hasQueried: boolean
}>()

const rowGroups = computed(() => {
    const groups: Record<string, string>[][] = []
    for (let i = 0; i < props.rows.length; i += 4) {
        groups.push(props.rows.slice(i, i + 4))
    }
    return groups
})

const stepTitle = (index: number, row: Record<string, string>) =>
    `${index < 20 ? String.fromCodePoint(0x2460 + index) : `${index + 1}.`} ${row.name || '-'}`

const stepStatus = (row: Record<string, string>): 'success' | 'error' =>
    row.status?.toLowerCase() === 'ok' ? 'success' : 'error'
</script>

<style scoped lang="scss">
.monitor-log-card {
    overflow: auto;
    width: 100%;
}

.monitor-log-card__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
}

.monitor-log-card__steps {
    width: 100%;

    :deep(.el-step) {
        flex: 1 1 0;
        min-width: 0;
    }

    :deep(.el-step__head) {
        text-align: center;
    }

    :deep(.el-step__title) {
        font-size: 0.8125rem;
        font-weight: 600;
        line-height: 1.4;
        text-align: center;
        word-break: break-word;
    }

    :deep(.el-step__description) {
        margin-top: 0.5rem;
        padding: 0 0.25rem;
        text-align: left;
        display: block;
    }

    :deep(.el-step__line) {
        background-color: var(--color-border);
    }

    :deep(.el-step__main) {
        text-align: center;
    }
}

.monitor-log-card__item {
    width: 100%;
    box-sizing: border-box;
    border-radius: var(--radius);
    border-color: var(--color-border);

    :deep(.el-card__body) {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.75rem 0.875rem;
        text-align: left;
    }
}

.monitor-log-card__field {
    display: grid;
    grid-template-columns: 5.5rem 1fr;
    gap: 0.5rem;
    align-items: start;
}

.monitor-log-card__label {
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
}

.monitor-log-card__value {
    font-size: 0.75rem;
    color: var(--color-text);
    word-break: break-word;
    white-space: pre-line;

    &--ok {
        color: #16a34a;
    }

    &--error {
        color: var(--color-error);
    }
}

.monitor-log-card__empty,
.monitor-log-card__status {
    margin: 0;
    padding: 2rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-align: center;
}
</style>
