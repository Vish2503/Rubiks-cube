import { world, rubiksCube, move, createWorld, generateScramble, getCubeString, solveTwoPhase, reverseMove, allowedMoves } from './src/RubiksCube';

const container = document.querySelector('#scene-container')
createWorld(container)


// const string = `U L2 D' B2 U' R2 B2 F2 D' F2 L2 R2 F R2 D L2 R2 B' L' D' R F' x2 y D' R u D R' y' D' R D R' y D r' E' L z2 U y l D R' z' R' x z' r' R2 U2 z D R2 D2 R' l' z M D2 M' z2 y R z' M z R' z' r' L' z D R' E R U' u' R E' R' u R' E' R E2 R E R' R2 E E' r2 E M2 E'`
const string = `R2 L' F2 D2 F' D L2 B' D L U B2 U B2 D2 L2 D' F2 D

F' R' D' R y R U' R' u' // xcross
U' R U R' // 2nd pair
y' L' U2 L U' L' U L // 3rd pair
d U R' U' R U R' U' R // 4th pair
U' R U2' R' R' F R F' R U2' R' // 1LLL`
// this just converts the string above to array containing only allowed moves
const moves = string.split(" ").join(',').split('\n').join(',').split(',').filter(el => allowedMoves.includes(el))
let scramble = generateScramble()
let i = 0;

document.addEventListener('DOMContentLoaded', () => {
    world.loop.updatables.push(rubiksCube.group)
    rubiksCube.group.tick = (delta) => {
        rubiksCube.group.rotation.y += - delta
        rubiksCube.group.position.y = Math.sin(rubiksCube.group.rotation.y) / 2
    }
})

let playpause = document.querySelector("#playpause")
let next = document.querySelector("#next")
let previous = document.querySelector("#previous")
let moveName = document.querySelector("#move")

let playing = false
scramble = generateScramble()
async function playAllMoves() {
    playing = !playing
    while (playing && moves[i]) {
        moveName.innerHTML = moves[i]
        await move(moves[i])
        i++
    }
}

async function playNextMove() {
    next.removeEventListener("click", playNextMove)
    if (moves[i]) {
        moveName.innerHTML = moves[i]
        await move(moves[i])
        i++
    }
    next.addEventListener("click", playNextMove)
}

async function playPreviousMove() {
    previous.removeEventListener("click", playPreviousMove)
    if (i) {
        i--
        moveName.innerHTML = moves[i-1]
        await move(reverseMove(moves[i]))
    }
    previous.addEventListener("click", playPreviousMove)
}

playpause.addEventListener("click", playAllMoves)
next.addEventListener("click", playNextMove)
previous.addEventListener("click", playPreviousMove)