import { DATA_CENTER_TABLES, DATA_LOOKUP_TABLES } from '@/configs/data'

export type DataRegion = 'usw1' | 'euc1'

export type DataRegionQuery<T> = T & {
    region: DataRegion
}

export type Bot = {
    id: string
    ownerId: string
    model: string
    serialNumber: string
    manufacturer: string
    status: string
    metadata: Record<string, unknown>
    registeredAt: string | null
    activatedAt: string | null
    createdAt: string
    updatedAt: string
}

export type ChatHistory = {
    id: string
    role: string
    content: string
    userId: string
    soulId: string
    conversationId: string
    topicId: string | null
    metadata: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export type Knowledge = {
    id: string
    document: string
    embedding: number[]
    metadata: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export type McpCapability = {
    id: string
    document: string
    embedding: number[]
    metadata: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export type MonitorSpan = {
    spanId: string
    parentSpanId: string | null
    env: string
    service: string
    instanceId: string
    eventName: string
    status: string
    startTimeMs: number
    durationMs: number
    error?: string | null
    traceAttributes?: Record<string, unknown>
    metadata?: Record<string, unknown>
}

export type MonitorTraceDetail = {
    traceId: string
    spans: MonitorSpan[]
}

export type User = {
    id: string
    username: string
    password: string | null
    email: string
    role: number
    soulId: string
    status: 'ACTIVE' | 'BANNED' | 'DELETED'
    providers: string[]
    createdAt: string
    updatedAt: string
}

export type Software = {
    id: string
    type: string
    name: string
    version: string
    dependencies: Record<string, unknown>
    changelog: string
    storageKey: string
    sizeBytes: number
    checksum: string
    signature: string | null
    status: string
    metadata: Record<string, unknown>
    uploadedBy: string
    createdAt: string
    updatedAt: string
}

export type UserBehaviorValue = {
    value: string
}

export type UserBehaviorValueCount = {
    value: string
    count: number
}

export type UserBehaviorLogAggregateBase = {
    userAgents: UserBehaviorValue[]
    screenSizes: UserBehaviorValue[]
    languages: UserBehaviorValue[]
    timezones: UserBehaviorValue[]
    referrers: UserBehaviorValue[]
    utmSources: UserBehaviorValue[]
    clientIps: UserBehaviorValue[]
    eventTypes: UserBehaviorValueCount[]
    eventNames: UserBehaviorValueCount[]
    createdAt: string
}

export type UserBehaviorLogSessionAggregate = UserBehaviorLogAggregateBase & {
    sessionId: string
    deviceIds: UserBehaviorValue[]
    userIds: UserBehaviorValue[]
}

export type UserBehaviorLogDeviceAggregate = UserBehaviorLogAggregateBase & {
    deviceId: string
    sessionIds: UserBehaviorValue[]
    userIds: UserBehaviorValue[]
}

export type UserBehaviorLogUserAggregate = UserBehaviorLogAggregateBase & {
    userId: string
    sessionIds: UserBehaviorValue[]
    deviceIds: UserBehaviorValue[]
}

export type UserBehaviorLogAggregateBy =
    | 'session_id'
    | 'device_id'
    | 'user_id'

export type UserBehaviorLogAggregate =
    | UserBehaviorLogSessionAggregate
    | UserBehaviorLogDeviceAggregate
    | UserBehaviorLogUserAggregate

export type UserBehaviorLogsQuery = {
    aggregateBy: UserBehaviorLogAggregateBy
    userId?: string
    createdAt?: [string, string]
    page: number
    pageSize: number
    order?: 'asc' | 'desc'
}

export type UserBehaviorStatsResult = {
    deviceCount: number
    sessionCount: number
    sessions: {
        deviceId: string
        createdAt: string
    }[]
    regions: {
        key: string
        count: number
    }[]
    mediaClickEvents: {
        eventName: string
        count: number
    }[]
}

export type DataTableKey = keyof typeof DATA_CENTER_TABLES

export type DataCenterSortFieldFor<K extends DataTableKey> = (typeof DATA_CENTER_TABLES)[K]['sortFields'][number]

export type DataCenterSortField = DataCenterSortFieldFor<DataTableKey>

export type DataSelectFieldConfig = {
    label: string
    default: string
    options: { label: string; value: string }[]
}

/* DateTimePicker datetimerange value for a single time field. */
export type DataTimeRangeFieldValues = [string, string] | null

/* Data center API pagination list response. */
export type DataListResult<T> = {
    items: T[]
    total: number
}

/* Data center list pagination, filter query parameters. */
export type DataListQuery<T, S extends DataCenterSortField = DataCenterSortField> = {
    [K in keyof T]?: T[K] | [string, string]
} & {
    page?: number
    pageSize?: number
    sortBy?: S
    order?: 'asc' | 'desc'
}

export type DataLookupEntity = keyof typeof DATA_LOOKUP_TABLES

export interface DataLookupQuery {
    entity: DataLookupEntity
    ids: string[]
}

export type DataLookupResult = Record<string, unknown>

export type SoftwareUploadPostParams = {
    type: string
    name: string
    version: string
    dependencies: Record<string, string>
    changelog: string
    fileName: string
    mimeType: string
    sizeBytes: number
    checksum: string
}

export type SoftwareUploadPostResult = {
    id: string
    uploadPost: {
        url: string
        fields: Record<string, string>
    }
}
