import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light to the scene
const light = new THREE.AmbientLight(0xFFFFFF); // Ambient light
scene.add(light);

// Declare an array to store the individual parts of the model
let parts = [];

// Define an array of colors for the different parts
const colors = [0xFFA500, 0xFF6347, 0x32CD32, 0x4682B4, 0xFFD700]; // Orange, Tomato, Lime, SteelBlue, Gold

// Load the OBJ model
const objLoader = new OBJLoader();
objLoader.load('./CD_Case_obj.obj', (root) => {
  let colorIndex = 0; // Index for cycling through colors

  // Traverse the loaded object and split it into separate meshes
  root.traverse((child) => {
    if (child.isMesh) {
      // Clone the mesh and apply materials individually
      const newMesh = child.clone();

      // Assign a different color to each mesh (cycling through colors array)
      const material = new THREE.MeshStandardMaterial({
        color: colors[colorIndex % colors.length], // Cycle through colors
        metalness: 0.5,
        roughness: 0.5
      });

      newMesh.material = material;

      // Scale the part (you can adjust the scale factors as needed)
      newMesh.scale.set(0.1, 0.1, 0.1); // Scale each part uniformly (0.1 scale)
      newMesh.position.set(0, 5, -25);
      newMesh.rotateX(90);

      // Add the original mesh to the scene
      scene.add(newMesh);
      parts.push(newMesh); // Store the original part

      // Create the first duplicate, position it to the left
      const leftMesh = newMesh.clone();
      leftMesh.position.set(-30, 5, -30); // Move it to the left (adjust the value as needed)
      scene.add(leftMesh);
      parts.push(leftMesh); // Store the left duplicate

      // Create the second duplicate, position it to the right
      const rightMesh = newMesh.clone();
      rightMesh.position.set(30, 5, -30); // Move it to the rigt (adjust the value as needed)
      scene.add(rightMesh);
      parts.push(rightMesh); // Store the right duplicate

      // Increment the color index
      colorIndex++;
    }
  });

  // Make the first object transparent like plastic
  if (parts.length > 0) {
    const firstPartMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, // White color for the first part
      metalness: 0.1,  // Reduce metalness for a more plastic look
      roughness: 0.7,  // Add roughness for a plastic surface
      transparent: true,  // Make the material transparent
      opacity: 0.6,  // Set transparency level (0 is fully transparent, 1 is fully opaque)
      refractionRatio: 0.98 // Simulate refraction like plastic
    });

    parts[2].material = firstPartMaterial;  // Apply the plastic-like material to the first part
  }

}, undefined, (error) => {
  console.error('Error loading OBJ file:', error);
});

// Position the camera

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth damping (for a more natural feel)
controls.dampingFactor = 0.25; // Set the damping factor
controls.screenSpacePanning = false; // Prevent panning in screen space

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate all the parts continuously
  parts.forEach(part => {
    part.rotation.z += 0.005; // Rotate each part along the Z-axis
  });

  // Update the controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
