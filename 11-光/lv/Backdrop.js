/*
属性：
  w：宽
  h：高
  d：深
  vertices：顶点集合
  normals：法线集合
  indexes：顶点索引集合
  count：顶点数量
*/
export default class Backdrop{
  constructor(w, h, d) {
    this.w=w
    this.h=h
    this.d=d
    this.vertices=new Float32Array()
    this.normals=new Float32Array()
    this.indexes = new Float32Array()
    this.count = 12
    this.init()
  }
  init() {
    const [x, y, z] = [this.w / 2, this.h, this.d]
    this.vertices = new Float32Array([
      -x, 0, 0,
      -x, 0, z,
      x, 0, 0,
      x, 0, z,
      -x, y, 0,
      -x, 0, 0,
      x, y, 0,
      x, 0, 0,
    ])
    this.normals = new Float32Array([
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ])

    this.indexes = new Uint16Array([
      0, 1, 2, 2, 1, 3,
      4, 5, 6, 6, 5, 7
    ])
  }
}





