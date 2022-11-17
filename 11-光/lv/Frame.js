import Scene from "./Scene.js";

const defAttr = () => ({
  //纹理对象
  texture: null,
  //帧缓冲区
  framebuffer: null,
  //深度缓冲区
  depthbuffer: null,
  //纹理对象尺寸
  width:1024,
  height:1024,
})

export default class Frame extends Scene{
  constructor(attr) {
    super(Object.assign(defAttr(),attr))
    this.init()
  }
  init() {
    const { gl } = this
    this.texture = gl.createTexture()
    this.framebuffer = gl.createFramebuffer()
    this.depthbuffer=gl.createRenderbuffer()
  }
  //绑定帧缓冲区，告诉webgl 要把渲染结果放到帧缓冲区的纹理对象里
  update() {
    const { gl, width, height } = this
    //纹理对象
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR
    )
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA,
      width, height,
      0,gl.RGBA,gl.UNSIGNED_BYTE,null
    )

    //帧缓冲区
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      0
    )

    //深度缓冲区
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthbuffer)
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,height
    )
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,this.depthbuffer
    )

    //视口尺寸
    gl.viewport(0, 0, width, height)

  }

  //清理缓冲区，重置视口
  reset() {
    const { gl } = this
    const { canvas: { width, height } } = gl
    gl.bindFramebuffer(gl.FRAMEBUFFER,null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D,null)
    gl.viewport(0,0,width,height)
  }

  //绘图
  draw() {
    this.update()
    super.draw()
    this.reset()
  }


}



