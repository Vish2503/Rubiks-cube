import { World } from './World/World.js';   

function main() {

    const container = document.querySelector('#scene-container')

    const world = new World(container)

    world.start()

    document.addEventListener('click', () => {
        world.rotate("F'")
        // console.log(world.rubikscube.indices)
        // world.rubikscube.rotateMatrixClockwise()
        // world.rubikscube.rotateMatrixClockwise()
        // world.rubikscube.rotateMatrixClockwise()
        // console.log(world.rubikscube.indices)
    })
    document.addEventListener('keyup', () => {
        world.rotate("R'")
    })
}

main()