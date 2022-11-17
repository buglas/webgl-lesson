import { Vector2 } from 'https://unpkg.com/three/build/three.module.js';

/*
属性：
  size:尺寸
  orign:基点，百分比，默认左下角
  vertices：顶点集合
  normals：法线集合
  indexes：顶点索引集合
  uv：uv坐标
*/

export default class Rect{
  constructor(w = 1, h = 1, x = 0, y = 0) {
    this.size=new Vector2(w,h)
    this.orign = new Vector2(x, y)
    this.vertices=new Float32Array()
    this.normals=new Float32Array()
    this.indexes=new Uint16Array()
    this.uv = new Float32Array()
    this.update()
  }
  update() {
    const {size,orign}=this
    const [l, b] = [
      -orign.x * size.x,
      -orign.y * size.y,
    ]
    const [r, t] = [
      size.x + l,
      size.y + b
    ]
    this.vertices = new Float32Array([
      l, t, 0,
      l, b, 0,
      r, t, 0,
      r,b,0,
    ])
    this.normals = new Float32Array([
      0,0,1,
      0,0,1,
      0,0,1,
      0,0,1,
    ])
    this.uv = new Float32Array([
      0, 1,
      0, 0,
      1, 1,
      1,0
    ])
    this.indexes = new Uint16Array([
      0, 1, 2,
      2,1,3
    ])
  }
}


