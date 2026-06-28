export const DATA_CONSOLE_PERMISSIONS: Record<number, string[]> = {
    2: ['bots', 'knowledge', 'mcp-capabilities', 'monitor-logs', 'user-behavior-logs', 'users'],
    5: ['bots'],
}

export const APP_SIDEBAR = [
    { name: 'BotsView', label: 'Bots', permission: 'bots' },
    { name: 'KnowledgeView', label: 'Knowledge', permission: 'knowledge' },
    { name: 'McpCapabilitiesView', label: 'McpCapabilities', permission: 'mcp-capabilities' },
    { name: 'MonitorLogsView', label: 'MonitorLogs', permission: 'monitor-logs' },
    { name: 'UserBehaviorLogsView', label: 'UserBehaviorLogs', permission: 'user-behavior-logs' },
    { name: 'UsersView', label: 'Users', permission: 'users' },
] as const

export const resolveDefaultRoute = (role: number) => {
    const permissions = DATA_CONSOLE_PERMISSIONS[role] ?? []
    return APP_SIDEBAR.find(item => permissions.includes(item.permission))?.name
}
