import { PerspectiveCamera, Vector3 } from 'three';

function createCamera() {
    const camera = new PerspectiveCamera(75, 1, 0.01, 100)

    camera.position.set(1,1,1);
    camera.lookAt(new Vector3())
    return camera
}

export { createCamera }