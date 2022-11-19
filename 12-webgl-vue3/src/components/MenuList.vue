<template>
	<a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="dark" mode="inline">
		<MenuItem :routes="routes" prefix="" />
	</a-menu>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { routes } from '@/router/index'
import MenuItem from './MenuItem.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])
function setMenuCurrent() {
	const { matched } = route
	openKeys.value = matched.slice(0, matched.length - 1).map((i) => i.path)
	selectedKeys.value = [route.path]
}
onMounted(() => setMenuCurrent())
watch(() => route.path, setMenuCurrent)
</script>
