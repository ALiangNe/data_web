<template>
    <router-view />
    <AppAlert />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import AppAlert from '@/components/layout/AppAlert.vue'
import { useAuth } from '@/composables'

const { initAuth } = useAuth()

onBeforeMount(async () => {
    await initAuth()
})
</script>
