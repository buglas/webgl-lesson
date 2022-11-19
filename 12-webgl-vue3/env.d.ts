/// <reference types="vite/client" />
declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const componnet: DefineComponent<{}, {}, any>
	export default componnet
}

declare module '*.vert' {
	const value: string
	export default value
}
declare module '*.frag' {
	const value: string
	export default value
}
