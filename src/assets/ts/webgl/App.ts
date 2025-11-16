import { Plane } from "./Plane";
import { Setup } from "./Setup";

export class App {
  setup: Setup
  plane: Plane

  constructor() {
    this.setup = new Setup();
    this.plane = new Plane(this.setup);
  }

  init() {
    this.plane.init();
  }

  render() {
    if(!this.setup.scene || !this.setup.camera) return
    this.setup.renderer?.render(this.setup.scene, this.setup.camera)
    this.plane.raf();
  }

  update() {
    this.plane.updateMesh();
  }

  resize() {
    this.setup.resize();
    this.plane.resize();
  }
}