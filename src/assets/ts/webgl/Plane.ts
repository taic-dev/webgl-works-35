import * as THREE from "three";
import { Setup } from "./Setup";
import { PARAMS } from "./constants";
import { getImagePositionAndSize, ImagePositionAndSize } from "../utils/getElementSize";
import imageFrag from "../../shader/image/fragmentShader.glsl"
import imageVert from "../../shader/image/vertexShader.glsl"
import lineFrag from "../../shader/line/fragmentShader.glsl"
import lineVert from "../../shader/line/vertexShader.glsl"
import mvTexture from "/assets/images/mv.png";
import depthTexture from "/assets/images/depth.png";

export class Plane {
  setup: Setup
  element: HTMLImageElement | null
  geometry: THREE.BufferGeometry | null
  planeImage: THREE.Mesh | null
  planeLine: THREE.Mesh | null
  loader: THREE.TextureLoader | null
  group: THREE.Group;

  constructor(setup: Setup) {
    this.setup = setup
    this.element = document.querySelector<HTMLImageElement>('.js-mv-image')
    this.geometry = null
    this.planeImage = null
    this.planeLine = null
    this.group = new THREE.Group();
    this.loader = this.setup.loader
  }

  init() {
    if(!this.element) return
    const info = getImagePositionAndSize(this.element);
    this.setPlaneImage(info);
    this.setPlaneLine(info);
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
      uLineColor: { value: this.setup.guiValue.lineColor },
      ...commonUniforms
    }
  }

  setPlaneImage(info: ImagePositionAndSize) {
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: imageFrag,
      vertexShader: imageVert,
      side: THREE.DoubleSide,
    })

    this.planeImage = new THREE.Mesh(geometry, material);
    this.group.add(this.planeImage)
    this.planeImage.layers.set(0);

    this.planeImage.scale.x = info.dom.width;
    this.planeImage.scale.y = info.dom.height;
    this.planeImage.position.x = info.dom.x;
    this.planeImage.position.y = info.dom.y;
  }

  setPlaneLine(info: ImagePositionAndSize) {
    if(!this.planeImage) return
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: lineFrag,
      vertexShader: lineVert,
      side: THREE.DoubleSide,
    })

    this.planeLine = new THREE.Mesh(geometry, material);
    this.group.add(this.planeLine)
    this.setup.scene?.add(this.group);
    this.planeLine.layers.set(1);

    this.planeLine.position.copy(this.planeImage.position);
    this.planeLine.position.z = 1
    this.planeLine.scale.copy(this.planeImage.scale);
  }

  updateMesh() {
    if(!this.planeImage || !this.planeLine || !this.element) return;
    const info = getImagePositionAndSize(this.element);
    this.planeImage.scale.x = info.dom.width;
    this.planeImage.scale.y = info.dom.height;
    this.planeImage.position.x = info.dom.x;
    this.planeImage.position.y = info.dom.y;
    this.planeLine.position.copy(this.planeImage.position);
    this.planeLine.scale.copy(this.planeImage.scale);
  }

  raf() {
    const { guiValue } = this.setup;
    const palneImageMaterial = (this.planeImage!.material as any);
    const palneLineMaterial = (this.planeLine!.material as any);

    palneImageMaterial.uniforms.uRange.value = guiValue.range;
    palneImageMaterial.uniforms.uDepthMode.value = guiValue.depthMode;
    palneImageMaterial.wireframe = guiValue.wireframe;
    palneImageMaterial.uniforms.uTime.value += 1;
  
    palneLineMaterial.uniforms.uRange.value = guiValue.range;
    palneLineMaterial.wireframe = guiValue.lineColor;
    palneLineMaterial.uniforms.uDepthMode.value = guiValue.depthMode;
    palneLineMaterial.wireframe = guiValue.wireframe;
    palneLineMaterial.uniforms.uTime.value += 1;

    if(guiValue.rotation) {
      this.group.rotation.y += 0.001
    }
  }

  resize() {
    this.updateMesh()
  }
}