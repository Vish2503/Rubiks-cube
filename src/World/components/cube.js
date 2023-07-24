import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three'; 

function createCube() {
    const geometry = new BoxGeometry(1,1,1)
    const material = new MeshStandardMaterial({
        //transparent: true
        color: 'black'
    })
    //material.opacity = 0

    const cube = new Mesh(geometry, material)

    return cube
}

export { createCube }