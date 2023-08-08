import { createWorld, generateScramble, getCubeString, getNotation, move, notationPositions, rubiksCube, setAnimationSpeed, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

let cubestring
let firstNotation

let pieces = []

document.addEventListener("DOMContentLoaded", async () => {
    setAnimationSpeed(1000)
    await move("x2")
    await move("y")
    setAnimationSpeed()
    firstNotation = getNotation()
    Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
})

// document.addEventListener("keyup", async () => {
//     // let scramble = generateScramble()
//     // setAnimationSpeed(220)
//     // for (let moves of scramble) {
//     //     await move(moves)
//     // }
//     firstNotation = getNotation()
//     Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
//     //await move("M")
//     //pieces = [getPositionByNotation("U"), getPositionByNotation("F")];
//     //highlightPieces(pieces)
//     //console.log(pieces);
// })


function introduction() {
    const infoHeader = document.querySelector("#info-header")
    const infoPara = document.querySelector("#info-para")
    const next = document.querySelector("#next")
    const previous = document.querySelector("#previous")

    infoHeader.innerHTML = "INTRODUCTION"
    infoPara.innerHTML = "This is an introduction to the rubiks cube!"
    function first() {
        // if coming to this one by using next, we need to remove the previous to previous function call
        previous.removeEventListener("click", sixth)
        // if coming to this one by using previous we need to remove this function call
        previous.removeEventListener("click", first)
        // now add the previous one which needs to be gone to on click
        previous.addEventListener("click", seventh)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the top layer to be highlighted
        (Object.keys(firstNotation).filter(key => (key.includes("U")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Top Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the top layer."
        next.removeEventListener("click", first)
        next.addEventListener("click", second)
    }
    function second() {
        previous.removeEventListener("click", seventh)
        previous.removeEventListener("click", second)
        previous.addEventListener("click", first)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the middle layer to be highlighted
        (Object.keys(firstNotation).filter(key => !(key.includes("U") || key.includes("D")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Middle Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the middle layer."
        next.removeEventListener("click", second)
        next.addEventListener("click", third)
    }
    function third() {
        previous.removeEventListener("click", first)
        previous.removeEventListener("click", third)
        previous.addEventListener("click", second)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the bottom layer to be highlighted
        (Object.keys(firstNotation).filter(key => (key.includes("D")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Bottom Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the bottom layer."
        next.removeEventListener("click", third)
        next.addEventListener("click", fourth)
    }
    function fourth() {
        previous.removeEventListener("click", second)
        previous.removeEventListener("click", fourth)
        previous.addEventListener("click", third)
        revertHighlight(pieces)
        infoHeader.innerHTML = "FACES"
        infoPara.innerHTML = "There are six faces on a Rubik's Cube. Each colored side of the cube makes up a single face."
        next.removeEventListener("click", fourth)
        next.addEventListener("click", fifth)
    }
    function fifth() {
        previous.removeEventListener("click", third)
        previous.removeEventListener("click", fifth)
        previous.addEventListener("click", fourth)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 1))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "CENTERS"
        infoPara.innerHTML = "These pieces have one color. There are six of them on a cube, one for each side. Center pieces are fixed to the core of the cube and do not move, hence we solve the rest of the face with respect to the center piece. Note that the following colors will always stay opposite to each other in a cube: White & Yellow, Blue & Green and Red & Orange"
        next.removeEventListener("click", fifth)
        next.addEventListener("click", sixth)
    }
    function sixth() {
        previous.removeEventListener("click", fourth)
        previous.removeEventListener("click", sixth)
        previous.addEventListener("click", fifth)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 2))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "EDGES"
        infoPara.innerHTML = "These pieces have two colors on them. There are 12 edge pieces on a cube."
        next.removeEventListener("click", sixth)
        next.addEventListener("click", seventh)
    }
    function seventh() {
        previous.removeEventListener("click", fifth)
        previous.removeEventListener("click", seventh)
        previous.addEventListener("click", sixth)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 3))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "CORNERS"
        infoPara.innerHTML = "These pieces have three colors on them. There are 8 corner pieces on a cube."
        next.removeEventListener("click", seventh)
        next.addEventListener("click", first)
    }
    next.addEventListener("click", first)
    previous.addEventListener("click", seventh)

    document.addEventListener('keyup', event => {
        if (event.key == "ArrowRight") {
            next.click()
        } else if (event.key == "ArrowLeft") {
            previous.click()
        }
    })
}

let beforeHighlight = []
function highlightPieces(pieces) {
    beforeHighlight = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (pieces.includes([i-1,j-1,k-1].join())) {
                    continue
                } else {
                    for (let w = 0; w < 6; w++) {
                        beforeHighlight.push(rubiksCube.pieces[i][j][k].faces[w].material.color.getHex())
                        rubiksCube.pieces[i][j][k].faces[w].material.color.set(0x555555)
                    }
                }
            }
        }
    }
}

function revertHighlight(pieces) {
    let count = 0
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (pieces.includes([i-1,j-1,k-1].join())) {
                    continue
                } else {
                    for (let w = 0; w < 6; w++) {
                        rubiksCube.pieces[i][j][k].faces[w].material.color.set(beforeHighlight[count])
                        count++
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

function getPositionByNotation(value, notation = firstNotation) {
    return notationPositions[getKeyByValue(notation, value)]
}
introduction()