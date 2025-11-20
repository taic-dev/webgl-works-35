uniform vec2 uPlaneSize;
uniform sampler2D uDepthTexture;
uniform vec2 uTextureSize;
uniform float uRange;
uniform bool uDepthMode;

varying vec2 vUv;
varying vec3 vPosition;
varying float vOver;

void main() {
  vUv = uv;
  vPosition = position;

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

  vec4 texture = texture2D(uDepthTexture, fixedUv);

  float brightness = dot(texture.rgb, vec3(0.299, 0.587, 0.114));

  float height = brightness * 350.;

  float maskX = step(0.001, fixedUv.x) * step(fixedUv.x, 1.);
  // float maskY = step(0.001, fixedUv.y) * step(fixedUv.y, 1.);
  // float mask = maskX * maskY;

  height *= maskX;

  vec3 pos = position + vec3(0.0, 0.0, height);

  float over = step(uRange, fixedUv.x);
  vOver = over;
  pos.z *= (1.0 - over);

  if(uDepthMode) {
    pos.z *= (over - 1.0);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}