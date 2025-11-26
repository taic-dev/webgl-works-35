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
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshPhongMaterial({color: 0xcbcbcb, depthWrite: false})
    );
    mesh.rotation.x = -Math.PI / 2;
    this.setup.scene?.add(mesh);
  }
}