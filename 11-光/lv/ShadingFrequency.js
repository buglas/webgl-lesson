import {Vector3} from 'https://unpkg.com/three/build/three.module.js';

// 逐三角形着色
function flatShading(vertices,indexes){
  // flat 法线集合
  const normals=[]
  //通过顶点索引遍历三角形
  for(let i=0;i<indexes.length;i+=3){
    // 三角形的三个顶点
    const p0=getVertice(vertices,indexes[i])
    const p1=getVertice(vertices,indexes[i+1])
    const p2=getVertice(vertices,indexes[i+2])
    // 三角面的法线
    const n=p2.clone().sub(p1)
      .cross(
        p0.clone().sub(p1)
      ).normalize()
    normals.push(...n,...n,...n)
  }
  return new Float32Array(normals)
}

// 逐顶点着色
function gouraudShading(vertices, indexes, type = 1) {
  const normals = []
  for (let i = 0; i < vertices.length / 3; i++){
    normals.push(...getGouraudNormal(i,vertices,indexes,type))
  }
  return new Float32Array(normals)
}
//获取顶点所对应的法线
function getGouraudNormal(ind,vertices,indexes,type) {
  const normal = new Vector3()
  if (type) {
    const triangles = []
    let sunArea = 0
    findTriangles(ind, vertices, indexes, n => {
      const area = n.length()
      sunArea += area
      triangles.push({n,area})
    })
    triangles.forEach(({ n, area }) => {
      normal.add(
        n.setLength(area/sunArea)
      )
    })
  } else {
    findTriangles(ind, vertices, indexes, n => {
      normal.add(n.normalize())
    })
  }
  return normal.normalize();
}
// 寻找与顶点相邻的所有三角形
function findTriangles(ind,vertices,indexes,fn) {
  for (let i = 0; i < indexes.length; i += 3){
    if (indexes.slice(i, i + 3).includes(ind)) {
      const p0=getVertice(vertices,indexes[i])
      const p1=getVertice(vertices,indexes[i+1])
      const p2 = getVertice(vertices, indexes[i + 2])
      const n = p2.clone().sub(p1)
        .cross(p0.clone().sub(p1))
      fn(n)
    }
  }
}

// 通过顶点索引从顶点集合中获取顶点
function getVertice(vertices,ind){
  const i=ind*3
  return new Vector3(vertices[i],vertices[i+1],vertices[i+2],)
}

export {
  flatShading,
  gouraudShading
}