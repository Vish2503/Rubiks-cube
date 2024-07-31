import { world, rubiksCube, move, createWorld, allowedMoves, setAnimationSpeed } from './src/RubiksCube';

const container = document.querySelector('#scene-container')
createWorld(container)

// Max Park 3x3 World Record (3.13s) Reconstruction
const scramble = `D U F2' L2 U' B2 F2 D L2 U R' F' D R' F' U L D' F' D R2`
const scrambleArray = scramble.split(" ")
const solution = `x2 // inspection
                  R' D D R' D L' U L D R' U' R D // xxcross
                  L U' L' // 3rd pair
                  U' R U R' d R' U' R // 4th pair
                  r' U' R U' R' U U r // OLL(CP)
                  U x2 // AUF`
const solutionArray = solution.split(" ").join(',').split('\n').join(',').split(',').filter(el => allowedMoves.includes(el))

document.addEventListener('DOMContentLoaded', async () => {
    world.loop.updatables.push(rubiksCube.group)
    rubiksCube.group.tick = (delta) => {
        rubiksCube.group.rotation.y += - delta
        rubiksCube.group.position.y = Math.sin(rubiksCube.group.rotation.y) / 2
    }

    setAnimationSpeed(5)
    for (let times = 0; times < 5; times++) {
        await new Promise(resolve => setTimeout(resolve, 5000))
        for (let i = 0, n = scrambleArray.length; i < n; i++) {
            await move(scrambleArray[i])
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
        for (let i = 0, n = solutionArray.length; i < n; i++) {
            await move(solutionArray[i])
        }
    }
})
