import { createWorld, generateScramble, getCubeString, getNotation, move, notationPositions, rubiksCube, setAnimationSpeed, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

let cubestring

let pieces = []
document.addEventListener("keyup", async () => {
    let scramble = generateScramble()
    // setAnimationSpeed(220)
    for (let moves of scramble) {
        await move(moves)
    }
    // const notation = getNotation()
    // await move("M")
    // pieces = [notationPositions[getKeyByValue(notation, "U")]];
    // highlightPieces(pieces)
    // console.log(pieces);
})

function highlightPieces(pieces) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (pieces.includes([i-1,j-1,k-1].join())) {
                    continue
                } else {
                    for (let w = 0; w < 6; w++) {
                        rubiksCube.pieces[i][j][k].faces[w].material.color.set(0x555555)
                    }
                }
            }
        }
    }
}

// thanks to: https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}