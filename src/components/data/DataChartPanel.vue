<template>
    <section class="data-chart-panel">
        <div class="data-chart-panel__stats">
            <article class="data-chart-panel__stat">
                <span class="data-chart-panel__stat-label">Total Users</span>
                <strong class="data-chart-panel__stat-value">{{ totalUsers }}</strong>
            </article>
            <article class="data-chart-panel__stat">
                <span class="data-chart-panel__stat-label">Today's New Users</span>
                <strong class="data-chart-panel__stat-value">{{ todayNew }}</strong>
            </article>
            <article class="data-chart-panel__stat">
                <span class="data-chart-panel__stat-label">Total Visitors</span>
                <strong class="data-chart-panel__stat-value">{{ totalVisitors }}</strong>
            </article>
            <article class="data-chart-panel__stat">
                <span class="data-chart-panel__stat-label">Total Visits</span>
                <strong class="data-chart-panel__stat-value">{{ totalVisits }}</strong>
            </article>
        </div>

        <div class="data-chart-panel__row">
            <article class="data-chart-panel__panel">
                <header class="data-chart-panel__header">
                    <h2 class="data-chart-panel__title">New Users</h2>
                    <span class="data-chart-panel__meta">Last 15 days</span>
                </header>
                <div ref="userChartRef" class="data-chart-panel__chart" />
            </article>

            <article class="data-chart-panel__panel">
                <header class="data-chart-panel__header">
                    <h2 class="data-chart-panel__title">Media Clicks</h2>
                    <span class="data-chart-panel__meta">Last 15 days</span>
                </header>
                <div ref="mediaChartRef" class="data-chart-panel__chart" />
            </article>
        </div>

        <div class="data-chart-panel__row">
            <article class="data-chart-panel__panel">
                <header class="data-chart-panel__header">
                    <h2 class="data-chart-panel__title">Visits</h2>
                    <span class="data-chart-panel__meta">Last 15 days</span>
                </header>
                <div ref="visitChartRef" class="data-chart-panel__chart" />
            </article>

            <article class="data-chart-panel__panel">
                <header class="data-chart-panel__header">
                    <h2 class="data-chart-panel__title">Regions</h2>
                    <span class="data-chart-panel__meta">Last 15 days</span>
                </header>
                <div ref="regionChartRef" class="data-chart-panel__chart" />
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use, init, type ECharts } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
    loading: boolean
    totalUsers: string
    todayNew: string
    totalVisitors: string
    totalVisits: string
    userChartLabels: string[]
    userChartValues: number[]
    visitChartLabels: string[]
    visitDeviceValues: number[]
    visitSessionValues: number[]
    regionLabels: string[]
    regionValues: number[]
    mediaChartLabels: string[]
    mediaChartValues: number[]
}>()

const userChartRef = ref<HTMLDivElement | null>(null)
const mediaChartRef = ref<HTMLDivElement | null>(null)
const visitChartRef = ref<HTMLDivElement | null>(null)
const regionChartRef = ref<HTMLDivElement | null>(null)
const userChart = ref<ECharts | null>(null)
const mediaChart = ref<ECharts | null>(null)
const visitChart = ref<ECharts | null>(null)
const regionChart = ref<ECharts | null>(null)

const getCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const chartColors = computed(() => [
    getCssVar('--color-primary'),
    getCssVar('--color-text-secondary'),
])

const baseTextStyle = computed(() => ({
    color: getCssVar('--color-text-secondary'),
    fontFamily: getCssVar('--font-sans'),
}))

const buildCategoryAxis = (labels: string[], rotate = 0) => ({
    type: 'category' as const,
    data: labels,
    axisTick: { show: false },
    axisLine: { lineStyle: { color: getCssVar('--color-border') } },
    axisLabel: rotate
        ? { interval: 0, rotate, align: 'right' as const, verticalAlign: 'top' as const }
        : { interval: 0 },
})

const buildValueAxis = () => ({
    type: 'value' as const,
    minInterval: 1,
    axisLine: { show: false },
    splitLine: { lineStyle: { color: getCssVar('--color-border') } },
})

