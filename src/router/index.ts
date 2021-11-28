import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Index from '@/views/Index.vue';
import Settings from '@/views/Settings.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: '',
        component: Index
    },
    {
        path: '/settings',
        name: 'About',
        component: Settings
    },
]

export default createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes
})
