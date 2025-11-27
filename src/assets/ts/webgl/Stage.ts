import * as THREE from "three";
import { Setup } from "./Setup";

export class Stage {
  setup: Setup

  constructor(setup: Setup) {
    this.setup = setup
  }

  init() {
    this.setMesh();
  }

  setMesh() {
    const size = Math.max(1500, window.innerWidth);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry( size, 32, 16 ),
      new THREE.MeshPhongMaterial({
        color: 0xED1A3D,
        depthWrite: false,
        side: THREE.DoubleSide,
        wireframe: true
      })
    );
    this.setup.scene?.add(mesh);
    mesh.layers.set(0);
  }
}