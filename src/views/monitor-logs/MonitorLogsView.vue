<template>
    <div class="data-list-view">
        <DataFilter
            v-model:filter-values="filterValues"
            :fields="filterFields"
            :loading="loading"
            @search="search"
            @reset="resetFilters"
        />
        <MonitorLogCard
            :columns="columns"
            :rows="rows"
            :loading="loading"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getMonitorLogsTrace } from '@/api/data'
import DataFilter from '@/components/data/DataFilter.vue'
import MonitorLogCard from '@/components/data/MonitorLogCard.vue'
import { useAlert } from '@/composables'
import { DATA_CENTER_TABLES } from '@/configs/data'
import { useRegionStore } from '@/stores'
import { ApiError } from '@/types/api'
import type { MonitorSpan } from '@/types/data'

const { show } = useAlert()
const regionStore = useRegionStore()

const table = DATA_CENTER_TABLES.monitorLogs
const filterFields = table.filter
const columns = ['traceId', 'spanId', 'parentSpanId', 'env', 'service', 'instanceId', 'eventName', 'status', 'startTimeMs', 'durationMs', 'error', 'traceAttributes', 'metadata']
const filterValues = ref<Record<string, string>>({})
const rows = ref<Record<string, string>[]>([])
const loading = ref(false)

const fetchData = async () => {
    const id = (filterValues.value.traceId ?? '').trim()
    if (!id || loading.value) return

    loading.value = true

    let data
    try {
        data = await getMonitorLogsTrace({
            region: regionStore.region,
            traceId: id,
        })
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
        if (span.parentSpanId) {
            childByParent.set(span.parentSpanId, span)
        }
    }

    const ordered: MonitorSpan[] = []
    let current = data.spans.find((span) => !span.parentSpanId || span.parentSpanId === 'root')
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
        eventName: span.eventName || '-',
        status: span.status || '-',
        startTimeMs: Number.isFinite(Number(span.startTimeMs))
            ? new Date(Number(span.startTimeMs)).toLocaleString()
            : '-',
        durationMs: Number.isFinite(Number(span.durationMs)) ? `${span.durationMs}ms` : '-',
        error: span.error || '-',
        traceAttributes: span.traceAttributes && typeof span.traceAttributes === 'object' && Object.keys(span.traceAttributes).length > 0
            ? JSON.stringify(span.traceAttributes, null, 2)
            : '-',
        metadata: span.metadata && typeof span.metadata === 'object' && Object.keys(span.metadata).length > 0
            ? JSON.stringify(span.metadata, null, 2)
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
}

watch(() => regionStore.region, () => {
    rows.value = []
})
</script>
