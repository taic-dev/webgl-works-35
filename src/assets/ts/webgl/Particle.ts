import * as THREE from "three";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/mv/fragmentShader.glsl"
import vertexShader from "../../shader/mv/vertexShader.glsl"
import { PARAMS } from "./constants";
import { getImagePositionAndSize, ImagePositionAndSize } from "../utils/getElementSize";

export class Particle {
  setup: Setup
  element: HTMLImageElement | null
  geometry: THREE.BufferGeometry | null
  mesh: THREE.Points | null
  loader: THREE.TextureLoader | null

  constructor(setup: Setup) {
    this.setup = setup
    this.element = document.querySelector<HTMLImageElement>('.js-mv-image')
    this.geometry = null
    this.mesh = null
    this.loader = this.setup.loader
  }

  init() {
    if(!this.element) return
    const info = getImagePositionAndSize(this.element);
    this.setUniforms(info)
    this.setMesh(info);
  }

  setParticle() {
    this.geometry = new THREE.BufferGeometry();

    const COLUMNS = 1000;
    const ROWS = 1000;

    const uvs = [];
    const vertices = [];
    const random = [];

    for(let i = 0; i < COLUMNS; i++) {
      for(let j = 0; j < ROWS; j++) {
        /* 0〜1の範囲に正規化 */
        const x = i / (COLUMNS - 1);
        const y = j / (ROWS - 1);
        uvs.push(x, y);
        vertices.push(x - 0.5, y - 0.5, 0);

        /* ランダムな値 */
        const randomNum = (Math.random() - 1.0) * 2.0;
        random.push(randomNum, randomNum);
      }
    }

    this.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    this.geometry.setAttribute('random', new THREE.BufferAttribute(new Float32Array(random), 2));
    this.geometry.center();
  }

  setUniforms(info: ImagePositionAndSize) {
    const commonUniforms = {
      uResolution: { value: new THREE.Vector2(PARAMS.WINDOW.W, PARAMS.WINDOW.H)},
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0.0 },
    };

    return {
      uPlaneSize: { value: new THREE.Vector2(info.dom.width, info.dom.height)},
      uTexture: { value: this.loader?.load(info.image.src) },
      uTextureSize: { value: new THREE.Vector2(info.image.width, info.image.height) },
      uSize: { value: 0 },
      ...commonUniforms
    }
  }

  setMesh(info: ImagePositionAndSize) {
    this.setParticle();
    const uniforms = this.setUniforms(info);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    })
    this.mesh = new THREE.Points(this.geometry!, material);
    this.setup.scene?.add(this.mesh);

    this.mesh.scale.x = info.dom.width;
    this.mesh.scale.y = info.dom.height;
    this.mesh.position.x = info.dom.x;
    this.mesh.position.y = info.dom.y;
  }

  updateMesh() {
    if(!this.mesh || !this.element) return;
      const info = getImagePositionAndSize(this.element);
      this.mesh.scale.x = info.dom.width;
      this.mesh.scale.y = info.dom.height;
      this.mesh.position.x = info.dom.x;
      this.mesh.position.y = info.dom.y;
  }

  raf() {
    (this.mesh!.material as any).uniforms.uTime.value += 1;
  }

  resize() {
    this.updateMesh()
  }
}