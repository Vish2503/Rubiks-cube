import { world, rubiksCube, move, createWorld } from './src/RubiksCube';

const container = document.querySelector('#scene-container')
createWorld(container)

const string = `U L2 D' B2 U' R2 B2 F2 D' F2 L2 R2 F R2 D L2 R2 B' L' D' R F' x2 y D' R u D R' y' D' R D R' y D r' E' L z2 U y l D R' z' R' x z' r' R2 U2 z D R2 D2 R' l' z M D2 M' z2 y R z' M z R' z' r' L' z D R' E R U' u' R E' R' u R' E' R E2 R E R' R2 E E' r2 E M2 E'`
const moves = string.split(" ")
let i = 0;
container.addEventListener('click', async () => {
    world.loop.updatables.splice(world.loop.updatables.indexOf(rubiksCube.group))
    while (i < moves.length) {
        await move(moves[i])
        i++
    }
}, {once:true})
// document.addEventListener('click', async () => {
//     if (!currentlyAnimating) {
//         await move(moves[i])
//         i++
//     }
// })
document.addEventListener('DOMContentLoaded', () => {
    world.loop.updatables.push(rubiksCube.group)
    rubiksCube.group.tick = (delta) => {
        rubiksCube.group.rotation.y += - delta
        rubiksCube.group.position.y = Math.sin(rubiksCube.group.rotation.y) / 2

    }
})