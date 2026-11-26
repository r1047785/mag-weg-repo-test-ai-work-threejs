import * as THREE from "three";
import { createScene } from "./scene.js";
import { Ground } from "./world/Ground.js";
import { Keyboard } from "./input/Keyboard.js";
import { Car } from "./car/Car.js";
import { FollowCamera } from "./camera/FollowCamera.js";

const { scene, camera, renderer } = createScene(
  document.getElementById("canvas"),
);

const ground = new Ground(scene);
const keyboard = new Keyboard();
const car = new Car(scene, keyboard, ground);
const followCamera = new FollowCamera(camera, car.object);

car.load("/models/police.glb").catch((error) => {
  console.error("Kon de auto niet laden:", error);
});

const clock = new THREE.Clock();
const MAX_FRAME_TIME = 0.1; // avoid huge jumps after a tab switch

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), MAX_FRAME_TIME);
  car.update(dt);
  followCamera.update(dt);

  renderer.render(scene, camera);
}

animate();
