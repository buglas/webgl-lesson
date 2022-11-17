precision mediump float;
uniform float u_Ratio;
uniform sampler2D u_SampNew;
uniform sampler2D u_SampOld;
varying vec2 v_Pin;
void main(){
  // uv坐标的中心点
  vec2 halfuv=vec2(0.5,0.5);
  //uv坐标缩放系数
  float scale=1.0-u_Ratio*0.1;
  //缩放uv坐标
  vec2 pin=(v_Pin-halfuv)*scale+halfuv;

  //新VR的颜色
  vec4 t1=texture2D(u_SampNew,v_Pin);
  //旧VR的颜色
  // vec4 t2=texture2D(u_SampOld,v_Pin);
  vec4 t2=texture2D(u_SampOld,pin);
  gl_FragColor=mix(t2,t1,u_Ratio);
}