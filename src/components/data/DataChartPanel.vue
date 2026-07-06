<template>
    <section class="data-chart-panel">
        <div class="data-chart-panel__stats">
            <article v-for="item in stats" :key="item.label" class="data-chart-panel__stat">
                <span class="data-chart-panel__stat-label">{{ item.label }}</span>
                <strong class="data-chart-panel__stat-value">{{ loading ? '-' : item.value }}</strong>
            </article>
        </div>

        <article class="data-chart-panel__panel">
            <header class="data-chart-panel__header">
                <h2 class="data-chart-panel__title">New Users</h2>
                <span class="data-chart-panel__meta">Last 7 days</span>
            </header>
            <div ref="chartRef" class="data-chart-panel__chart" />
        </article>
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { use, init, type ECharts } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
    stats: {
        label: string
        value: string
    }[]
    labels: string[]
    values: number[]
    loading: boolean
}>()

const chartRef = ref<HTMLDivElement | null>(null)
const chart = ref<ECharts | null>(null)

const getCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const chartOption = computed(() => ({
    color: [getCssVar('--color-primary')],
    grid: {
        top: 24,
        right: 16,
        bottom: 32,
        left: 44,
        containLabel: true,
    },
    tooltip: {
        trigger: 'axis',
    },
    textStyle: {
        color: getCssVar('--color-text-secondary'),
        fontFamily: getCssVar('--font-sans'),
    },
    xAxis: {
        type: 'category',
        data: props.labels,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: getCssVar('--color-border') } },
        axisLabel: { interval: 0 },
    },
    yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: getCssVar('--color-border') } },
    },
    series: [
        {
            type: 'bar',
            data: props.values,
            barMaxWidth: 28,
            itemStyle: {
                borderRadius: [4, 4, 0, 0],
            },
        },
    ],
}))

const renderChart = () => {
    if (props.loading || !chartRef.value) return

    if (!chart.value) {
        chart.value = init(chartRef.value)
    }

    chart.value.setOption(chartOption.value, { notMerge: true })
}

watch(
    () => [chartOption.value, props.loading] as const,
    () => {
        renderChart()
    },
    { deep: true, flush: 'post' },
)

onMounted(() => {
    renderChart()
    window.addEventListener('resize', () => chart.value?.resize())
})

onBeforeUnmount(() => {
    chart.value?.dispose()
    chart.value = null
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
        grid-template-columns: 1fr;
    }
}
</style>
