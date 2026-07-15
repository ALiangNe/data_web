export const DATA_CONSOLE_PERMISSIONS: Record<number, string[]> = {
    0: ['users', 'bots', 'software', 'user-behavior-logs', 'knowledge', 'mcp-capabilities', 'monitor-logs', 'data-lookup'],
    1: ['users', 'bots', 'software', 'user-behavior-logs', 'knowledge', 'mcp-capabilities', 'monitor-logs', 'data-lookup'],
    2: ['bots', 'software'],
    3: ['users', 'user-behavior-logs', 'knowledge'],
}

export const APP_SIDEBAR = [
    {
        key: 'user-operations',
        label: 'User Operations',
        children: [
            { name: 'UsersView', label: 'Users', permission: 'users' },
            { name: 'UserBehaviorLogsView', label: 'User Behavior Logs', permission: 'user-behavior-logs' },
        ],
    },
    {
        key: 'robot-management',
        label: 'Robot Management',
        children: [
            { name: 'BotsView', label: 'Bots', permission: 'bots' },
            { name: 'SoftwareView', label: 'Software Packages', permission: 'software' },
        ],
    },
    {
        key: 'ai-resources',
        label: 'AI Resources',
        children: [
            { name: 'KnowledgeView', label: 'Knowledge', permission: 'knowledge' },
            { name: 'McpCapabilitiesView', label: 'MCP Capabilities', permission: 'mcp-capabilities' },
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
