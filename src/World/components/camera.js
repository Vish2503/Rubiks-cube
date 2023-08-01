import { PerspectiveCamera, Vector3 } from 'three';

function createCamera() {
    const camera = new PerspectiveCamera(75, 1, 1, 100)

    camera.position.set(3,3,7);
    camera.lookAt(new Vector3())
    return camera
}

export { createCamera }