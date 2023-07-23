import { createCamera } from './components/camera';
import { createScene } from './components/scene';
import { createCube } from './components/cube';
import { createLights } from './components/lights';
import { Rubikscube } from './components/Rubikscube';

import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';
import { AxesHelper } from 'three'; 


let camera;
let scene;
let renderer;
let loop;
let rubikscube;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        rubikscube = new Rubikscube()
        loop = new Loop(camera, scene, renderer)
        container.append(renderer.domElement)
        const axesHelper = new AxesHelper( 5 );
        scene.add( axesHelper );


        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    scene.add(rubikscube.pieces[i][j][k])
                    rubikscube.pieces[i][j][k].material.color.r = Math.random()
                    rubikscube.pieces[i][j][k].material.color.g = Math.random()
                    rubikscube.pieces[i][j][k].material.color.b = Math.random()
                }
            }
        }
        
        const light = createLights()
        scene.add(light)
        
        let n = 0
        this.rotate90 = () => {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    if (j === 1 && k === 1) continue;
                    rubikscube.pieces[2][1][1].attach(rubikscube.pieces[2][j][k]);
                }
            }
            let total = 0
            loop.updatables.push(rubikscube.pieces[2][1][1])
            rubikscube.pieces[2][1][1].tick = (delta) => {
                rubikscube.pieces[2][1][1].rotation.x += Math.PI * delta / 2
                total += Math.PI * delta / 2
        
                if (total >= Math.PI / 2) {
                    loop.updatables.splice(loop.updatables.indexOf(rubikscube.pieces[2][1][1]));
                    n++
                    rubikscube.pieces[2][1][1].rotation.x = n * Math.PI / 2
                }
                console.log(rubikscube.pieces[2][1][1].rotation.x)
            }

            // for (let j = 0; j < 3; j++) {
            //     for (let k = 0; k < 3; k++) {
            //         if (j === 1 && k === 1) continue;
            //         scene.attach((rubikscube.pieces[2][j][k]))
            //     }
            // }

        }

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