import { Vector2 } from 'https://unpkg.com/three/build/three.module.js';

/*
属性：
  points:线条节点,二维，[Vector2,Vector2,……]
  lineWidth：线宽
  vertices：顶点集合
  normals：法线集合
  indexes：顶点索引集合
  uv：uv坐标集合
*/

export default class BoldLine{
  constructor(points = [], lineWidth = 1) {
    this.points = points
    this.lineWidth = lineWidth
    this.vertices=null
    this.normals=null
    this.indexes=null
    this.uv=null
    this.init()
  }
  init() {
    const { points, lineWidth: h } = this
    const len = points.length
    if(len<2){return}

    // 挤压线条，获取顶点
    const extrudePoints = this.extrude()
    
    // 顶点集合
    const vertices = []
    // 顶点索引
    const indexes = []
    // uv 坐标
    const uv=[]
    
    // 以线段挤压出的四边形为单位，构建顶点集合、顶点索引、uv
    const len1 = points.length - 1
    for (let i = 0; i < len1; i++){
      // 四边形的4个顶点
      const pi = i * 2
      const [A1, A2, B1, B2] = [
        extrudePoints[pi],
        extrudePoints[pi+1],
        extrudePoints[pi+2],
        extrudePoints[pi+3],
      ]
      vertices.push(
        ...A1,...A2,...B1,...B2
      )

      // 顶点索引
      const A1i = i * 4
      const A2i=A1i+1
      const B1i=A1i+2
      const B2i=A1i+3
      indexes.push(
        A1i, A2i, B1i,
        B1i,A2i,B2i
      )

      // 让四边形躺平
      const ang=-B1.clone().sub(A1).angle()
      const O = new Vector2()
      const [lb, rt, rb] = [
        A2.clone().sub(A1).rotateAround(O,ang),
        B1.clone().sub(A1).rotateAround(O,ang),
        B2.clone().sub(A1).rotateAround(O,ang),
      ]
      uv.push(
        0, 1,
        lb.x/h,0,
        rt.x/h,1,
        rb.x/h,0,
      )

    }
    

    this.vertices=new Float32Array(vertices)
    this.indexes=new Uint16Array(indexes)
    this.uv=new Float32Array(uv)

  }

  extrude() {
    const { points } = this
    // 线宽的一半
    const h = this.lineWidth / 2
    // 挤压出来的顶点集合
    const extrudePoints = [
      ...this.verticalPoint(points[0],points[1],h)
    ]
    // 挤压线条内部点，置入extrudePoints
    const len1 = points.length - 1
    const len2 = len1 - 1
    for (let i = 0; i < len2; i++){
      // 三个点，两条线
      const [A, B, C] = [
        points[i],
        points[i+1],
        points[i+2],
      ]
      // 线段AB和线段BC是否相交
      if (this.intersect(A, B, C)) {
        extrudePoints.push(
          ...this.interPoint(A,B,C,h)
        )
      } else {
        extrudePoints.push(
          ...this.verticalPoint(B,C,h)
        )
      }
    }

    // 挤压最后一个点
    extrudePoints.push(
      ...this.verticalPoint(
        points[len2],points[len1],h,points[len1]
      )
    )

    return extrudePoints
  }

  // 垂直挤压
  verticalPoint(A, B, h, M = A) {
    const {x,y}=B.clone().sub(A)
    return [
      new Vector2(-y,x).setLength(h).add(M),
      new Vector2(y,-x).setLength(h).add(M),
    ]
  }

  // 两条线段是否相交
  intersect(A,B,C) {
    const [angAB, angBC] = [
      B.clone().sub(A).angle(),
      C.clone().sub(B).angle(),
    ]
    return !!(angAB-angBC)%Math.PI
  }

  // 两条线段相交时，取拐点
  interPoint(A,B,C,h) {
    // 计算向量BD的单位向量d
    const d = B.clone().sub(A).normalize()
    // 计算向量BE的单位向量e
    const e = B.clone().sub(C).normalize()
    // 由等边平行四边形定理，可求得BB2 的单位向量b
    const b=d.clone().add(e).normalize()
    // 向量BG
    const BG = new Vector2(d.y, -d.x).setLength(h)
    // BG 的长度
    const BGLen = BG.length()
    // cos∠B2BG
    const cos = BG.clone().dot(b) / BGLen
    // 向量BB2
    const BB2=b.setLength(BGLen/cos)
    // 向量BB2取反-BB1
    const BB1 = BB2.clone().negate()
    // 自上往下返回挤压点
    return [
      BB1.add(B),
      BB2.add(B),
    ]


  }
}













