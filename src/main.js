import { pingpong } from 'three/src/math/MathUtils.js';
import { World } from './World/World.js';
import { Rubikscube } from './World/components/Rubikscube.js';  
import { Color, Euler, LatheGeometry, Raycaster, Vector3 } from 'three';  

const container = document.querySelector('#scene-container')

const world = new World(container)

const rubiksCube = new Rubikscube()
rubiksCube.addToScene(world.scene)

let currentlyAnimating = false

function main() {

    world.start()
    
    const string = "D U F2' L2 U' B2 F2 D L2 U R' F' D R' F' U L D' F' D R2 x2 R' D D R' D L' U L D R' U' R D L U' L' U' R U R' U y' R' U' R L' x' U' R U' R' U U L x U"
    const moves = string.split(" ")
    let i = 0;
    document.addEventListener('click', () => {
        if (!currentlyAnimating) {
            move(moves[i])
            i++
        }
    })
    document.addEventListener("keydown", () => {
        getFaces()
    })
}



function move(move) {
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
        
        if (move.charAt(0) === "x") {
            rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(1,0,0), dir * speed)
        } else if (move.charAt(0) === "y") {
            rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,1,0), dir * speed)
        } else if (move.charAt(0) === "z") {
            rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,1), dir * speed)
        } else {
            rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(rubiksCube.pieces[i_][j_][k_].cube.position, dir * speed)
        }

        total += dir * speed

        // when we have sufficiently animated the move, we can remove the centerpiece from the animation loop and revert back to the oldRotation then finally actually move the pieces as we wanted
        if (Math.abs(total) >= Math.abs(dir * Math.PI / 2)) {

            world.loop.updatables.splice(world.loop.updatables.indexOf(rubiksCube.pieces[i_][j_][k_]))
            currentlyAnimating = false

            rubiksCube.pieces[i_][j_][k_].cube.setRotationFromEuler(oldRotation)
            if (move.charAt(0) === "x") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(1,0,0), dir * Math.PI / 2)
            } else if (move.charAt(0) === "y") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,1,0), dir * Math.PI / 2)
            } else if (move.charAt(0) === "z") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,1), dir * Math.PI / 2)
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
                    }
                }
            }
            for (const i of x) {
                for (const j of y) {
                    for (const k of z) {
                        let vector1 = new Vector3(i-1,j-1,k-1)
                        if (move.charAt(0) === "R" || move.charAt(0) === "x") {
                            vector1.applyAxisAngle(new Vector3(1,0,0), dir * Math.PI / 2).round()
                        }
                        if (move.charAt(0) === "L") {
                            vector1.applyAxisAngle(new Vector3(-1,0,0), dir * Math.PI / 2).round()
                        }
                        else if (move.charAt(0) === "U" || move.charAt(0) === "y") {
                            vector1.applyAxisAngle(new Vector3(0,1,0), dir * Math.PI / 2).round()
                        }
                        else if (move.charAt(0) === "D") {
                            vector1.applyAxisAngle(new Vector3(0,-1,0), dir * Math.PI / 2).round()
                        }
                        else if (move.charAt(0) === "F" || move.charAt(0) === "z") {
                            vector1.applyAxisAngle(new Vector3(0,0,1), dir * Math.PI / 2).round()
                        }
                        else if (move.charAt(0) === "B") {
                            vector1.applyAxisAngle(new Vector3(0,0,-1), dir * Math.PI / 2).round()
                        }
                        new_i = vector1.getComponent(0) + 1
                        new_j = vector1.getComponent(1) + 1
                        new_k = vector1.getComponent(2) + 1
                        rubiksCube.indices[new_i][new_j][new_k] = previous[i][j][k]
                    }
                }
            }
        }
    }
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
    switch (move.charAt(0)) {
        case "R":
            x = [2]
            rotatingAround = "x"
            break;
        case "L":
            x = [0]
            rotatingAround = "x"
            break;
        case "U":
            y = [2]
            rotatingAround = "y"
            break;
        case "D":
            y = [0]
            rotatingAround = "y"
            break;
        case "F":
            z = [2]
            rotatingAround = "z"
            break;
        case "B":
            z = [0]
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

function getFaces() {
    let faces = ""
    let intersects
    const raycaster = new Raycaster()
    let i, j, k, a, b, c
    i = 1
    // this is non blocking which is possibly the issue with this code right now
    for (k = -1; k <= 1; k++) {
        for (j = -1; j <= 1; j++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,1,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }
    console.log(faces);
}

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
            return null;
    }
}

main()