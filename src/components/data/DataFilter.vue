<template>
    <section class="data-filter">
        <form class="data-filter__form" @submit.prevent="emit('search')">
            <div class="data-filter__grid">
                <label v-for="field in fields" :key="field" class="data-filter__field">
                    <span class="data-filter__label">{{ field }}</span>
                    <input
                        class="data-filter__input"
                        type="text"
                        :name="field"
                        :value="filterValues[field] ?? ''"
                        :placeholder="field"
                        @input="updateField(field, ($event.target as HTMLInputElement).value)"
                    />
                </label>

                <template v-if="selectFields">
                    <label v-for="(config, key) in selectFields" :key="key" class="data-filter__field">
                        <span class="data-filter__label">{{ config.label }}</span>
                        <ElSelect
                            :model-value="selectValues![key]"
                            :disabled="loading"
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

                <div v-if="showTimeRange" class="data-filter__row-break" />

                <template v-if="showTimeRange">
                    <template v-for="field in timeRangeFields" :key="field">
                        <label class="data-filter__field">
                            <span class="data-filter__label">{{ field }} start</span>
                            <input
                                class="data-filter__input data-filter__input--datetime"
                                :class="{ 'data-filter__input--empty': !timeRangeValues[field]?.startTime }"
                                type="datetime-local"
                                :name="`${field}-start`"
                                :value="timeRangeValues[field]?.startTime ?? ''"
                                @click="openPicker"
                                @input="updateTimeRange(field, 'startTime', ($event.target as HTMLInputElement).value)"
                            />
                        </label>
                        <label class="data-filter__field">
                            <span class="data-filter__label">{{ field }} end</span>
                            <input
                                class="data-filter__input data-filter__input--datetime"
                                :class="{ 'data-filter__input--empty': !timeRangeValues[field]?.endTime }"
                                type="datetime-local"
                                :name="`${field}-end`"
                                :value="timeRangeValues[field]?.endTime ?? ''"
                                @click="openPicker"
                                @input="updateTimeRange(field, 'endTime', ($event.target as HTMLInputElement).value)"
                            />
                        </label>
                    </template>
                </template>

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
            </div>
        </form>
    </section>
</template>

<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import type { DataSelectFieldConfig, DataTimeRangeFieldValues } from '@/types/data'

const props = defineProps<{
    fields: string[]
    filterValues: Record<string, string>
    selectFields?: Record<string, DataSelectFieldConfig>
    selectValues?: Record<string, string>
    timeRangeFields: string[]
    timeRangeValues: Record<string, DataTimeRangeFieldValues>
    showTimeRange: boolean
    loading: boolean
}>()

const emit = defineEmits<{
    (e: 'update:filterValues', value: Record<string, string>): void
    (e: 'update:selectValues', value: Record<string, string>): void
    (e: 'update:timeRangeValues', value: Record<string, DataTimeRangeFieldValues>): void
    (e: 'search'): void
    (e: 'reset'): void
}>()

const openPicker = (event: MouseEvent) => {
    const input = event.currentTarget as HTMLInputElement
    input.showPicker?.()
}

const updateField = (key: string, value: string) => {
    emit('update:filterValues', {
        ...props.filterValues,
        [key]: value,
    })
}

const updateSelect = (key: string, value: string) => {
    emit('update:selectValues', {
        ...props.selectValues!,
        [key]: value,
    })
}

const updateTimeRange = (field: string, key: keyof DataTimeRangeFieldValues, value: string) => {
    emit('update:timeRangeValues', {
        ...props.timeRangeValues,
        [field]: {
            ...props.timeRangeValues[field],
            [key]: value,
        },
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

.data-filter__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 0.75rem 1rem;
}

.data-filter__row-break {
    grid-column: 1 / -1;
}

.data-filter__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    min-width: 0;

    :deep(.el-select) {
        width: 100%;
    }
}

.data-filter__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
}

.data-filter__input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    font: inherit;
    font-size: 0.8125rem;
    color: var(--color-text);
    transition: border-color 150ms ease, box-shadow 150ms ease;

    &::placeholder {
        color: var(--color-text-muted);
    }

    &--empty {
        color: var(--color-text-muted);

        &::-webkit-datetime-edit,
        &::-webkit-datetime-edit-fields-wrapper,
        &::-webkit-datetime-edit-text,
        &::-webkit-datetime-edit-month-field,
        &::-webkit-datetime-edit-day-field,
        &::-webkit-datetime-edit-year-field,
        &::-webkit-datetime-edit-hour-field,
        &::-webkit-datetime-edit-minute-field {
            color: var(--color-text-muted);
        }
    }

    &:not(.data-filter__input--empty) {
        color: var(--color-text);
    }

    &:hover {
        border-color: var(--color-border-strong);
    }

    &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: var(--focus-ring);
    }

    &--datetime {
        cursor: pointer;
    }
}

.data-filter__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    grid-column: 1 / -1;
    align-self: end;
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
