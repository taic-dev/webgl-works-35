import * as THREE from "three";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/list/fragmentShader.glsl"
import vertexShader from "../../shader/list/vertexShader.glsl"
import { PARAMS } from "./constants";
import { getImagePositionAndSize, ImagePositionAndSize } from "../utils/getElementSize";

export class Mesh {
  setup: Setup
  elements: HTMLImageElement[] | null
  mesh: THREE.Mesh | null
  meshes: THREE.Mesh[]
  loader: THREE.TextureLoader | null

  constructor(setup: Setup) {
    this.setup = setup
    this.elements = [...document.querySelectorAll<HTMLImageElement>('.js-item-image')];
    this.mesh = null
    this.meshes = []
    this.loader = null
  }

  init() {
    this.elements?.forEach((element) => {
      const info = getImagePositionAndSize(element);
      this.setUniforms(info)
      this.setMesh(info)
    })
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

    this.meshes.push(this.mesh);
  }

  updateMesh() {
    if(!this.mesh) return;
    this.elements?.forEach((element, i) => {
      const info = getImagePositionAndSize(element);
      this.meshes[i].scale.x = info.dom.width;
      this.meshes[i].scale.y = info.dom.height;
      this.meshes[i].position.x = info.dom.x;
      this.meshes[i].position.y = info.dom.y;
    })
  }

  resize() {
    this.updateMesh();
  }
}