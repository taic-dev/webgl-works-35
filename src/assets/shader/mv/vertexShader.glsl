attribute vec2 random;

varying vec2 vUv;
varying vec2 vTexCoords;

uniform float uTime;
uniform vec2 uPlaneSize;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform float uSize;

#pragma glslify: snoise = require('glsl-noise/simplex/2d');

void main() {
  vUv = uv;
  vTexCoords = position.xy;
  
  vec3 pos = position;

  pos.xy += vec2(snoise(vec2(random.x, uTime * 0.01)), snoise(vec2(uTime * 0.01, random.y))) * 0.005;

  float radiusRange = 0.5;
  float radiusRandX = radiusRange * cos((uTime * random.x * 0.03) * random.y);
  float radiusRandY = radiusRange * cos((uTime * random.y * 0.03) * random.x);
  float radiusRandAll = radiusRandX + radiusRandY;
  float finalRadius = max(radiusRandAll, .1);

  gl_PointSize = finalRadius;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}