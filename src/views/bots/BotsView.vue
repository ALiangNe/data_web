<template>
    <div class="data-list-view">
        <DataFilter
            v-model:filter-values="filterValues"
            v-model:time-range-values="timeRangeValues"
            :fields="filterFields"
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
            @update:page-size="onPageSizeChange"
            @prev="prevPage"
            @next="nextPage"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getBots } from '@/api/data'
import DataFilter from '@/components/data/DataFilter.vue'
import DataPagination from '@/components/data/DataPagination.vue'
import DataTable from '@/components/data/DataTable.vue'
import { useAlert } from '@/composables'
import { DATA_CENTER_TABLES } from '@/configs/data'
import { ApiError } from '@/types/api'
import type { DataCenterSortFieldFor, DataTimeRangeFieldValues } from '@/types/data'

const { show } = useAlert()

const table = DATA_CENTER_TABLES.bots
const pageSizeOptions = [5, 10, 20]
const filterFields = table.filter
const sortableFields = table.sortFields
const timeRangeFields = table.timeRangeFields
const filterValues = ref<Record<string, string>>({})
const timeRangeValues = ref<Record<string, DataTimeRangeFieldValues>>({})
const sortField = ref<DataCenterSortFieldFor<'bots'>>(table.sortFields[0])
const sortOrder = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(20)
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
        const start = (range.startTime ?? '').trim()
        const end = (range.endTime ?? '').trim()
        if (!start && !end) continue

        timeRangeFilters[field] = [
            start ? new Date(start).toISOString() : '',
            end ? new Date(end).toISOString() : '',
        ]
    }

    let data
    try {
        data = await getBots({
            ...filters,
            ...timeRangeFilters,
            page: page.value,
            pageSize: pageSize.value,
            sortBy: sortField.value,
            order: sortOrder.value,
        })
    } catch (error) {
        console.error('BotsView fetch failed:', error)
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
            else if (key === 'createdAt' || key === 'updatedAt' || key === 'registeredAt' || key === 'activatedAt') formatted[key] = new Date(value as string).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
            else if (key === 'metadata') formatted[key] = JSON.stringify(value)
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
}

const search = () => {
    page.value = 1
    fetchData()
}

const resetFilters = () => {
    filterValues.value = {}
    timeRangeValues.value = {}
    sortField.value = table.sortFields[0]
    sortOrder.value = 'desc'
    page.value = 1
    fetchData()
}

const prevPage = () => {
    if (page.value <= 1 || loading.value) return
    page.value -= 1
    fetchData()
}

const nextPage = () => {
    if (page.value * pageSize.value >= total.value || loading.value) return
    page.value += 1
    fetchData()
}

const onPageSizeChange = (value: number) => {
    pageSize.value = value
    page.value = 1
    fetchData()
}

const onSortColumn = (col: string) => {
    if (loading.value) return
    if (!sortableFields.includes(col as DataCenterSortFieldFor<'bots'>)) return
    if (col === sortField.value) {
        sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
    } else {
        sortField.value = col as DataCenterSortFieldFor<'bots'>
        sortOrder.value = 'desc'
    }
    page.value = 1
    fetchData()
}

onMounted(() => {
    fetchData()
})
</script>
