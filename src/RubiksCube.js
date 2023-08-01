import { World } from './World/World.js';
import { Rubikscube } from './World/components/3x3.js';  
import { Euler, Raycaster, Vector3 } from 'three';  


let world;
let rubiksCube;

let currentlyAnimating = false

function createWorld(container) {
    world = new World(container)
    world.start()

    rubiksCube = new Rubikscube()
    rubiksCube.addToScene(world.scene)  
}

// this function does a move on the rubiks cube when called, both the animation and moving the cube around.
function move(move) {

    // using a promise to ensure that we will wait for the whole animation to finish and then move on to other moves
    return new Promise(resolve => {
        // this global variable will let us know whenever we are animating so we can stop other controls which may cause issues with the animation
        currentlyAnimating = true
        const [x, y, z, dir, rotatingAround] = getMoveInfo(move)

        // i_, j_ and k_ will be the position of the center piece which will actually rotate and the other pieces on the face or cube will be attached to the centerpiece and move together
        let i_ = 1
        let j_ = 1
        let k_ = 1
        // we are holding the indices of the piece actually at any position in an indices array so a, b, c will hold that index and eventually i_, j_, k_ will be assigned that value
        let a = 1, b = 1, c = 1
        if (rotatingAround === "x" && x.length === 1) {
            [a,b,c] = rubiksCube.indices[x[0]][1][1]
        }
        else if (rotatingAround === "y" && y.length === 1) {
            [a,b,c] = rubiksCube.indices[1][y[0]][1]
        }
        else if (rotatingAround === "z" && z.length === 1) {
            [a,b,c] = rubiksCube.indices[1][1][z[0]]
        }
        i_ = a
        j_ = b
        k_ = c

        // attaching the actual pieces to the center piece in the scene
        for (const i of x) {
            for (const j of y) {
                for (const k of z) {
                    [a,b,c] = rubiksCube.indices[i][j][k]
                    if (a === i_ && b === j_ && c === k_) continue;
                    rubiksCube.pieces[i_][j_][k_].cube.attach(rubiksCube.pieces[a][b][c].cube)
                }
            }
        }

        // now we can animate and move that center piece
        world.loop.updatables.push(rubiksCube.pieces[i_][j_][k_])
        let total = 0
        const oldRotation = new Euler().copy(rubiksCube.pieces[i_][j_][k_].cube.rotation)
        rubiksCube.pieces[i_][j_][k_].tick = (delta) => {

            const speed = delta * Math.PI * 2
            
            if (move.charAt(0) === "x" || move.charAt(0) === "r") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(1,0,0), dir * speed)
            } else if (move.charAt(0) === "y" || move.charAt(0) === "u") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,1,0), dir * speed)
            } else if (move.charAt(0) === "z" || move.charAt(0) === "f" || move.charAt(0) === "S") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,1), dir * speed)
            } else if (move.charAt(0) === "l" || move.charAt(0) === "M") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(-1,0,0), dir * speed)
            } else if (move.charAt(0) === "d" || move.charAt(0) === "E") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,-1,0), dir * speed)
            } else if (move.charAt(0) === "b") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,-1), dir * speed)
            } else {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(rubiksCube.pieces[i_][j_][k_].cube.position, dir * speed)
            }

            total += dir * speed

            // when we have sufficiently animated the move, we can remove the centerpiece from the animation loop and revert back to the oldRotation then finally actually move the pieces as we wanted
            if (Math.abs(total) >= Math.abs(dir * Math.PI / 2)) {

                world.loop.updatables.splice(world.loop.updatables.indexOf(rubiksCube.pieces[i_][j_][k_]))
                currentlyAnimating = false

                rubiksCube.pieces[i_][j_][k_].cube.setRotationFromEuler(oldRotation)
                if (move.charAt(0) === "x" || move.charAt(0) === "r") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(1,0,0), dir * Math.PI / 2)
                } else if (move.charAt(0) === "y" || move.charAt(0) === "u") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,1,0), dir * Math.PI / 2)
                } else if (move.charAt(0) === "z" || move.charAt(0) === "f" || move.charAt(0) === "S") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,1), dir * Math.PI / 2)
                } else if (move.charAt(0) === "l" || move.charAt(0) === "M") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(-1,0,0), dir * Math.PI / 2)
                } else if (move.charAt(0) === "d" || move.charAt(0) === "E") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,-1,0), dir * Math.PI / 2)
                } else if (move.charAt(0) === "b") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,-1), dir * Math.PI / 2)
                } else {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(rubiksCube.pieces[i_][j_][k_].cube.position, dir * Math.PI / 2)
                }

                // finally we can change the indices array to hold the new values after the move finishes
                let new_i, new_j, new_k
                let previous = []
                for (let i = 0; i < 3; i++) {
                    previous[i] = []
                    for (let j = 0; j < 3; j++) {
                        previous[i][j] = []
                        for (let k = 0; k < 3; k++) {
                            previous[i][j][k] = []
                            previous[i][j][k] = rubiksCube.indices[i][j][k]
                            // also using this loop to remove the piece from being attached to the centerpiece
                            rubiksCube.group.attach(rubiksCube.pieces[i][j][k].cube)
                        }
                    }
                }
                for (const i of x) {
                    for (const j of y) {
                        for (const k of z) {
                            let vector1 = new Vector3(i-1,j-1,k-1)
                            if (move.charAt(0) === "R" || move.charAt(0) === "x" || move.charAt(0) === "r") {
                                vector1.applyAxisAngle(new Vector3(1,0,0), dir * Math.PI / 2).round()
                            }
                            if (move.charAt(0) === "L" || move.charAt(0) === "l" || move.charAt(0) === "M") {
                                vector1.applyAxisAngle(new Vector3(-1,0,0), dir * Math.PI / 2).round()
                            }
                            else if (move.charAt(0) === "U" || move.charAt(0) === "y" || move.charAt(0) === "u") {
                                vector1.applyAxisAngle(new Vector3(0,1,0), dir * Math.PI / 2).round()
                            }
                            else if (move.charAt(0) === "D" || move.charAt(0) === "d" || move.charAt(0) === "E") {
                                vector1.applyAxisAngle(new Vector3(0,-1,0), dir * Math.PI / 2).round()
                            }
                            else if (move.charAt(0) === "F" || move.charAt(0) === "z" || move.charAt(0) === "f" || move.charAt(0) === "S") {
                                vector1.applyAxisAngle(new Vector3(0,0,1), dir * Math.PI / 2).round()
                            }
                            else if (move.charAt(0) === "B" || move.charAt(0) === "b") {
                                vector1.applyAxisAngle(new Vector3(0,0,-1), dir * Math.PI / 2).round()
                            }
                            new_i = vector1.getComponent(0) + 1
                            new_j = vector1.getComponent(1) + 1
                            new_k = vector1.getComponent(2) + 1
                            rubiksCube.indices[new_i][new_j][new_k] = previous[i][j][k]
                        }
                    }
                }
                // we can now resolve the promise as we have completed everything for this move
                resolve();
            }
        }
    })
}

