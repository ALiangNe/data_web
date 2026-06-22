import apiClient from './apiClient'
import type {
    AuthProvider,
    Bot,
    ChatHistory,
    ChatTopic,
    DataCenterSortFieldFor,
    DataListQuery,
    DataListResult,
    Knowledge,
    McpCapability,
    Media,
    MonitorLog,
    User,
    UserBehaviorLog,
    UserMemory,
} from '@/types/data'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getAuthProviders = async (params: DataListQuery<AuthProvider, DataCenterSortFieldFor<'authProviders'>>): Promise<DataListResult<AuthProvider>> => {
    return apiClient.post<any, DataListResult<AuthProvider>>('/data/getAuthProviders', params, baseURL)
}

export const getBots = async (params: DataListQuery<Bot, DataCenterSortFieldFor<'bots'>>): Promise<DataListResult<Bot>> => {
    return apiClient.post<any, DataListResult<Bot>>('/data/getBots', params, baseURL)
}

export const getChatHistories = async (params: DataListQuery<ChatHistory, DataCenterSortFieldFor<'chatHistories'>>): Promise<DataListResult<ChatHistory>> => {
    return apiClient.post<any, DataListResult<ChatHistory>>('/data/getChatHistories', params, baseURL)
}

export const getChatTopics = async (params: DataListQuery<ChatTopic, DataCenterSortFieldFor<'chatTopics'>>): Promise<DataListResult<ChatTopic>> => {
    return apiClient.post<any, DataListResult<ChatTopic>>('/data/getChatTopics', params, baseURL)
}

export const getKnowledge = async (params: DataListQuery<Knowledge, DataCenterSortFieldFor<'knowledge'>>): Promise<DataListResult<Knowledge>> => {
    return apiClient.post<any, DataListResult<Knowledge>>('/data/getKnowledge', params, baseURL)
}

export const getMcpCapabilities = async (params: DataListQuery<McpCapability, DataCenterSortFieldFor<'mcpCapabilities'>>): Promise<DataListResult<McpCapability>> => {
    return apiClient.post<any, DataListResult<McpCapability>>('/data/getMcpCapabilities', params, baseURL)
}

export const getMedia = async (params: DataListQuery<Media, DataCenterSortFieldFor<'media'>>): Promise<DataListResult<Media>> => {
    return apiClient.post<any, DataListResult<Media>>('/data/getMedia', params, baseURL)
}

export const getMonitorLogs = async (params: DataListQuery<MonitorLog, DataCenterSortFieldFor<'monitorLogs'>>): Promise<DataListResult<MonitorLog>> => {
    return apiClient.post<any, DataListResult<MonitorLog>>('/data/getMonitorLogs', params, baseURL)
}

export const getUsers = async (params: DataListQuery<User, DataCenterSortFieldFor<'users'>>): Promise<DataListResult<User>> => {
    return apiClient.post<any, DataListResult<User>>('/data/getUsers', params, baseURL)
}

export const getUserBehaviorLogs = async (params: DataListQuery<UserBehaviorLog, DataCenterSortFieldFor<'userBehaviorLogs'>>): Promise<DataListResult<UserBehaviorLog>> => {
    return apiClient.post<any, DataListResult<UserBehaviorLog>>('/data/getUserBehaviorLogs', params, baseURL)
}

export const getUserMemories = async (params: DataListQuery<UserMemory, DataCenterSortFieldFor<'userMemories'>>): Promise<DataListResult<UserMemory>> => {
    return apiClient.post<any, DataListResult<UserMemory>>('/data/getUserMemories', params, baseURL)
}

export const getChatActiveDates = async (params: { userId: string; currentTime: string }): Promise<string[]> => {
    return apiClient.post<any, string[]>('/data/getChatActiveDates', params, baseURL)
}

export const getChatHistoriesByDate = async (params: { userId: string; date: string }): Promise<ChatHistory[]> => {
    return apiClient.post<any, ChatHistory[]>('/data/getChatHistoriesByDate', params, baseURL)
}
