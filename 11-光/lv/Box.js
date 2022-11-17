/*
属性：
  w：宽
  h：高
  d：深
  vertices：顶点集合
  normals：法线集合
  indexes：顶点索引集合
  uv：uv坐标集合
  count：顶点数量
*/
export default class Box{
  constructor(w=1,h=1,d=1){
    this.w=w
    this.h=h
    this.d=d
    this.vertices=null
    this.normals=null
    this.indexes = null
    this.uv = null
    this.count = 36
    this.init()
  }
  init() {
    const [x, y, z] = [this.w / 2, this.h / 2, this.d / 2]
    this.vertices = new Float32Array([
      // 前 0 1 2 3
      -x, y, z, -x, -y, z, x, y, z, x, -y, z,
      // 右 4 5 6 7
      x, y, z, x, -y, z, x, y, -z, x, -y, -z,
      // 后 8 9 10 11
      x, y, -z, x, -y, -z, -x, y, -z, -x, -y, -z,
      // 左 12 13 14 15 
      -x, y, -z, -x, -y, -z, -x, y, z, -x, -y, z,
      // 上 16 17 18 19
      -x, y, -z, -x, y, z, x, y, -z, x, y, z,
      // 下 20 21 22 23 
      -x,-y,z,-x,-y,-z,x,-y,z,x,-y,-z,
    ])
    this.normals = new Float32Array([
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      0,-1,0,0,-1,0,0,-1,0,0,-1,0,
    ])
    this.uv = new Float32Array([
      0,1, 0,0.5, 0.25,1, 0.25,0.5,
      0.25,1, 0.25,0.5, 0.5,1, 0.5,0.5,
      0.5,1, 0.5,0.5, 0.75,1, 0.75,0.5,
      0,0.5,0,0,0.25,0.5,0.25,0,
      0.25,0.5,0.25,0,0.5,0.5,0.5,0,
      0.5,0.5,0.5,0,0.75,0.5,0.75,0,
    ])
    this.indexes = new Uint16Array([
      0, 1, 2, 2, 1, 3,
      4, 5, 6, 6, 5, 7,
      8, 9, 10, 10, 9, 11,
      12, 13, 14, 14, 13, 15,
      16, 17, 18, 18, 17, 19, 
      20,21,22,22,21,23
    ])
  } 
}