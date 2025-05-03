import { Particle } from "./Particle";
import { Setup } from "./Setup";

export class App {
  setup: Setup
  particle: Particle

  constructor() {
    this.setup = new Setup();
    this.particle = new Particle(this.setup);
  }

  init() {
    this.particle.init();
  }

  render() {
    if(!this.setup.scene || !this.setup.camera) return
    this.setup.renderer?.render(this.setup.scene, this.setup.camera)
    this.particle.raf();
  }

  update() {
    this.particle.updateMesh();
  }

  resize() {
    this.setup.resize();
    this.particle.resize();
  }
}