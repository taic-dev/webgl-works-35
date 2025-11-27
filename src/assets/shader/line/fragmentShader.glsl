uniform float uRange;
uniform vec3 uLineColor;

varying vec2 vUv;

void main() {
  float lineWidth = 0.03;

  // 線の範囲以外、uRangeが1の時は描画しない
  if (abs(vUv.x - uRange) > lineWidth || uRange == 1.) {
    discard;
  }

  gl_FragColor = vec4(vec3(uLineColor), 1.);
}