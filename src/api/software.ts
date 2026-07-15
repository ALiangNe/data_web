import apiClient from './apiClient'
import type {
    DataCenterSortFieldFor,
    DataListQuery,
    DataListResult,
    Software,
    SoftwareUploadPostParams,
    SoftwareUploadPostResult,
} from '@/types/data'

const baseURL = { baseURL: import.meta.env.VITE_DATA_API_BASE_URL }

export const listSoftware = async (params: DataListQuery<Software, DataCenterSortFieldFor<'software'>>): Promise<DataListResult<Software>> => {
    return apiClient.get<unknown, DataListResult<Software>>('/software/list', { ...baseURL, params })
}

export const getSoftwareVersions = async (name: string): Promise<string[]> => {
    return apiClient.get<unknown, string[]>('/software/versions', { ...baseURL, params: { name } })
}

export const getUploadPost = async (params: SoftwareUploadPostParams): Promise<SoftwareUploadPostResult> => {
    return apiClient.post<unknown, SoftwareUploadPostResult>('/software/upload-post', params, baseURL)
}

export const completeUpload = async (params: { id: string; checksum: string }): Promise<void> => {
    return apiClient.post<unknown, void>('/software/complete-upload', params, baseURL)
}
