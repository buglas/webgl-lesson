const defAttr = () => ({
  geo:null,
  mat:null,
})
export default class Obj3D{
  constructor(attr){
    Object.assign(this,defAttr(),attr)
  }
  init(gl){
    const { mat, geo } = this
    mat.init(gl)
    geo.init(gl,mat.program)
  }
  
  update(gl) {
    this.geo.update(gl)
    this.mat.update(gl)
  }
}