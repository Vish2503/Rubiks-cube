import { World } from './World/World.js';
import { Rubikscube } from './World/components/Rubikscube.js';  
import { Vector3 } from 'three';  

const container = document.querySelector('#scene-container')

const world = new World(container)

const rubiksCube = new Rubikscube()
rubiksCube.addToScene(world.scene)

function main() {

    world.start()

    const string = "F2 R2 U B2 U' L2 U L2' F2 L B D2 F U F' R' D' F2 L B'"
    const moves = string.split(" ")
    let i = 0;
    document.addEventListener('click', () => {
        if (i === 19) {
            console.log("scrambled");
        }
        move(moves[i])
        i++
    })
}

function move(move, rubikscube = rubiksCube, loop = world.loop) {
    // get the array of pieces to move in x, y, z and also the direction to rotate in, in dir 
    const [x, y, z, dir] = getMoveInfo(move)

    // i_, j_, k_ are the center pieces on which the the rest of the pieces on the face attach to for movement, if the center piece is not given, we move the whole cube so each piece attaches to the core i.e., piece at (1,1,1)
    let i_ = 1
    let j_ = 1
    let k_ = 1
    // x, y, z contain the indices of the position which needs to be moved, equivalently i, j, k also hold those. So, a, b, c will hold the indices of the piece which is at the position i, j, k currently.
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

    // now we can animate the center piece we want, to do this we add the piece to the animation loop and write into its tick function.
    loop.updatables.push(rubikscube.pieces[i_][j_][k_])
    let total = 0
    rubikscube.pieces[i_][j_][k_].tick = (delta) => {
        const speed = delta * Math.PI * 2
        if (i_ != 1) rubikscube.pieces[i_][j_][k_].cube.rotation.x += dir * speed
        else if (j_ != 1) rubikscube.pieces[i_][j_][k_].cube.rotation.y += dir * speed
        else if (k_ != 1) rubikscube.pieces[i_][j_][k_].cube.rotation.z += dir * speed
        total += dir * speed

        // When we are done animating, we can actually change the variables of the piece to be at the rotation it needs to be at and also remove it from the animation loop
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
                        if (i === i_ && j === j_ && k === k_) continue;
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

function getMoveInfo(move) {
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
    return [x, y, z, dir]
}

main()