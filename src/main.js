import { World } from './World/World.js';   

function main() {

    const container = document.querySelector('#scene-container')

    const world = new World(container)

    world.start()

    container.addEventListener('click', () => {
        world.rotate90()
    })
}

main()