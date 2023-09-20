import * as THREE from 'three';
import CANNON, {Sphere} from 'cannon';
import {GUI} from 'lil-gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const gui = new GUI();
const objectdebug = {};
objectdebug.createsphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 8,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(objectdebug, 'createsphere');
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000,
);

const scene = new THREE.Scene();
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
const updateToObj = [];
// Create Meshes

const plane = new THREE.PlaneGeometry(420, 420);
const material = new THREE.MeshBasicMaterial({side: 2, color: 0x00ff00});
const planemesh = new THREE.Mesh(plane, material);
const ambient = new THREE.AmbientLight(0xffffff, 1);
planemesh.rotation.set(-Math.PI / 2, 0, 0);
camera.position.z = 15;
camera.position.y = 1;
const sgeo = new THREE.SphereGeometry(1);
const smat = new THREE.MeshStandardMaterial({color: 0x00ffff});
function createSphere(radius, position) {
  const smesh = new THREE.Mesh(sgeo, smat);
  smesh.position.copy(position);
  smesh.scale.set(radius, radius, radius);
  scene.add(smesh);

  const shape = new CANNON.Sphere(radius);
  const spmat = new CANNON.Material('plastic');
  const sbody = new CANNON.Body({
    mass: 1,
    allowSleep: false,
    shape: shape,
    material: mat,
  });
  sbody.position.copy(position);
  world.add(sbody);
  updateToObj.push({
    smesh: smesh,
    sbody: sbody,
  });
}

scene.add(planemesh);
scene.add(ambient);
window.addEventListener('resize', (event) => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});
const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;

//create a physics world
const world = new CANNON.World();
world.gravity.set(0, -9.8, 0);
const mat = new CANNON.Material('plastic');
const matcon = new CANNON.Material('concrete');

const contactmat = new CANNON.ContactMaterial(matcon, mat, {
  friction: 0.1,
  restitution: 0.9,
});

const planeshape = new CANNON.Plane();
const planebdy = new CANNON.Body({
  mass: 0,
  shape: planeshape,
  allowSleep: false,
  material: matcon,
});
world.addContactMaterial(contactmat);
//set sphere position

planebdy.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
createSphere(0.5, {x: 0, y: 3, z: 0});

world.add(planebdy);

//create clock
const clock = new THREE.Clock();
let lastTime;
function tick() {
  let currentTime = clock.getElapsedTime();
  const delta = currentTime - lastTime;
  lastTime = currentTime;

  world.step(1 / 60, delta, 3);

  updateToObj.forEach((item) => {
    item.smesh.position.copy(item.sbody.position);
  });
  control.update();

  //planemesh.position.y = planebdy.position.y;
  // planemesh.rotation.y = planebdy.quaternion.y;
  camera.updateProjectionMatrix();
  window.requestAnimationFrame(tick);
  renderer.setSize(size.width, size.height);
  renderer.render(scene, camera);
}
tick();
