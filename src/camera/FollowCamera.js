import * as THREE from "three";

const OFFSET = new THREE.Vector3(0, 4, -8); // behind and above, in the target's local space
const LOOK_HEIGHT = 1;
const FOLLOW_SHARPNESS = 5; // higher = snappier

/** Third-person camera that smoothly trails behind a target object. */
export class FollowCamera {
  /**
   * @param {THREE.PerspectiveCamera} camera
   * @param {THREE.Object3D} target
   */
  constructor(camera, target) {
    this.camera = camera;
    this.target = target;

    this.desiredPosition = new THREE.Vector3();
    this.lookTarget = new THREE.Vector3();

    this.snap();
  }

  /** Jump straight to the follow position (no smoothing). */
  snap() {
    this.target.updateMatrixWorld();
    this.camera.position.copy(this.#computeDesiredPosition());
    this.#lookAtTarget();
  }

  update(dt) {
    const t = 1 - Math.exp(-FOLLOW_SHARPNESS * dt); // frame-rate independent
    this.camera.position.lerp(this.#computeDesiredPosition(), t);
    this.#lookAtTarget();
  }

  #computeDesiredPosition() {
    return this.desiredPosition
      .copy(OFFSET)
      .applyMatrix4(this.target.matrixWorld);
  }

  #lookAtTarget() {
    this.lookTarget.copy(this.target.position).y += LOOK_HEIGHT;
    this.camera.lookAt(this.lookTarget);
  }
}
