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
    DataLookupQuery,
    DataLookupResult,
} from '@/types/data'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getBots = async (params: DataListQuery<Bot, DataCenterSortFieldFor<'bots'>>): Promise<DataListResult<Bot>> => {
    return apiClient.post<any, DataListResult<Bot>>('/data/getBots', params, baseURL)
}

export const getKnowledge = async (params: DataListQuery<Knowledge, DataCenterSortFieldFor<'knowledge'>>): Promise<DataListResult<Knowledge>> => {
    return apiClient.post<any, DataListResult<Knowledge>>('/data/getKnowledge', params, baseURL)
}

export const getMcpCapabilities = async (params: DataListQuery<McpCapability, DataCenterSortFieldFor<'mcpCapabilities'>>): Promise<DataListResult<McpCapability>> => {
    return apiClient.post<any, DataListResult<McpCapability>>('/data/getMcpCapabilities', params, baseURL)
}

export const getMonitorLogsTrace = async (traceId: string): Promise<MonitorTraceDetail | null> => {
    return apiClient.post<any, MonitorTraceDetail | null>('/data/getMonitorLogsTrace', { traceId }, baseURL)
}

export const getUsers = async (params: DataListQuery<User, DataCenterSortFieldFor<'users'>>): Promise<DataListResult<User>> => {
    return apiClient.post<any, DataListResult<User>>('/data/getUsers', params, baseURL)
}

export const getUserBehaviorLogs = async (params: UserBehaviorLogsQuery): Promise<DataListResult<UserBehaviorLogAggregate>> => {
    return apiClient.post<any, DataListResult<UserBehaviorLogAggregate>>('/data/getUserBehaviorLogs', params, baseURL)
}

export const getUserMemory = async (params: { userId: string; soulId: string }): Promise<string> => {
    return apiClient.post<any, string>('/data/getUserMemory', params, baseURL)
}

export const getChatActiveDates = async (params: { userId: string; currentTime: string }): Promise<string[]> => {
    return apiClient.post<any, string[]>('/data/getChatActiveDates', params, baseURL)
}

export const getChatHistories = async (params: { userId: string; soulId: string; date: string }): Promise<ChatHistory[]> => {
    return apiClient.post<any, ChatHistory[]>('/data/getChatHistories', params, baseURL)
}

export const getDataLookup = async (params: DataLookupQuery): Promise<DataLookupResult[]> => {
    return apiClient.post<any, DataLookupResult[]>('/data/getDataLookup', params, baseURL)
}
