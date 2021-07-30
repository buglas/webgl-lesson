precision mediump float;

uniform float iWidth;
uniform float iHeight;

vec2 u_CanvasSize = vec2(iWidth, iHeight);
vec2 center = u_CanvasSize / 2.0;
float diagLen = length(center);
float pi2 = radians(360.0);
float omega = 4.0;
float a = 0.5;

//渐变
float gradient(float ang) {
  return a * sin(omega * ang) + 0.5;;
}

//水平拉丝
float wire(vec2 v) {
  vec2 a = vec2(0.0, 1.0);
  float n = dot(v, a);
  return fract(tan(n) * 10000.0);
}

//杂色
float noise(vec2 v) {
  vec2 a = vec2(0.1234, 0.5678);
  float n = dot(v, a);
  return fract(tan(n) * 10000.0);
}

//获取弧度
float getAngle(vec2 v) {
  float ang = atan(v.y, v.x);
  if(ang < 0.0) {
    ang += pi2;
  }
  return ang;
}

void main() {
  vec2 p = gl_FragCoord.xy - center;
  float len = length(p);
  float ang = getAngle(p);
  float x = u_CanvasSize.x * ang / pi2;
  float y = (len / diagLen) * u_CanvasSize.y;

  float f1 = gradient(ang);
  f1 = 0.65 * f1 + 0.5;

  float f2 = wire(vec2(int(x), int(y)));
  f2 = clamp(f2, 0.75, 0.8);

  float f3 = noise(gl_FragCoord.xy);
  f3 *= 0.07;

    //复合亮度
  float f = f1 * f2 + f3;

    //片元亮度集合
  float ratio1 = smoothstep(-1.0, 1.0, sin(ang));
  float ratio2 = 1.0 - ratio1;
  float ls[2];
  ls[0] = f * (ratio1 + 0.3);
  ls[1] = f * (ratio2 + 0.1);

    //初始半径
  float r = 46.0;
    //半径集合
  float rs[2];
  rs[0] = r + 4.0;
  rs[1] = rs[0] + 12.0;

    //基于len值，计算片元亮度
  for(int i = 0; i < 2; i++) {
    if(len >= r && len < rs[i]) {
      f = ls[i];
      break;
    }
    r = rs[i];
  }

  gl_FragColor = vec4(vec3(f), 1);
}