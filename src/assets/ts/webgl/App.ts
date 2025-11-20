import { BloomEffect } from "./BloomEffect";
import { Plane } from "./Plane";
import { Setup } from "./Setup";

export class App {
  setup: Setup
  plane: Plane
  bloomEffect: BloomEffect

  constructor() {
    this.setup = new Setup();
    this.plane = new Plane(this.setup);
    this.bloomEffect = new BloomEffect(this.setup);
  }

  init() {
    this.plane.init();
    this.bloomEffect.init();
  }

  render() {
    if(!this.setup.scene || !this.setup.camera) return
    // this.setup.renderer?.render(this.setup.scene, this.setup.camera)
    this.plane.raf();
    this.bloomEffect.render()
  }

  update() {
    this.plane.updateMesh();
  }

  resize() {
    this.setup.resize();
    this.plane.resize();
  }
}