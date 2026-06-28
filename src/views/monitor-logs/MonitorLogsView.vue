<template>
    <div class="data-list-view">
        <DataFilter
            v-model:filter-values="filterValues"
            :fields="filterFields"
            :time-range-fields="[]"
            :time-range-values="{}"
            :show-time-range="false"
            :loading="loading"
            @search="search"
            @reset="resetFilters"
        />
        <MonitorLogCard
            :columns="columns"
            :rows="rows"
            :loading="loading"
            :has-queried="hasQueried"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getMonitorLogsTrace } from '@/api/data'
import DataFilter from '@/components/data/DataFilter.vue'
import MonitorLogCard from '@/components/data/MonitorLogCard.vue'
import { useAlert } from '@/composables'
import { DATA_CENTER_TABLES } from '@/configs/data'
import { ApiError } from '@/types/api'
import type { MonitorSpan } from '@/types/data'

const { show } = useAlert()

const table = DATA_CENTER_TABLES.monitorLogs
const filterFields = table.filter
const columns = ['traceId', 'spanId', 'parentSpanId', 'env', 'service', 'instanceId', 'name', 'status', 'botId', 'soulId', 'startTimeMs', 'durationMs', 'error', 'meta']
const filterValues = ref<Record<string, string>>({})
const rows = ref<Record<string, string>[]>([])
const loading = ref(false)
const hasQueried = ref(false)

const fetchData = async () => {
    const id = (filterValues.value.traceId ?? '').trim()
    if (!id || loading.value) return

    loading.value = true
    hasQueried.value = true

    let data
    try {
        data = await getMonitorLogsTrace(id)
    } catch (error) {
        console.error('MonitorLogsView fetch failed:', error)
        rows.value = []
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load spans. Please try again.'
        show(message, 'error')
        loading.value = false
        return
    }

    if (!data || !Array.isArray(data.spans) || data.spans.length === 0) {
        rows.value = []
        loading.value = false
        show('Query successful.', 'success')
        return
    }

    const childByParent = new Map<string, MonitorSpan>()
    for (const span of data.spans) {
        childByParent.set(span.parentSpanId, span)
    }

    const ordered: MonitorSpan[] = []
    let current = data.spans.find((span) => span.parentSpanId === 'root')
    for (let i = 0; i < data.spans.length && current; i++) {
        ordered.push(current)
        current = childByParent.get(current.spanId)
    }

    const spans = ordered.length ? ordered : data.spans
    rows.value = spans.map((span) => ({
        traceId: id,
        spanId: span.spanId || '-',
        parentSpanId: span.parentSpanId || '-',
        env: span.env || '-',
        service: span.service || '-',
        instanceId: span.instanceId || '-',
        name: span.name || '-',
        status: span.status || '-',
        botId: span.botId || '-',
        soulId: span.soulId || '-',
        startTimeMs: Number.isFinite(Number(span.startTimeMs))
            ? new Date(Number(span.startTimeMs)).toLocaleString()
            : '-',
        durationMs: Number.isFinite(Number(span.durationMs)) ? `${span.durationMs}ms` : '-',
        error: span.error || '-',
        meta: span.meta && typeof span.meta === 'object' && Object.keys(span.meta).length > 0
            ? JSON.stringify(span.meta, null, 2)
            : '-',
    }))

    loading.value = false
    show('Query successful.', 'success')
}

const search = () => {
    fetchData()
}

const resetFilters = () => {
    filterValues.value = {}
    rows.value = []
    hasQueried.value = false
}
</script>
