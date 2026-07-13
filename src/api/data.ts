import apiClient from './apiClient'
import type {
    Bot,
    ChatHistory,
    DataCenterSortFieldFor,
    DataListQuery,
    DataListResult,
    Knowledge,
    McpCapability,
    MonitorTraceDetail,
    User,
    UserBehaviorLogsQuery,
    UserBehaviorLogAggregate,
    UserBehaviorStatsResult,
    DataLookupQuery,
    DataLookupResult,
    CreateSoftwareParams,
    SoftwareUploadResult,
} from '@/types/data'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getBots = async (params: DataListQuery<Bot, DataCenterSortFieldFor<'bots'>>): Promise<DataListResult<Bot>> => {
    return apiClient.post<unknown, DataListResult<Bot>>('/data/getBots', params, baseURL)
}

export const getKnowledge = async (params: DataListQuery<Knowledge, DataCenterSortFieldFor<'knowledge'>>): Promise<DataListResult<Knowledge>> => {
    return apiClient.post<unknown, DataListResult<Knowledge>>('/data/getKnowledge', params, baseURL)
}

export const getMcpCapabilities = async (params: DataListQuery<McpCapability, DataCenterSortFieldFor<'mcpCapabilities'>>): Promise<DataListResult<McpCapability>> => {
    return apiClient.post<unknown, DataListResult<McpCapability>>('/data/getMcpCapabilities', params, baseURL)
}

export const getMonitorLogsTrace = async (traceId: string): Promise<MonitorTraceDetail | null> => {
    return apiClient.post<unknown, MonitorTraceDetail | null>('/data/getMonitorLogsTrace', { traceId }, baseURL)
}

export const getUsers = async (params: DataListQuery<User, DataCenterSortFieldFor<'users'>>): Promise<DataListResult<User>> => {
    return apiClient.post<unknown, DataListResult<User>>('/data/getUsers', params, baseURL)
}

export const updateUserPermission = async (params: { userId: string; role: number }): Promise<void> => {
    return apiClient.post<unknown, void>('/data/updateUserPermission', params, baseURL)
}

export const getUserBehaviorLogs = async (params: UserBehaviorLogsQuery): Promise<DataListResult<UserBehaviorLogAggregate>> => {
    return apiClient.post<unknown, DataListResult<UserBehaviorLogAggregate>>('/data/getUserBehaviorLogs', params, baseURL)
}

export const getUserBehaviorStats = async (params: DataListQuery<{ createdAt: string }> = {}): Promise<UserBehaviorStatsResult> => {
    return apiClient.post<unknown, UserBehaviorStatsResult>('/data/getUserBehaviorStats', params, baseURL)
}

export const getUserMemory = async (params: { userId: string; soulId: string }): Promise<string> => {
    return apiClient.post<unknown, string>('/data/getUserMemory', params, baseURL)
}

export const getChatActiveDates = async (params: { userId: string; currentTime: string }): Promise<string[]> => {
    return apiClient.post<unknown, string[]>('/data/getChatActiveDates', params, baseURL)
}

export const getChatHistories = async (params: { userId: string; soulId: string; date: string }): Promise<ChatHistory[]> => {
    return apiClient.post<unknown, ChatHistory[]>('/data/getChatHistories', params, baseURL)
}

export const getDataLookup = async (params: DataLookupQuery): Promise<DataLookupResult[]> => {
    return apiClient.post<unknown, DataLookupResult[]>('/data/getDataLookup', params, baseURL)
}

export const createSoftware = async (params: CreateSoftwareParams): Promise<SoftwareUploadResult> => {
    return apiClient.post<unknown, SoftwareUploadResult>('/data/createSoftware', params, baseURL)
}
