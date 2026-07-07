export const DATA_CONSOLE_PERMISSIONS: Record<number, string[]> = {
    1: ['users', 'bots', 'software', 'ota-releases', 'user-behavior-logs', 'knowledge', 'mcp-capabilities', 'monitor-logs', 'data-lookup'],
    5: ['users', 'bots', 'software', 'ota-releases', 'user-behavior-logs', 'knowledge', 'mcp-capabilities', 'monitor-logs', 'data-lookup'],
}

export const APP_SIDEBAR = [
    {
        key: 'user',
        label: 'User',
        children: [
            { name: 'UsersView', label: 'Users', permission: 'users' },
        ],
    },
    {
        key: 'robot',
        label: 'Robot',
        children: [
            { name: 'BotsView', label: 'Bots', permission: 'bots' },
            { name: 'SoftwareView', label: 'Software Packages', permission: 'software' },
            // { name: 'OtaReleasesView', label: 'OTA Releases', permission: 'ota-releases' },
        ],
    },
    {
        key: 'system',
        label: 'System',
        children: [
            { name: 'UserBehaviorLogsView', label: 'User Behavior Logs', permission: 'user-behavior-logs' },
            { name: 'KnowledgeView', label: 'Knowledge', permission: 'knowledge' },
            { name: 'McpCapabilitiesView', label: 'MCP Capabilities', permission: 'mcp-capabilities' },
        ],
    },
    {
        key: 'developer',
        label: 'Developer',
        children: [
            { name: 'MonitorLogsView', label: 'Monitor Logs', permission: 'monitor-logs' },
            { name: 'DataLookupView', label: 'Data Lookup', permission: 'data-lookup' },
        ],
    },
] as const
