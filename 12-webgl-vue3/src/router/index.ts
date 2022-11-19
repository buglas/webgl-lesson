import { createRouter, createWebHistory } from 'vue-router'
import type { AsyncComponentLoader, Component } from 'vue'
export interface MenuType {
	path: string
	name?: string
	component: AsyncComponentLoader<Component>
	children?: MenuType[]
}
export const routes: MenuType[] = [
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/HomeView.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes,
})

export default router
