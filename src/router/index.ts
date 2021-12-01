import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Watch from '@/views/Watch.vue';
import Settings from '@/views/Settings.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Settings',
        component: Settings
    },
    {
        path: '/watch',
        name: 'Watch',
        component: Watch
    },
]

export default createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes
})
