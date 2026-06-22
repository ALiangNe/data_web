<template>
    <main class="auth-layout">
        <router-view />
    </main>
</template>

<style scoped lang="scss">
.auth-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--color-bg);
}
</style>
