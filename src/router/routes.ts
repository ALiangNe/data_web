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
                component: () => import('@/views/users/UsersView.vue'),
            },
            {
                path: 'user-memories',
                name: 'UserMemoriesView',
                component: () => import('@/views/user-memories/UserMemoriesView.vue'),
            },
            {
                path: 'auth-providers',
                name: 'AuthProvidersView',
                component: () => import('@/views/auth-providers/AuthProvidersView.vue'),
            },
            {
                path: 'bots',
                name: 'BotsView',
                component: () => import('@/views/bots/BotsView.vue'),
            },
            {
                path: 'chat-histories',
                name: 'ChatHistoriesView',
                component: () => import('@/views/chat-histories/ChatHistoriesView.vue'),
            },
            {
                path: 'chat-topics',
                name: 'ChatTopicsView',
                component: () => import('@/views/chat-topics/ChatTopicsView.vue'),
            },
            {
                path: 'knowledge',
                name: 'KnowledgeView',
                component: () => import('@/views/knowledge/KnowledgeView.vue'),
            },
            {
                path: 'mcp-capabilities',
                name: 'McpCapabilitiesView',
                component: () => import('@/views/mcp-capabilities/McpCapabilitiesView.vue'),
            },
            {
                path: 'media',
                name: 'MediaView',
                component: () => import('@/views/media/MediaView.vue'),
            },
            {
                path: 'monitor-logs',
                name: 'MonitorLogsView',
                component: () => import('@/views/monitor-logs/MonitorLogsView.vue'),
            },
            {
                path: 'user-behavior-logs',
                name: 'UserBehaviorLogsView',
                component: () => import('@/views/user-behavior-logs/UserBehaviorLogsView.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'LoginView' },
    },
]
