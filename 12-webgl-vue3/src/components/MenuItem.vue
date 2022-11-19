<template>
	<template v-for="route in routes">
		<a-sub-menu v-if="isMenu(route)" :key="genkey(route.path)">
			<template #title>
				<span :title="route.name">{{ route.name }}</span>
			</template>
			<!-- 递归调用自己 -->
			<MenuItem v-if="hasChildren(route.children)" :routes="route.children" :prefix="genkey(route.path)" />
		</a-sub-menu>
		<template v-else>
			<RouterLink :to="genkey(route.path)" :key="genkey(route.path)" :title="route.name">
				<a-menu-item :key="genkey(route.path)">
					{{ route.name }}
				</a-menu-item>
			</RouterLink>
		</template>
	</template>
</template>

<script setup lang="ts">
import type { MenuType } from '@/router/index'
import { RouterLink } from 'vue-router'
import { toRefs, withDefaults, unref } from 'vue'

type PropsType = {
	routes?: MenuType[]
	prefix?: string
}
const props = withDefaults(defineProps<PropsType>(), {
	routes: () => [],
	prefix: '',
})
const { routes, prefix } = toRefs(props)

function genkey(path: string): string {
	if (unref(prefix) === '') return path
	return [unref(prefix), path].join('/')
}
function isMenu(route: MenuType): boolean {
	return Array.isArray(route.children)
}
function hasChildren(children?: MenuType[]): boolean {
	return Array.isArray(children) && children.length > 0
}
</script>
