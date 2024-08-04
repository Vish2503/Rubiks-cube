import { AmbientLight, Clock, MOUSE, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const clock = new Clock();

class World {
    constructor(container) {
        this.camera = new PerspectiveCamera(75, 1, 1, 100);
        this.camera.position.set(4,4,6);
        this.camera.lookAt(new Vector3());

        this.scene = new Scene();

        this.renderer = new WebGLRenderer({ 
                            antialias: true 
                        });

        container.append(this.renderer.domElement)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enablePan = false
        this.controls.enableDamping = true
        this.controls.minDistance = 5
        this.controls.maxDistance = 10
        this.controls.mouseButtons = {
            LEFT: MOUSE.ROTATE,
            MIDDLE: MOUSE.DOLLY,
        }
        
        this.ambientLight = new AmbientLight('white', 3);
        this.scene.add(this.ambientLight)
        
        // Resizing system
        const setSize = () => {
            this.camera.aspect = container.clientWidth / container.clientHeight
            if (window.innerWidth / window.innerHeight < 1) {
                this.camera.fov = 50
            } else {
                this.camera.fov = 75
            }
            this.camera.updateProjectionMatrix();
        
            this.renderer.setSize(container.clientWidth, container.clientHeight)
            this.renderer.setPixelRatio(window.devicePixelRatio);
        };
        setSize();
        window.addEventListener('resize', () => {
            setSize()
        });

        this.updatables = [];
        this.animate();
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        
        let delta = clock.getDelta();
        for (const object of this.updatables) {
            object.tick(delta);
        }
        window.requestAnimationFrame(this.animate.bind(this));
    }
}

export { World }