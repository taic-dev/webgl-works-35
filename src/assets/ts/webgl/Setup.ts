import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PARAMS } from "./constants";
import GUI from "lil-gui";

export class Setup {
  renderer: THREE.WebGLRenderer | null
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  ambientLight: THREE.AmbientLight | null
  directionalLight: THREE.DirectionalLight | null;
  loader: THREE.TextureLoader
  guiValue: any
  controls: OrbitControls | null

  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.ambientLight = null;
    this.directionalLight = null
    this.controls = null;
    this.guiValue = null
    this.loader = new THREE.TextureLoader();

    this.init();
  }

  init() {
    this.setRenderer();
    this.setScene();
    this.setCamera();
    this.setAmbientLight();
    this.setDirectionalLight();
    this.setGui();
    this.setHelper();
  }

  setRenderer() {
    const element = document.querySelector('.webgl');
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(PARAMS.WINDOW.W, PARAMS.WINDOW.H);
    element?.appendChild(this.renderer.domElement);
  }

  updateRenderer() {
    this.renderer?.setSize(window.innerWidth, window.innerHeight);
    this.renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      PARAMS.CAMERA.FOV,
      PARAMS.CAMERA.ASPECT,
      PARAMS.CAMERA.NEAR,
      PARAMS.CAMERA.FAR
    );
    const fovRad = (PARAMS.CAMERA.FOV / 2) * (Math.PI / 180);
    const dist = window.innerHeight / 2 / Math.tan(fovRad);

    this.camera.position.set(0, 0, dist);
  }

  updateCamera() {
    if (!this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera?.updateProjectionMatrix();
    const fovRad = (PARAMS.CAMERA.FOV / 2) * (Math.PI / 180);
    const dist = window.innerHeight / 2 / Math.tan(fovRad);
    this.camera.position.set(0, 0, dist);
  }

  setDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight(0xfff0dd, 5);
    this.directionalLight.position.set(0, 0, 10);
    this.scene?.add(this.directionalLight);
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 10)
    this.scene?.add(this.ambientLight);
  }

  setGui() {
    const gui = new GUI();
    this.guiValue = {
      color: { r: 0.8314, g: 0.898, b: 1.0 },
      wireframe: false,
    };
    gui.addColor(this.guiValue, "color")
    gui.add(this.guiValue, "wireframe");
  }


  setHelper() {
    if (!this.camera) return;
    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer?.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;

    // AxesHelper
    const axesHelper = new THREE.AxesHelper(2000);
    this.scene?.add(axesHelper);
  }

  resize() {
    this.updateRenderer();
    this.updateCamera();
  }
}