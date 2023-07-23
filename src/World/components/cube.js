import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three'; 

function createCube() {
    const geometry = new BoxGeometry(0.2,0.2,0.2)
    const material = new MeshStandardMaterial()

    const cube = new Mesh(geometry, material)

    return cube
}

export { createCube }