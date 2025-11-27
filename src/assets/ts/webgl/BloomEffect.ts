import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
// @ts-ignore
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Setup } from "./Setup";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import fragmentShader from "../../shader/bloom/fragmentShader.glsl";
import vertexShader from "../../shader/bloom/vertexShader.glsl";

export class BloomEffect {
  setup: Setup;
  renderPassBloom: RenderPass | null;
  renderPassBase: RenderPass | null;
  smaaPass: SMAAPass
  unrealBloomPass: UnrealBloomPass | null
  outPass: OutputPass;
  shaderPass: ShaderPass | null;
  effectComposer1: EffectComposer | null;
  effectComposer2: EffectComposer | null;

  constructor(setup: Setup) {
    this.setup = setup;
    this.renderPassBloom = null;
    this.renderPassBase = null;
    this.smaaPass = new SMAAPass();
    this.unrealBloomPass = null;
    this.outPass = new OutputPass();
    this.shaderPass = null;
    this.effectComposer1 = null;
    this.effectComposer2 = null;
  }

  init() {
    if (!this.setup) return;
    const { scene, camera, renderer } = this.setup;
    
    const scale = 1;
    const radius = 0.1;

    this.renderPassBloom = new RenderPass(scene!, camera!);
    this.renderPassBase = new RenderPass(scene!, camera!);

    this.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerHeight * scale, window.innerWidth * scale), 0.3, radius, 0.2);
    this.effectComposer1 = new EffectComposer(renderer!);
    this.effectComposer2 = new EffectComposer(renderer!);
    this.shaderPass = new ShaderPass(new THREE.ShaderMaterial(this.setMaterial()));

    this.effectComposer1.addPass(this.renderPassBloom);
    this.effectComposer1.addPass(this.unrealBloomPass);
    this.effectComposer1.addPass(this.outPass);
    this.effectComposer1.renderToScreen = false;
    
    this.effectComposer2.addPass(this.renderPassBase);
    this.effectComposer2.addPass(this.shaderPass);
    this.effectComposer2.addPass(this.smaaPass);
  }

  setMaterial() {
    return {
      uniforms: this.setUniforms(),
      fragmentShader,
      vertexShader,
    };
  }

  setUniforms() {
    return {
      tDiffuse: { value: null },
      uStrength: { value: 3 },
      uBloomTexture: { value: this.effectComposer1?.renderTarget2.texture },
    };
  }

  update() {
    this.effectComposer1?.setSize(window.innerWidth, window.innerHeight);
    this.effectComposer2?.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    const { camera, renderer } = this.setup;

    renderer!.clear();
    camera!.layers.set(1);
    this.effectComposer1?.render();
    
    renderer!.clearDepth();
    camera!.layers.set(0);
    this.effectComposer2?.render();
  }
}
