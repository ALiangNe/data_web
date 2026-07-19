import apiClient from './apiClient'
import type {
    DataSortFieldFor,
    DataListQuery,
    DataListResult,
    DataRegionQuery,
    Software,
    SoftwareUploadPostParams,
    SoftwareUploadPostResult,
} from '@/types'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const listSoftware = async (params: DataRegionQuery<DataListQuery<Software, DataSortFieldFor<'software'>>>): Promise<DataListResult<Software>> => {
    return apiClient.get<unknown, DataListResult<Software>>('/software/list', { ...baseURL, params })
}

export const getSoftwareVersions = async (params: DataRegionQuery<{ name: string }>): Promise<string[]> => {
    return apiClient.get<unknown, string[]>('/software/versions', { ...baseURL, params })
}

export const getUploadPost = async (params: DataRegionQuery<SoftwareUploadPostParams>): Promise<SoftwareUploadPostResult> => {
    return apiClient.post<unknown, SoftwareUploadPostResult>('/software/upload-post', params, baseURL)
}

export const completeUpload = async (params: DataRegionQuery<{ id: string; checksum: string }>): Promise<void> => {
    return apiClient.post<unknown, void>('/software/complete-upload', params, baseURL)
}
