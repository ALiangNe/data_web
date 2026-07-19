<template>
    <div class="data-list-view">
        <DataFilter
            v-model:filter-values="filterValues"
            v-model:select-values="selectValues"
            :fields="filterFields"
            :select-fields="selectFields"
            :loading="loading"
            @search="search"
            @reset="resetFilters"
        />
        <DataTable
            :columns="columns"
            :rows="rows"
            :loading="loading"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getDataLookup } from '@/api/common'
import DataFilter from '@/components/common/DataFilter.vue'
import DataTable from '@/components/common/DataTable.vue'
import { useAlert } from '@/composables'
import { DATA_LOOKUP_TABLES } from '@/configs/data'
import { useRegionStore } from '@/stores'
import { ApiError } from '@/types/api'
import type { DataLookupEntity, DataSelectFieldConfig } from '@/types'

const { show } = useAlert()
const regionStore = useRegionStore()

const selectFields: Record<string, DataSelectFieldConfig> = {
    entity: {
        label: 'entity',
        default: '',
        options: (Object.keys(DATA_LOOKUP_TABLES) as DataLookupEntity[]).map((key) => ({
            label: key,
            value: key,
        })),
    },
}
const filterValues = ref<Record<string, string>>({})
const selectValues = ref<{ entity: string }>({ entity: selectFields.entity.default })
const rows = ref<Record<string, string>[]>([])
const loading = ref(false)
const columns = computed(() => rows.value[0] ? Object.keys(rows.value[0]) : [])

const filterFields = computed(() => {
    if (selectValues.value.entity === 'monitorLogs') return ['spanId']
    if (selectValues.value.entity === 'userBehaviorLogs') return ['sessionId']
    return ['ids']
})

const fetchData = async () => {
    const entity = selectValues.value.entity.trim()
    if (!entity) {
        show('Please select an entity.', 'error')
        return
    }

    const ids = (filterValues.value[filterFields.value[0]] ?? '').split(',').map((v) => v.trim()).filter(Boolean)
    if (ids.length === 0) {
        show(`Please enter at least one ${filterFields.value[0]}.`, 'error')
        return
    }

    loading.value = true

    let data
    try {
        data = await getDataLookup({
            region: regionStore.region,
            entity: entity as DataLookupEntity,
            ids,
        })
    } catch (error) {
        console.error('DataLookupView fetch failed:', error)
        rows.value = []
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load data. Please try again.'
        show(message, 'error')
        loading.value = false
        return
    }

    rows.value = data.map((row) => {
        const formatted: Record<string, string> = {}
        for (const [key, value] of Object.entries(row)) {
            if (value == null) formatted[key] = '-'
            else if (value instanceof Date) formatted[key] = value.toISOString()
            else if (typeof value === 'object') formatted[key] = JSON.stringify(value)
            else formatted[key] = String(value)
        }
        return formatted
    })

    loading.value = false
}

const search = () => {
    fetchData()
}

const resetFilters = () => {
    filterValues.value = {}
    selectValues.value = { entity: selectFields.entity.default }
    rows.value = []
}

watch(() => regionStore.region, () => {
    rows.value = []
})
</script>
