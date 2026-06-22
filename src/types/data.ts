import { DATA_CENTER_TABLES } from '@/configs/data'

export interface AuthProvider {
    id: string
    userId: string
    provider: string
    userProviderId: string
    email: string | null
    emailVerified: boolean
    createdAt: string
    updatedAt: string
}

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

export interface ChatTopic {
    id: string
    summary: string
    embedding: number[]
    participants: string[]
    soulId: string
    conversationId: string
    startedAt: string
    endedAt: string
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

export interface Media {
    id: string
    ownerId: string
    mimeType: string
    storageKey: string
    sizeBytes: number
    metadata: {
        width?: number
        height?: number
        durationMs?: number
        [key: string]: unknown
    }
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED'
    reason: string | null
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

export interface UserBehaviorLog {
    deviceId: string
    sessionId: string
    userId: string | null
    platform: string
    userAgent: string
    screenSize: string | null
    language: string | null
    timezone: string | null
    referrer: string | null
    utmSource: string | null
    eventType: string
    eventName: string
    clientIp: string | null
    metadata: Record<string, unknown>
    createdAt: string
}

export interface UserMemory {
    id: string
    memory: string
    embedding: number[]
    userId: string
    soulId: string
    metadata: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export type DataTableKey = keyof typeof DATA_CENTER_TABLES

export type DataCenterSortFieldFor<K extends DataTableKey> = (typeof DATA_CENTER_TABLES)[K]['sortFields'][number]

export type DataCenterSortField = DataCenterSortFieldFor<DataTableKey>

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
