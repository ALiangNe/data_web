export const DATA_CONSOLE_PERMISSIONS: Record<number, string[]> = {
    1: ['bots', 'knowledge', 'mcp-capabilities', 'monitor-logs', 'user-behavior-logs', 'users', 'data-lookup'],
    5: ['bots', 'knowledge', 'mcp-capabilities', 'monitor-logs', 'user-behavior-logs', 'users', 'data-lookup'],
}

export const APP_SIDEBAR = [
    {
        key: 'management',
        label: 'Management',
        children: [
            { name: 'BotsView', label: 'Bots', permission: 'bots' },
            { name: 'KnowledgeView', label: 'Knowledge', permission: 'knowledge' },
            { name: 'McpCapabilitiesView', label: 'MCP Capabilities', permission: 'mcp-capabilities' },
            { name: 'UserBehaviorLogsView', label: 'User Behavior Logs', permission: 'user-behavior-logs' },
            { name: 'UsersView', label: 'Users', permission: 'users' },
        ],
    },
    {
        key: 'developer-tools',
        label: 'Developer Tools',
        children: [
            { name: 'MonitorLogsView', label: 'Monitor Logs', permission: 'monitor-logs' },
            { name: 'DataLookupView', label: 'Data Lookup', permission: 'data-lookup' },
        ],
    },
] as const

// TODO: 逻辑不该写在config中
export const resolveDefaultRoute = (role: number) => {
    const permissions = DATA_CONSOLE_PERMISSIONS[role] ?? []
    for (const group of APP_SIDEBAR) {
        const item = group.children.find((child) => permissions.includes(child.permission))
        if (item) return item.name
    }
}
