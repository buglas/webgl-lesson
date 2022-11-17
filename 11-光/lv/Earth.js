import Geography from './Geography.js'

/*
属性：
  r：半径
  widthSegments：横向段数，最小3端
  heightSegments：纵向段数，最小3端
  vertices：顶点集合
  normals：法线集合
  indexes：顶点索引集合
  uv：uv坐标
  count：顶点数量
*/
export default class Earth{
  constructor(r=1, widthSegments=16, heightSegments=16){
    this.r=r
    this.widthSegments=widthSegments
    this.heightSegments=heightSegments
    this.vertices=[]
    this.normals=[]
    this.indexes = []
    this.uv=[]
    this.count=0
    this.init()
  }
  init() {
    const { r, widthSegments, heightSegments } = this
    //网格线的数量
    const [width,height]=[widthSegments+1,heightSegments+1]
    //顶点数量
    this.count = width * height
    // theta和phi方向的旋转弧度
    const thetaSize = Math.PI * 2 / widthSegments
    const phiSize = Math.PI / heightSegments
    // 顶点集合
    const vertices = []
    // 法线集合
    const normals = []
    // 顶点索引集合
    const indexes = []
    //uv 坐标集合
    const uv = []
    
    //逐网格线行列的遍历
    for (let y = 0; y < height; y++){
      //维度
      const phi = Math.PI/2 - phiSize * y
      for (let x = 0; x < width; x++){
        //经度，-Math.PI是为了让0°经线经过x轴的正半轴
        const theta = thetaSize * x - Math.PI
        // 计算顶点和法线
        const vertice = new Geography(r, theta, phi).position
        vertices.push(...Object.values(vertice))
        normals.push(...Object.values(vertice.normalize()))
        uv.push(
          x / widthSegments,
          1-y/heightSegments
        )
        //顶点索引
        if (y && x) {
          // 一个矩形格子的左上lt、右上rt、左下lb、右下rb点
          const lt = (y-1) * width + (x-1)
          const rt = (y-1) * width + x
          const lb = y * width + (x-1)
          const rb = y * width + x
          indexes.push(lb, rb, lt, lt, rb, rt)
        }

      }
    }

    this.vertices=new Float32Array(vertices)
    this.normals=new Float32Array(normals)
    this.uv=new Float32Array(uv)
    this.indexes=new Uint16Array(indexes)
  }

}