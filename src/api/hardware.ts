import apiClient from './apiClient'
import type {
    Bot,
    DataListQuery,
    DataListResult,
    DataRegionQuery,
    DataSortFieldFor,
} from '@/types'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getBots = async (params: DataRegionQuery<DataListQuery<Bot, DataSortFieldFor<'bots'>>>): Promise<DataListResult<Bot>> => {
    return apiClient.get<unknown, DataListResult<Bot>>('/hardware/bots', { ...baseURL, params })
}
