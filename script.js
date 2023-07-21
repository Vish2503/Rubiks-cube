import * as THREE from 'three';

// Create a Scene
const scene = new THREE.Scene();

// Create a red cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'white'});

let cubeMesh = []
for (let i = 0; i < 3; i++) {
    cubeMesh[i] = []
    for (let j = 0; j < 3; j++) {
        cubeMesh[i][j] = []
        for (let k = 0; k < 3; k++) {
            cubeMesh[i][j][k] = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubeMesh[i][j][k].position.set(i-1, j-1, k-1)
            scene.add(cubeMesh[i][j][k]);
        } 
    }
}


// Sizes to give aspect ratio in camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Add a camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.set(-5,5,5);
camera.lookAt(new THREE.Vector3())
scene.add(camera);

// Create renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

// Try animation
let time = Date.now()
let i = 0
const animate = () => {

    const currentTime = Date.now()
    const dt = currentTime - time
    time = currentTime

    // console.log(cubeMesh.position.angleTo(new THREE.Vector3(0, 0, 0)))
    // console.log(cubeMesh.position.applyMatrix3(new THREE.Matrix3(0.002*dt, 0, 0, 0, 0.002*dt, 0, 0, 0, 1)))
    let m = new THREE.Matrix4(); 
    m.makeRotationZ(0.002 * dt)

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            cubeMesh[i][j][2].position.applyMatrix4(m)
            cubeMesh[i][j][2].rotateZ(0.002*dt)
        }
    }
    

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)
}

animate()