/* 
attributes 数据结构:{
  a_Position: {
    size: 3,
    index:0
  }
}
uniforms 数据结构:{
  u_Color: {
    type: 'uniform1f',
    value:1
  }
}
*/
const defAttr = () => ({
  gl:null,
  type:'POINTS',
  source:[],
  sourceSize:0,
  elementBytes:4,
  categorySize: 0,
  attributes: {},
  uniforms: {},
})
export default class Poly{
  constructor(attr){
    Object.assign(this,defAttr(),attr)
    this.init()
  }
  init(){
    if (!this.gl) { return }
    this.calculateSize()
    this.updateAttribute();
    this.updateUniform();
  }
  calculateSize() {
    const {attributes, elementBytes,source } = this
    let categorySize = 0
    Object.values(attributes).forEach(ele => {
      const { size, index } = ele
      categorySize += size
      ele.byteIndex=index*elementBytes
    })
    this.categorySize = categorySize
    this.categoryBytes=categorySize*elementBytes
    this.sourceSize = source.length / categorySize
  }
  updateAttribute() {
    const { gl, attributes, categoryBytes, source } = this
    const sourceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source), gl.STATIC_DRAW)
    for (let [key, { size, byteIndex }] of Object.entries(attributes)) {
      const attr = gl.getAttribLocation(gl.program, key)
      gl.vertexAttribPointer(
        attr,
        size,
        gl.FLOAT,
        false,
        categoryBytes,
        byteIndex
      )
      gl.enableVertexAttribArray(attr)
    }
  }
  updateUniform() {
    const {gl,uniforms}=this
    for (let [key, val] of Object.entries(uniforms)) {
      const { type, value } = val
      const u = gl.getUniformLocation(gl.program, key)
      if (type.includes('Matrix')) {
        gl[type](u,false,value)
      } else {
        gl[type](u,value)
      }
    }
  }
  draw(type = this.type) {
    const { gl, sourceSize } = this
    gl.drawArrays(gl[type],0,sourceSize);
  }
}