<template>
    <div class="data-list-view">
        <DataFilter
            v-model:filter-values="filterValues"
            v-model:select-values="selectValues"
            :fields="filterFields"
            :select-fields="selectFields"
            :time-range-fields="[]"
            :time-range-values="{}"
            :show-time-range="false"
            :loading="loading"
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
            :actions="tableActions"
            @sort-column="onSortColumn"
            @action="onTableAction"
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
            :open="modalOpen"
            :title="modalTitle"
            max-width="32rem"
            @close="closeModal"
        >
            <ChatHistoryPanel
                v-if="modalType === 'chat'"
                v-model:date="selectedDate"
                :dates-loading="chatDatesLoading"
                :disabled-date="disabledDate"
                :loading="chatMessagesLoading"
                :messages="chatMessages"
                @panel-change="onChatPanelChange"
            />
            <UserMemoryPanel v-else-if="modalType === 'memory'" :loading="userMemoryLoading" :memory="userMemory" />
            <UserPermissionPanel
                v-else-if="modalType === 'permission'"
                v-model:selected-role="targetSelectedRole"
                :username="targetUsername"
                :current-role="targetCurrentRole"
                :role-options="roleOptions"
                :role-labels="roleLabels"
                :saving="roleEditSaving"
                :disabled-roles="targetDisabledRoles"
                :submit-disabled="targetSubmitDisabled"
                @submit="submitPermission"
            />
        </DataModal>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getChatActiveDates, getChatHistories, getUserMemory, getUsers, updateUserPermission } from '@/api/data'
import ChatHistoryPanel from '@/components/data/ChatHistoryPanel.vue'
import DataFilter from '@/components/data/DataFilter.vue'
import DataModal from '@/components/data/DataModal.vue'
import DataPagination from '@/components/data/DataPagination.vue'
import DataTable from '@/components/data/DataTable.vue'
import UserPermissionPanel from '@/components/data/UserPermissionPanel.vue'
import UserMemoryPanel from '@/components/data/UserMemoryPanel.vue'
import { useAlert } from '@/composables'
import { DATA_CENTER_TABLES } from '@/configs/data'
import { useUserStore } from '@/stores'
import { ApiError } from '@/types/api'
import type { ChatHistory, DataCenterSortFieldFor, DataListResult, User } from '@/types/data'

const { show } = useAlert()
const userStore = useUserStore()

const table = DATA_CENTER_TABLES.users
const roleLabels: Record<number, string> = {
    0: 'Super Admin',
    1: 'Platform Developer',
    2: 'Technical Staff',
    3: 'Marketing Staff',
    4: 'Reserved',
    5: 'User',
    6: 'Reserved',
    7: 'Reserved',
    8: 'Reserved',
    9: 'Disabled',
}
const roleOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const pageSizeOptions = [5, 10, 20]
const filterFields = table.filter
const selectFields = {
    role: {
        label: 'role',
        default: '',
        options: roleOptions.map((role) => ({
            label: `${role} - ${roleLabels[role]}`,
            value: String(role),
        })),
    },
}
const sortableFields = table.sortFields
const filterValues = ref<Record<string, string>>({})
const selectValues = ref({ role: selectFields.role.default })
const sortField = ref<DataCenterSortFieldFor<'users'>>(table.sortFields[0])
const sortOrder = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const rows = ref<Record<string, string>[]>([])
const loading = ref(false)
const modalOpen = ref(false)
const modalType = ref<'chat' | 'memory' | 'permission' | null>(null)
const selectedDate = ref('')
const chatActiveDates = ref<string[]>([])
const chatActiveMonth = ref('')
const chatDatesLoading = ref(false)
const chatUserId = ref('')
const chatSoulId = ref('')
const chatMessages = ref<ChatHistory[]>([])
const chatMessagesLoading = ref(false)
const userMemory = ref('')
const userMemoryLoading = ref(false)
const targetUserId = ref('')
const targetUsername = ref('')
const targetCurrentRole = ref(0)
const targetSelectedRole = ref(0)
const roleEditSaving = ref(false)
const editedByRole = computed(() => userStore.user?.role ?? null)
const editedByUserId = computed(() => userStore.user?.userId ?? '')
const tableActions = computed(() => {
    const actions = [
        { key: 'viewChat', label: 'ViewChat' },
        { key: 'viewMemory', label: 'ViewMemory' },
    ]
    if (editedByRole.value != null && editedByRole.value <= 1) {
        actions.push({ key: 'EditPermissions', label: 'EditPermissions' })
    }
    return actions
})
const modalTitle = computed(() => {
    if (modalType.value === 'chat') return 'ViewChat'
    if (modalType.value === 'memory') return 'ViewMemory'
    if (modalType.value === 'permission') return 'EditPermissions'
    return ''
})
const targetIsSelf = computed(() => targetUserId.value === editedByUserId.value)
const targetEditForbidden = computed(() => {
    if (editedByRole.value == null) return true
    return targetCurrentRole.value <= editedByRole.value
})
const targetDisabledRoles = computed(() => {
    if (editedByRole.value == null) return roleOptions
    if (targetIsSelf.value || targetEditForbidden.value) return roleOptions
    return roleOptions.filter((role) => role <= editedByRole.value!)
})
const targetSubmitDisabled = computed(() => {
    if (editedByRole.value == null) return true
    if (targetIsSelf.value || targetEditForbidden.value) return true
    return targetSelectedRole.value <= editedByRole.value
})
const columns = ['id', 'username', 'email', 'role', 'status', 'soulId', 'providers']
const chatDateFormatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Shanghai',
})

const disabledDate = (time: Date) => !chatActiveDates.value.includes(chatDateFormatter.format(time))

