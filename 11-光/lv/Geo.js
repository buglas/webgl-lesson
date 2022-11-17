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
    this.initData(gl, program)
    this.initIndex(gl)
  }
  initData(gl) {
    for (let attr of Object.values(this.data)) {
      attr.buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, attr.array, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
      attr.needUpdate=true
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
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
      index.needUpdate=true
    } else {
      const { array, size } = this.data['a_Position']
      this.count = array.length / size
      this.drawType='drawArrays'
    }
  }
  update(gl,attrs) {
    this.updateData(gl,attrs)
    this.updateIndex(gl)
  }
  updateData(gl,attrs) {
    for (let [key,attr] of Object.entries(this.data)) {
      const { buffer, size, needUpdate, array } = attr
      const location=attrs.get(key)
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
      if (needUpdate) {
        attr.needUpdate = false
        gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW)
      }
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(location)
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