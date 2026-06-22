<template>
    <div class="data-list-view">
        <DataFilter v-model:filter-values="filterValues" :fields="filterFields" :loading="loading" @search="search"
            @reset="resetFilters" />
        <DataTable :columns="columns" :rows="rows" :sortable-fields="sortableFields" :sort-field="sortField"
            :sort-order="sortOrder" :loading="loading" :actions="tableActions" @sort-column="onSortColumn"
            @action="openChatModal" />
        <DataPagination :page="page" :page-size="pageSize" :page-size-options="pageSizeOptions" :total="total"
            :loading="loading" @update:page-size="onPageSizeChange" @prev="prevPage" @next="nextPage" />
        <DataModal :open="chatModalOpen" @close="closeChatModal">
            <ChatHistoryList v-model:date="selectedDate" :dates-loading="chatDatesLoading" :disabled-date="disabledDate"
                :loading="chatMessagesLoading" :messages="chatMessages" />
        </DataModal>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getChatActiveDates, getChatHistoriesByDate, getUsers } from '@/api/data'
import ChatHistoryList from '@/components/data/ChatHistoryList.vue'
import DataFilter from '@/components/data/DataFilter.vue'
import DataModal from '@/components/data/DataModal.vue'
import DataPagination from '@/components/data/DataPagination.vue'
import DataTable from '@/components/data/DataTable.vue'
import { useAlert } from '@/composables'
import { DATA_CENTER_TABLES } from '@/configs/data'
import { ApiError } from '@/types/api'
import type { ChatHistory, DataCenterSortFieldFor, DataListResult, User } from '@/types/data'

const { show } = useAlert()

const table = DATA_CENTER_TABLES.users
const pageSizeOptions = [5, 10, 20]
const filterFields = table.filter
const sortableFields = table.sortFields
const filterValues = ref<Record<string, string>>({})
const sortField = ref<DataCenterSortFieldFor<'users'>>(table.sortFields[0])
const sortOrder = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const rows = ref<Record<string, string>[]>([])
const loading = ref(false)
const chatModalOpen = ref(false)
const selectedDate = ref('')
const chatActiveDates = ref<string[]>([])
const chatDatesLoading = ref(false)
const chatUserId = ref('')
const chatMessages = ref<ChatHistory[]>([])
const chatMessagesLoading = ref(false)
const tableActions = [{ key: 'viewChat', label: 'ViewChat' }]
const columns = computed(() => rows.value[0]
    ? Object.keys(rows.value[0]).filter(key => key !== 'createdAt' && key !== 'updatedAt' && key !== 'password')
    : [])

const disabledDate = (time: Date) => !chatActiveDates.value.includes(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
}).format(time))

const fetchData = async () => {
    loading.value = true

    const filters: Record<string, string> = {}
    for (const [key, rawValue] of Object.entries(filterValues.value)) {
        const v = rawValue.trim()
        if (!v) continue
        filters[key] = v
    }

    const params = {
        ...filters,
        page: page.value,
        pageSize: pageSize.value,
        sortBy: sortField.value,
        order: sortOrder.value,
    }

    let data: DataListResult<User>
    try {
        data = await getUsers(params)
    } catch (error) {
        console.error('UsersView fetch failed:', error)
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
            else if (key === 'createdAt' || key === 'updatedAt') formatted[key] = new Date(value as string).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
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

const openChatModal = async (payload: { key: string; row: Record<string, string> }) => {
    if (payload.key !== 'viewChat') return

    chatUserId.value = payload.row.id
    selectedDate.value = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date())
    chatModalOpen.value = true
    chatDatesLoading.value = true
    chatActiveDates.value = []
    chatMessages.value = []

    const params = {
        userId: chatUserId.value,
        currentTime: new Date().toISOString(),
    }

    let dates: string[]
    try {
        dates = await getChatActiveDates(params)
    } catch (error) {
        console.error('UsersView fetchChatActiveDates failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load chat dates. Please try again.'
        show(message, 'error')
        chatDatesLoading.value = false
        return
    }

    chatActiveDates.value = dates
    chatDatesLoading.value = false
}

const fetchChatMessages = async (date: string) => {
    if (!chatUserId.value || !date) return

    chatMessagesLoading.value = true
    chatMessages.value = []

    const params = {
        userId: chatUserId.value,
        date,
    }

    let messages: ChatHistory[]
    try {
        messages = await getChatHistoriesByDate(params)
    } catch (error) {
        console.error('UsersView fetchChatMessages failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load chat records. Please try again.'
        show(message, 'error')
        chatMessagesLoading.value = false
        return
    }

    chatMessages.value = messages.map((message) => ({
        ...message,
        createdAt: new Date(message.createdAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    }))
    chatMessagesLoading.value = false
}

const search = () => {
    page.value = 1
    fetchData()
}

const resetFilters = () => {
    filterValues.value = {}
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

const closeChatModal = () => {
    chatModalOpen.value = false
    selectedDate.value = ''
    chatActiveDates.value = []
    chatDatesLoading.value = false
    chatUserId.value = ''
    chatMessages.value = []
    chatMessagesLoading.value = false
}

const onSortColumn = (col: string) => {
    if (loading.value) return
    if (!sortableFields.includes(col as DataCenterSortFieldFor<'users'>)) return
    if (col === sortField.value) {
        sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
    } else {
        sortField.value = col as DataCenterSortFieldFor<'users'>
        sortOrder.value = 'desc'
    }
    page.value = 1
    fetchData()
}

onMounted(() => {
    fetchData()
})

watch(selectedDate, (date) => {
    if (!chatModalOpen.value) return
    chatMessages.value = []
    if (!date) return
    fetchChatMessages(date)
})
</script>
