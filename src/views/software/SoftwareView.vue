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
        >
            <template #actions-before>
                <button type="button" :disabled="loading" @click="openUploadModal">
                    Upload Software
                </button>
            </template>
        </DataFilter>
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
        <DataModal
            :open="uploadModalOpen"
            title="Upload Software"
            :help="uploadHelp"
            max-width="56rem"
            @close="closeUploadModal"
        >
            <SoftwareForm
                :disabled="submitting"
                :loading-version="loadingVersion"
                :allow-custom-version="allowCustomVersion"
                :version-options="versionOptions"
                :dependency-packages="dependencyPackages"
                @request-version="onRequestVersion"
                @request-dependency-versions="onRequestDependencyVersions"
                @submit="onSubmit"
            />
        </DataModal>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { completeUpload, getSoftwareVersions, getUploadPost, listSoftware } from '@/api/software'
import DataFilter from '@/components/data/DataFilter.vue'
import DataModal from '@/components/data/DataModal.vue'
import DataPagination from '@/components/data/DataPagination.vue'
import DataTable from '@/components/data/DataTable.vue'
import SoftwareForm from '@/components/data/SoftwareForm.vue'
import { useAlert } from '@/composables'
import { DATA_CENTER_TABLES } from '@/configs/data'
import { ApiError } from '@/types/api'
import semver from 'semver'
import type { DataCenterSortFieldFor, DataTimeRangeFieldValues, SoftwareUploadPostParams } from '@/types/data'

type DependencyPackage = {
    name: string
    versionOptions: string[]
    publishedVersions: string[]
}

const { show } = useAlert()

const table = DATA_CENTER_TABLES.software
const pageSizeOptions = [5, 10, 20]
const filterFields = table.filter
const sortableFields = table.sortFields
const timeRangeFields = table.timeRangeFields
const filterValues = ref<Record<string, string>>({})
const timeRangeValues = ref<Record<string, DataTimeRangeFieldValues>>({})
const sortField = ref<DataCenterSortFieldFor<'software'>>(table.sortFields[0])
const sortOrder = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const rows = ref<Record<string, string>[]>([])
const loading = ref(false)

const uploadModalOpen = ref(false)
const submitting = ref(false)
const loadingVersion = ref(false)
const allowCustomVersion = ref(false)
const lastVersionName = ref('')
const versionOptions = ref<string[]>([])
const defaultVersion = 'v1.0.0'
const uploadHelp = [
    '1. ^ allows compatible updates: ^1.2.3 means >=1.2.3 <2.0.0; ^0.2.3 means >=0.2.3 <0.3.0 (0.x versions are unstable).',
    '2. ~ allows patch updates: ~1.2.3 means >=1.2.3 <1.3.0; ~1.2 means >=1.2.0 <1.3.0.',
    '3. "and" restricts the current range; "or" starts another range. "and" has higher priority: A or B and C means A or (B and C).',
].join('\n')

const columns = computed(() => rows.value[0] ? Object.keys(rows.value[0]) : [])

const dependencyPackages = ref<DependencyPackage[]>([])

const getNextVersionOptions = (latestVersion: string) => {
    const version = semver.valid(latestVersion)
    if (!version) return [defaultVersion]

    const majorVersion = semver.inc(version, 'major')
    const minorVersion = semver.inc(version, 'minor')
    const patchVersion = semver.inc(version, 'patch')
    if (!majorVersion || !minorVersion || !patchVersion) return [defaultVersion]

    return [`v${majorVersion}`, `v${minorVersion}`, `v${patchVersion}`]
}

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
        data = await listSoftware({
            ...filters,
            ...timeRangeFilters,
            page: page.value,
            pageSize: pageSize.value,
            sortBy: sortField.value,
            order: sortOrder.value,
        })
    } catch (error) {
        console.error('SoftwareView fetch failed:', error)
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
            else if (key === 'createdAt' || key === 'updatedAt') formatted[key] = new Date(value as string).toLocaleString()
            else if (key === 'dependencies' || key === 'metadata') formatted[key] = JSON.stringify(value)
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
    if (!sortableFields.includes(col as DataCenterSortFieldFor<'software'>)) return
    if (col === sortField.value) {
        sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
    } else {
        sortField.value = col as DataCenterSortFieldFor<'software'>
        sortOrder.value = 'desc'
    }
    page.value = 1
    fetchData()
}

