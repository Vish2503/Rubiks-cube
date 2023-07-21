import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create a Scene
const scene = new THREE.Scene();

// Create a red cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ 
    // color: 'white',
    // vertexColors: true
});


// Creating a 3x3x3 cube (with random colors right now)
let cubeMesh = []
for (let i = 0; i < 3; i++) {
    cubeMesh[i] = []
    for (let j = 0; j < 3; j++) {
        cubeMesh[i][j] = []
        for (let k = 0; k < 3; k++) {
            cubeMesh[i][j][k] = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial());
            cubeMesh[i][j][k].position.set(i-1, j-1, k-1)
            scene.add(cubeMesh[i][j][k]);
            cubeMesh[i][j][k].material.color.r = Math.random()
            cubeMesh[i][j][k].material.color.g = Math.random()
            cubeMesh[i][j][k].material.color.b = Math.random()
        } 
    }
}


// Sizes to give aspect ratio in camera and size to renderer
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Add a camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height);
camera.position.set(-5,5,5);
camera.lookAt(new THREE.Vector3())
scene.add(camera);

// Create renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);


// Update the render and camera when the window is resized
window.addEventListener('resize', function(){ 
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height; 
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

// Allow Orbiting the scene
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true
controls.enablePan = false
controls.zoomSpeed = 3

// Animation loop
let time = Date.now()
const animate = () => {

    // finding dt so that the 
    const currentTime = Date.now()
    const dt = currentTime - time
    time = currentTime

    let m = new THREE.Matrix4(); 
    m.makeRotationZ(0.002 * dt)

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            cubeMesh[i][j][2].position.applyMatrix4(m)
            cubeMesh[i][j][2].rotateZ(0.002 * dt)
        }
    }
    
    controls.update
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)
}

animate()


// 90 degree rotation animation first attempt
// let totalRotation = 0;
// let time = Date.now()
// function rotate90(){

//     // const currentTime = Date.now()
//     // const dt = currentTime - time
//     // time = currentTime
    
//     let m = new THREE.Matrix4(); 
//     m.makeRotationZ(0.1)
    
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             cubeMesh[i][j][2].position.applyMatrix4(m)
//             cubeMesh[i][j][2].rotateZ(0.1)
//         }
//     }

//     totalRotation += 0.1

//     if (totalRotation >= Math.PI / 2)
//     {
//         m.makeRotationZ(Math.PI - totalRotation)
    
//         for (let i = 0; i < 3; i++) {
//             for (let j = 0; j < 3; j++) {
//                 cubeMesh[i][j][2].position.applyMatrix4(m)
//                 cubeMesh[i][j][2].rotateZ(Math.PI - totalRotation)
//             }
//         }
//         renderer.render(scene, camera);
//         return
//     }
//     controls.update
//     renderer.render(scene, camera);
//     window.requestAnimationFrame(rotate90)
// }

// rotate90()