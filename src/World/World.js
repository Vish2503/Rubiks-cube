import { createCamera } from './components/camera';
import { createScene } from './components/scene';
import { createLights } from './components/lights';
import { Rubikscube } from './components/Rubikscube';
import { Vector3 } from 'three'; 

import { createControls } from './systems/controls';
import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';


class World {
    constructor(container) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.loop = new Loop(this.camera, this.scene, this.renderer)
        container.append(this.renderer.domElement)

        this.controls = createControls(this.camera, this.renderer.domElement)
        this.loop.updatables.push(this.controls)

        
        this.ambientLight = createLights()[0]
        this.light = createLights()[1]
        this.scene.add(this.ambientLight, this.light)
        

        this.resizer = new Resizer(container, this.camera, this.renderer);
    }

    render() {
        this.renderer.render(scene, camera)
    }

    start() {
        this.loop.start()
    }

    stop() {
        this.loop.stop()
    }
}

export { World }