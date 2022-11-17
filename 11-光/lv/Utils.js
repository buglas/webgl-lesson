import { Vector3} from 'https://unpkg.com/three/build/three.module.js';

function initShaders(gl, vsSource, fsSource) {
  //创建程序对象
  const program = gl.createProgram();
  //建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader);
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader);
  //连接webgl上下文对象和程序对象
  gl.linkProgram(program);
  //启动程序对象
  gl.useProgram(program);
  //将程序对象挂到上下文对象上
  gl.program = program;
  return true;
}
function createProgram(gl, vsSource, fsSource) {
  //创建程序对象
  const program = gl.createProgram();
  //建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader);
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader);
  //连接webgl上下文对象和程序对象
  gl.linkProgram(program);
  return program
}

function loadShader(gl, type, source) {
  //根据着色类型，建立着色器对象
  const shader = gl.createShader(type);
  //将着色器源文件传入着色器对象中
  gl.shaderSource(shader, source);
  //编译着色器对象
  gl.compileShader(shader);
  //返回着色器对象
  return shader;
}

function getMousePosInWebgl({ clientX, clientY }, canvas) {
  //鼠标在画布中的css位置
  const { left, top, width, height } = canvas.getBoundingClientRect();
  const [cssX, cssY] = [clientX - left, clientY - top];
  //解决坐标原点位置的差异
  const [halfWidth, halfHeight] = [width / 2, height / 2];
  const [xBaseCenter, yBaseCenter] = [
    cssX - halfWidth,
    cssY - halfHeight,
  ];
  // 解决y 方向的差异
  const yBaseCenterTop = -yBaseCenter;
  //解决坐标基底的差异
  return {
    x: xBaseCenter / halfWidth,
    y: yBaseCenterTop / halfHeight
  }
}

function glToCssPos({ x, y }, { width, height }) {
  const [halfWidth, halfHeight] = [width / 2, height / 2];
  return {
    x: x * halfWidth,
    y: -y * halfHeight
  }
}

//线性比例尺
function ScaleLinear(ax, ay, bx, by) {
  const delta = {
    x: bx - ax,
    y: by - ay,
  };
  const k = delta.y / delta.x;
  const b = ay - ax * k;
  return function (x) {
    return k * x + b;
  };
}

/* 正弦函数 */
function SinFn(a, Omega, phi) {
  return function (x) {
    return a * Math.sin(Omega * x + phi);
  }
}

/* GetIndexInGrid
  在由一维数组建立的栅格矩阵中，基于行列获取元素的索引位置
*/
function GetIndexInGrid(w, size) {
  return function (x, y) {
    return (y * w + x) * size
  }
}

/* 对Image 加载事件的封装 */
function imgPromise(img){
  return new Promise((resolve)=>{
    img.onload=function(){
        resolve(img);
    }
  });
}

/* 解析渐变节点 */
function parseColorStops(source) {
    const stops = new Array(16).fill(-1);
    source.forEach(({ color, stop }, stopInd) => {
        let rgb = '';
        let ar = '';
        color.forEach((ele, ind) => {
          //1 1001 '1001' '001'
          const str = (ele + 1000).toString().slice(1);
          if (ind < 3) {
              rgb += str;
          } else {
              ar += str;
          }
        })
        ar += (Math.round(stop * 255) + 1000).toString().slice(1);
        stops[stopInd * 2] = rgb;
        stops[stopInd * 2 + 1] = ar;
    })
    return stops;
}

const isPC=()=>!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)

function worldPos({ clientX, clientY },canvas,pvMatrix) {
  const [hw, hh] = [canvas.width / 2, canvas.height / 2]
  // 裁剪空间位
  const cp = new Vector3(
    (clientX - hw) / hw,
    -(clientY - hh) / hh,
    0
  )
  // 鼠标在世界坐标系中的位置
  return cp.applyMatrix4(
    pvMatrix.clone().invert()
  )
}

export {
  imgPromise,
  initShaders,
  createProgram,
  getMousePosInWebgl,
  glToCssPos,
  ScaleLinear,
  SinFn,
  GetIndexInGrid,
  parseColorStops,
  isPC,
  worldPos,
};
