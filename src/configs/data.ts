/* Per-table filter, sort, and time-range configuration */
export const DATA_CENTER_TABLES = {
    users: {
        filter: ['id', 'username', 'email', 'role', 'soulId', 'status'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
    authProviders: {
        filter: ['id', 'userId', 'provider', 'userProviderId', 'email', 'emailVerified'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
    bots: {
        filter: ['id', 'ownerId', 'platform', 'status', 'metadata'],
        sortFields: ['createdAt', 'updatedAt', 'registeredAt', 'activatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt', 'registeredAt', 'activatedAt'],
    },
    chatHistories: {
        filter: ['id', 'role', 'content', 'userId', 'soulId', 'conversationId', 'topicId', 'metadata'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
    chatTopics: {
        filter: ['id', 'summary', 'participants', 'soulId', 'conversationId', 'metadata'],
        sortFields: ['createdAt', 'updatedAt', 'startedAt', 'endedAt'],
        timeRangeFields: ['createdAt', 'updatedAt', 'startedAt', 'endedAt'],
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
    media: {
        filter: ['id', 'ownerId', 'mimeType', 'storageKey', 'sizeBytes', 'metadata', 'status', 'reason'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
    monitorLogs: {
        filter: ['service', 'env', 'instanceId', 'traceId', 'spanId', 'parentSpanId', 'name', 'status', 'botId', 'soulId', 'meta', 'error'],
        sortFields: ['startTimeMs', 'durationMs'],
        timeRangeFields: ['startTimeMs'],
    },
    userBehaviorLogs: {
        filter: ['deviceId', 'sessionId', 'userId', 'platform', 'userAgent', 'screenSize', 'language', 'timezone', 'referrer', 'utmSource', 'eventType', 'eventName', 'clientIp', 'metadata'],
        sortFields: ['createdAt'],
        timeRangeFields: ['createdAt'],
    },
    userMemories: {
        filter: ['id', 'memory', 'userId', 'soulId', 'metadata'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
}