const userChartOption = computed(() => ({
    color: [chartColors.value[0]],
    grid: {
        top: 24,
        right: 16,
        bottom: 32,
        left: 44,
        containLabel: true,
    },
    tooltip: { trigger: 'axis' },
    textStyle: baseTextStyle.value,
    xAxis: buildCategoryAxis(props.userChartLabels, 30),
    yAxis: buildValueAxis(),
    series: [
        {
            type: 'bar',
            data: props.userChartValues,
            barMaxWidth: 28,
            itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
    ],
}))

const visitChartOption = computed(() => ({
    color: chartColors.value,
    grid: {
        top: 40,
        right: 16,
        bottom: 32,
        left: 44,
        containLabel: true,
    },
    legend: {
        top: 0,
        right: 0,
    },
    tooltip: { trigger: 'axis' },
    textStyle: baseTextStyle.value,
    xAxis: buildCategoryAxis(props.visitChartLabels, 30),
    yAxis: buildValueAxis(),
    series: [
        {
            name: 'Visitors',
            type: 'bar',
            data: props.visitDeviceValues,
            barMaxWidth: 28,
            itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
        {
            name: 'Visits',
            type: 'bar',
            data: props.visitSessionValues,
            barMaxWidth: 28,
            itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
    ],
}))

const regionChartOption = computed(() => ({
    color: [chartColors.value[0]],
    grid: {
        top: 24,
        right: 16,
        bottom: 32,
        left: 44,
        containLabel: true,
    },
    tooltip: { trigger: 'axis' },
    textStyle: baseTextStyle.value,
    xAxis: buildCategoryAxis(props.regionLabels),
    yAxis: buildValueAxis(),
    series: [
        {
            type: 'bar',
            data: props.regionValues,
            barMaxWidth: 28,
            itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
    ],
}))

const mediaChartOption = computed(() => ({
    color: [chartColors.value[0]],
    grid: {
        top: 24,
        right: 16,
        bottom: 32,
        left: 44,
        containLabel: true,
    },
    tooltip: { trigger: 'axis' },
    textStyle: baseTextStyle.value,
    xAxis: buildCategoryAxis(props.mediaChartLabels),
    yAxis: buildValueAxis(),
    series: [
        {
            type: 'bar',
            data: props.mediaChartValues,
            barMaxWidth: 28,
            itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
    ],
}))

const renderCharts = () => {
    if (props.loading) return

    if (userChartRef.value) {
        if (!userChart.value) {
            userChart.value = init(userChartRef.value)
        }
        userChart.value.setOption(userChartOption.value, { notMerge: true })
    }

    if (mediaChartRef.value) {
        if (!mediaChart.value) {
            mediaChart.value = init(mediaChartRef.value)
        }
        mediaChart.value.setOption(mediaChartOption.value, { notMerge: true })
    }

    if (visitChartRef.value) {
        if (!visitChart.value) {
            visitChart.value = init(visitChartRef.value)
        }
        visitChart.value.setOption(visitChartOption.value, { notMerge: true })
    }

    if (regionChartRef.value) {
        if (!regionChart.value) {
            regionChart.value = init(regionChartRef.value)
        }
        regionChart.value.setOption(regionChartOption.value, { notMerge: true })
    }
}

watch(
    () => [userChartOption.value, mediaChartOption.value, visitChartOption.value, regionChartOption.value, props.loading] as const,
    () => {
        renderCharts()
    },
    { deep: true, flush: 'post' },
)

onMounted(() => {
    renderCharts()
    window.addEventListener('resize', () => {
        userChart.value?.resize()
        mediaChart.value?.resize()
        visitChart.value?.resize()
        regionChart.value?.resize()
    })
})

onBeforeUnmount(() => {
    userChart.value?.dispose()
    mediaChart.value?.dispose()
    visitChart.value?.dispose()
    regionChart.value?.dispose()
    userChart.value = null
    mediaChart.value = null
    visitChart.value = null
    regionChart.value = null
})
</script>

<style scoped lang="scss">
.data-chart-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.data-chart-panel__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
}

.data-chart-panel__row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}

.data-chart-panel__stat,
.data-chart-panel__panel {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
}

.data-chart-panel__stat {
    min-height: 7rem;
    padding: 1rem;
}

.data-chart-panel__stat-label,
.data-chart-panel__meta {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
}

.data-chart-panel__stat-value {
    display: block;
    margin-top: 0.5rem;
    color: var(--color-text);
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
}

.data-chart-panel__panel {
    min-width: 0;
    padding: 1rem;
}

.data-chart-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.data-chart-panel__title {
    margin: 0;
    color: var(--color-text);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
}

.data-chart-panel__chart {
    width: 100%;
    height: 20rem;
}

@media (width <=640px) {
    .data-chart-panel__stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .data-chart-panel__row {
        grid-template-columns: 1fr;
    }
}
</style>
