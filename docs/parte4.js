<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Big Bang Cinemático - Documentário</title>
<style>
  body, html { margin:0; padding:0; overflow:hidden; background:black; }
  canvas { display:block; }
</style>
</head>
<body>
<script type="module">
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/controls/OrbitControls.js';
import { createParticles, createGalaxy, createNebula } from './parte2.js';
import { createBlackHole, timelineBigBang, animateUniverse } from './parte3.js';

// --- Cena, câmera e renderizador ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000);
camera.position.z = 60;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 500;

// --- Grupos ---
const particlesGroup = new THREE.Group();
scene.add(particlesGroup);

const galaxiesGroup = new THREE.Group();
scene.add(galaxiesGroup);

const nebulasGroup = new THREE.Group();
scene.add(nebulasGroup);

const blackHolesGroup = new THREE.Group();
scene.add(blackHolesGroup);

// --- Inicia a linha do tempo do Big Bang ---
timelineBigBang(particlesGroup, galaxiesGroup, nebulasGroup, blackHolesGroup);

// --- Inicia a animação contínua ---
animateUniverse(renderer, scene, camera, controls, particlesGroup, galaxiesGroup, nebulasGroup, blackHolesGroup);

// --- Responsividade ---
window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});

console.log("Documentário do Big Bang iniciado!");
</script>
</body>
</html>
