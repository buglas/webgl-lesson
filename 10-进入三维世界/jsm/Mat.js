const defAttr = () => ({
  program:null,
  data: {},
  mode: 'TRIANGLES',
  maps: {},
})
export default class Mat{
  constructor(attr){
    Object.assign(this,defAttr(),attr)
  }
  init(gl){
    const { program, data, maps } = this
    for (let [key, obj] of [...Object.entries(data), ...Object.entries(maps)]) {
      obj.location=gl.getUniformLocation(program, key)
      obj.needUpdate=true
    }
  }
  
  update(gl) {
    this.updateData(gl)
    this.updateMaps(gl)
  }
  updateData(gl) {
    for (let obj of Object.values(this.data)) {
      if(!obj.needUpdate){continue}
      obj.needUpdate = false
      const { type, value, location } = obj
      if (type.includes('Matrix')) {
        gl[type](location,false,value)
      } else {
        gl[type](location,value)
      }
    }
  }
  updateMaps(gl) {
    Object.values(this.maps).forEach((map, ind) => {
      if(!map.needUpdate){return}
      map.needUpdate = false
      const {
            format = gl.RGB,
            image,
            wrapS,
            wrapT,
            magFilter,
            minFilter,
            location,
        } = map

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.activeTexture(gl[`TEXTURE${ind}`])
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            format,
            format,
            gl.UNSIGNED_BYTE,
            image
        )
        wrapS&&gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_WRAP_S,
            wrapS
        )
        wrapT&&gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_WRAP_T,
            wrapT
        )
        magFilter&&gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_MAG_FILTER,
            magFilter
        )
        if (!minFilter || minFilter > 9729) {
            gl.generateMipmap(gl.TEXTURE_2D)
        }
        minFilter&&gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_MIN_FILTER,
            minFilter
        )
        gl.uniform1i(location, ind)
    })
  }
  setData(key,val) {
    const obj = this.data[key]
    if(!obj){return}
    obj.needUpdate = true
    Object.assign(obj,val)
  }
  setMap(key,val) {
    const obj = this.maps[key]
    if(!obj){return}
    obj.needUpdate = true
    Object.assign(obj,val)
  }
}