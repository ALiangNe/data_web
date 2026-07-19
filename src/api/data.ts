import apiClient from './apiClient'
import type {
    Bot,
    ChatHistory,
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
    DataLookupQuery,
    DataLookupResult,
} from '@/types/data'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getBots = async (params: DataRegionQuery<DataListQuery<Bot, DataCenterSortFieldFor<'bots'>>>): Promise<DataListResult<Bot>> => {
    return apiClient.get<unknown, DataListResult<Bot>>('/data/getBots', { ...baseURL, params })
}

export const getKnowledge = async (params: DataRegionQuery<DataListQuery<Knowledge, DataCenterSortFieldFor<'knowledge'>>>): Promise<DataListResult<Knowledge>> => {
    return apiClient.get<unknown, DataListResult<Knowledge>>('/data/getKnowledge', { ...baseURL, params })
}

export const getMcpCapabilities = async (params: DataRegionQuery<DataListQuery<McpCapability, DataCenterSortFieldFor<'mcpCapabilities'>>>): Promise<DataListResult<McpCapability>> => {
    return apiClient.get<unknown, DataListResult<McpCapability>>('/data/getMcpCapabilities', { ...baseURL, params })
}

export const getMonitorLogsTrace = async (params: DataRegionQuery<{ traceId: string }>): Promise<MonitorTraceDetail | null> => {
    return apiClient.get<unknown, MonitorTraceDetail | null>('/data/getMonitorLogsTrace', { ...baseURL, params })
}

export const getUsers = async (params: DataRegionQuery<DataListQuery<User, DataCenterSortFieldFor<'users'>>>): Promise<DataListResult<User>> => {
    return apiClient.get<unknown, DataListResult<User>>('/data/getUsers', { ...baseURL, params })
}

export const updateUserPermission = async (params: DataRegionQuery<{ userId: string; role: number }>): Promise<void> => {
    return apiClient.post<unknown, void>('/data/updateUserPermission', params, baseURL)
}

export const getUserBehaviorLogs = async (params: DataRegionQuery<UserBehaviorLogsQuery>): Promise<DataListResult<UserBehaviorLogAggregate>> => {
    return apiClient.get<unknown, DataListResult<UserBehaviorLogAggregate>>('/data/getUserBehaviorLogs', { ...baseURL, params })
}

export const getUserBehaviorStats = async (params: DataRegionQuery<{ createdAt?: [string, string] }>): Promise<UserBehaviorStatsResult> => {
    return apiClient.get<unknown, UserBehaviorStatsResult>('/data/getUserBehaviorStats', { ...baseURL, params })
}

export const getUserMemory = async (params: DataRegionQuery<{ userId: string; soulId: string }>): Promise<string> => {
    return apiClient.get<unknown, string>('/data/getUserMemory', { ...baseURL, params })
}

export const getChatActiveDates = async (params: DataRegionQuery<{ userId: string; createdAt: [string, string] }>): Promise<string[]> => {
    return apiClient.get<unknown, string[]>('/data/getChatActiveDates', { ...baseURL, params })
}

export const getChatHistories = async (params: DataRegionQuery<{ userId: string; soulId: string; createdAt: [string, string] }>): Promise<ChatHistory[]> => {
    return apiClient.get<unknown, ChatHistory[]>('/data/getChatHistories', { ...baseURL, params })
}

export const getDataLookup = async (params: DataRegionQuery<DataLookupQuery>): Promise<DataLookupResult[]> => {
    return apiClient.get<unknown, DataLookupResult[]>('/data/getDataLookup', { ...baseURL, params })
}
