import { createProgram } from "./Utils.js";
import Mat from './Mat.js'
import Geo from './Geo.js'
import Obj3D from './Obj3D.js'
import Scene from './Scene.js'
import Rect from './Rect.js'

const vs = `
attribute vec4 a_Position;
attribute vec2 a_Pin;
varying vec2 v_Pin;
void main(){
  gl_Position=a_Position;
  v_Pin=a_Pin;
}
`
const fs = `
precision mediump float;
uniform float u_Ratio;
uniform sampler2D u_SampNew;
uniform sampler2D u_SampOld;
varying vec2 v_Pin;
void main(){
  // uv坐标的中心点
  vec2 halfuv=vec2(0.5,0.5);
  //uv坐标缩放系数
  float scale=1.0-u_Ratio*0.2;
  //缩放uv坐标
  vec2 pin=(v_Pin-halfuv)*scale+halfuv;

  //新VR的颜色
  vec4 t1=texture2D(u_SampNew,v_Pin);
  //旧VR的颜色
  // vec4 t2=texture2D(u_SampOld,v_Pin);
  vec4 t2=texture2D(u_SampOld,pin);
  gl_FragColor=mix(t2,t1,u_Ratio);
}
`

export default class VRPlane extends Scene{
  constructor(attr) {
    super(attr)
    this.createModel()
  }
  createModel() {
    const { gl } = this
    this.registerProgram('map', {
      program: createProgram(gl, vs, fs),
      attributeNames: ['a_Position', 'a_Pin'],
      uniformNames:['u_SampNew','u_SampOld','u_Ratio']
    })
    const mat = new Mat({
      program: 'map',
      data: {
        u_Ratio: {
          value: 0,
          type:'uniform1f',
        }
      }
    })
    const rect=new Rect(2,2,0.5,0.5)
    const geo = new Geo({
      data: {
        a_Position: {
          array: rect.vertices,
          size:3
        },
        a_Pin: {
          array: rect.uv,
          size:2
        },
      },
      index: {
        array:rect.indexes
      }
    })
    this.add(new Obj3D({mat,geo}))
    this.mat=mat
  }
}




