<template>
	<canvas ref="canvasRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import vertShaderSource from './shader.vert'
import fragShaderSource from './shader.frag'

const canvasRef = ref<HTMLCanvasElement | null>(null)

let canvas: HTMLCanvasElement
let gl: WebGLRenderingContext
let program: WebGLProgram

//7个一组，前3个为顶点坐标，后4个为颜色坐标
// prettier-ignore
let sources = new Float32Array([
   	 0,    0.2, 0,     1, 0, 1, 1,
   	-0.2, -0.2, 0,     1, 1, 0, 1,
   	 0.2, -0.2, 0,     0, 1, 1, 1
   ])

const elementBytes = Float32Array.BYTES_PER_ELEMENT
const vertSize = 3
const colorSize = 4
const categorySize = vertSize + colorSize
const vertIndex = 0 // 顶点索引
const colorIndex = vertSize * elementBytes // 颜色索引
const sourceSize = sources.length / categorySize // 共有多少个顶点

// 创建shader
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader = gl.createShader(type)
	if (!shader) throw new Error('shader 创建失败')
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	return shader
}
// 创建proram
function createProgram(gl: WebGLRenderingContext, vexShaderSource: string, fragShaderSource: string): WebGLProgram {
	const program = gl.createProgram()
	if (!program) throw new Error('program创建错误')
	const vexShader = createShader(gl, gl.VERTEX_SHADER, vexShaderSource)
	const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource)
	gl.attachShader(program, vexShader)
	gl.attachShader(program, fragShader)
	gl.linkProgram(program)
	gl.useProgram(program)
	return program
}
// 渲染
function render(): void {
	gl = canvas.getContext('webgl') as WebGLRenderingContext
	program = createProgram(gl, vertShaderSource, fragShaderSource)
	gl.clearColor(0, 0, 0, 1)

	gl.clear(gl.COLOR_BUFFER_BIT)
	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sources), gl.STATIC_DRAW)

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	gl.vertexAttribPointer(a_Position, vertSize, gl.FLOAT, false, categorySize * elementBytes, vertIndex)
	gl.enableVertexAttribArray(a_Position)

	const a_Color = gl.getAttribLocation(program, 'a_Color')
	gl.vertexAttribPointer(a_Color, colorSize, gl.FLOAT, false, categorySize * elementBytes, colorIndex)
	gl.enableVertexAttribArray(a_Color)

	gl.drawArrays(gl.TRIANGLES, 0, sourceSize)
}

function init(): void {
	canvas = canvasRef.value as HTMLCanvasElement
	onWindowResize()
	render()
}

function onWindowResize() {
	const container = document.querySelector('.AppContainer') as HTMLElement
	const { width, height } = container.getBoundingClientRect()
	canvas.width = width
	canvas.height = height - 20
}

onMounted(init)
</script>
