import * as THREE from "three";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/mv/fragmentShader.glsl"
import vertexShader from "../../shader/mv/vertexShader.glsl"
import { PARAMS } from "./constants";
import { getImagePositionAndSize, ImagePositionAndSize } from "../utils/getElementSize";

export class Plane {
  setup: Setup
  element: HTMLImageElement | null
  geometry: THREE.BufferGeometry | null
  mesh: THREE.Mesh | null
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
    this.setMesh(info);
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
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    })
    this.mesh = new THREE.Mesh(geometry, material);
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
    const material = (this.mesh!.material as any);
    material.uniforms.uTime.value += 1;
  }

  resize() {
    this.updateMesh()
  }
}