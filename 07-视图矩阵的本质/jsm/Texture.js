const defAttr = () => ({
  image,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  format,
})

export default class Texture{
  constructor(attr){
    Object.assign(this,defAttr(),attr)
    this.init()
  }
  init(){
    
  }
}