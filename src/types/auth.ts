export type LoginResult = {
    accessToken: string
    refreshToken: string
    expiresAt: number
}

export type RefreshTokenResult = LoginResult

export const COGNITO_ROLES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export type Role = typeof COGNITO_ROLES[number]

export interface User {
    userId: string
    role: Role
    email: string
    username: string
    isPasswordSet: boolean
    botId: string
    soulId: string
}
