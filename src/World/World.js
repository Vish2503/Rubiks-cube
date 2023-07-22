import { createCamera } from './components/camera';
import { createScene } from './components/scene';
import { createCube } from './components/cube';
import { createLights } from './components/lights';

import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';


let camera;
let scene;
let renderer;
let loop;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer)
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
                    loop.updatables.push(cubeMesh[i][j][k])
                } 
            }
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {

                    if (i === 1 && j === 1 && k === 1) continue;
                    if (i === 1 && j === 1) {
                        cubeMesh[1][1][1].add(cubeMesh[i][j][k]);
                        continue
                    }
                    if (j === 1 && k === 1) {
                        cubeMesh[1][1][1].add(cubeMesh[i][j][k]);
                        continue
                    }
                    if (i === 1 && k === 1) {
                        cubeMesh[1][1][1].add(cubeMesh[i][j][k]);
                        continue
                    }
                    if (i === 2) { 
                        cubeMesh[2][1][1].add(cubeMesh[i][j][k])
                        cubeMesh[i][j][k].position.set(0, (j-1)*0.2, (k-1)*0.2)
                    }
                }
            }
        }
        
        // const cube = createCube()
        // loop.updatables.push(cube)
        const light = createLights()
        scene.add(light)
        //scene.add(cube)

        // making the right side center move and all the side pieces will move with it because of it being the parent of all the other pieces
        cubeMesh[2][1][1].tick = (delta) => { cubeMesh[2][1][1].rotation.x += Math.PI * delta}
        
        const resizer = new Resizer(container, camera, renderer);
    }

    render() {
        renderer.render(scene, camera)
    }

    start() {
        loop.start()
    }

    stop() {
        loop.stop()
    }
}

export { World }