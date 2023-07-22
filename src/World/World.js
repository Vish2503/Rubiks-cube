import { createCamera } from './components/camera';
import { createScene } from './components/scene';
import { createCube } from './components/cube';
import { createLights } from './components/lights';

import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';

let camera;
let scene;
let renderer;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.append(renderer.domElement)

        let cubeMesh = []
        for (let i = 0; i < 3; i++) {
            cubeMesh[i] = []
            for (let j = 0; j < 3; j++) {
                cubeMesh[i][j] = []
                for (let k = 0; k < 3; k++) {
                    cubeMesh[i][j][k] = createCube();
                    cubeMesh[i][j][k].position.set((i-1)*0.2, (j-1)*0.2, (k-1)*0.2)
                    scene.add(cubeMesh[i][j][k]);
                    cubeMesh[i][j][k].material.color.r = Math.random()
                    cubeMesh[i][j][k].material.color.g = Math.random()
                    cubeMesh[i][j][k].material.color.b = Math.random()
                } 
            }
        }
        // const cube = createCube()
        const light = createLights()
        scene.add(light)

        const resizer = new Resizer(container, camera, renderer);
    }

    render() {
        renderer.render(scene, camera)
    }
}

export { World }