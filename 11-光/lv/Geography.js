import { Vector3 } from 'https://unpkg.com/three/build/three.module.js';

/*
属性：
  r：半径
  longitude：经度(弧度)
  latitude：纬度(弧度)
  position：三维坐标位

构造参数：
  r,longitude,latitude 
  或者
  position
*/

export default class Geography{
  constructor(r,longitude,latitude) {
    this.r=r
    this.longitude=longitude
    this.latitude = latitude
    this.position = new Vector3()
    this.updatePos()
  }

  //克隆
  clone() {
    const { r, longitude, latitude } = this
    return new Geography(r, longitude, latitude )
  }

  //设置半径
  setR(r) {
    this.r = r
    this.updatePos()
    return this
  }

  //根据经纬度更新三维直角坐标位
  updatePos() {
    const { r, longitude, latitude } = this
    const len = Math.cos(latitude) * r
    this.position.set(
      Math.cos(longitude) * len,
      Math.sin(latitude) * r,
      -Math.sin(longitude)*len
    )
  }


}



