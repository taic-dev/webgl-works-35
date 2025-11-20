import * as THREE from "three";
import { gsap } from "gsap";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/mv/fragmentShader.glsl"
import vertexShader from "../../shader/mv/vertexShader.glsl"
import { PARAMS } from "./constants";
import { getImagePositionAndSize, ImagePositionAndSize } from "../utils/getElementSize";
import mvTexture from "/assets/images/mv.png";
import depthTexture from "/assets/images/depth.png";
import { EASING } from "../utils/constant";

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

    // this.click();
  }

  setUniforms(info: ImagePositionAndSize) {
    const commonUniforms = {
      uResolution: { value: new THREE.Vector2(PARAMS.WINDOW.W, PARAMS.WINDOW.H)},
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0.0 },
    };

    return {
      uPlaneSize: { value: new THREE.Vector2(info.dom.width, info.dom.height)},
      uColorTexture: { value: this.loader?.load(mvTexture) },
      uDepthTexture: { value: this.loader?.load(depthTexture) },
      uTextureSize: { value: new THREE.Vector2(info.image.width, info.image.height) },
      uRange: { value: this.setup.guiValue.range },
      uDepthMode: { value: this.setup.guiValue.depthMode },
      ...commonUniforms
    }
  }

  setMesh(info: ImagePositionAndSize) {
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      side: THREE.DoubleSide
    })

    // const material = new THREE.MeshStandardMaterial({
    //   map: this.loader?.load(mvTexture),
    //   displacementMap: this.loader?.load(depthTexture),
    //   displacementScale: 0,
    //   // alphaMap: this.loader?.load(alphaTexture),
    //   transparent: true,
    //   // depthTest: false,
    //   // wireframe: true
    // })
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

  click() {
    const material = (this.mesh!.material as any);
    let isAnim = false
    window.addEventListener('click', () => {
      gsap.to(material, {
        duration: 0.4,
        displacementScale: isAnim ? 300 : 0,
        ease: EASING.OUT_BACK,
        onComplete: () => {
          gsap.to(this.mesh!.position, {
          duration: 0.4,
          z: isAnim ? -300 : 0,
          ease: EASING.OUT_BACK,
          onComplete: () => {
            isAnim = !isAnim;
          }
      })
        }
      })      
      // material.displacementScale = 200
    })
  }

  raf() {
    const material = (this.mesh!.material as any);    
    material.uniforms.uRange.value = this.setup.guiValue.range;
    material.uniforms.uDepthMode.value = this.setup.guiValue.depthMode;
    material.wireframe = this.setup.guiValue.wireframe;
    material.uniforms.uTime.value += 1;
  }

  resize() {
    this.updateMesh()
  }
}