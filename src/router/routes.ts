import type { RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: AuthLayout,
        meta: { guestOnly: true },
        children: [
            {
                path: '',
                name: 'LoginView',
                component: () => import('@/views/login/LoginView.vue'),
            },
        ],
    },
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'users',
                name: 'UsersView',
                meta: { permission: 'users' },
                component: () => import('@/views/users/UsersView.vue'),
            },
            {
                path: 'bots',
                name: 'BotsView',
                meta: { permission: 'bots' },
                component: () => import('@/views/bots/BotsView.vue'),
            },
            {
                path: 'knowledge',
                name: 'KnowledgeView',
                meta: { permission: 'knowledge' },
                component: () => import('@/views/knowledge/KnowledgeView.vue'),
            },
            {
                path: 'mcp-capabilities',
                name: 'McpCapabilitiesView',
                meta: { permission: 'mcp-capabilities' },
                component: () => import('@/views/mcp-capabilities/McpCapabilitiesView.vue'),
            },
            {
                path: 'monitor-logs',
                name: 'MonitorLogsView',
                meta: { permission: 'monitor-logs' },
                component: () => import('@/views/monitor-logs/MonitorLogsView.vue'),
            },
            {
                path: 'user-behavior-logs',
                name: 'UserBehaviorLogsView',
                meta: { permission: 'user-behavior-logs' },
                component: () => import('@/views/user-behavior-logs/UserBehaviorLogsView.vue'),
            },
            {
                path: 'data-lookup',
                name: 'DataLookupView',
                meta: { permission: 'data-lookup' },
                component: () => import('@/views/data-lookup/DataLookupView.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'LoginView' },
    },
]
