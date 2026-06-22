export type RequestInterceptorFn = (input: RequestInfo | URL, init?: RequestInit) => [RequestInfo | URL, RequestInit?] | Promise<[RequestInfo | URL, RequestInit?]>;
export type ResponseInterceptorFn = (response: Response) => unknown | Promise<unknown>;
export type ApiResponse<T> = {
    errno: ApiErrorCode
    errmsg: string
    data: T
}
export type ApiErrorCode = 400 | 401 | 403 | 404 | 429 | 500 | 0
export type ApiErrorScope = 'global' | 'view'

export class ApiError extends Error {
    status: number
    code: ApiErrorCode
    scope: ApiErrorScope

    constructor(status: number, code: ApiErrorCode, scope: ApiErrorScope, message?: string) {
        super(message)
        this.status = status
        this.code = code
        this.scope = scope
        this.name = 'ApiError'
        Object.setPrototypeOf(this, new.target.prototype)
    }
}
