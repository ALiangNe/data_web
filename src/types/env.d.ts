interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_DATA_API_BASE_URL: string
}

declare global {
    interface ImportMeta {
        readonly env: ImportMetaEnv
    }
}

export {}
