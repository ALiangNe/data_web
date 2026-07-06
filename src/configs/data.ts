/* Per-table filter, sort, and time-range configuration */
export const DATA_CENTER_TABLES = {
    bots: {
        filter: ['id', 'ownerId', 'platform', 'status', 'metadata'],
        sortFields: ['createdAt', 'updatedAt', 'registeredAt', 'activatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt', 'registeredAt', 'activatedAt'],
    },
    knowledge: {
        filter: ['id', 'document', 'metadata'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
    mcpCapabilities: {
        filter: ['id', 'document', 'metadata'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
    monitorLogs: {
        filter: ['traceId'],
        sortFields: ['startTimeMs'],
    },
    userBehaviorLogs: {
        filter: ['userId'],
        selectFields: {
            aggregateBy: {
                label: 'aggregateBy',
                default: 'session_id' as const,
                options: [
                    { label: 'deviceId', value: 'device_id' },
                    { label: 'sessionId', value: 'session_id' },
                    { label: 'userId', value: 'user_id' },
                ],
            },
        },
        sortFields: ['createdAt'],
        timeRangeFields: ['createdAt'],
    },
    users: {
        filter: ['id', 'username', 'email', 'role', 'soulId', 'status'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
}

/* Per-table entity configuration for data lookup */
export const DATA_LOOKUP_TABLES = {
    authProviders: {},
    bots: {},
    chatHistories: {},
    chatTopics: {},
    knowledge: {},
    mcpCapabilities: {},
    media: {},
    monitorLogs: {},
    users: {},
    userBehaviorLogs: {},
    userMemories: {},
} as const

/* Dashboard media click chart platform mapping */
export const MEDIA_PLATFORMS = [
    {
        label: 'Instagram',
        events: ['nav-Instagram', 'contact-Instagram: @eloi_0606'],
    },
    {
        label: 'X',
        events: ['nav-X(Twitter)', 'contact-X: @Eloi_0606'],
    },
    {
        label: 'Discord',
        events: ['nav-Discord', 'contact-Discord: @Animotion Party'],
    },
    {
        label: 'LinkedIn',
        events: ['nav-LinkedIn', 'contact-Linkedin: @Animotion Robotics'],
    },
    {
        label: 'Medium',
        events: ['contact-Medium: @Animotion Robotics'],
    },
] as const
