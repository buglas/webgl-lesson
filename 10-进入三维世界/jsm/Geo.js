const defAttr = () => ({
  data: {},
  count: 0,
  index: null,
  drawType:'drawArrays'
})
export default class Geo{
  constructor(attr){
    Object.assign(this,defAttr(),attr)
  }
  init(gl,program){
    gl.useProgram(program)
    this.initData(gl, program)
    this.initIndex(gl)
  }
  initData(gl,program) {
    for (let [key, attr] of Object.entries(this.data)) {
      attr.buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, attr.array, gl.STATIC_DRAW)
      const location = gl.getAttribLocation(program, key)
      gl.vertexAttribPointer(location, attr.size, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(location)
      attr.location=location
    }
  }
  initIndex(gl) {
    const { index } = this
    if (index) {
      this.count = index.array.length
      this.drawType='drawElements'
      index.buffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index.buffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,index.array,gl.STATIC_DRAW)
    } else {
      const { array, size } = this.data['a_Position']
      this.count = array.length / size
      this.drawType='drawArrays'
    }
  }
  update(gl) {
    this.updateData(gl)
    this.updateIndex(gl)
  }
  updateData(gl) {
    for (let attr of Object.values(this.data)) {
      const {buffer,location,size,needUpdate,array}=attr
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
      if (needUpdate) {
        attr.needUpdate = false
        gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW)
      }
      gl.vertexAttribPointer(location,size,gl.FLOAT,false,0,0)
    }
  }
  updateIndex(gl) {
    const { index } = this
    if (index) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index.buffer)
      if (index.needUpdate) {
        index.needUpdate = false
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,index.array,gl.STATIC_DRAW)
      }
    }
  }
  setData(key,val) {
    const obj = this.data[key]
    if(!obj){return}
    obj.needUpdate = true
    Object.assign(obj,val)
  }
  setIndex(val) {
    const { index } = this
    if (val) {
      index.needUpdate = true
      index.array=val
      this.count = val.length
      this.drawType='drawElements'
    } else {
      const {array,size}=this.data['a_Position']
      this.count=array.length/size
      this.drawType='drawArrays'
    }
  }
}