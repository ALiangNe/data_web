<template>
    <section class="auth-login-form">
        <header class="auth-login-form__header">
            <h1 class="auth-login-form__title">Login</h1>
            <p class="auth-login-form__subtitle">Data Console</p>
        </header>

        <form class="auth-login-form__body" @submit.prevent="handleSubmit">
            <label class="auth-login-form__field">
                <span class="auth-login-form__label">Email</span>
                <input
                    v-model="email"
                    class="auth-login-form__input"
                    type="email"
                    name="email"
                    autocomplete="username"
                    placeholder="name@example.com"
                />
            </label>

            <label class="auth-login-form__field">
                <span class="auth-login-form__label">Password</span>
                <input
                    v-model="password"
                    class="auth-login-form__input"
                    type="password"
                    name="password"
                    autocomplete="current-password"
                    placeholder="Enter your password"
                />
            </label>

            <button type="submit" class="auth-login-form__submit">
                Sign in
            </button>
        </form>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const emit = defineEmits<{
    submit: [email: string, password: string]
}>()

const handleSubmit = () => {
    emit('submit', email.value, password.value)
}
</script>

<style scoped lang="scss">
.auth-login-form {
    width: 100%;
    max-width: 24rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: var(--shadow);
}

.auth-login-form__header {
    padding: 1.5rem 1.5rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
}

.auth-login-form__title {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-text);
}

.auth-login-form__subtitle {
    margin: 0.375rem 0 0;
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
}

.auth-login-form__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
}

.auth-login-form__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.auth-login-form__label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-secondary);
}

.auth-login-form__input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text);
    font: inherit;
    font-size: 0.875rem;
    transition: border-color 150ms ease, box-shadow 150ms ease;

    &::placeholder {
        color: var(--color-text-muted);
    }

    &:hover {
        border-color: var(--color-border-strong);
    }

    &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: var(--focus-ring);
    }
}

.auth-login-form__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.25rem;
    padding: 0.625rem 1rem;
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-sm);
    background: var(--color-primary);
    color: #fff;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease;

    &:hover {
        background: var(--color-primary-hover);
        border-color: var(--color-primary-hover);
    }
}
</style>
