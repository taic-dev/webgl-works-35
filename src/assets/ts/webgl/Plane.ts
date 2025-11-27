import * as THREE from "three";
import { Setup } from "./Setup";
import { PARAMS } from "./constants";
import { getImagePositionAndSize, ImagePositionAndSize } from "../utils/getElementSize";
import imageFrag from "../../shader/image/fragmentShader.glsl"
import imageVert from "../../shader/image/vertexShader.glsl"
import imageBackFrag from "../../shader/imageBack/fragmentShader.glsl"
import imageBackVert from "../../shader/imageBack/vertexShader.glsl"
import lineFrag from "../../shader/line/fragmentShader.glsl"
import lineVert from "../../shader/line/vertexShader.glsl"
import mvTexture from "/assets/images/mv.webp";
import depthTexture from "/assets/images/depth.webp";

export class Plane {
  setup: Setup
  element: HTMLImageElement | null
  geometry: THREE.BufferGeometry | null
  planeImage: THREE.Mesh | null
  planeBackImage: THREE.Mesh | null
  planeLine: THREE.Mesh | null
  loader: THREE.TextureLoader | null
  group: THREE.Group;

  constructor(setup: Setup) {
    this.setup = setup
    this.element = document.querySelector<HTMLImageElement>('.js-mv-image')
    this.geometry = null
    this.planeImage = null
    this.planeBackImage = null
    this.planeLine = null
    this.group = new THREE.Group();
    this.loader = this.setup.loader
  }

  init() {
    if(!this.element) return
    const info = getImagePositionAndSize(this.element);
    this.setPlaneImage(info);
    this.setPlaneBackImage(info);
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

  setPlaneBackImage(info: ImagePositionAndSize) {
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: imageBackFrag,
      vertexShader: imageBackVert,
      side: THREE.DoubleSide,
    })

    this.planeBackImage = new THREE.Mesh(geometry, material);
    this.group.add(this.planeBackImage)
    this.planeBackImage.layers.set(0);

    this.planeBackImage.scale.x = info.dom.width;
    this.planeBackImage.scale.y = info.dom.height;
    this.planeBackImage.position.x = info.dom.x;
    this.planeBackImage.position.y = info.dom.y;
    this.planeBackImage.position.z = -0.01;
  }

  setPlaneLine(info: ImagePositionAndSize) {
    if(!this.planeImage) return
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: lineFrag,
      vertexShader: lineVert,
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
    if(!this.planeImage || !this.planeBackImage || !this.planeLine || !this.element) return;
    const info = getImagePositionAndSize(this.element);
    this.planeImage.scale.x = info.dom.width;
    this.planeImage.scale.y = info.dom.height;
    this.planeImage.position.x = info.dom.x;
    this.planeImage.position.y = info.dom.y;

    this.planeBackImage.position.copy(this.planeImage.position);
    this.planeBackImage.position.z = -1;
    this.planeBackImage.scale.copy(this.planeImage.scale);

    this.planeLine.position.copy(this.planeImage.position);
    this.planeLine.scale.copy(this.planeImage.scale);
  }

  raf() {
    const { guiValue } = this.setup;
    const palneImageMaterial = (this.planeImage!.material as any);
    const palneBackImageMaterial = (this.planeBackImage!.material as any);
    const palneLineMaterial = (this.planeLine!.material as any);

    palneImageMaterial.uniforms.uRange.value = guiValue.range;
    palneImageMaterial.uniforms.uDepthMode.value = guiValue.depthMode;
    palneImageMaterial.wireframe = guiValue.wireframe;
    palneImageMaterial.uniforms.uTime.value += 1;

    palneBackImageMaterial.wireframe = guiValue.wireframe;
  
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