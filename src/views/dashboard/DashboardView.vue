<template>
    <div class="dashboard-view">
        <DataChartPanel :loading="loading" :total-users="totalUsers" :today-new="todayNew"
            :user-chart-labels="userChartLabels" :user-chart-values="userChartValues" :total-visitors="totalVisitors"
            :total-visits="totalVisits" :visit-chart-labels="visitChartLabels" :visit-device-values="visitDeviceValues"
            :visit-session-values="visitSessionValues" :region-labels="regionLabels" :region-values="regionValues"
            :media-chart-labels="mediaChartLabels" :media-chart-values="mediaChartValues" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserBehaviorStats, getUsers } from '@/api/data'
import DataChartPanel from '@/components/data/DataChartPanel.vue'
import { MEDIA_PLATFORMS } from '@/configs/data'
import { useAlert } from '@/composables'
import { ApiError } from '@/types/api'
import type { DataListResult, User, UserBehaviorStatsResult } from '@/types/data'

const { show } = useAlert()

const loading = ref(false)
const totalUsers = ref('0')
const todayNew = ref('0')
const totalVisitors = ref('0')
const totalVisits = ref('0')
const userChartLabels = ref<string[]>([])
const userChartValues = ref<number[]>([])
const visitChartLabels = ref<string[]>([])
const visitDeviceValues = ref<number[]>([])
const visitSessionValues = ref<number[]>([])
const regionLabels = ref<string[]>([])
const regionValues = ref<number[]>([])
const mediaChartLabels = ref<string[]>([])
const mediaChartValues = ref<number[]>([])

const fetchData = async () => {
    loading.value = true
    totalUsers.value = '0'
    todayNew.value = '0'
    totalVisitors.value = '0'
    totalVisits.value = '0'
    userChartLabels.value = []
    userChartValues.value = []
    visitChartLabels.value = []
    visitDeviceValues.value = []
    visitSessionValues.value = []
    regionLabels.value = []
    regionValues.value = []
    mediaChartLabels.value = []
    mediaChartValues.value = []

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
    const recentCreatedAt = [days[0].toISOString(), rangeEnd.toISOString()] as [string, string]
    const chartLabels = days.map((day) => day.toLocaleDateString())

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

    let behaviorData: UserBehaviorStatsResult
    try {
        behaviorData = await getUserBehaviorStats({ createdAt: recentCreatedAt })
    } catch (error) {
        console.error('DashboardView behavior stats fetch failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load data. Please try again.'
        show(message, 'error')
        loading.value = false
        return
    }

    const userCounts = new Map<number, number>()
    for (const user of recentData.list) {
        const day = new Date(user.createdAt)
        day.setHours(0, 0, 0, 0)
        const key = day.getTime()
        userCounts.set(key, (userCounts.get(key) ?? 0) + 1)
    }

    const visitDevices = new Map<number, Set<string>>()
    const visitSessions = new Map<number, number>()
    for (const session of behaviorData.sessions) {
        const day = new Date(session.createdAt)
        day.setHours(0, 0, 0, 0)
        const key = day.getTime()

        if (!visitDevices.has(key)) {
            visitDevices.set(key, new Set())
        }
        visitDevices.get(key)!.add(session.deviceId)
        visitSessions.set(key, (visitSessions.get(key) ?? 0) + 1)
    }

    totalUsers.value = totalData.total.toLocaleString()
    todayNew.value = (userCounts.get(days[days.length - 1].getTime()) ?? 0).toLocaleString()
    totalVisits.value = behaviorData.sessionCount.toLocaleString()
    totalVisitors.value = behaviorData.deviceCount.toLocaleString()

    userChartLabels.value = chartLabels
    userChartValues.value = days.map((day) => userCounts.get(day.getTime()) ?? 0)

    visitChartLabels.value = chartLabels
    visitDeviceValues.value = days.map((day) => visitDevices.get(day.getTime())?.size ?? 0)
    visitSessionValues.value = days.map((day) => visitSessions.get(day.getTime()) ?? 0)

    regionLabels.value = behaviorData.regions.map((item) => item.key)
    regionValues.value = behaviorData.regions.map((item) => item.count)

    const eventCountMap = new Map(behaviorData.mediaClickEvents.map((item) => [item.eventName, item.count]))
    mediaChartLabels.value = MEDIA_PLATFORMS.map((platform) => platform.label)

    const mediaValues: number[] = []
    for (const platform of MEDIA_PLATFORMS) {
        let count = 0
        for (const eventName of platform.events) {
            count += eventCountMap.get(eventName) ?? 0
        }
        mediaValues.push(count)
    }
    mediaChartValues.value = mediaValues
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
