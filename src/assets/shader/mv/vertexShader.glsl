// attribute vec2 uv;

varying vec2 vUv;
varying vec2 vTexCoords;

void main() {
  vUv = uv;
  vTexCoords = position.xy;

  vec3 pos = position;

  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}