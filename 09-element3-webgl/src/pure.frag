precision mediump float;

uniform float u_Width;
uniform float u_Height;
uniform float u_Radius;

void main() {
  vec2 center = vec2(u_Width, u_Height) / 2.0;
  vec2 p = gl_FragCoord.xy - center;
  float l = length(p);
  if(l < u_Radius) {
    gl_FragColor = vec4(1, 1, 0, 1);
  } else {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
}