import apiClient from './apiClient'
import type {
    ChatHistory,
    DataRegionQuery,
} from '@/types'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getChatActiveDates = async (params: DataRegionQuery<{ userId: string; createdAt: [string, string] }>): Promise<string[]> => {
    return apiClient.get<unknown, string[]>('/chat/active-dates', { ...baseURL, params })
}

export const getChatHistories = async (params: DataRegionQuery<{ userId: string; soulId: string; createdAt: [string, string] }>): Promise<ChatHistory[]> => {
    return apiClient.get<unknown, ChatHistory[]>('/chat/histories', { ...baseURL, params })
}
