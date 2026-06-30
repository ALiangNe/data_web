<template>
    <section class="data-filter">
        <form class="data-filter__form" @submit.prevent="emit('search')">
            <div class="data-filter__input-grid">
                <template v-if="selectFields">
                    <label
                        v-for="(config, key) in selectFields"
                        :key="key"
                        class="data-filter__field"
                    >
                        <span class="data-filter__label">{{ config.label }}</span>
                        <ElSelect
                            :model-value="selectValues![key]"
                            :placeholder="config.label"
                            :disabled="loading"
                            clearable
                            @update:model-value="updateSelect(key, $event)"
                        >
                            <ElOption
                                v-for="option in config.options"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            />
                        </ElSelect>
                    </label>
                </template>

                <label
                    v-for="field in fields"
                    :key="field"
                    class="data-filter__field"
                >
                    <span class="data-filter__label">{{ field }}</span>
                    <ElInput
                        :model-value="filterValues[field] ?? ''"
                        :placeholder="field"
                        :disabled="loading"
                        clearable
                        @update:model-value="updateField(field, $event)"
                    />
                </label>
            </div>

            <div v-if="showTimeRange && timeRangeFields" class="data-filter__time-grid">
                <label
                    v-for="field in timeRangeFields"
                    :key="field"
                    class="data-filter__field"
                >
                    <span class="data-filter__label">{{ field }}</span>
                    <ElDatePicker
                        class="data-filter__datetime"
                        type="datetimerange"
                        :model-value="timeRangeValues?.[field] ?? null"
                        :disabled="loading"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        range-separator="-"
                        start-placeholder="Start"
                        end-placeholder="End"
                        @update:model-value="updateTimeRange(field, $event)"
                    />
                </label>
            </div>

            <div class="data-filter__actions">
                <button
                    type="button"
                    class="data-filter__button data-filter__button--reset"
                    :disabled="loading"
                    @click="emit('reset')"
                >
                    Reset
                </button>
                <button
                    type="submit"
                    class="data-filter__button data-filter__button--submit"
                    :disabled="loading"
                >
                    {{ loading ? 'Querying…' : 'Query' }}
                </button>
            </div>
        </form>
    </section>
</template>

<script setup lang="ts">
import { ElDatePicker, ElInput, ElOption, ElSelect } from 'element-plus'
import type { DataSelectFieldConfig, DataTimeRangeFieldValues } from '@/types/data'

const props = defineProps<{
    fields: string[]
    filterValues: Record<string, string>
    selectFields?: Record<string, DataSelectFieldConfig>
    selectValues?: Record<string, string>
    timeRangeFields?: string[]
    timeRangeValues?: Record<string, DataTimeRangeFieldValues>
    showTimeRange?: boolean
    loading: boolean
}>()

const emit = defineEmits<{
    (e: 'update:filterValues', value: Record<string, string>): void
    (e: 'update:selectValues', value: Record<string, string>): void
    (e: 'update:timeRangeValues', value: Record<string, DataTimeRangeFieldValues>): void
    (e: 'search'): void
    (e: 'reset'): void
}>()

const updateField = (key: string, value: string) => {
    emit('update:filterValues', {
        ...props.filterValues,
        [key]: value ?? '',
    })
}

const updateSelect = (key: string, value: string) => {
    emit('update:selectValues', {
        ...(props.selectValues ?? {}),
        [key]: value,
    })
}

const updateTimeRange = (field: string, value: DataTimeRangeFieldValues) => {
    emit('update:timeRangeValues', {
        ...(props.timeRangeValues ?? {}),
        [field]: value,
    })
}
</script>

<style scoped lang="scss">
.data-filter {
    margin-bottom: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.data-filter__form {
    padding: 1rem 1.25rem;
}

.data-filter__input-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem 1rem;
}

.data-filter__time-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem 1rem;
    margin-top: 0.75rem;
}

.data-filter__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    min-width: 0;

    :deep(.el-input) {
        width: 100%;
    }

    :deep(.el-select) {
        width: 100%;
    }

    :deep(.el-date-editor) {
        width: 100%;
    }
}

.data-filter__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
}

.data-filter__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.data-filter__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-secondary);
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

    &--submit {
        border-color: var(--color-primary);
        background: var(--color-primary);
        color: #fff;

        &:hover:not(:disabled) {
            background: var(--color-primary-hover);
            border-color: var(--color-primary-hover);
            color: #fff;
        }
    }
}
</style>
