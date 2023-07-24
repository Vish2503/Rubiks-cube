import { World } from './World/World.js';   

function main() {

    const container = document.querySelector('#scene-container')

    const world = new World(container)

    world.start()

    document.addEventListener('keyup', () => {
        world.rotate90()
    })
}

main()