import { createProgram } from "./Utils.js";
import {Matrix4} from 'https://unpkg.com/three/build/three.module.js';
import Mat from './Mat.js'
import Geo from './Geo.js'
import Obj3D from './Obj3D.js'
import Earth from './Earth.js'
import Frame from './Frame.js'

const vs = `
  attribute vec4 a_Position;
  attribute vec2 a_Pin;
  uniform mat4 u_PvMatrix;
  uniform mat4 u_ModelMatrix;
  varying vec2 v_Pin;
  void main(){
    gl_Position=u_PvMatrix*u_ModelMatrix*a_Position;
    v_Pin=a_Pin;
  }
`
const fs = `
  precision mediump float;
  uniform sampler2D u_Sampler;
  varying vec2 v_Pin;
  void main(){
    gl_FragColor=texture2D(u_Sampler,v_Pin);
  }
`


/* 参数
  gl,
  orbit,
*/

export default class VRFrame extends Frame{
  constructor(attr) {
    super(attr)
    this.createModel()
  }
  createModel() {
    const { gl,orbit } = this
    this.registerProgram('map', {
      program: createProgram(gl, vs, fs),
      attributeNames: ['a_Position', 'a_Pin'],
      uniformNames:['u_PvMatrix','u_ModelMatrix','u_Sampler']
    })
    const mat = new Mat({
      program: 'map',
      data: {
        u_PvMatrix: {
          value: orbit.getPvMatrix().elements,
          type: 'uniformMatrix4fv',
        },
        u_ModelMatrix: {
          value: new Matrix4().elements,
          type: 'uniformMatrix4fv',
        },
      },
      maps: {
        u_Sampler: {
          magFilter: gl.LINEAR,
          minFilter: gl.LINEAR,
        }
      }
    })
    const earth = new Earth(0.5, 64, 32)
    const geo = new Geo({
      data: {
        a_Position: {
          array: earth.vertices,
          size: 3
        },
        a_Pin: {
          array: earth.uv,
          size: 2
        }
      },
      index: {
        array: earth.indexes
      }
    })
    this.add(new Obj3D({ geo, mat }))
    this.draw()
    this.mat=mat
  }
}




