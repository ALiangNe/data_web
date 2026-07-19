import apiClient from './apiClient'
import type {
    DataListQuery,
    DataListResult,
    DataRegionQuery,
    DataSortFieldFor,
    User,
    UserBehaviorLogAggregate,
    UserBehaviorLogsQuery,
    UserBehaviorStatsResult,
} from '@/types'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getUsers = async (params: DataRegionQuery<DataListQuery<User, DataSortFieldFor<'users'>>>): Promise<DataListResult<User>> => {
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
