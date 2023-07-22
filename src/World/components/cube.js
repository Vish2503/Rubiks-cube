import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three'; 

function createCube() {
    const geometry = new BoxGeometry(0.2,0.2,0.2)
    const material = new MeshStandardMaterial()

    const cube = new Mesh(geometry, material)

    // cube.tick = (delta) => {
    //     cube.rotation.x += Math.PI * delta / 6
    //     cube.rotation.y += Math.PI * delta / 6
    //     cube.rotation.z += Math.PI * delta / 6
    // }

    cube.tick = (delta) => {}

    return cube
}

export { createCube }