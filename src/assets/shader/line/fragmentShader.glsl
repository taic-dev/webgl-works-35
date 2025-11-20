uniform float uTime;
uniform vec2 uPlaneSize;
uniform sampler2D uColorTexture;
uniform vec2 uTextureSize;
uniform float uRange;
uniform vec3 uLineColor;

varying vec2 vUv;
varying vec3 vPosition;
varying float vOver;

void main() {
  float lineWidth = 0.025;

  // 線の範囲以外、uRangeが0と1の時は描画しない
  if (abs(vUv.x - uRange) > lineWidth || uRange == 0. || uRange == 1.) {
    discard;
  }

  // 赤い線を描画
  gl_FragColor = vec4(vec3(uLineColor), 1.);
}