const openUploadModal = async () => {
    uploadModalOpen.value = true

    let softwareResult
    try {
        softwareResult = await listSoftware({
            page: 1,
            pageSize: 100,
            sortBy: 'createdAt',
            order: 'desc',
        })
    } catch (error) {
        console.error('SoftwareView listSoftware dependency packages failed:', error)
        dependencyPackages.value = []
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load dependency packages. Please try again.'
        show(message, 'error')
        return
    }

    const names = [...new Set(
        softwareResult.list
            .map((software) => software.name.trim())
            .filter(Boolean),
    )]
    dependencyPackages.value = names.map((name) => ({ name, versionOptions: [], publishedVersions: [] }))
}

const closeUploadModal = () => {
    uploadModalOpen.value = false
    lastVersionName.value = ''
    versionOptions.value = []
    allowCustomVersion.value = false
    loadingVersion.value = false
    dependencyPackages.value = []
}

const onRequestVersion = async (name: string) => {
    if (!name) {
        lastVersionName.value = ''
        versionOptions.value = []
        allowCustomVersion.value = false
        return
    }
    if (name === lastVersionName.value) return

    lastVersionName.value = name
    versionOptions.value = []
    allowCustomVersion.value = false
    loadingVersion.value = true

    let softwareResult
    try {
        softwareResult = await getSoftwareVersions(name)
    } catch (error) {
        console.error('SoftwareView getSoftwareVersions failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load software version. Please try again.'
        show(message, 'error')
        lastVersionName.value = ''
        loadingVersion.value = false
        return
    }

    loadingVersion.value = false
    const latestVersion = softwareResult[0] ?? ''
    if (latestVersion) {
        versionOptions.value = getNextVersionOptions(latestVersion)
        allowCustomVersion.value = false
        return
    }

    versionOptions.value = []
    allowCustomVersion.value = true
}

const onRequestDependencyVersions = async (name: string) => {
    const packageItem = dependencyPackages.value.find((item) => item.name === name)
    if (!packageItem) return

    let versions
    try {
        versions = await getSoftwareVersions(name)
    } catch (error) {
        console.error('SoftwareView getSoftwareVersions dependency versions failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load dependency versions. Please try again.'
        show(message, 'error')
        return
    }

    const publishedVersions = versions
        .map((version) => semver.valid(version))
        .filter((version): version is string => !!version)
        .map((version) => `v${version}`)
        .sort((a, b) => semver.rcompare(a, b))
    const latestVersion = semver.valid(publishedVersions[0] ?? '')
    const versionOptions = [...publishedVersions]

    if (latestVersion) {
        const minorVersion = semver.inc(latestVersion, 'minor')
        const patchVersion = semver.inc(latestVersion, 'patch')
        if (patchVersion) versionOptions.unshift(`v${patchVersion}`)
        if (minorVersion) versionOptions.unshift(`v${minorVersion}`)
    }

    packageItem.publishedVersions = publishedVersions
    packageItem.versionOptions = [...new Set(versionOptions)]
}

const onSubmit = async (params: SoftwareUploadPostParams, file: File) => {
    submitting.value = true

    let softwareUpload
    try {
        softwareUpload = await getUploadPost(params)
    } catch (error) {
        console.error('SoftwareView getUploadPost failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to get upload post. Please try again.'
        show(message, 'error')
        submitting.value = false
        return
    }

    const formData = new FormData()
    for (const [key, value] of Object.entries(softwareUpload.uploadPost.fields)) {
        formData.append(key, value)
    }
    formData.append('file', file)

    let uploadResponse
    try {
        uploadResponse = await fetch(softwareUpload.uploadPost.url, {
            method: 'POST',
            body: formData,
        })
    } catch (error) {
        console.error('SoftwareView upload software file failed:', error)
        show('Failed to upload software file. Please try again.', 'error')
        submitting.value = false
        return
    }
    if (!uploadResponse.ok) {
        console.error(`SoftwareView upload software file failed: ${uploadResponse.status} ${uploadResponse.statusText}`)
        show('Failed to upload software file. Please try again.', 'error')
        submitting.value = false
        return
    }

    try {
        await completeUpload({
            id: softwareUpload.id,
            checksum: params.checksum,
        })
    } catch (error) {
        console.error('SoftwareView completeUpload failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to complete software upload. Please try again.'
        show(message, 'error')
        submitting.value = false
        return
    }

    submitting.value = false
    closeUploadModal()
    show('Software uploaded successfully.', 'success')
    fetchData()
}

onMounted(() => {
    fetchData()
})
</script>
