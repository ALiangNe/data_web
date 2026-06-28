import { DATA_CENTER_TABLES } from '@/configs/data'

export type Bot = {
    id: string
    ownerId: string
    platform: string
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
    parentSpanId: string
    service: string
    env: string
    instanceId: string
    botId?: string
    soulId?: string
    name: string
    status: string
    startTimeMs: number
    durationMs: number
    error?: string | null
    meta?: Record<string, unknown>
}

export type MonitorTrace = {
    traceId: string
    startTimeMs: number
    chain: string[]
    serviceCount: number
    durationMs: number
    status: 'ok' | 'error'
}

export type MonitorTraceDetail = {
    traceId: string
    spans: MonitorSpan[]
}

export type MonitorLogsTracesQuery = {
    traceId?: string
    page: number
    pageSize: number
    sortBy?: 'startTimeMs'
    order?: 'asc' | 'desc'
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

export type UserBehaviorValue = {
    value: string
}

export type UserBehaviorValueCount = {
    value: string
    count: number
}

export type UserBehaviorLogAggregateBase = {
    platforms: UserBehaviorValue[]
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

export type DataTableKey = keyof typeof DATA_CENTER_TABLES

export type DataCenterSortFieldFor<K extends DataTableKey> = (typeof DATA_CENTER_TABLES)[K]['sortFields'][number]

export type DataCenterSortField = DataCenterSortFieldFor<DataTableKey>

export type DataSelectFieldConfig = {
    label: string
    default: string
    options: { label: string; value: string }[]
}

type A = typeof DATA_CENTER_TABLES['users']['sortFields']

/* Single time field range filter values. */
export type DataTimeRangeFieldValues = {
    startTime: string
    endTime: string
    a:A
}

/* Data center API pagination list response. */
export type DataListResult<T> = {
    list: T[]
    total: number
}

/* Data center list pagination, filter query parameters. */
export type DataListQuery<T, S extends DataCenterSortField = DataCenterSortField> = {
    [K in keyof T]?: T[K] | [string, string]
} & {
    page: number
    pageSize: number
    sortBy?: S
    order?: 'asc' | 'desc'
}
