<template>
    <div class="dashboard-view">
        <DataChartPanel
            :stats="stats"
            :labels="chartLabels"
            :values="chartValues"
            :loading="loading"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getUsers } from '@/api/data'
import DataChartPanel from '@/components/data/DataChartPanel.vue'
import { useAlert } from '@/composables'
import { ApiError } from '@/types/api'
import type { DataListResult, User } from '@/types/data'

const { show } = useAlert()

const loading = ref(false)
const totalUsers = ref(0)
const todayNew = ref(0)
const chartLabels = ref<string[]>([])
const chartValues = ref<number[]>([])

const stats = computed(() => [
    {
        label: 'Total Users',
        value: totalUsers.value.toLocaleString(),
    },
    {
        label: 'Today\'s New Users',
        value: todayNew.value.toLocaleString(),
    },
])

const fetchData = async () => {
    loading.value = true
    totalUsers.value = 0
    todayNew.value = 0
    chartLabels.value = []
    chartValues.value = []

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const days: Date[] = []
    for (let i = 6; i >= 0; i--) {
        const day = new Date(todayStart)
        day.setDate(day.getDate() - i)
        days.push(day)
    }

    const rangeEnd = new Date(todayStart)
    rangeEnd.setDate(rangeEnd.getDate() + 1)
    const recentCreatedAt: [string, string] = [
        days[0].toISOString(),
        rangeEnd.toISOString(),
    ]

    let totalData: DataListResult<User>
    try {
        totalData = await getUsers({ page: 1, pageSize: 1 })
    } catch (error) {
        console.error('DashboardView total users fetch failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load data. Please try again.'
        show(message, 'error')
        loading.value = false
        return
    }

    let recentData: DataListResult<User>
    try {
        recentData = await getUsers({ createdAt: recentCreatedAt })
    } catch (error) {
        console.error('DashboardView recent users fetch failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load data. Please try again.'
        show(message, 'error')
        loading.value = false
        return
    }

    const counts = new Map<number, number>()
    for (const user of recentData.list) {
        const day = new Date(user.createdAt)
        day.setHours(0, 0, 0, 0)
        const key = day.getTime()
        counts.set(key, (counts.get(key) ?? 0) + 1)
    }

    totalUsers.value = totalData.total
    todayNew.value = counts.get(days[days.length - 1].getTime()) ?? 0
    chartLabels.value = days.map((day) => new Date(day).toLocaleDateString())
    chartValues.value = days.map((day) => counts.get(day.getTime()) ?? 0)
    loading.value = false
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped lang="scss">
.dashboard-view {
    padding: var(--content-padding);
}
</style>
