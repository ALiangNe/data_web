<template>
    <div class="chat-history-panel">
        <el-date-picker
            class="chat-history-panel__date-picker"
            :model-value="date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="Select date"
            :disabled="datesLoading"
            :disabled-date="disabledDate"
            @update:model-value="onDateChange"
            @panel-change="onPanelChange"
        />
        <div class="chat-history-panel__content">
            <p v-if="loading" class="chat-history-panel__status">Loading...</p>
            <p v-else-if="messages.length === 0" class="chat-history-panel__status">No chat records for this date.</p>
            <ul v-else class="chat-history-panel__messages">
                <li
                    v-for="(message, index) in messages"
                    :key="message.id"
                    class="chat-history-panel__item"
                    :class="{ 'chat-history-panel__item--continued': !shouldShowTime(index) }"
                >
                    <time v-if="shouldShowTime(index)" class="chat-history-panel__time">{{ message.createdAt }}</time>
                    <div
                        class="chat-history-panel__message"
                        :class="message.role === 'user'
                            ? 'chat-history-panel__message--user'
                            : 'chat-history-panel__message--assistant'"
                    >
                        <p class="chat-history-panel__content-text">{{ message.content }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElDatePicker } from 'element-plus'
import type { ChatHistory } from '@/types'

const props = defineProps<{
    date: string
    datesLoading?: boolean
    disabledDate?: (time: Date) => boolean
    loading: boolean
    messages: ChatHistory[]
}>()

const emit = defineEmits<{
    (e: 'update:date', value: string): void
    (e: 'panelChange', value: Date): void
}>()

const onDateChange = (value: string | null) => {
    emit('update:date', value ?? '')
}

const onPanelChange = (date: Date) => {
    emit('panelChange', date)
}

const shouldShowTime = (index: number) => {
    if (index === 0) return true
    return props.messages[index].createdAt !== props.messages[index - 1].createdAt
}
</script>

<style scoped lang="scss">
.chat-history-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.chat-history-panel__date-picker {
    width: 100%;
}

.chat-history-panel__content {
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

.chat-history-panel__status {
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

.chat-history-panel__messages {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 0;
    padding: 1.25rem 0.75rem;
    list-style: none;
}

.chat-history-panel__item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &--continued {
        margin-top: -1rem;
    }
}

.chat-history-panel__time {
    align-self: center;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.01em;
    color: var(--color-text-muted);
}

.chat-history-panel__message {
    max-width: 90%;
    padding: 0.625rem 0.875rem;
    border-radius: var(--radius);
    background: var(--color-hover);

    &--user {
        align-self: flex-end;
        margin-inline-start: auto;
        text-align: left;
    }

    &--assistant {
        align-self: flex-start;
        margin-inline-end: auto;
        text-align: left;
    }
}

.chat-history-panel__content-text {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--color-text);
}
</style>
