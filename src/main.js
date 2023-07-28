import { pingpong } from 'three/src/math/MathUtils.js';
import { World } from './World/World.js';
import { Rubikscube } from './World/components/Rubikscube.js';  
import { Color, LatheGeometry, Raycaster, Vector3 } from 'three';  

const container = document.querySelector('#scene-container')

const world = new World(container)

const rubiksCube = new Rubikscube()
rubiksCube.addToScene(world.scene)

let currentlyAnimating = false

function main() {

    world.start()

    // CURRENT BUG, WHEN ROTATING THE WHOLE CUBE, THE WORLD AXIS REMAINS AT THE SAME PLACE WHICH NEEDS TO BE ALSO ROTATED.
    const string = "R U R' U' R U R' U' R U R' U' R U R' U' R U R' U' R U R' U'"

    
    // const string = "F2 R2 U B2 U' L2 U L2' F2 L B D2 F U F' R' D' F2 L B' x' z R' F R2 D F2 U R U2 R' D' R' U' R y' y' R U R' U R U' R' U' R' U R U' R' U R F R' F' R U R U' R' U'"
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

function move(move, rubikscube = rubiksCube, loop = world.loop) {
    currentlyAnimating = true
    // get the array of pieces to move in x, y, z and also the direction to rotate in, in dir 
    const [x, y, z, dir, rotatingAround] = getMoveInfo(move)

    // i_, j_, k_ are the center pieces on which the the rest of the pieces on the face attach to for movement, if the center piece is not given, we move the whole cube so each piece attaches to the core i.e., piece at (1,1,1)
    let i_ = 1
    let j_ = 1
    let k_ = 1
    // x, y, z contain the indices of the position which needs to be moved, equivalently i, j, k also hold those. So, a, b, c will hold the indices of the piece which is at the position i, j, k currently.
    let a, b, c
    if (rotatingAround === "x" && x.length === 1) {
        [a,b,c] = rubikscube.indices[x[0]][1][1]
    }
    else if (rotatingAround === "y" && y.length === 1) {
        [a,b,c] = rubikscube.indices[1][y[0]][1]
    }
    else if (rotatingAround === "z" && z.length === 1) {
        [a,b,c] = rubikscube.indices[1][1][z[0]]
    }
    i_ = a
    j_ = b
    k_ = c

    for (const i of x) {
        for (const j of y) {
            for (const k of z) {
                [a,b,c] = rubikscube.indices[i][j][k]
                if (a === i_ && b === j_ && c === k_) continue;
                rubikscube.pieces[i_][j_][k_].cube.attach(rubikscube.pieces[a][b][c].cube)
            }
        }
    }

    // now we can animate the center piece we want, to do this we add the piece to the animation loop and write into its tick function.
    loop.updatables.push(rubikscube.pieces[i_][j_][k_])
    let total = 0
    rubikscube.pieces[i_][j_][k_].tick = (delta) => {
        const speed = delta * Math.PI * 2
        if (rotatingAround === "x") rubikscube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(1,0,0), dir * speed)
        else if (rotatingAround === "y") rubikscube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,1,0), dir * speed)
        else if (rotatingAround === "z") rubikscube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,1), dir * speed)
        total += dir * speed

        // When we are done animating, we can actually change the variables of the piece to be at the rotation it needs to be at and also remove it from the animation loop
        if (Math.abs(total) >= Math.abs(dir * Math.PI / 2)){
            loop.updatables.splice(loop.updatables.indexOf(rubikscube.pieces[i_][j_][k_]))
            currentlyAnimating = false
            if (rotatingAround === "x") {
                rubikscube.pieces[i_][j_][k_].totalX += dir * Math.PI / 2
            }
            else if (rotatingAround === "y") {
                rubikscube.pieces[i_][j_][k_].totalY += dir * Math.PI / 2
            }
            else if (rotatingAround === "z") {
                rubikscube.pieces[i_][j_][k_].totalZ += dir * Math.PI / 2
            }
            rubikscube.pieces[i_][j_][k_].cube.setRotationFromAxisAngle(new Vector3(1,0,0),0)
            rubikscube.pieces[i_][j_][k_].cube.setRotationFromAxisAngle(new Vector3(0,1,0),0)
            rubikscube.pieces[i_][j_][k_].cube.setRotationFromAxisAngle(new Vector3(0,0,1),0)
            rubikscube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(1,0,0), rubikscube.pieces[i_][j_][k_].totalX)
            rubikscube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,1,0), rubikscube.pieces[i_][j_][k_].totalY)
            rubikscube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,1), rubikscube.pieces[i_][j_][k_].totalZ)

            // now we need to change the indices to actually show which piece ends up at the new position
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
                        // moving the pieces indices to where they should be after rotation
                        let vector1 = new Vector3(i-1,j-1,k-1)
                        if (rotatingAround === "x") {
                            vector1.applyAxisAngle(new Vector3(1,0,0), dir * Math.PI / 2).round()
                        }
                        else if (rotatingAround === "y") {
                            vector1.applyAxisAngle(new Vector3(0,1,0), dir * Math.PI / 2).round()
                        }
                        else if (rotatingAround === "z") {
                            vector1.applyAxisAngle(new Vector3(0,0,1), dir * Math.PI / 2).round()
                        }
                        new_i = vector1.getComponent(0) + 1
                        new_j = vector1.getComponent(1) + 1
                        new_k = vector1.getComponent(2) + 1
                        rubikscube.indices[new_i][new_j][new_k] = previous[i][j][k]
                    }
                }
            }
        }
    }
}

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
            dir *= -1
            rotatingAround = "x"
            break;
        case "U":
            y = [2]
            rotatingAround = "y"
            break;
        case "D":
            y = [0]
            dir *= -1
            rotatingAround = "y"
            break;
        case "F":
            z = [2]
            rotatingAround = "z"
            break;
        case "B":
            z = [0]
            dir *= -1
            rotatingAround = "z"
            break;
        // case "x":
        //     rotatingAround = "x"
        //     break;
        // case "y":
        //     rotatingAround = "y"
        //     break;
        // case "z":
        //     rotatingAround = "z"
        //     break;
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