import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000,
);
const ambientlight = new THREE.AmbientLight({color: 0xffffff, intensity: 1});
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
const control = new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;
camera.position.y = 1;
//add object in scene

const spheremat = new THREE.MeshStandardMaterial({
  color: '#f56693',
  metalness: 0.85,
  roughness: 0.4,
});
const sphereGeo = new THREE.SphereGeometry(0.5, 32, 16);
const sphereMesh = new THREE.Mesh(sphereGeo, spheremat);

//Addd Plane
const planemat = new THREE.MeshStandardMaterial({
  color: '#af00bf',
  side: 2,
  metalness: 0.85,
  roughness: 0.4,
});

const planeGeo = new THREE.PlaneGeometry(5, 5);
const planeMesh = new THREE.Mesh(planeGeo, planemat);
planeMesh.rotation.set(Math.PI / 2, 0, 0);
planeMesh.position.set(0, -0.5, 0);
//planeMesh.rotateX(Math.PI / 2);

//addd Directional Lighting
const drLight = new THREE.DirectionalLight(0xffffff, 1);
drLight.castShadow = true;
scene.add(drLight);
scene.add(planeMesh);
scene.add(sphereMesh);
scene.add(ambientlight);
//add particles
const geometry = new THREE.BufferGeometry();

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const count = 1000;
const radius = 60;
const vertices = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i <= count * 3; i++) {
  vertices[i * 3] = (Math.random() - 0.5) * radius; //x
  vertices[i * 3 + 1] = (Math.random() - 0.5) * radius; //y
  vertices[i * 3 + 2] = (Math.random() - 0.5) * radius; //z

  colors[i * 3] = Math.random(); //x
  colors[i * 3 + 1] = Math.random(); //y
  colors[i * 3 + 2] = Math.random(); //z
}
// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const material = new THREE.PointsMaterial({
  size: 0.9,
  vertexColors: true,
});
const mesh = new THREE.Points(geometry, material);
scene.add(mesh);
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});
const clock = new THREE.Clock();
function tick() {
  renderer.setSize(size.width, size.height);
  renderer.shadowMap.enabled = true;
  sphereMesh.position.set(
    Math.cos(clock.getElapsedTime()) * 2,
    Math.abs(Math.sin(clock.getElapsedTime()) * 2),
    Math.sin(clock.getElapsedTime()) * 2,
  );
  // mesh.rotation.set(
  //   // Math.cos(clock.getElapsedTime() * 3) * 5,
  //   // Math.abs(Math.sin(clock.getElapsedTime() * 3) * 5),
  //   // Math.sin(clock.getElapsedTime() * 3) * 5,
  // );
  mesh.rotateZ(1 / 100);
  sphereMesh.castShadow = true;
  planeMesh.receiveShadow = true;
  camera.updateProjectionMatrix();
  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
}
tick();
