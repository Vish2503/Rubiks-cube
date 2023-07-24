import { createCamera } from './components/camera';
import { createScene } from './components/scene';
import { createLights } from './components/lights';
import { Rubikscube } from './components/Rubikscube';
import { AxesHelper, Matrix4 } from 'three'; 

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
        const axesHelper = new AxesHelper( 5 );
        scene.add( axesHelper );

        controls = createControls(camera, renderer.domElement)
        loop.updatables.push(controls)


        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    scene.add(rubikscube.pieces[i][j][k])
                }
            }
        }
        
        const {ambientLight, light} = createLights()
        scene.add(ambientLight, light)
        
        this.rotate90 = () => {
            controls.enable = false
            controls.reset()
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
                    rubikscube.pieces[2][1][1].rotation.x = 0
                    for (let j = 0; j < 3; j++) {
                        for (let k = 0; k < 3; k++) {
                            if (j === 1 && k === 1) continue;
                            rubikscube.pieces[2][j][k].rotation.x += Math.PI / 2
                        }
                    }
                    controls.enable = true
                }
            }
        }

        // this.rotate = (move) => {
        //     let x,y,z,dir
        //     switch (move.charAt(0)) {
        //         case "R":
        //             x = [2]
        //             y = [0,1,2]
        //             z = [0,1,2]
        //             break;
        //         case "L":
        //             x = [0]
        //             y = [0,1,2]
        //             z = [0,1,2]
        //             break;
        //         case "F":
        //             x = [0,1,2]
        //             y = [0,1,2]
        //             z = [2]
        //             break;
        //         case "B":
        //             x = [0,1,2]
        //             y = [0,1,2]
        //             z = [0]
        //             break;
        //         case "U":
        //             x = [0,1,2]
        //             y = [2]
        //             z = [0,1,2]
        //             break;
        //         case "D":
        //             x = [0,1,2]
        //             y = [0]
        //             z = [0,1,2]
        //             break;
        //         default:
        //             break;
        //     }
        //     if (!move.charAt(1)) dir = -1;
        //     else if (move.charAt(1) === "'") dir = 1;
        //     else if (move.charAt(1) === "2") dir = -2;
        //     let i_, j_, k_;
        //     x.forEach(i => {
        //         y.forEach(j => {
        //             z.forEach(k => {
        //                 if (x.length === 1) {
        //                     i_ = i
        //                     j_ = 1
        //                     k_ = 1
        //                 }
        //                 else if (y.length === 1) {
        //                     i_ = 1
        //                     j_ = j
        //                     k_ = 1
        //                 }
        //                 else if (z.length === 1) {
        //                     i_ = 1
        //                     j_ = 1
        //                     k_ = k
        //                 }
        //                 if ( i === i_ && j === j_ && k === k_) return ;
        //                 rubikscube.pieces[i_][j_][k_].attach(rubikscube.pieces[i][j][k]);
        //             });
        //         });
        //     });

        //     let total = 0
        //     loop.updatables.push(rubikscube.pieces[i_][j_][k_])
        //     rubikscube.pieces[i_][j_][k_].tick = (delta) => {
        //         let speed = Math.PI * delta
        //         if (i_ === 0 || i_ === 2) rubikscube.pieces[i_][j_][k_].rotation.x += dir * speed
        //         else if (j_ === 0 || j_ === 2) rubikscube.pieces[i_][j_][k_].rotation.y += dir * speed
        //         else if (k_ === 0 || k_ === 2) rubikscube.pieces[i_][j_][k_].rotation.z += dir * speed
        //         total += dir * speed

        //         if (Math.abs(total) > Math.abs(dir * Math.PI / 2)) {
        //             loop.updatables.splice(loop.updatables.indexOf(rubikscube.pieces[i_][j_][k_]));
        //             if (i_ === 0 || i_ === 2) rubikscube.pieces[i_][j_][k_].rotation.x = 0
        //             else if (j_ === 0 || j_ === 2) rubikscube.pieces[i_][j_][k_].rotation.y = 0
        //             else if (k_ === 0 || k_ === 2) rubikscube.pieces[i_][j_][k_].rotation.z = 0
        //             x.forEach(i => {
        //                 y.forEach(j => {
        //                     z.forEach(k => {
        //                         if ( i === i_ && j === j_ && k === k_) return ;
        //                         if (i_ === 0 || i_ === 2) rubikscube.pieces[i][j][k].rotation.x += dir * Math.PI / 2
        //                         else if (j_ === 0 || j_ === 2) rubikscube.pieces[i][j][k].rotation.y += dir * Math.PI / 2
        //                         else if (k_ === 0 || k_ === 2) rubikscube.pieces[i][j][k].rotation.z += dir * Math.PI / 2
        //                     });
        //                 });
        //             });
        //             controls.enable = true
        //         }
        //     }   
        // }



        this.rotate = (move) => {
            let x,y,z,dir
            switch (move.charAt(0)) {
                case "R":
                    x = [2]
                    y = [0,1,2]
                    z = [0,1,2]
                    break;
                case "L":
                    x = [0]
                    y = [0,1,2]
                    z = [0,1,2]
                    break;
                case "F":
                    x = [0,1,2]
                    y = [0,1,2]
                    z = [2]
                    break;
                case "B":
                    x = [0,1,2]
                    y = [0,1,2]
                    z = [0]
                    break;
                case "U":
                    x = [0,1,2]
                    y = [2]
                    z = [0,1,2]
                    break;
                case "D":
                    x = [0,1,2]
                    y = [0]
                    z = [0,1,2]
                    break;
                default:
                    break;
            }
            if (!move.charAt(1)) dir = -1;
            else if (move.charAt(1) === "'") dir = 1;
            else if (move.charAt(1) === "2") dir = -2;
            let i_, j_, k_;
            x.forEach(i => {
                y.forEach(j => {
                    z.forEach(k => {
                        if (x.length === 1) {
                            i_ = i
                            j_ = 1
                            k_ = 1
                        }
                        else if (y.length === 1) {
                            i_ = 1
                            j_ = j
                            k_ = 1
                        }
                        else if (z.length === 1) {
                            i_ = 1
                            j_ = 1
                            k_ = k
                        }
                        if ( i === i_ && j === j_ && k === k_) return ;
                        const [a,b,c] = rubikscube.indices[i][j][k]
                        console.log(a,b,c)
                        rubikscube.pieces[i_][j_][k_].attach(rubikscube.pieces[a][b][c]);
                    });
                });
            });

            let total = 0
            loop.updatables.push(rubikscube.pieces[i_][j_][k_])
            rubikscube.pieces[i_][j_][k_].tick = (delta) => {
                let speed = Math.PI * delta
                if (i_ === 0 || i_ === 2) rubikscube.pieces[i_][j_][k_].rotation.x += dir * speed
                else if (j_ === 0 || j_ === 2) rubikscube.pieces[i_][j_][k_].rotation.y += dir * speed
                else if (k_ === 0 || k_ === 2) rubikscube.pieces[i_][j_][k_].rotation.z += dir * speed
                total += dir * speed

                if (Math.abs(total) > Math.abs(dir * Math.PI / 2)) {
                    loop.updatables.splice(loop.updatables.indexOf(rubikscube.pieces[i_][j_][k_]));
                    if (i_ === 0 || i_ === 2) {
                        rubikscube.pieces[i_][j_][k_].rotation.x = Math.round(Math.abs(total) / Math.abs(dir * Math.PI / 2)) * dir * Math.PI / 2
                        for (let times = 1; times <= dir % 4; times++) {
                            let temp = []
                            temp = rubikscube.indices[i_][2][2]
                            rubikscube.indices[i_][2][2] = rubikscube.indices[i_][0][2]
                            rubikscube.indices[i_][0][2] = rubikscube.indices[i_][0][0]
                            rubikscube.indices[i_][0][0] = rubikscube.indices[i_][2][0]
                            rubikscube.indices[i_][2][0] = temp
                            temp = rubikscube.indices[i_][2][1]
                            rubikscube.indices[i_][2][1] = rubikscube.indices[i_][1][0]
                            rubikscube.indices[i_][1][0] = rubikscube.indices[i_][0][1]
                            rubikscube.indices[i_][0][1] = rubikscube.indices[i_][1][2]
                            rubikscube.indices[i_][1][2] = temp
                        }
                        console.log(rubikscube.indices)
                    }
                    else if (j_ === 0 || j_ === 2) {
                        rubikscube.pieces[i_][j_][k_].rotation.y = Math.round(Math.abs(total) / Math.abs(dir * Math.PI / 2)) * dir * Math.PI / 2
                        for (let times = 1; times <= dir % 4; times++) {
                            let temp = []
                            temp = rubikscube.indices[2][j_][2]
                            rubikscube.indices[2][j_][2] = rubikscube.indices[0][j_][2]
                            rubikscube.indices[0][j_][2] = rubikscube.indices[0][j_][0]
                            rubikscube.indices[0][j_][0] = rubikscube.indices[2][j_][0]
                            rubikscube.indices[2][j_][0] = temp
                            temp = rubikscube.indices[2][j_][1]
                            rubikscube.indices[2][j_][1] = rubikscube.indices[1][j_][0]
                            rubikscube.indices[1][j_][0] = rubikscube.indices[0][j_][1]
                            rubikscube.indices[0][j_][1] = rubikscube.indices[1][j_][2]
                            rubikscube.indices[1][j_][2] = temp
                        }
                    }
                    else if (k_ === 0 || k_ === 2) {
                        rubikscube.pieces[i_][j_][k_].rotation.z = Math.round(Math.abs(total) / Math.abs(dir * Math.PI / 2)) * dir * Math.PI / 2
                        for (let times = 1; times <= dir % 4; times++) {
                            let temp = []
                            temp = rubikscube.indices[2][2][k_]
                            rubikscube.indices[2][2][k_] = rubikscube.indices[0][2][k_]
                            rubikscube.indices[0][2][k_] = rubikscube.indices[0][0][k_]
                            rubikscube.indices[0][0][k_] = rubikscube.indices[2][0][k_]
                            rubikscube.indices[2][0][k_] = temp
                            temp = rubikscube.indices[2][1][k_]
                            rubikscube.indices[2][1][k_] = rubikscube.indices[1][0][k_]
                            rubikscube.indices[1][0][k_] = rubikscube.indices[0][1][k_]
                            rubikscube.indices[0][1][k_] = rubikscube.indices[1][2][k_]
                            rubikscube.indices[1][2][k_] = temp
                        }
                    }
                    x.forEach(i => {
                        y.forEach(j => {
                            z.forEach(k => {
                                if ( i === i_ && j === j_ && k === k_) return ;
                                // if (i_ === 0 || i_ === 2) rubikscube.pieces[i][j][k].rotation.x += dir * Math.PI / 2
                                // else if (j_ === 0 || j_ === 2) rubikscube.pieces[i][j][k].rotation.y += dir * Math.PI / 2
                                // else if (k_ === 0 || k_ === 2) rubikscube.pieces[i][j][k].rotation.z += dir * Math.PI / 2
                            });
                        });
                    });
                    controls.enable = true
                }
                //rubikscube.pieces[i_][j_][k_].updateMatrix()
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