// this function just gives us information about the pieces to be moved, which way to move the pieces and on which axis the pieces need to be moved, it is a helper function for move
function getMoveInfo(move) {
    let x = [0,1,2]
    let y = [0,1,2]
    let z = [0,1,2]
    let dir
    let rotatingAround
    if (!move.charAt(1)) {
        dir = -1
    } else if (move.charAt(1) === "'") {
        dir = 1
    }
    else if (move.charAt(1) === "2") {
        dir = -2
    }
    else if (move.charAt(1) === "3") {
        dir = -3
    }
    else if (move.charAt(1) === "3") {
        dir = -3
    }
    switch (move.charAt(0)) {
        case "R":
            x = [2]
            rotatingAround = "x"
            break;
        case "r":
            x = [1,2]
            rotatingAround = "x"
            break;
        case "L":
            x = [0]
            rotatingAround = "x"
            break;
        case "l":
            x = [0,1]
            rotatingAround = "x"
            break;
        case "M":
            x = [1]
            rotatingAround = "x"
            break;
        case "U":
            y = [2]
            rotatingAround = "y"
            break;
        case "u":
            y = [1,2]
            rotatingAround = "y"
            break;
        case "D":
            y = [0]
            rotatingAround = "y"
            break;
        case "d":
            y = [0,1]
            rotatingAround = "y"
            break;
        case "E":
            y = [1]
            rotatingAround = "y"
            break;
        case "F":
            z = [2]
            rotatingAround = "z"
            break;
        case "f":
            z = [1,2]
            rotatingAround = "z"
            break;
        case "S":
            z = [1]
            rotatingAround = "z"
            break;
        case "B":
            z = [0]
            rotatingAround = "z"
            break;
        case "b":
            z = [0,1]
            rotatingAround = "z"
            break;
        case "x":
            rotatingAround = "x"
            break;
        case "y":
            rotatingAround = "y"
            break;
        case "z":
            rotatingAround = "z"
            break;
        default:
            break;
    }
    return [x, y, z, dir, rotatingAround]
}

