import apiClient from './apiClient'
import type { LoginResult, RefreshTokenResult, User } from '@/types/auth'

export const login = async (email: string, password: string): Promise<LoginResult> => {
    const response = await apiClient.post<any, LoginResult>('/auth/webLogin', { email, password })
    return response
}

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResult> => {
    const response = await apiClient.post<any, RefreshTokenResult>('/auth/refresh', {}, {
        headers: {
            'x-refresh-token': refreshToken,
        },
    })
    return response
}

export const getUserInfo = async (): Promise<User> => {
    const response = await apiClient.post<any, User>('/auth/getUserInfo')
    return response
}
