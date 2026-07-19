import apiClient from './apiClient'
import type {
    DataListQuery,
    DataListResult,
    DataRegionQuery,
    DataSortFieldFor,
    Knowledge,
    McpCapability,
} from '@/types'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getKnowledge = async (params: DataRegionQuery<DataListQuery<Knowledge, DataSortFieldFor<'knowledge'>>>): Promise<DataListResult<Knowledge>> => {
    return apiClient.get<unknown, DataListResult<Knowledge>>('/resource/knowledge', { ...baseURL, params })
}

export const getMcpCapabilities = async (params: DataRegionQuery<DataListQuery<McpCapability, DataSortFieldFor<'mcpCapabilities'>>>): Promise<DataListResult<McpCapability>> => {
    return apiClient.get<unknown, DataListResult<McpCapability>>('/resource/mcp-capabilities', { ...baseURL, params })
}
