import * as THREE from "three";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/mv/fragmentShader.glsl"
import vertexShader from "../../shader/mv/vertexShader.glsl"
import { PARAMS } from "./constants";
import { getImagePositionAndSize, ImagePositionAndSize } from "../utils/getElementSize";

export class MvMesh {
  setup: Setup
  element: HTMLImageElement | null
  mesh: THREE.Mesh | null
  loader: THREE.TextureLoader | null

  constructor(setup: Setup) {
    this.setup = setup
    this.element = document.querySelector<HTMLImageElement>('.js-mv-image')
    this.mesh = null
    this.loader = null
  }

  init() {
    if(!this.element) return
    const info = getImagePositionAndSize(this.element);
    this.setUniforms(info)
    this.setMesh(info);
  }

  setUniforms(info: ImagePositionAndSize) {
    const loader = this.setup.loader;

    const commonUniforms = {
      uResolution: { value: new THREE.Vector2(PARAMS.WINDOW.W, PARAMS.WINDOW.H)},
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0.0 },
    };

    return {
      uPlaneSize: { value: new THREE.Vector2(info.dom.width, info.dom.height)},
      uTexture: { value: loader.load(info.image.src) },
      uTextureSize: { value: new THREE.Vector2(info.image.width, info.image.height) },
      ...commonUniforms
    }
  }

  setMesh(info: ImagePositionAndSize) {
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
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

  resize() {
    this.updateMesh()
  }
}