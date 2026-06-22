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
        filter: ['service', 'env', 'instanceId', 'traceId', 'spanId', 'parentSpanId', 'name', 'status', 'botId', 'soulId', 'meta', 'error'],
        sortFields: ['startTimeMs', 'durationMs'],
        timeRangeFields: ['startTimeMs'],
    },
    userBehaviorLogs: {
        filter: ['deviceId', 'sessionId', 'userId', 'platform', 'userAgent', 'screenSize', 'language', 'timezone', 'referrer', 'utmSource', 'eventType', 'eventName', 'clientIp', 'metadata'],
        sortFields: ['createdAt'],
        timeRangeFields: ['createdAt'],
    },
    users: {
        filter: ['id', 'username', 'email', 'role', 'soulId', 'status'],
        sortFields: ['createdAt', 'updatedAt'],
        timeRangeFields: ['createdAt', 'updatedAt'],
    },
}
