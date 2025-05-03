uniform float uTime;
uniform vec2 uPlaneSize;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;

varying vec2 vUv;

float circle(vec2 uv, float border) {
  float radius = 0.5;
  float dist = radius - distance(uv, vec2(0.5));
  return smoothstep(0.0, border, dist);
}

void main() {
  // アスペクトを計算
  float planeAspect = uPlaneSize.x / uPlaneSize.y;
  float textureAspect = uTextureSize.x / uTextureSize.y;

  // 画像のアスペクトとプレーンのアスペクトを比較し、短い方に合わせる
  vec2 ratio = vec2(
    min(planeAspect / textureAspect, 1.0),
    min((1.0 / planeAspect) / (1.0 / textureAspect), 1.0)
  );

  // 計算結果を用いて補正後のuv値を生成
  vec2 fixedUv = vec2(
    (vUv.x - 0.5) * ratio.x + 0.5,
    (vUv.y - 0.5) * ratio.y + 0.5
  );

  vec4 texture = texture2D(uTexture, fixedUv);

  float grey = texture.r * 0.21 + texture.g * 0.71 + texture.b * 0.07;
  
  // if(texture.r < 0.2 || texture.g < 0.2 || texture.b < 0.2) discard;

  gl_FragColor = vec4(texture.rgb, 1.0);
  gl_FragColor.a *= circle(gl_PointCoord, 0.1);
}