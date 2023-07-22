import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three'; 

function createCube() {
    const geometry = new BoxGeometry(0.2,0.2,0.2)
    const material = new MeshStandardMaterial()

    const cube = new Mesh(geometry, material)
    // cube.rotation.set(-0.5, -0.1, 0.8);
    return cube
}

export { createCube }