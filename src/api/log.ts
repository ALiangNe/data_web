import apiClient from './apiClient'
import type {
    DataRegionQuery,
    MonitorTraceDetail,
} from '@/types'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const getMonitorLogsTrace = async (params: DataRegionQuery<{ traceId: string }>): Promise<MonitorTraceDetail | null> => {
    return apiClient.get<unknown, MonitorTraceDetail | null>('/log/monitor-trace', { ...baseURL, params })
}
