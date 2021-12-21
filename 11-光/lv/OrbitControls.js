import {
      Matrix4, Vector2, Vector3,Spherical
} from 'https://unpkg.com/three/build/three.module.js';
    
const pi2 = Math.PI * 2
const pvMatrix=new Matrix4()

const defAttr = () => ({
  camera: null,
  dom: null,
  target: new Vector3(),
  mouseButtons:new Map([
      [0, 'rotate'],
      [2, 'pan'],
  ]),
  state: 'none',
  dragStart: new Vector2(),
  dragEnd: new Vector2(),
  panOffset: new Vector3(),
  screenSpacePanning: true,
  zoomScale: 0.95,
  spherical:new Spherical(),
  rotateDir: 'xy',
})

export default class OrbitControls{
  constructor(attr){
    Object.assign(this, defAttr(), attr)
    this.resetSpherical()
    this.updateCamera()
  }
  pointerdown({ clientX, clientY,button }) {
    const {dragStart,mouseButtons}=this
    dragStart.set(clientX, clientY)
    this.state = mouseButtons.get(button)
  }
  pointermove({ clientX, clientY }) {
    const { dragStart, dragEnd, state, camera: { type } } = this
    dragEnd.set(clientX, clientY)
    switch (state) {
      case 'pan':
        this[`pan${type}`](dragEnd.clone().sub(dragStart))
        break
      case 'rotate':
        this.rotate(dragEnd.clone().sub(dragStart))
        break
    }
    dragStart.copy(dragEnd)/*  */
  }
  pointerup() {
    this.state = 'none'
  }
  wheel({ deltaY }) {
    const { zoomScale, camera: { type } } = this
    let scale=deltaY < 0?zoomScale:1 / zoomScale
    this[`dolly${type}`](scale)
    this.updateSph()
  }
  dollyPerspectiveCamera(dollyScale) {
    this.spherical.radius /= dollyScale
  }
  dollyOrthographicCamera(dollyScale) {
    const {camera}=this
    camera.zoom *= dollyScale
    camera.updateProjectionMatrix()
  }
  panPerspectiveCamera({ x, y }) {
    const {
      camera: { matrix, position, fov,up },
      dom: { clientHeight },
      panOffset,screenSpacePanning,target
    } = this

    //视线长度：相机视点到目标点的距离
    const sightLen = position.clone().sub(target).length()
    //视椎体垂直夹角的一半(弧度)
    const halfFov = fov * Math.PI / 360
    //目标平面的高度
    const targetHeight = sightLen * Math.tan(halfFov) * 2
    //目标平面与画布的高度比
    const ratio = targetHeight / clientHeight
    //画布位移量转目标平面位移量
    const distanceLeft = x * ratio
    const distanceUp = y * ratio

    //相机平移方向
    //鼠标水平运动时，按照相机本地坐标的x轴平移相机
    const mx = new Vector3().setFromMatrixColumn(matrix, 0)
    //鼠标水平运动时，按照相机本地坐标的y轴，或者-z轴平移相机
    const myOrz = new Vector3()
    if (screenSpacePanning) {
      //y轴，正交相机中默认
      myOrz.setFromMatrixColumn(matrix, 1)
    } else {
      //-z轴，透视相机中默认
      myOrz.crossVectors(up, mx)
    }
    //目标平面位移量转世界坐标
    const vx = mx.clone().multiplyScalar(-distanceLeft)
    const vy = myOrz.clone().multiplyScalar(distanceUp)
    panOffset.copy(vx.add(vy))

    this.updatePos()
  }

  panOrthographicCamera({ x, y }) {
    const {
      camera: { right, left, top, bottom, matrix, up },
      dom: { clientWidth, clientHeight },
      panOffset,screenSpacePanning
    } = this
      
    const cameraW = right - left
    const cameraH = top - bottom
    const ratioX = x / clientWidth
    const ratioY = y / clientHeight
    const distanceLeft = ratioX * cameraW
    const distanceUp = ratioY * cameraH
    const mx = new Vector3().setFromMatrixColumn(matrix, 0)
    const vx = mx.clone().multiplyScalar(-distanceLeft)
    const vy = new Vector3()
    if (screenSpacePanning) {
      vy.setFromMatrixColumn(matrix, 1)
    } else {
      vy.crossVectors(up, mx)
    }
    vy.multiplyScalar(distanceUp)
    panOffset.copy(vx.add(vy))
    this.updatePos()
  }


  rotate({ x, y }) {
    const {
      dom: { clientHeight },
      spherical, rotateDir,
    } = this
    const deltaT = pi2 * x / clientHeight
    const deltaP = pi2 * y / clientHeight
    if (rotateDir.includes('x')) {
      spherical.theta -= deltaT
    }
    if (rotateDir.includes('y')) {
      const phi = spherical.phi - deltaP
      spherical.phi = Math.min(
        Math.PI * 0.99999999,
        Math.max(0.00000001, phi)
      )
    }
    this.updateSph()
  }

  update() {
    const {camera,target,spherical,panOffset} = this
    //基于平移量平移相机
    target.add(panOffset)
    camera.position.add(panOffset)

    //基于球坐标缩放相机
    const rotateOffset = new Vector3()
      .setFromSpherical(spherical)
    camera.position.copy(
      target.clone().add(rotateOffset)
    )

    //更新投影视图矩阵
    camera.lookAt(target)
    camera.updateMatrixWorld(true)
    
    //重置旋转量和平移量
    spherical.setFromVector3(
      camera.position.clone().sub(target)
    )
    panOffset.set(0, 0, 0)
  }

  //基于平移量更新相机轨道
  updatePos() {
    const { camera, target, panOffset } = this
    target.add(panOffset)
    camera.position.add(panOffset)
    this.updateCamera()
    panOffset.set(0, 0, 0)
  }
  //基于球坐标更新相机轨道
  updateSph() {
    const { camera, target, spherical } = this
    const rotateOffset = new Vector3()
      .setFromSpherical(spherical)
    camera.position.copy(
      target.clone().add(rotateOffset)
    )
    this.updateCamera()
    this.resetSpherical()
  }

  // 更新投影视图矩阵
  updateCamera() {
    const { camera, target } = this
    camera.lookAt(target)
    camera.updateMatrixWorld(true)
  }

  // 重置球坐标
  resetSpherical() {
    const {spherical,camera,target}=this
    spherical.setFromVector3(
        camera.position.clone().sub(target)
    )
  }

  getPvMatrix() {
    const { camera: { projectionMatrix, matrixWorldInverse } } = this
    return pvMatrix.multiplyMatrices(
      projectionMatrix,
      matrixWorldInverse,
    )
  }

}