<template>
    <div class="chat-history-list">
        <p v-if="loading" class="chat-history-list__status">Loading...</p>
        <p v-else-if="messages.length === 0" class="chat-history-list__status">No chat records for this date.</p>
        <ul v-else class="chat-history-list__messages">
            <li
                v-for="(message, index) in messages"
                :key="message.id"
                class="chat-history-list__item"
                :class="{ 'chat-history-list__item--continued': !shouldShowTime(index) }"
            >
                <time v-if="shouldShowTime(index)" class="chat-history-list__time">{{ message.createdAt }}</time>
                <div
                    class="chat-history-list__message"
                    :class="message.role === 'user'
                        ? 'chat-history-list__message--user'
                        : 'chat-history-list__message--assistant'"
                >
                    <p class="chat-history-list__content">{{ message.content }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { ChatHistory } from '@/types/data'

const props = defineProps<{
    loading: boolean
    messages: ChatHistory[]
}>()

const shouldShowTime = (index: number) => {
    if (index === 0) return true
    return props.messages[index].createdAt !== props.messages[index - 1].createdAt
}
</script>

<style scoped lang="scss">
.chat-history-list {
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

.chat-history-list__status {
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

.chat-history-list__messages {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 0;
    padding: 1.25rem 0.75rem;
    list-style: none;
}

.chat-history-list__item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &--continued {
        margin-top: -1rem;
    }
}

.chat-history-list__time {
    align-self: center;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.01em;
    color: var(--color-text-muted);
}

.chat-history-list__message {
    max-width: 90%;
    padding: 0.625rem 0.875rem;
    border-radius: var(--radius);
    background: var(--color-hover);

    &--user {
        align-self: flex-end;
        margin-inline-start: auto;
        text-align: right;
    }

    &--assistant {
        align-self: flex-start;
        margin-inline-end: auto;
        text-align: left;
    }
}

.chat-history-list__content {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--color-text);
}

</style>
