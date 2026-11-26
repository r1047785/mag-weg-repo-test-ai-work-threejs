import * as THREE from "three";

/** Flat square ground plane centred on the origin. */
export class Ground {
  constructor(scene, { size = 200, color = 0x4a7c3a } = {}) {
    this.size = size;

    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshPhongMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    scene.add(this.mesh);
  }

  /** Half the side length: the furthest x/z you can go from the centre. */
  get halfSize() {
    return this.size / 2;
  }
}
