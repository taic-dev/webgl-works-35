import { Mesh } from "./Mesh";
import { MvMesh } from "./MvMesh";
import { Setup } from "./Setup";

export class App {
  setup: Setup
  mesh: Mesh
  mvMesh: MvMesh

  constructor() {
    this.setup = new Setup();
    this.mesh = new Mesh(this.setup);
    this.mvMesh = new MvMesh(this.setup);
  }

  init() {
    this.mvMesh.init();
    this.mesh.init();
  }

  render() {
    if(!this.setup.scene || !this.setup.camera) return
    this.setup.renderer?.render(this.setup.scene, this.setup.camera)
  }

  update() {
    this.mesh.updateMesh();
    this.mvMesh.updateMesh();
  }

  resize() {
    this.setup.resize();
    this.mesh.resize();
    this.mvMesh.resize();
  }
}