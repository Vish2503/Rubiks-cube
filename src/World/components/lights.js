import { AmbientLight, DirectionalLight } from 'three';   

function createLights() {
    const ambientLight = new AmbientLight('white', 1)
    const light = new DirectionalLight('white', 3)

    light.position.set(5,5,5)

    return {ambientLight, light}
}

export { createLights }