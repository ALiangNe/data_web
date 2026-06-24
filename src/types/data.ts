import { DATA_CENTER_TABLES } from '@/configs/data'

export interface Bot {
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

export interface ChatHistory {
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

export interface Knowledge {
    id: string
    document: string
    embedding: number[]
    metadata: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export interface McpCapability {
    id: string
    document: string
    embedding: number[]
    metadata: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export interface MonitorLog {
    service: string
    env: string
    instanceId: number
    traceId: string
    spanId: string
    parentSpanId: string | null
    name: string
    startTimeMs: number
    durationMs: number
    status: string
    botId: string | null
    soulId: string | null
    meta: Record<string, unknown>
    error: Record<string, unknown> | null
}

export interface User {
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

export interface UserBehaviorValueCount {
    value: string
    count: number
}

export interface UserBehaviorLogAggregateBase {
    platforms: UserBehaviorValueCount[]
    userAgents: UserBehaviorValueCount[]
    screenSizes: UserBehaviorValueCount[]
    languages: UserBehaviorValueCount[]
    timezones: UserBehaviorValueCount[]
    referrers: UserBehaviorValueCount[]
    utmSources: UserBehaviorValueCount[]
    eventTypes: UserBehaviorValueCount[]
    eventNames: UserBehaviorValueCount[]
    clientIps: UserBehaviorValueCount[]
    createdAt: string
}

export interface UserBehaviorLogSessionAggregate extends UserBehaviorLogAggregateBase {
    sessionId: string
    deviceIds: UserBehaviorValueCount[]
    userIds: UserBehaviorValueCount[]
}

export interface UserBehaviorLogDeviceAggregate extends UserBehaviorLogAggregateBase {
    deviceId: string
    sessionIds: UserBehaviorValueCount[]
    userIds: UserBehaviorValueCount[]
}

export interface UserBehaviorLogUserAggregate extends UserBehaviorLogAggregateBase {
    userId: string
    sessionIds: UserBehaviorValueCount[]
    deviceIds: UserBehaviorValueCount[]
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

/* Single time field range filter values. */
export type DataTimeRangeFieldValues = {
    startTime: string
    endTime: string
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
