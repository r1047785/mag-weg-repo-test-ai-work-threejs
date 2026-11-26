import * as THREE from "three";

const FOG_COLOR = 0xcccccc;
const FOG_NEAR = 20;
const FOG_FAR = 100;

/**
 * Creates the renderer, scene (fog + lights) and camera,
 * and keeps them sized to the window.
 */
export function createScene(canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(FOG_COLOR);

  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(5, 10, 7);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer };
}
