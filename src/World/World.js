import { createCamera } from './components/camera';
import { createScene } from './components/scene';
import { createLights } from './components/lights';
import { Rubikscube } from './components/Rubikscube';
import { Vector3 } from 'three'; 

import { createControls } from './systems/controls';
import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';


let camera;
let scene;
let renderer;
let loop;
let controls;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        const rubikscube = new Rubikscube()
        loop = new Loop(camera, scene, renderer)
        container.append(renderer.domElement)

        controls = createControls(camera, renderer.domElement)
        loop.updatables.push(controls)

        rubikscube.addToScene(scene)
        
        const {ambientLight, light} = createLights()
        scene.add(ambientLight, light)
        

        this.rotate = (move) => {
            let x = [0,1,2]
            let y = [0,1,2]
            let z = [0,1,2]
            let dir
            if (!move.charAt(1)) {
                dir = -1
            } else if (move.charAt(1) === "'") {
                dir = 1
            }
            else if (move.charAt(1) === "2") {
                dir = -2
            }
            switch (move.charAt(0)) {
                case "R":
                    x = [2]
                    break;
                case "L":
                    x = [0]
                    dir *= -1
                    break;
                case "U":
                    y = [2]
                    break;
                case "D":
                    y = [0]
                    dir *= -1
                    break;
                case "F":
                    z = [2]
                    break;
                case "B":
                    z = [0]
                    dir *= -1
                    break;
                default:
                    break;
            }
            let i_ = 1
            let j_ = 1
            let k_ = 1
            let a, b, c
            for (const i of x) {
                for (const j of y) {
                    for (const k of z) {
                        if (x.length === 1) i_ = i;
                        else if (y.length === 1) j_ = j;
                        else if (z.length === 1) k_ = k;
                        [a,b,c] = rubikscube.indices[i][j][k]
                        if (i === i_ && j === j_ && k === k_) continue;
                        rubikscube.pieces[i_][j_][k_].cube.attach(rubikscube.pieces[a][b][c].cube)
                    }
                }
            }

            loop.updatables.push(rubikscube.pieces[i_][j_][k_])
            let total = 0
            rubikscube.pieces[i_][j_][k_].tick = (delta) => {
                const speed = delta * Math.PI * 2
                if (i_ != 1) rubikscube.pieces[i_][j_][k_].cube.rotation.x += dir * speed
                else if (j_ != 1) rubikscube.pieces[i_][j_][k_].cube.rotation.y += dir * speed
                else if (k_ != 1) rubikscube.pieces[i_][j_][k_].cube.rotation.z += dir * speed
                total += dir * speed

                if (Math.abs(total) >= Math.abs(dir * Math.PI / 2)){
                    loop.updatables.splice(loop.updatables.indexOf(rubikscube.pieces[i_][j_][k_]))
                    if (i_ != 1) {
                        rubikscube.pieces[i_][j_][k_].totalX += dir * Math.PI / 2
                        rubikscube.pieces[i_][j_][k_].cube.rotation.x = rubikscube.pieces[i_][j_][k_].totalX
                    }
                    else if (j_ != 1) {
                        rubikscube.pieces[i_][j_][k_].totalY += dir * Math.PI / 2
                        rubikscube.pieces[i_][j_][k_].cube.rotation.y = rubikscube.pieces[i_][j_][k_].totalY
                    }
                    else if (k_ != 1) {
                        rubikscube.pieces[i_][j_][k_].totalZ += dir * Math.PI / 2
                        rubikscube.pieces[i_][j_][k_].cube.rotation.z = rubikscube.pieces[i_][j_][k_].totalZ
                    }
                    let new_i, new_j, new_k
                    let previous = []
                    for (let i = 0; i < 3; i++) {
                        previous[i] = []
                        for (let j = 0; j < 3; j++) {
                            previous[i][j] = []
                            for (let k = 0; k < 3; k++) {
                                previous[i][j][k] = []
                                previous[i][j][k][0] = rubikscube.indices[i][j][k][0]
                                previous[i][j][k][1] = rubikscube.indices[i][j][k][1]
                                previous[i][j][k][2] = rubikscube.indices[i][j][k][2]
                            }
                        }
                    }
                    for (const i of x) {
                        for (const j of y) {
                            for (const k of z) {
                                if (i === i_ && j === j_ && k === k_) continue;
                                scene.attach(rubikscube.pieces[a][b][c].cube)
                                if (i_ != 1) {
                                    // moving the pieces indices to where they should be after rotation
                                    let vector1 = new Vector3(i-1,j-1,k-1)
                                    vector1.applyAxisAngle(new Vector3(1,0,0), dir * Math.PI / 2)
                                    new_i = Math.round(vector1.toArray()[0]) + 1
                                    new_j = Math.round(vector1.toArray()[1]) + 1
                                    new_k = Math.round(vector1.toArray()[2]) + 1
                                    rubikscube.indices[new_i][new_j][new_k][0] = previous[i][j][k][0]
                                    rubikscube.indices[new_i][new_j][new_k][1] = previous[i][j][k][1]
                                    rubikscube.indices[new_i][new_j][new_k][2] = previous[i][j][k][2]
                                }
                                else if (j_ != 1) {
                                    // moving the pieces indices to where they should be after rotation
                                    let vector1 = new Vector3(i-1,j-1,k-1)
                                    vector1.applyAxisAngle(new Vector3(0,1,0), dir * Math.PI / 2)
                                    new_i = Math.round(vector1.toArray()[0]) + 1
                                    new_j = Math.round(vector1.toArray()[1]) + 1
                                    new_k = Math.round(vector1.toArray()[2]) + 1
                                    rubikscube.indices[new_i][new_j][new_k][0] = previous[i][j][k][0]
                                    rubikscube.indices[new_i][new_j][new_k][1] = previous[i][j][k][1]
                                    rubikscube.indices[new_i][new_j][new_k][2] = previous[i][j][k][2]
                                }
                                else if (k_ != 1) {
                                    // moving the pieces indices to where they should be after rotation
                                    let vector1 = new Vector3(i-1,j-1,k-1)
                                    vector1.applyAxisAngle(new Vector3(0,0,1), dir * Math.PI / 2)
                                    new_i = Math.round(vector1.toArray()[0]) + 1
                                    new_j = Math.round(vector1.toArray()[1]) + 1
                                    new_k = Math.round(vector1.toArray()[2]) + 1
                                    // console.log(new_i, new_j, new_k);
                                    rubikscube.indices[new_i][new_j][new_k][0] = previous[i][j][k][0]
                                    rubikscube.indices[new_i][new_j][new_k][1] = previous[i][j][k][1]
                                    rubikscube.indices[new_i][new_j][new_k][2] = previous[i][j][k][2]
                                }
                            }
                        }
                    }
                }
            }


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

// rubikscube.pieces[i_][j_][k_].cube.rotation.x = 0
// rubikscube.pieces[i][j][k].y = Math.round(Math.cos(dir * Math.PI / 2) * y_ - Math.sin(dir * Math.PI / 2) * z_)
// console.log(y_, rubikscube.pieces[i][j][k].y);
// rubikscube.pieces[i][j][k].z = Math.round(Math.cos(dir * Math.PI / 2) * y_ + Math.sin(dir * Math.PI / 2) * z_)
// console.log(z_, rubikscube.pieces[i][j][k].z);

// rubikscube.pieces[i][j][k].cube.position.set(rubikscube.pieces[i][j][k].x, rubikscube.pieces[i][j][k].y, rubikscube.pieces[i][j][k].z)

// rubikscube.indices[i][j][k] = [rubikscube.pieces[i][j][k].x + 1, rubikscube.pieces[i][j][k].y + 1, rubikscube.pieces[i][j][k].z + 1]

// rubikscube.pieces[i][j][k].totalX += dir * Math.PI / 2
// rubikscube.pieces[i][j][k].cube.rotation.x = rubikscube.pieces[i][j][k].totalX