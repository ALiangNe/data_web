<template>
    <div class="user-permission-panel">
        <div class="user-permission-panel__content">
            <div class="user-permission-panel__item">
                <p class="user-permission-panel__label">Username</p>
                <p class="user-permission-panel__text">{{ username }}</p>
            </div>
            <div class="user-permission-panel__item">
                <p class="user-permission-panel__label">Current Role</p>
                <p class="user-permission-panel__text">{{ formatRole(currentRole) }}</p>
            </div>
            <div class="user-permission-panel__item">
                <p class="user-permission-panel__label">Target Role</p>
                <ElSelect
                    :model-value="selectedRole"
                    class="user-permission-panel__select"
                    :disabled="saving"
                    @update:model-value="onRoleChange"
                >
                    <ElOption
                        v-for="role in props.roleOptions"
                        :key="role"
                        :label="formatRole(role)"
                        :value="role"
                        :disabled="disabledRoles.includes(role)"
                    />
                </ElSelect>
            </div>
        </div>
        <div class="user-permission-panel__actions">
            <button
                type="button"
                class="user-permission-panel__button"
                :disabled="saving || submitDisabled"
                @click="emit('submit')"
            >
                {{ saving ? 'Saving...' : 'Confirm' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'

const props = defineProps<{
    username: string
    currentRole: number
    selectedRole: number
    roleOptions: number[]
    roleLabels: Record<number, string>
    saving: boolean
    disabledRoles: number[]
    submitDisabled: boolean
}>()

const emit = defineEmits<{
    (e: 'update:selectedRole', value: number): void
    (e: 'submit'): void
}>()

const formatRole = (role: number) => `${role} - ${props.roleLabels[role] ?? role}`

const onRoleChange = (value: number) => {
    emit('update:selectedRole', value)
}
</script>

<style scoped lang="scss">
.user-permission-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.user-permission-panel__content {
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

.user-permission-panel__item {
    margin: 1.25rem;
    margin-bottom: 0;
    padding: 0.875rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-hover);

    &:last-child {
        margin-bottom: 1.25rem;
    }
}

.user-permission-panel__label {
    margin: 0 0 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-text-secondary);
}

.user-permission-panel__text {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--color-text);
    word-break: break-word;
}

.user-permission-panel__select {
    width: 100%;
}

.user-permission-panel__actions {
    display: flex;
    justify-content: flex-end;
}

.user-permission-panel__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 5rem;
    height: 2.25rem;
    padding: 0 0.875rem;
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-sm);
    background: var(--color-primary);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease;

    &:hover:not(:disabled) {
        border-color: var(--color-primary-hover);
        background: var(--color-primary-hover);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>
