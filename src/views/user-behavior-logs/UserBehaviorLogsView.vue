<template>
    <div class="data-list-view">
        <DataFilter
            v-model:filter-values="filterValues"
            v-model:select-values="selectValues"
            v-model:time-range-values="timeRangeValues"
            :fields="filterFields"
            :select-fields="selectFields"
            :time-range-fields="timeRangeFields"
            :loading="loading"
            show-time-range
            @search="search"
            @reset="resetFilters"
        />
        <DataTable
            :columns="columns"
            :rows="rows"
            :sortable-fields="sortableFields"
            :sort-field="sortField"
            :sort-order="sortOrder"
            :loading="loading"
            @sort-column="onSortColumn"
        />
        <DataPagination
            :page="page"
            :page-size="pageSize"
            :page-size-options="pageSizeOptions"
            :total="total"
            :loading="loading"
            @update:page="onPageChange"
            @update:page-size="onPageSizeChange"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getUserBehaviorLogs } from '@/api/data'
import DataFilter from '@/components/data/DataFilter.vue'
import DataPagination from '@/components/data/DataPagination.vue'
import DataTable from '@/components/data/DataTable.vue'
import { useAlert } from '@/composables'
import { DATA_CENTER_TABLES } from '@/configs/data'
import { useRegionStore } from '@/stores'
import { ApiError } from '@/types/api'
import type { DataCenterSortFieldFor, DataTimeRangeFieldValues, UserBehaviorLogAggregateBy } from '@/types/data'

const { show } = useAlert()
const regionStore = useRegionStore()

const table = DATA_CENTER_TABLES.userBehaviorLogs
const pageSizeOptions = [5, 10, 20]
const sortableFields = table.sortFields
const filterFields = table.filter
const timeRangeFields = table.timeRangeFields
const selectFields = table.selectFields
const filterValues = ref<Record<string, string>>({})
const selectValues = ref<{ aggregateBy: UserBehaviorLogAggregateBy }>({ aggregateBy: selectFields.aggregateBy.default })
const timeRangeValues = ref<Record<string, DataTimeRangeFieldValues>>({})
const sortField = ref<DataCenterSortFieldFor<'userBehaviorLogs'>>(table.sortFields[0])
const sortOrder = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const rows = ref<Record<string, string>[]>([])
const loading = ref(false)
const columns = computed(() => rows.value[0] ? Object.keys(rows.value[0]) : [])

const fetchData = async () => {
    loading.value = true

    const filters: Record<string, string> = {}
    for (const [key, rawValue] of Object.entries(filterValues.value)) {
        const v = rawValue.trim()
        if (!v) continue
        filters[key] = v
    }

    const timeRangeFilters: Record<string, [string, string]> = {}
    for (const [field, range] of Object.entries(timeRangeValues.value)) {
        if (!range) continue
        const [start, end] = range
        const startTrim = start.trim()
        const endTrim = end.trim()
        if (!startTrim && !endTrim) continue

        timeRangeFilters[field] = [
            startTrim ? new Date(startTrim).toISOString() : '',
            endTrim ? new Date(endTrim).toISOString() : '',
        ]
    }

    let data
    try {
        data = await getUserBehaviorLogs({
            aggregateBy: selectValues.value.aggregateBy,
            ...filters,
            ...timeRangeFilters,
            region: regionStore.region,
            page: page.value,
            pageSize: pageSize.value,
            order: sortOrder.value,
        })
    } catch (error) {
        console.error('UserBehaviorLogsView fetch failed:', error)
        rows.value = []
        total.value = 0
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load data. Please try again.'
        show(message, 'error')
        loading.value = false
        return
    }

    total.value = data.total
    rows.value = data.list.map((row) => {
        const formatted: Record<string, string> = {}
        for (const [key, value] of Object.entries(row)) {
            if (value == null) formatted[key] = '-'
            else if (key === 'createdAt') formatted[key] = new Date(value as string).toLocaleString()
            else if (Array.isArray(value)) {
                formatted[key] = value.length
                    ? value.map((item: { value: string, count?: number }) => {
                        if (key === 'eventTypes' || key === 'eventNames') {
                            return `${item.value} (${item.count})`
                        }
                        return item.value
                    }).join(',\n')
                    : '-'
            }
            else formatted[key] = String(value)
        }
        return formatted
    })

    const maxPage = Math.max(1, Math.ceil(data.total / pageSize.value))
    if (page.value > maxPage) {
        page.value = maxPage
        loading.value = false
        return fetchData()
    }

    loading.value = false
    show('Data loaded successfully.', 'success')
}

const search = () => {
    page.value = 1
    fetchData()
}

const resetFilters = () => {
    filterValues.value = {}
    selectValues.value = { aggregateBy: selectFields.aggregateBy.default }
    timeRangeValues.value = {}
    sortField.value = table.sortFields[0]
    sortOrder.value = 'desc'
    page.value = 1
    fetchData()
}

const onPageChange = (value: number) => {
    if (loading.value) return
    if (value > page.value && page.value * pageSize.value >= total.value) return
    page.value = value
    fetchData()
}

const onPageSizeChange = (value: number) => {
    pageSize.value = value
    page.value = 1
    fetchData()
}

const onSortColumn = (col: string) => {
    if (loading.value) return
    if (!sortableFields.includes(col as DataCenterSortFieldFor<'userBehaviorLogs'>)) return
    if (col === sortField.value) {
        sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
    } else {
        sortField.value = col as DataCenterSortFieldFor<'userBehaviorLogs'>
        sortOrder.value = 'desc'
    }
    page.value = 1
    fetchData()
}

onMounted(() => {
    fetchData()
})

watch(() => regionStore.region, () => {
    page.value = 1
    fetchData()
})
</script>
