<template>
	<a-layout style="min-height: 100vh">
		<a-layout-sider class="AppSider">
			<MenuList />
		</a-layout-sider>
		<a-layout>
			<a-layout-content class="AppContainer">
				<RouterView :key="$route.path" />
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import MenuList from '@/components/MenuList.vue'
</script>
<style>
.AppContainer {
	background-color: #000;
	color: #fff;
}
</style>
