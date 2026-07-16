import apiClient from './apiClient'
import type { LoginResult, RefreshTokenResult, User } from '@/types/auth'

export const login = async (email: string, password: string): Promise<LoginResult> => {
    const response = await apiClient.post<unknown, LoginResult>('/auth/login-pwd', { email, password })
    return response
}

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResult> => {
    const response = await apiClient.post<unknown, RefreshTokenResult>('/auth/refresh-token', {}, {
        headers: {
            'Authorization': 'Refresh ' + refreshToken,
        },
    })
    return response
}

export const getUserInfo = async (): Promise<User> => {
    const response = await apiClient.get<unknown, User>('/user/info')
    return response
}
