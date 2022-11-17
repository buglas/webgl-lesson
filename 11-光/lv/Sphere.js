import {Vector3,Spherical} from 'https://unpkg.com/three/build/three.module.js';

/*
属性：
  r：半径
  widthSegments：横向段数，最小3端
  heightSegments：纵向段数，最小3端
  vertices：顶点集合
  normals：法线集合
  indexes：顶点索引集合
  count：顶点数量
*/
export default class Sphere{
  constructor(r=1, widthSegments=16, heightSegments=16){
    this.r=r
    this.widthSegments=widthSegments
    this.heightSegments=heightSegments
    this.vertices=[]
    this.normals=[]
    this.indexes = []
    this.count=0
    this.init()
  }
  init() {
    const { r, widthSegments, heightSegments } = this
    //顶点数量
    this.count = widthSegments * (heightSegments - 1) + 2
    // 球坐标系
    const spherical = new Spherical()
    // theta和phi方向的旋转弧度
    const thetaSize = Math.PI * 2 / widthSegments
    const phiSize = Math.PI / heightSegments

    // 顶点集合，先内置北极点
    const vertices = [0, r, 0]
    // 法线集合，先内置北极法线
    const normals = [0, 1, 0]
    // 顶点索引集合
    const indexes = []
    // 最后一个顶点索引
    const lastInd = this.count-1
    // 逐行列遍历
    for (let y = 0; y < heightSegments; y++) {
      // 球坐标垂直分量
      const phi = phiSize * y
      for (let x1 = 0; x1 < widthSegments; x1++) {
        // x1后的两列
        const x2 = x1 + 1
        const x3 = x2 % widthSegments + 1
        if (y) {
          // 计算顶点和法线
          spherical.set(r, phi, thetaSize * x1)
          const vertice = new Vector3().setFromSpherical(spherical)
          vertices.push(...vertice)
          normals.push(...vertice.normalize())
        } else {
          // 第一行的三角网
          indexes.push(0, x2, x3)
        }
        if (y < heightSegments - 2) {
          // 一个矩形格子的左上lt、右上rt、左下lb、右下rb点
          const lt = y * widthSegments + x2
          const rt = y * widthSegments + x3
          const lb = (y + 1) * widthSegments + x2
          const rb = (y + 1) * widthSegments + x3
          // 第一行和最后一行中间的三角网
          indexes.push(lb, rb, lt, lt, rb, rt)
          if (y === heightSegments - 3) {
            // 最后一行的三角网
            indexes.push(lastInd, rb, lb)
          }
        }
      }
    }
    // 南极顶点
    vertices.push(0, -r, 0)
    // 南极法线
    normals.push(0, -1, 0)

    this.vertices=new Float32Array(vertices)
    this.normals=new Float32Array(normals)
    this.indexes=new Uint16Array(indexes)
  }

  getTriangles() {
    const {indexes}=this
    // 顶点集合
    const vertices = []
    // 通过顶点索引遍历三角形
    for (let i = 0; i < indexes.length; i += 3) {
      // 三角形的三个顶点
      const p0 = this.getVertice(indexes[i])
      const p1 = this.getVertice(indexes[i + 1])
      const p2 = this.getVertice(indexes[i + 2])
      vertices.push(...p0, ...p1, ...p2)
    }
    return new Float32Array(vertices)
  }

  getVertice(ind) {
    const {vertices}=this
    const i = ind * 3
    return new Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
  }
}