const fetchData = async () => {
    loading.value = true

    const filters: Record<string, string> = {}
    for (const [key, rawValue] of Object.entries(filterValues.value)) {
        const v = rawValue.trim()
        if (!v) continue
        filters[key] = v
    }
    if (selectValues.value.role) filters.role = selectValues.value.role

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
            else if (key === 'createdAt' || key === 'updatedAt') formatted[key] = new Date(value as string).toLocaleString()
            else if (key === 'role') formatted[key] = `${value} - ${roleLabels[Number(value)] ?? value}`
            else if (Array.isArray(value)) formatted[key] = value.length ? value.join(', ') : '-'
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

const onTableAction = (payload: { key: string; row: Record<string, string> }) => {
    if (payload.key === 'viewChat') {
        openChatModal(payload)
        return
    }
    if (payload.key === 'viewMemory') {
        openMemoryModal(payload)
        return
    }
    if (payload.key === 'EditPermissions') {
        openPermissionModal(payload)
    }
}

const openChatModal = async (payload: { key: string; row: Record<string, string> }) => {
    chatUserId.value = payload.row.id
    chatSoulId.value = payload.row.soulId
    selectedDate.value = chatDateFormatter.format(new Date())
    modalType.value = 'chat'
    modalOpen.value = true
    chatActiveMonth.value = ''
    chatActiveDates.value = []
    chatMessages.value = []

    const monthKey = chatDateFormatter.format(new Date()).slice(0, 7)
    chatDatesLoading.value = true

    try {
        chatActiveDates.value = await getChatActiveDates({
            userId: chatUserId.value,
            currentTime: new Date(`${monthKey}-10T00:00:00+08:00`).toISOString(),
        })
        chatActiveMonth.value = monthKey
    } catch (error) {
        console.error('UsersView fetchChatActiveDates failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load chat dates. Please try again.'
        show(message, 'error')
        closeModal()
        return
    } finally {
        chatDatesLoading.value = false
    }
}

const onChatPanelChange = async (date: Date) => {
    if (!modalOpen.value || modalType.value !== 'chat' || !chatUserId.value) return

    const monthKey = chatDateFormatter.format(date).slice(0, 7)
    if (selectedDate.value && !selectedDate.value.startsWith(monthKey)) {
        selectedDate.value = ''
        chatMessages.value = []
    }
    if (monthKey === chatActiveMonth.value) return

    chatDatesLoading.value = true
    chatActiveDates.value = []

    try {
        chatActiveDates.value = await getChatActiveDates({
            userId: chatUserId.value,
            currentTime: new Date(`${monthKey}-10T00:00:00+08:00`).toISOString(),
        })
        chatActiveMonth.value = monthKey
    } catch (error) {
        console.error('UsersView fetchChatActiveDates failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load chat dates. Please try again.'
        show(message, 'error')
    } finally {
        chatDatesLoading.value = false
    }
}

const openMemoryModal = async (payload: { row: Record<string, string> }) => {
    modalType.value = 'memory'
    modalOpen.value = true
    userMemoryLoading.value = true
    userMemory.value = ''

    const params = {
        userId: payload.row.id,
        soulId: payload.row.soulId,
    }

    let memory: string
    try {
        memory = await getUserMemory(params)
    } catch (error) {
        console.error('UsersView fetchUserMemories failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to load user memory. Please try again.'
        show(message, 'error')
        userMemoryLoading.value = false
        closeModal()
        return
    }

    userMemory.value = Array.isArray(memory) ? (memory[0] ?? '') : memory
    userMemoryLoading.value = false
}

const openPermissionModal = (payload: { row: Record<string, string> }) => {
    targetUserId.value = payload.row.id
    targetUsername.value = payload.row.username
    targetCurrentRole.value = parseInt(payload.row.role, 10)
    targetSelectedRole.value = parseInt(payload.row.role, 10)
    roleEditSaving.value = false
    modalType.value = 'permission'
    modalOpen.value = true
}

const submitPermission = async () => {
    if (targetSubmitDisabled.value) return

    const params = {
        userId: targetUserId.value,
        role: targetSelectedRole.value,
    }
    roleEditSaving.value = true

    try {
        await updateUserPermission(params)
    } catch (error) {
        console.error('UsersView updateUserPermission failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to update user permission. Please try again.'
        show(message, 'error')
        roleEditSaving.value = false
        return
    }

    roleEditSaving.value = false
    show('Permission updated successfully.', 'success')
    closeModal()
    fetchData()
}

const fetchChatMessages = async (date: string) => {
    if (!chatUserId.value || !chatSoulId.value || !date) return

    chatMessagesLoading.value = true
    chatMessages.value = []

    const params = {
        userId: chatUserId.value,
        soulId: chatSoulId.value,
        date,
    }

    let messages: ChatHistory[]
    try {
        messages = await getChatHistories(params)
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
        createdAt: new Date(message.createdAt).toLocaleString(),
    }))
    chatMessagesLoading.value = false
}

const search = () => {
    page.value = 1
    fetchData()
}

const resetFilters = () => {
    filterValues.value = {}
    selectValues.value = { role: selectFields.role.default }
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

const closeModal = () => {
    modalOpen.value = false
    modalType.value = null
    selectedDate.value = ''
    chatActiveDates.value = []
    chatActiveMonth.value = ''
    chatDatesLoading.value = false
    chatUserId.value = ''
    chatSoulId.value = ''
    chatMessages.value = []
    chatMessagesLoading.value = false
    userMemory.value = ''
    userMemoryLoading.value = false
    targetUserId.value = ''
    targetUsername.value = ''
    targetCurrentRole.value = 0
    targetSelectedRole.value = 0
    roleEditSaving.value = false
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
    if (!modalOpen.value || modalType.value !== 'chat') return
    chatMessages.value = []
    if (!date) return
    fetchChatMessages(date)
})
</script>
