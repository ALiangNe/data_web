import apiClient from './apiClient'
import type {
    DataLookupQuery,
    DataLookupResult,
    DataRegionQuery,
} from '@/types'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getDataLookup = async (params: DataRegionQuery<DataLookupQuery>): Promise<DataLookupResult[]> => {
    return apiClient.get<unknown, DataLookupResult[]>('/common/data-lookup', { ...baseURL, params })
}