// this function returns all 6 faces in a string following the representation expected by the kociemba two phase solver. this was chosen simply for convention, so I do not have to change between by representation and kociemba representation everytime I try to use it
/*
 - https://github.com/hkociemba/RubiksCube-TwophaseSolver
A solved string is of the form: 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
The names of the facelet positions of the cube
             |************|
             |*U1**U2**U3*|
             |************|
             |*U4**U5**U6*|
             |************|
             |*U7**U8**U9*|
             |************|
|************|************|************|************|
|*L1**L2**L3*|*F1**F2**F3*|*R1**R2**R3*|*B1**B2**B3*|
|************|************|************|************|
|*L4**L5**L6*|*F4**F5**F6*|*R4**R5**R6*|*B4**B5**B6*|
|************|************|************|************|
|*L7**L8**L9*|*F7**F8**F9*|*R7**R8**R9*|*B7**B8**B9*|
|************|************|************|************|
             |************|
             |*D1**D2**D3*|
             |************|
             |*D4**D5**D6*|
             |************|
             |*D7**D8**D9*|
             |************|
A cube definition string "UBL..." means for example: In position U1 we have the U-color, in position U2 we have the
B-color, in position U3 we have the L color etc.
*/
function getFaces() {
    let faces = ""
    let intersects
    const raycaster = new Raycaster()
    let i, j, k, a, b, c

    // U face
    j = 1
    for (k = -1; k <= 1; k++) {
        for (i = -1; i <= 1; i++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,1,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // R face
    i = 1
    for (j = 1; j >= -1; j--) {
        for (k = 1; k >= -1; k--) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(1,0,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // F face
    k = 1
    for (j = 1; j >= -1; j--) {
        for (i = -1; i <= 1; i++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,0,1))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // D face
    j = -1
    for (k = 1; k >= -1; k--) {
        for (i = -1; i <= 1; i++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,-1,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // L face
    i = -1
    for (j = 1; j >= -1; j--) {
        for (k = -1; k <= 1; k++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(-1,0,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // B-face
    k = -1
    for (j = 1; j >= -1; j--) {
        for (i = 1; i >= -1; i--) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,0,-1))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    return faces;
}

// simply returns the string representation of the color, the string is the face on which this color is the center of
/*
    White => U
    Green => F
    Red => R
    Blue => B
    Orange => L
    Yellow => D
*/
function getColor(color) {
    switch (color) {
        case 0xffffff:
            return "U"
        case 0x00ff00:
            return "F"
        case 0xff0000:
            return "R"
        case 0x0000ff:
            return "B"
        case 0xffa500:
            return "L"
        case 0xffff00:
            return "D"
        default:
            return "E";
    }
}

export { createWorld, world, rubiksCube, currentlyAnimating, move, getFaces }