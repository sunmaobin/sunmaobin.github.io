import { createRouter, createHistory } from '@posva/vue-router-next'
import Page1 from '../views/Page1.vue'
import Page2 from '../views/Page2.vue'

const routes = [
    {
        path: '/page1',
        name: 'page1',
        component: Page1
    },
    {
        path: '/page2',
        name: 'page2',
        // lazy-loaded doesn't seem to be implemented yet
        // https://github.com/vuejs/vue-next/issues/777
        component: Page2
    }
]

export const routerHistory = createHistory()
export const router = createRouter({
    history: routerHistory,
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    console.log('beforeEach', to.name);
    next()
})

export default router
