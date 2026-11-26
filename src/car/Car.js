import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// --- Tuning ------------------------------------------------------------
const MAX_SPEED = 10; // units per second
const MAX_REVERSE_SPEED = 5;
const ACCELERATION = 8;
const BRAKE = 16;
const FRICTION = 4;
const TURN_SPEED = 2; // radians per second at full speed
const MAX_STEER_ANGLE = 0.5; // visual angle of the front wheels
const WHEEL_RADIUS = 0.3;
const EDGE_MARGIN = 2; // keep this far from the edge of the bounds

const loader = new GLTFLoader();

/**
 * A drivable car. The model must face +Z with its wheels on y = 0;
 * nodes whose name starts with "wheel" roll, and "front" wheels steer.
 */
export class Car {
  /**
   * @param {THREE.Scene} scene
   * @param {{ throttle: number, steer: number }} controls
   * @param {{ halfSize: number }} bounds  area the car must stay inside
   */
  constructor(scene, controls, bounds) {
    this.controls = controls;
    this.bounds = bounds;
    this.speed = 0;

    this.object = new THREE.Group();
    scene.add(this.object);

    this.wheels = [];
    this.frontWheels = [];
  }

  async load(url) {
    const gltf = await loader.loadAsync(url);
    this.object.add(gltf.scene);

    gltf.scene.traverse((child) => {
      if (!child.name.startsWith("wheel")) return;
      child.rotation.order = "YXZ"; // steer (Y) first, then roll (X)
      this.wheels.push(child);
      if (child.name.includes("front")) this.frontWheels.push(child);
    });

    return this;
  }

  get position() {
    return this.object.position;
  }

  update(dt) {
    const { throttle, steer } = this.controls;

    this.#updateSpeed(throttle, dt);
    this.#move(steer, dt);
    this.#animateWheels(steer, dt);

    this.object.updateMatrixWorld();
  }

  #updateSpeed(throttle, dt) {
    if (throttle !== 0) {
      const braking =
        this.speed !== 0 && Math.sign(throttle) !== Math.sign(this.speed);
      this.speed += throttle * (braking ? BRAKE : ACCELERATION) * dt;
    } else {
      const drop = FRICTION * dt;
      this.speed =
        Math.abs(this.speed) <= drop
          ? 0
          : this.speed - Math.sign(this.speed) * drop;
    }
    this.speed = THREE.MathUtils.clamp(
      this.speed,
      -MAX_REVERSE_SPEED,
      MAX_SPEED,
    );
  }

  #move(steer, dt) {
    const { object, speed } = this;

    // Turning scales with speed, so the car can't spin in place.
    object.rotation.y += steer * TURN_SPEED * (speed / MAX_SPEED) * dt;

    object.position.x += Math.sin(object.rotation.y) * speed * dt;
    object.position.z += Math.cos(object.rotation.y) * speed * dt;

    const limit = this.bounds.halfSize - EDGE_MARGIN;
    object.position.x = THREE.MathUtils.clamp(object.position.x, -limit, limit);
    object.position.z = THREE.MathUtils.clamp(object.position.z, -limit, limit);
  }

  #animateWheels(steer, dt) {
    const roll = (this.speed * dt) / WHEEL_RADIUS;
    for (const wheel of this.wheels) wheel.rotation.x += roll;
    for (const wheel of this.frontWheels) {
      wheel.rotation.y = steer * MAX_STEER_ANGLE;
    }
  }
}
