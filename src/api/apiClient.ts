import axios, { type AxiosResponse, type AxiosError, type AxiosRequestConfig } from 'axios'
import type { Router } from 'vue-router'
import { ApiError, type ApiResponse } from '../types/api'
import type { RefreshTokenResult } from '@/types/auth'

let router: Router | null = null
let isRefreshing = false
let requests: Array<{
    resolve: (token: string) => void
    reject: (error: ApiError) => void
}> = []
let logout: () => void
let refreshToken: () => Promise<RefreshTokenResult | undefined>

const handleRefreshTokenFail = (status: number, errorMsg: string) => {
    logout?.()
    requests.forEach(request => request.reject(new ApiError(status, 401, 'global', errorMsg)))
    requests = []
    isRefreshing = false
    if (status !== 401) {
        return Promise.reject(new ApiError(status, 500, 'global', errorMsg))
    }
    return Promise.reject(new ApiError(status, 401, 'global', errorMsg))
}
export const initApiClient = (options: {
    router: Router
    refreshToken: () => Promise<RefreshTokenResult | undefined>
    logout: () => void
}) => {
    router = options.router
    refreshToken = options.refreshToken
    logout = options.logout
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    skipErrorHandler: false,
})
// const apiClient = new ApiFetch(import.meta.env.VITE_API_BASE_URL, {
//     headers: {
//         'Content-Type': 'application/json',
//     }
// },10000)

// Request interceptor
apiClient.interceptors.request.use(async config => {
    try {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.auth = accessToken
        }
    } catch (e) {
        console.error('[API] Failed to fetch access token:', e)
    }
    return config
})

// Response interceptor
apiClient.interceptors.response.use(
    <T>(res: AxiosResponse<ApiResponse<T>>) => {
        const { errno, errmsg, data } = res.data
        if (errno !== 0 || errmsg !== 'OK') {
            throw new ApiError(500, 500, 'global', 'Invalid API response structure')
        }
        return data
    },
    async (err: AxiosError<ApiResponse<null>>) => {
        const { config, response } = err
        const { skipErrorHandler } = config as AxiosRequestConfig
        const status = response?.status
        const errorCode = response?.data?.errno ?? 500
        const errorMsg = response?.data?.errmsg ?? err.message
        console.error(`[API] ${config?.method?.toUpperCase()} ${config?.url} ${status}: ${errorMsg}`)

        if (!router) {
            console.warn('[API] router not initialized')
            return Promise.reject(new ApiError(500, 500, 'global', errorMsg))
        }

        if (!response || !status) {
            router.push({ name: 'ErrorView', params: { status: 500 } })
            return Promise.reject(new ApiError(500, 500, 'global', errorMsg))
        }

        if (status === 400) {
            return Promise.reject(new ApiError(400, 400, 'view', errorMsg))
        }

        if (status === 401 && config && !config._retry) {
            if (!refreshToken || !logout) {
                console.warn('[API] auth actions not initialized')
                return Promise.reject(new ApiError(status, 500, 'global', errorMsg))
            }

            if (String(config.url ?? '').includes('/auth/refresh')) {
                return handleRefreshTokenFail(status, errorMsg)
            }

            const refreshTokenStr = localStorage.getItem('refreshToken')

            if (!refreshTokenStr) {
                return handleRefreshTokenFail(status, errorMsg)
            }
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    requests.push({
                        resolve: (token: string) => {
                            config.headers.auth = token
                            config._retry = true
                            resolve(apiClient(config))
                        },
                        reject: (error: ApiError) => {
                            reject(error)
                        },
                    })
                })
            }

            config._retry = true
            isRefreshing = true
            let res: RefreshTokenResult | undefined
            try {
                res = await refreshToken()
            } catch (e) {
                console.error('[API] Failed to refresh token:', e)
                return handleRefreshTokenFail(status, errorMsg)
            }

            if (!res) {
                return handleRefreshTokenFail(status, errorMsg)
            }
            for (const request of requests) {
                try {
                    request.resolve(res.accessToken)
                } catch {
                    request.reject(new ApiError(status, 401, 'global', errorMsg))
                }
            }
            requests = []
            isRefreshing = false
            config.headers.auth = res.accessToken
            return apiClient(config)
        }

        const apiError = new ApiError(status, errorCode, 'global', errorMsg)
        if (status !== 401 && !skipErrorHandler) {
            if ([403, 429, 500].includes(status)) {
                router.push({ name: 'ErrorView', params: { status } })
            } else {
                router.push({ name: 'ErrorView', params: { status: 500 } })
            }
        }
        return Promise.reject(apiError)
    },
)

export default apiClient

