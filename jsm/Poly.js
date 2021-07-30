const defAttr=()=>({
  gl:null,
  vertices:[],
  geoData:[],
  size:2,
  attrName:'a_Position',
  uniName:'u_IsPOINTS',
  count:0,
  types: ['POINTS'],
  circleDot: false,
  u_IsPOINTS:null
})
export default class Poly{
  constructor(attr){
    Object.assign(this,defAttr(),attr)
    this.init()
  }
  init(){
    const {attrName,size,gl,circleDot}=this
    if(!gl){return}
    //缓冲对象
    const vertexBuffer = gl.createBuffer();
    //绑定缓冲对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //写入数据
    this.updateBuffer()
    //获取attribute 变量
    const a_Position=gl.getAttribLocation(gl.program, attrName)
    //修改attribute 变量
    gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0)
    //赋能-批处理
    gl.enableVertexAttribArray(a_Position)
    //如果是圆点，就获取一下uniform 变量
    if (circleDot) {
      this.u_IsPOINTS=gl.getUniformLocation(gl.program, 'u_IsPOINTS')
    }
  }

  updateBuffer(){
    const {gl,vertices}=this
    this.updateCount()
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW)
  }
  updateCount(){
    this.count=this.vertices.length/this.size
  }
  addVertice(...params){
    this.vertices.push(...params)
    this.updateBuffer()
  }
  popVertice(){
    const {vertices,size}=this
    const len=vertices.length
    vertices.splice(len-size,len)
    this.updateCount()
  }
  setVertice(ind,...params){
    const {vertices,size}=this
    const i=ind*size
    params.forEach((param,paramInd)=>{
      vertices[i+paramInd]=param
    })
  }
  updateVertices(params){
    const {geoData}=this
    const vertices=[]
    geoData.forEach(data=>{
      params.forEach(key=>{
        vertices.push(data[key])
      })
    })
    this.vertices=vertices
  }
  draw(types=this.types){
    const {gl,count,circleDot,u_IsPOINTS}=this
    for (let type of types) {
      circleDot&&gl.uniform1f(u_IsPOINTS,type==='POINTS')
      gl.drawArrays(gl[type],0,count);
    }
  }
}