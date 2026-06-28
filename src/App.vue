<template>
    <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useAuth } from '@/composables'

const { initAuth } = useAuth()

onBeforeMount(async () => {
    await initAuth()
})
</script>
