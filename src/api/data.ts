import apiClient from './apiClient'
import type {
    Bot,
    ChatHistory,
    DataLookupQuery,
    DataLookupResult,
    DataCenterSortFieldFor,
    DataListQuery,
    DataListResult,
    DataRegionQuery,
    Knowledge,
    McpCapability,
    MonitorTraceDetail,
    User,
    UserBehaviorLogsQuery,
    UserBehaviorLogAggregate,
    UserBehaviorStatsResult,
} from '@/types/data'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getChatActiveDates = async (params: DataRegionQuery<{ userId: string; createdAt: [string, string] }>): Promise<string[]> => {
    return apiClient.get<unknown, string[]>('/chat/active-dates', { ...baseURL, params })
}

export const getChatHistories = async (params: DataRegionQuery<{ userId: string; soulId: string; createdAt: [string, string] }>): Promise<ChatHistory[]> => {
    return apiClient.get<unknown, ChatHistory[]>('/chat/histories', { ...baseURL, params })
}

export const getDataLookup = async (params: DataRegionQuery<DataLookupQuery>): Promise<DataLookupResult[]> => {
    return apiClient.get<unknown, DataLookupResult[]>('/common/data-lookup', { ...baseURL, params })
}

export const getBots = async (params: DataRegionQuery<DataListQuery<Bot, DataCenterSortFieldFor<'bots'>>>): Promise<DataListResult<Bot>> => {
    return apiClient.get<unknown, DataListResult<Bot>>('/hardware/bots', { ...baseURL, params })
}

export const getMonitorLogsTrace = async (params: DataRegionQuery<{ traceId: string }>): Promise<MonitorTraceDetail | null> => {
    return apiClient.get<unknown, MonitorTraceDetail | null>('/log/monitor-trace', { ...baseURL, params })
}

export const getKnowledge = async (params: DataRegionQuery<DataListQuery<Knowledge, DataCenterSortFieldFor<'knowledge'>>>): Promise<DataListResult<Knowledge>> => {
    return apiClient.get<unknown, DataListResult<Knowledge>>('/resource/knowledge', { ...baseURL, params })
}

export const getMcpCapabilities = async (params: DataRegionQuery<DataListQuery<McpCapability, DataCenterSortFieldFor<'mcpCapabilities'>>>): Promise<DataListResult<McpCapability>> => {
    return apiClient.get<unknown, DataListResult<McpCapability>>('/resource/mcp-capabilities', { ...baseURL, params })
}

export const getUsers = async (params: DataRegionQuery<DataListQuery<User, DataCenterSortFieldFor<'users'>>>): Promise<DataListResult<User>> => {
    return apiClient.get<unknown, DataListResult<User>>('/user/list', { ...baseURL, params })
}

export const updateUserPermission = async (params: DataRegionQuery<{ userId: string; role: number }>): Promise<void> => {
    return apiClient.post<unknown, void>('/user/permission', params, baseURL)
}

export const getUserBehaviorLogs = async (params: DataRegionQuery<UserBehaviorLogsQuery>): Promise<DataListResult<UserBehaviorLogAggregate>> => {
    return apiClient.get<unknown, DataListResult<UserBehaviorLogAggregate>>('/user/behavior-logs', { ...baseURL, params })
}

export const getUserBehaviorStats = async (params: DataRegionQuery<{ createdAt?: [string, string] }>): Promise<UserBehaviorStatsResult> => {
    return apiClient.get<unknown, UserBehaviorStatsResult>('/user/behavior-stats', { ...baseURL, params })
}

export const getUserMemory = async (params: DataRegionQuery<{ userId: string; soulId: string }>): Promise<string> => {
    return apiClient.get<unknown, string>('/user/memory', { ...baseURL, params })
}
