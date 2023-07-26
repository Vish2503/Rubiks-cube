import { World } from './World/World.js';   

function main() {

    const container = document.querySelector('#scene-container')

    const world = new World(container)

    world.start()

    const string = "L2 U' R' D F U' R' U' B L' R F L R' D B' F2 U L2 R' U' B2 U2 B' F D2 R' F' U L2"
    const moves = string.split(" ")
    let i = 0;
    document.addEventListener('click', () => {
        world.rotate(moves[i])
        i++
    })
}

main()