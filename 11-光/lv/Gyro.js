import {Euler} from 'https://unpkg.com/three/build/three.module.js';

const rad = Math.PI / 180

const defAttr = () => ({
  //用于触发事件的按钮
  btn: null,
  //没有陀螺仪
  noDevice: () => { },
  //当点击按钮时
  onClick: () => { },
  //可以使用陀螺仪时触发一次
  init: () => { },
  //用户拒绝开启陀螺仪
  reject: () => { },
  //请求失败
  error: () => { },
  //陀螺仪变换
  change: () => { },
})

export default class Gyro{
  constructor(attr) {
    Object.assign(this,defAttr(),attr)
  }
  //开启陀螺仪
  start() {
    const { btn } = this
    if (window.DeviceMotionEvent) {
      // 让用户触发陀螺仪的监听事件
      btn.addEventListener('click', () => {
        this.onClick()
        //若系统是ios，需要请求用户许可
        if (DeviceMotionEvent.requestPermission) {
          this.requestPermission()
        } else {
          this.translate()
        }
      })
    } else {
      this.noDevice()
    }
  }
  //请求用户许可
  requestPermission() {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
      // granted:用户允许浏览器监听陀螺仪事件
      if (permissionState === 'granted') {
        this.translate()
      } else {
        this.reject()
      }
    }).catch((err) => {
      this.error(err)
    });
  }
  // 监听陀螺仪
  translate() {
    this.init()
    window.addEventListener('deviceorientation', ({ beta, alpha, gamma }) => {
      this.change(new Euler(
        beta * rad,
        alpha * rad,
        -gamma * rad,
        'YXZ'
      ))
    })
  }
}




