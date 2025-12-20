import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter(
    {
        history: createWebHashHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: '/',
                redirect: '/login',
            },
            {
                path: '/login',
                name: 'login',
                component: () => import('@/components/LoginForm.vue'),
            },
            {
                path: '/register',
                name: 'register',
                component: () => import('@/components/RegisterForm.vue'),
            },
            {
                path: '/welcome',
                name: 'welcome',
                component: () => import('@/components/Welcome.vue'),
            },
            {
                path: '/:pathMatch(.*)*',
                redirect: '/not-found'
            },
            {
                path: '/not-found',
                name: 'notFound',
                component: () => import('@/components/NotFound.vue')
            }
        ]
    }
)

export default router