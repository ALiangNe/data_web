<template>
    <div class="data-list-view">
        <DataFilter v-model:filter-values="filterValues" v-model:time-range-values="timeRangeValues"
            :fields="filterFields" :time-range-fields="timeRangeFields" :loading="loading" show-time-range
            @search="search" @reset="resetFilters" />
        <DataTable :columns="traceColumns" :rows="traceRows" :sortable-fields="sortableFields" :sort-field="sortField"
            :sort-order="sortOrder" :loading="loading" clickable @sort-column="onSortColumn" @row-click="selectTrace" />
        <DataPagination :page="page" :page-size="pageSize" :page-size-options="pageSizeOptions" :total="total"
            :loading="loading" @update:page-size="onPageSizeChange" @prev="prevPage" @next="nextPage" />
        <DataTable v-if="selectedTraceId" :columns="spanColumns" :rows="spanRows" :sortable-fields="[]" sort-field=""
            sort-order="desc" :loading="spanLoading" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMonitorLogsTrace, getMonitorLogsTraces } from '@/api/data'
import DataFilter from '@/components/data/DataFilter.vue'
import DataPagination from '@/components/data/DataPagination.vue'
import DataTable from '@/components/data/DataTable.vue'
import { useAlert } from '@/composables'
import { DATA_CENTER_TABLES } from '@/configs/data'
import { ApiError } from '@/types/api'
import type { DataCenterSortFieldFor, DataTimeRangeFieldValues, MonitorLogsTracesQuery } from '@/types/data'

const { show } = useAlert()

const table = DATA_CENTER_TABLES.monitorLogs
const pageSizeOptions = [5, 10, 20]
const filterFields = table.filter
const sortableFields = table.sortFields
const timeRangeFields = table.timeRangeFields
const traceColumns = ['traceId', 'chain', 'serviceCount', 'durationMs', 'status','startTimeMs']
const spanColumns = ['spanId', 'parentSpanId', 'env', 'service', 'instanceId', 'name', 'status', 'botId', 'soulId', 'startTimeMs', 'durationMs', 'error', 'meta']
const filterValues = ref<Record<string, string>>({})
const timeRangeValues = ref<Record<string, DataTimeRangeFieldValues>>({})
const sortField = ref<DataCenterSortFieldFor<'monitorLogs'>>(table.sortFields[0])
const sortOrder = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(5)
const total = ref(0)
const traceRows = ref<Record<string, string>[]>([])
const spanRows = ref<Record<string, string>[]>([])
const selectedTraceId = ref('')
const loading = ref(false)
const spanLoading = ref(false)

const formatDuration = (durationMs: number) => `${(durationMs / 1000).toFixed(2)}s`

const fetchTraces = async () => {
    loading.value = true

    const params: MonitorLogsTracesQuery = {
        page: page.value,
        pageSize: pageSize.value,
        sortBy: sortField.value as MonitorLogsTracesQuery['sortBy'],
        order: sortOrder.value,
    }

    const traceId = (filterValues.value.traceId ?? '').trim()
    if (traceId) params.traceId = traceId

    const range = timeRangeValues.value.startTimeMs
    const start = (range?.startTime ?? '').trim()
    const end = (range?.endTime ?? '').trim()
    if (start) params.startTimeStart = String(new Date(start).getTime())
    if (end) params.startTimeEnd = String(new Date(end).getTime())

    let data
    try {
        data = await getMonitorLogsTraces(params)
    } catch (error) {
        console.error('MonitorLogsView fetch failed:', error)
        traceRows.value = []
        total.value = 0
        selectedTraceId.value = ''
        spanRows.value = []
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load data. Please try again.'
        show(message, 'error')
        loading.value = false
        return
    }

    total.value = data.total
    traceRows.value = data.list.map((row) => ({
        traceId: row.traceId,
        startTimeMs: new Date(Number(row.startTimeMs)).toLocaleString(),
        chain: row.chain.join(' -> '),
        serviceCount: String(row.serviceCount),
        durationMs: formatDuration(Number(row.durationMs)),
        status: row.status,
    }))

    const maxPage = Math.max(1, Math.ceil(data.total / pageSize.value))
    if (page.value > maxPage) {
        page.value = maxPage
        loading.value = false
        return fetchTraces()
    }

    if (selectedTraceId.value && !traceRows.value.some((row) => row.traceId === selectedTraceId.value)) {
        selectedTraceId.value = ''
        spanRows.value = []
    }

    loading.value = false
}

const fetchSpans = async (traceId: string) => {
    spanLoading.value = true

    let data
    try {
        data = await getMonitorLogsTrace(traceId)
    } catch (error) {
        console.error('MonitorLogsView fetch spans failed:', error)
        spanRows.value = []
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load spans. Please try again.'
        show(message, 'error')
        spanLoading.value = false
        return
    }

    spanRows.value = data?.spans.map((span) => {
        const formatted: Record<string, string> = {
            spanId: span.spanId,
            parentSpanId: span.parentSpanId,
            env: span.env,
            service: span.service,
            instanceId: span.instanceId,
            name: span.name,
            status: span.status,
            botId: span.botId ?? '-',
            soulId: span.soulId ?? '-',
            startTimeMs: new Date(Number(span.startTimeMs)).toLocaleString(),
            durationMs: formatDuration(Number(span.durationMs)),
            error: span.error ?? '-',
            meta: span.meta ? JSON.stringify(span.meta) : '-',
        }
        return formatted
    })

    spanLoading.value = false
}

const selectTrace = (row: Record<string, string>) => {
    if (loading.value || spanLoading.value) return
    selectedTraceId.value = row.traceId
    fetchSpans(row.traceId)
}

const search = () => {
    page.value = 1
    selectedTraceId.value = ''
    spanRows.value = []
    fetchTraces()
}

const resetFilters = () => {
    filterValues.value = {}
    timeRangeValues.value = {}
    sortField.value = table.sortFields[0]
    sortOrder.value = 'desc'
    page.value = 1
    selectedTraceId.value = ''
    spanRows.value = []
    fetchTraces()
}

const prevPage = () => {
    if (page.value <= 1 || loading.value) return
    page.value -= 1
    fetchTraces()
}

const nextPage = () => {
    if (page.value * pageSize.value >= total.value || loading.value) return
    page.value += 1
    fetchTraces()
}

const onPageSizeChange = (value: number) => {
    pageSize.value = value
    page.value = 1
    fetchTraces()
}

const onSortColumn = (col: string) => {
    if (loading.value) return
    if (!sortableFields.includes(col as DataCenterSortFieldFor<'monitorLogs'>)) return
    if (col === sortField.value) {
        sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
    } else {
        sortField.value = col as DataCenterSortFieldFor<'monitorLogs'>
        sortOrder.value = 'desc'
    }
    page.value = 1
    fetchTraces()
}

onMounted(() => {
    fetchTraces()
})
</script>
