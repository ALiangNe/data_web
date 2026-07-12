<template>
    <div class="user-permission-panel">
        <p class="user-permission-panel__text">Username: {{ username }}</p>
        <p class="user-permission-panel__text">Current Role: {{ formatRole(currentRole) }}</p>
        <label class="user-permission-panel__field">
            <span>Target Role</span>
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
        </label>
        <div class="user-permission-panel__actions">
            <button
                type="button"
                class="user-permission-panel__button user-permission-panel__button--primary"
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
    gap: 0.875rem;
}

.user-permission-panel__text {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-text);
    word-break: break-word;
}

.user-permission-panel__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-secondary);
}

.user-permission-panel__select {
    width: 100%;
}

.user-permission-panel__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.user-permission-panel__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 5rem;
    height: 2.25rem;
    padding: 0 0.875rem;
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
}

.user-permission-panel__button--primary {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: #fff;

    &:hover:not(:disabled) {
        border-color: var(--color-primary-hover);
        background: var(--color-primary-hover);
        color: #fff;
    }
}
</style>
