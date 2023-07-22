import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three'; 

function createCube() {
    const geometry = new BoxGeometry(2,2,2)
    const material = new MeshBasicMaterial()

    const cube = new Mesh(geometry, material)
    console.log(cube)
    return cube
}

export { createCube }