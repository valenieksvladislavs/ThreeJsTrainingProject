import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const canvas = document.getElementById('webglCanvas') as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xFFFFFF);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

const cameraRadius = 50;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, cameraRadius);

const loader = new GLTFLoader();

let model: THREE.Object3D | null = null;

loader.load(
  'models/Dingus/scene.gltf',
  (gltf) => {
    model = gltf.scene;

    scene.add(model);
  },
  (xhr) => {
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error) => {
    console.error('Ошибка загрузки модели', error);
  }
);

const angleSpeed = 0.0005;
const tiltSpeed = 0.006;
const tiltAmplitude = 0.3;
const shiftAmount = 5;

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    const angle = Date.now() * angleSpeed;
    camera.position.x = cameraRadius * Math.cos(angle);
    camera.position.z = cameraRadius * Math.sin(angle);
    camera.lookAt(model.position);
    
    const tiltOffset = Math.sin(Date.now() * tiltSpeed) * tiltAmplitude;
    const shiftOffset = Math.sin(Date.now() * tiltSpeed) * shiftAmount;
    
    model.rotation.x = tiltOffset;
    
    model.position.x = shiftOffset;
    model.position.z = shiftOffset;
    
    if (tiltOffset < 0) {
      model.position.x = -shiftOffset;
      model.position.z = -shiftOffset;
    }
  }

  renderer.render(scene, camera);
}

const audioContext = new window.AudioContext();
let audioBuffer: AudioBuffer;
const musicSource = audioContext.createBufferSource();

function loadMusic() {
  fetch('music/maxwell-the-cat-theme-made-with-Voicemod.mp3')
    .then((response) => response.arrayBuffer())
    .then((data) => {
      audioContext.decodeAudioData(data, (buffer) => {
        audioBuffer = buffer;
        startMusic();
      });
    })
    .catch((error) => console.error('Ошибка загрузки музыки', error));
}

function startMusic() {
  if (audioBuffer) {
    musicSource.buffer = audioBuffer;
    musicSource.loop = true;
    musicSource.connect(audioContext.destination);
    musicSource.start(0);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-button')?.addEventListener('click', (event) => {
    loadMusic();
    animate();
    const element = event.target as HTMLElement;
    const parent = element.parentNode as HTMLElement;
    if (parent) {
      parent.remove();
    } else {
      element.remove();
    }
  });
});

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
