import { Raycaster, Vector2 } from "three"
import { createWorld, generateScramble, getCubeString, getNotation, move, notationPositions, reverseMove, rubiksCube, setAnimationSpeed, shrinkMoveArray, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

let cubestring
let firstNotation

let pieces = []

// document.addEventListener("DOMContentLoaded", async () => {
//     setAnimationSpeed(1000)
//     await move("x2")
//     await move("y")
//     setAnimationSpeed()
//     firstNotation = getNotation()
//     Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
// })

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


async function introduction() {
    setAnimationSpeed(1000)
    await move("x2")
    await move("y")
    setAnimationSpeed()
    firstNotation = getNotation()
    Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
    const infoHeader = document.querySelector("#info-header")
    const infoPara = document.querySelector("#info-para")
    const next = document.querySelector("#next")
    const previous = document.querySelector("#previous")
    const moveName = document.querySelector("#move")

    infoHeader.innerHTML = "INTRODUCTION"
    infoPara.innerHTML = "This is an introduction to the rubiks cube!"
    function first() {
        // if we use > to come to this function we need to remove these listeners
        next.removeEventListener("click", first)
        // if we use < to get to this function we need to remove these listeners
        previous.removeEventListener("click", first)
        next.removeEventListener("click", third)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the top layer to be highlighted
        (Object.keys(firstNotation).filter(key => (key.includes("U")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Top Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the top layer."

        // now add the next one which needs to be gone to on click
        next.addEventListener("click", second)
    }
    function second() {
        next.removeEventListener("click", second)

        previous.removeEventListener("click", second)
        next.removeEventListener("click", fourth)
        
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the middle layer to be highlighted
        (Object.keys(firstNotation).filter(key => !(key.includes("U") || key.includes("D")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Middle Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the middle layer."

        previous.addEventListener("click", first)
        next.addEventListener("click", third)
    }
    function third() {
        previous.removeEventListener("click", first)
        next.removeEventListener("click", third)

        previous.removeEventListener("click", third)
        next.removeEventListener("click", fifth)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the bottom layer to be highlighted
        (Object.keys(firstNotation).filter(key => (key.includes("D")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Bottom Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the bottom layer."

        previous.addEventListener("click", second)
        next.addEventListener("click", fourth)
    }
    function fourth() {
        previous.removeEventListener("click", second)
        next.removeEventListener("click", fourth)

        previous.removeEventListener("click", fourth)
        next.removeEventListener("click", sixth)

        revertHighlight(pieces)
        infoHeader.innerHTML = "FACES"
        infoPara.innerHTML = "There are six faces on a Rubik's Cube. Each colored side of the cube makes up a single face."

        previous.addEventListener("click", third)
        next.addEventListener("click", fifth)
    }
    function fifth() {
        previous.removeEventListener("click", third)
        next.removeEventListener("click", fifth)

        previous.removeEventListener("click", fifth)
        next.removeEventListener("click", seventh)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 1))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "CENTERS"
        infoPara.innerHTML = "These pieces have one color. There are six of them on a cube, one for each side. Center pieces are fixed to the core of the cube and do not move, hence we solve the rest of the face with respect to the center piece. Note that the following colors will always stay opposite to each other in a cube: White & Yellow, Blue & Green and Red & Orange"

        previous.addEventListener("click", fourth)
        next.addEventListener("click", sixth)
    }
    function sixth() {
        previous.removeEventListener("click", fourth)
        next.removeEventListener("click", sixth)

        previous.removeEventListener("click", sixth)
        next.removeEventListener("click", eighth)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 2))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "EDGES"
        infoPara.innerHTML = "These pieces have two colors on them. There are 12 edge pieces on a cube."

        previous.addEventListener("click", fifth)
        next.addEventListener("click", seventh)
    }
    function seventh() {
        previous.removeEventListener("click", fifth)
        next.removeEventListener("click", seventh)

        previous.removeEventListener("click", seventh)
        next.removeEventListener("click", ninth)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 3))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "CORNERS"
        infoPara.innerHTML = "These pieces have three colors on them. There are 8 corner pieces on a cube."

        previous.addEventListener("click", sixth)
        next.addEventListener("click", eighth)
    }
    async function eighth(){
        previous.removeEventListener("click", sixth)
        next.removeEventListener("click", eighth)

        previous.removeEventListener("click", eighth)
        next.removeEventListener("click", tenth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: UP (U)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "U"
        await move("U")
        await delay(1000)
        moveName.innerHTML = "U'"
        await move("U'")
        await delay(1000)
        moveName.innerHTML = "U2"
        await move("U2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("U2")
        setAnimationSpeed()

        previous.addEventListener("click", seventh)
        next.addEventListener("click", ninth)
    }
    async function ninth(){
        previous.removeEventListener("click", seventh)
        next.removeEventListener("click", ninth)

        previous.removeEventListener("click", ninth)
        next.removeEventListener("click", eleventh)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: DOWN (D)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "D"
        await move("D")
        await delay(1000)
        moveName.innerHTML = "D'"
        await move("D'")
        await delay(1000)
        moveName.innerHTML = "D2"
        await move("D2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("D2")
        setAnimationSpeed()

        previous.addEventListener("click", eighth)
        next.addEventListener("click", tenth)
    }
    async function tenth(){
        previous.removeEventListener("click", eighth)
        next.removeEventListener("click", tenth)

        previous.removeEventListener("click", tenth)
        next.removeEventListener("click", twelfth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: LEFT (L)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "L"
        await move("L")
        await delay(1000)
        moveName.innerHTML = "L'"
        await move("L'")
        await delay(1000)
        moveName.innerHTML = "L2"
        await move("L2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("L2")
        setAnimationSpeed()

        previous.addEventListener("click", ninth)
        next.addEventListener("click", eleventh)
    }
    async function eleventh(){
        previous.removeEventListener("click", ninth)
        next.removeEventListener("click", eleventh)

        previous.removeEventListener("click", eleventh)
        next.removeEventListener("click", thirteenth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: RIGHT (R)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "R"
        await move("R")
        await delay(1000)
        moveName.innerHTML = "R'"
        await move("R'")
        await delay(1000)
        moveName.innerHTML = "R2"
        await move("R2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("R2")
        setAnimationSpeed()

        previous.addEventListener("click", tenth)
        next.addEventListener("click", twelfth)
    }
    async function twelfth(){
        previous.removeEventListener("click", tenth)
        next.removeEventListener("click", twelfth)

        previous.removeEventListener("click", twelfth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: FRONT (F)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "F"
        await move("F")
        await delay(1000)
        moveName.innerHTML = "F'"
        await move("F'")
        await delay(1000)
        moveName.innerHTML = "F2"
        await move("F2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("F2")
        setAnimationSpeed()

        previous.addEventListener("click", eleventh)
        next.addEventListener("click", thirteenth)
    }
    async function thirteenth(){
        previous.removeEventListener("click", eleventh)
        next.removeEventListener("click", thirteenth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: BACK (B)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "B"
        await move("B")
        await delay(1000)
        moveName.innerHTML = "B'"
        await move("B'")
        await delay(1000)
        moveName.innerHTML = "B2"
        await move("B2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("B2")
        setAnimationSpeed()

        previous.addEventListener("click", twelfth)
    }
    next.addEventListener("click", first)

    function keyboardControls(event){
        if (event.key == "ArrowRight") {
            next.click()
        } else if (event.key == "ArrowLeft") {
            previous.click()
        }
    }
    document.addEventListener('keyup', keyboardControls)
}

let allFaces 
let selectedFace
async function getUserCube() {
    await delay(1000)
    firstNotation = getNotation()
    Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
    revertHighlight(pieces)
    pieces.length = 0
    const centers = ["U", "D", "F", "B", "R", "L"]
    centers.forEach(element => {
        pieces.push(getPositionByNotation(element))
    })
    highlightPieces(pieces)

    
    const pointer = new Vector2()
    const raycaster = new Raycaster()

    
    const whiteButton = document.querySelector("#whiteButton")
    const redButton = document.querySelector("#redButton")
    const greenButton = document.querySelector("#greenButton")
    const yellowButton = document.querySelector("#yellowButton")
    const orangeButton = document.querySelector("#orangeButton")
    const blueButton = document.querySelector("#blueButton")
    const finished = document.querySelector("#finished")

    let selectedColor
    function selectFace(event) {
        pointer.x = -1 + 2 * (event.offsetX) / container.clientWidth;
        pointer.y = 1 - 2 * (event.offsetY) / container.clientHeight;
        raycaster.setFromCamera( pointer, world.camera );
        try {
            const intersects = raycaster.intersectObjects(allFaces);
            if (selectedFace) {
                selectedFace.material.color.set(0x555555)
            }
            selectedFace = intersects[0].object
            if (selectedColor) {
                selectedFace.material.color.set(selectedColor)
                selectedFace = undefined
            } else {
                selectedFace.material.color.set(0x999999)
            }
        } catch (error) {}
    }

    whiteButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0xFFFFFF
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })
    redButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0xFF0000
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(0xFF0000)
            selectedFace = undefined
        }
    })
    greenButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0x00FF00
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })
    orangeButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0xFFA500
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })
    blueButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0x0000FF
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })
    yellowButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0xFFFF00
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })

    window.addEventListener('click', selectFace);

    function userFinished() {
        let faces = getCubeString()
        if(faces.includes("E")) {
            console.log("not finished");
        }
    }
    finished.addEventListener("click", userFinished)
}

let beforeHighlight = []
function highlightPieces(pieces) {
    beforeHighlight = []
    allFaces = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (pieces.includes([i-1,j-1,k-1].join())) {
                    continue
                } else {
                    for (let w = 0; w < 6; w++) {
                        allFaces.push(rubiksCube.pieces[i][j][k].faces[w])
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

// thanks to: https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// to help with different permutations of a string
function sortString(str) {
    return str.split("").sort().join("")
}

// introduction()
// getUserCube()

setAnimationSpeed(10000)
let scramble = generateScramble()
// let scramble = `U' D2 F' U' R2 B2 L' D' B R2 F' B2 D2 L' R2 D B U D L2 F' B R' D L'`.split(" ")
console.log("scramble:", scramble.join(" "));
for (let i = 0; i < scramble.length; i++) {
    await move(scramble[i])
}
await move("x2")
// setAnimationSpeed()

let solution = []

async function solveDaisy() {
    // getting the white edges which are solved in this step
    let currentNotation = getNotation()
    if (currentNotation["D"] !== "U") {    
        solution.push("x2")
        await move("x2")
        currentNotation = getNotation()
    }
    let whiteEdges = Object.keys(currentNotation).filter(key => (key.length === 2 && key.charAt(0) === "U"))
    
    // removing the edges which are in the correct place already from the array
    let i = whiteEdges.length
    while (i--) {
        if (getKeyByValue(currentNotation, whiteEdges[i]).charAt(0) === "U") {
            whiteEdges.splice(i, 1)
        }
    }
    
    // base case for recursion, when all edges are in the correct position, we can return
    if (whiteEdges.length === 0) {
        return
    }
    
    let firstEdgePosition = getKeyByValue(currentNotation, whiteEdges[0])

    // if the edge is in the correct position but flipped
    if (firstEdgePosition.charAt(1) === "U") {
        while (!(firstEdgePosition === "RU")) {
            solution.push("y")
            await move("y")
            currentNotation = getNotation()
            firstEdgePosition = getKeyByValue(currentNotation, whiteEdges[0])
        }
        solution.push("R'")
        solution.push("U")
        solution.push("F'")
        await move("R'")
        await move("U")
        await move("F'")

        await solveDaisy()
        return
    }

    // moving the cube until we find a white edge to move
    while (!firstEdgePosition.includes("R")) {
        solution.push("y")
        await move("y")
        currentNotation = getNotation()
        firstEdgePosition = getKeyByValue(currentNotation, whiteEdges[0])
    }
    
    // moving the up layer until theres no white piece on the right side which we will be switching so that we dont push it out of the layer
    while (currentNotation["UR"].includes("U")) {
        solution.push("U")
        await move("U")
        currentNotation = getNotation()
    }

    // doing R moves to get it in the top layer where we want it
    while (!currentNotation["UR"].includes("U")) {
        solution.push("R")
        await move("R")
        currentNotation = getNotation()
    }

    // now that one of the pieces is in the correct position we can again use this function to solve the rest of the edge pieces left
    await solveDaisy()
}

async function solveCross() {

    let currentNotation = getNotation()
    let whiteEdges = Object.keys(currentNotation).filter(key => (key.length === 2 && key.charAt(0) === "U"))

    for (let i = whiteEdges.length - 1; i >= 0; i--) {
        let EdgePosition = getKeyByValue(currentNotation, whiteEdges[i])
        if (EdgePosition.charAt(0) === "D" && currentNotation[EdgePosition].charAt(1) === currentNotation[EdgePosition.charAt(1)]) {
            whiteEdges.splice(i, 1)
        }
    }

    if (whiteEdges.length === 0) {
        return
    }

    while (currentNotation["UF"].charAt(0) !== "U") {
        await move("y")
        solution.push("y")
        currentNotation = getNotation()
    }

    while (currentNotation["F"] !== currentNotation["UF"].charAt(1)) {
        await move("d")
        solution.push("d")
        currentNotation = getNotation()
    }

    if (currentNotation["UF"].charAt(0) === "U" && (currentNotation["F"] === currentNotation["UF"].charAt(1))) {
        await move("F2")
        solution.push("F2")
    }

    await solveCross()
}

async function solveFirstLayer() {

    let currentNotation = getNotation()
    if (currentNotation["U"] !== "U") {    
        solution.push("x2")
        await move("x2")
        currentNotation = getNotation()
    }

    let whiteCorners = Object.keys(currentNotation).filter(key => (key.length === 3 && key.charAt(0) === "U"))

    for (let i = whiteCorners.length - 1; i >= 0; i--) {
        let cornerPosition = getKeyByValue(currentNotation, whiteCorners[i])
        if (cornerPosition.charAt(0) === "U" && currentNotation[cornerPosition].charAt(1) === currentNotation[cornerPosition.charAt(1)]) {
            whiteCorners.splice(i, 1)
        }
    }

    if (whiteCorners.length === 0) {
        return
    }
    
    let whiteCornersSorted = [...whiteCorners]
    for (let i = 0; i < whiteCornersSorted.length; i++) {
        let element = whiteCornersSorted[i];
        element = sortString(element)
        whiteCornersSorted[i] = element
    }

    async function getCornerOut(piece = null) {
        let condition = piece ? (sortString(currentNotation["UFR"]) !== sortString(piece)) : !(whiteCornersSorted.includes(sortString(currentNotation["UFR"])))
        let rotation = 0 
        while (condition) {
            solution.push("y")
            await move("y")
            rotation++
            currentNotation = getNotation()
            condition = piece ? (sortString(currentNotation["UFR"]) !== sortString(piece)) : !(whiteCornersSorted.includes(sortString(currentNotation["UFR"])))
        }
        solution.push("R'")
        await move("R'")
        solution.push("D'")
        await move("D'")
        solution.push("R")
        await move("R")
        while (rotation) {
            solution.push("y'")
            await move("y'")
            rotation--
        }
    }

    let rotationCount = 0;
    while (currentNotation["UFR"].includes("U")) {
        solution.push("y")
        await move("y")
        currentNotation = getNotation()
        rotationCount++
        if (rotationCount === 4) {
            await getCornerOut()
        }
    }

    rotationCount = 0;
    let requiredPiece = "U" + currentNotation["F"] + currentNotation["R"]
    while (sortString(currentNotation["DRF"]) !== sortString(requiredPiece)) {
        solution.push("D")
        await move("D")
        currentNotation = getNotation()
        rotationCount++
        if (rotationCount === 4) {
            await getCornerOut(requiredPiece)
        }
    }

    if (currentNotation["DRF"].charAt(0) === "U") {
        solution.push("F")
        await move("F")
        solution.push("D'")
        await move("D'")
        solution.push("F'")
        await move("F'")
        solution.push("D2")
        await move("D2")
        currentNotation = getNotation()
    }

    if (currentNotation["RFD"].charAt(0) === "U") {
        solution.push("D")
        await move("D")
        solution.push("F")
        await move("F")
        solution.push("D'")
        await move("D'")
        solution.push("F'")
        await move("F'")
        currentNotation = getNotation()
    }

    if (currentNotation["FDR"].charAt(0) === "U") {
        solution.push("D'")
        await move("D'")
        solution.push("R'")
        await move("R'")
        solution.push("D")
        await move("D")
        solution.push("R")
        await move("R")
        currentNotation = getNotation()
    }

    await solveFirstLayer()
}

async function solveSecondLayer() {
    let currentNotation = getNotation()
    if (currentNotation["D"] !== "U") {    
        solution.push("x2")
        await move("x2")
        currentNotation = getNotation()
    }

    let secondLayerEdges = ["RF", "RB", "LF", "LB"]

    for (let i = secondLayerEdges.length - 1; i >= 0; i--) {
        let EdgePosition = getKeyByValue(currentNotation, secondLayerEdges[i])
        if (currentNotation[EdgePosition].charAt(0) === currentNotation[EdgePosition.charAt(0)] && currentNotation[EdgePosition].charAt(1) === currentNotation[EdgePosition.charAt(1)]) {
            secondLayerEdges.splice(i, 1)
        }
    }

    if (secondLayerEdges.length === 0) {
        return
    }

    let secondLayerEdgesSorted = [...secondLayerEdges]
    for (let i = 0; i < secondLayerEdgesSorted.length; i++) {
        let element = secondLayerEdgesSorted[i];
        element = sortString(element)
        secondLayerEdgesSorted[i] = element
    }

    async function movingRight() {
        solution.push("U")
        await move("U")
        solution.push("R")
        await move("R")
        solution.push("U'")
        await move("U'")
        solution.push("R'")
        await move("R'")
        solution.push("U'")
        await move("U'")
        solution.push("F'")
        await move("F'")
        solution.push("U")
        await move("U")
        solution.push("F")
        await move("F")
    }
    async function movingLeft() {
        solution.push("y'")
        await move("y'")
        solution.push("U'")
        await move("U'")
        solution.push("F'")
        await move("F'")
        solution.push("U")
        await move("U")
        solution.push("F")
        await move("F")
        solution.push("U")
        await move("U")
        solution.push("R")
        await move("R")
        solution.push("U'")
        await move("U'")
        solution.push("R'")
        await move("R'")
    }
    async function getEdgeOut() {
        while (!(secondLayerEdgesSorted.includes(sortString(currentNotation["FR"])))) {
            solution.push("y")
            await move("y")
            currentNotation = getNotation()
        }
        await movingRight()
    }

    let rotationCount = 0
    let yCount = 0
    while (!(currentNotation["FU"].charAt(1) !== currentNotation["U"] && currentNotation["FU"].charAt(0) === currentNotation["F"])) {
        solution.push("U")
        await move("U")
        currentNotation = getNotation()
        rotationCount++
        if (rotationCount === 4) {
            solution.push("y")
            await move("y")
            currentNotation = getNotation()
            rotationCount = 0
            yCount++
            if (yCount === 4) {
                yCount = 0
                await getEdgeOut()
                await solveSecondLayer()
                return
            }
        }
    }

    if (currentNotation["FU"].charAt(1) === currentNotation["R"]) {
        await movingRight()
    } else {
        await movingLeft()
    }

    await solveSecondLayer()
}

async function solveYellowCross() {
    let currentNotation = getNotation()
    if (currentNotation["D"] !== "U") {    
        solution.push("x2")
        await move("x2")
        currentNotation = getNotation()
    }

    let yellowEdges = Object.keys(currentNotation).filter(key => (key.length === 2 && key.charAt(0) === "D"))

    for (let i = yellowEdges.length - 1; i >= 0; i--) {
        let EdgePosition = getKeyByValue(currentNotation, yellowEdges[i])
        if (EdgePosition.charAt(0) !== "U") {
            yellowEdges.splice(i, 1)
        }
    }

    if (yellowEdges.length === 4) {
        return
    }

    async function orientEdges() {
        solution.push("F")
        await move("F")
        solution.push("U")
        await move("U")
        solution.push("R")
        await move("R")
        solution.push("U'")
        await move("U'")
        solution.push("R'")
        await move("R'")
        solution.push("F'")
        await move("F'")
    }

    if (yellowEdges.length === 0) {
        await orientEdges()
    }

    if (yellowEdges.length === 2) {
        while (!(yellowEdges.includes(currentNotation["UL"]) && yellowEdges.includes(currentNotation["UR"])) && !(yellowEdges.includes(currentNotation["UL"]) && yellowEdges.includes(currentNotation["UB"]))) {
            solution.push("U")
            await move("U")
            currentNotation = getNotation()
        }

        await orientEdges()
    }

    await solveYellowCross()
}

async function solveYellowFace() {
    let currentNotation = getNotation()
    if (currentNotation["D"] !== "U") {    
        solution.push("x2")
        await move("x2")
        currentNotation = getNotation()
    }

    let yellowCorners = Object.keys(currentNotation).filter(key => (key.length === 3 && key.charAt(0) === "D"))

    let yellowCornersDone = []
    for (let i = yellowCorners.length - 1; i >= 0; i--) {
        let cornerPosition = getKeyByValue(currentNotation, yellowCorners[i])
        if (cornerPosition.charAt(0) === "U") {
            yellowCornersDone.push(yellowCorners[i])
            yellowCorners.splice(i, 1)
        }
    }

    if (yellowCornersDone.length === 4) {
        return
    }

    async function orientCorners() {
        solution.push("R")
        await move("R")
        solution.push("U")
        await move("U")
        solution.push("R'")
        await move("R'")
        solution.push("U")
        await move("U")
        solution.push("R")
        await move("R")
        solution.push("U2")
        await move("U2")
        solution.push("R'")
        await move("R'")
    }

    if (yellowCornersDone.length === 1) {
        while (currentNotation["ULF"].charAt(0) !== currentNotation["U"]) {
            solution.push("U")
            await move("U")
            currentNotation = getNotation()
        }

        await orientCorners()
    }

    if (yellowCornersDone.length === 2) {
        while (currentNotation["FUL"].charAt(0) !== currentNotation["U"]) {
            solution.push("U")
            await move("U")
            currentNotation = getNotation()
        }

        await orientCorners()
    }

    if (yellowCornersDone.length === 0) {
        while (currentNotation["LFU"].charAt(0) !== currentNotation["U"]) {
            solution.push("U")
            await move("U")
            currentNotation = getNotation()
        }

        await orientCorners()
    }

    await solveYellowFace()
}

async function permuteLastLayerCorners() {
    let currentNotation = getNotation()
    let cubestring = getCubeString()
    if (currentNotation["D"] !== "U") {    
        solution.push("x2")
        await move("x2")
        currentNotation = getNotation()
    }

    let lastLayerCorners = Object.keys(currentNotation).filter(key => (key.length === 3 && key.charAt(0) === "D"))
    let lastLayerCornersDone = []


    let center
    if (cubestring[47] === cubestring[45]) {
        lastLayerCornersDone.push(currentNotation["UBL"])
        lastLayerCornersDone.push(currentNotation["URB"])
        center = cubestring[47]
    }
    if (cubestring[20] === cubestring[18]) {
        lastLayerCornersDone.push(currentNotation["ULF"])
        lastLayerCornersDone.push(currentNotation["UFR"])
        center = cubestring[20]
    }
    if (cubestring[11] === cubestring[9]) {
        lastLayerCornersDone.push(currentNotation["UFR"])
        lastLayerCornersDone.push(currentNotation["URB"])
        center = cubestring[11]
    }
    if (cubestring[38] === cubestring[36]) {
        lastLayerCornersDone.push(currentNotation["UBL"])
        lastLayerCornersDone.push(currentNotation["ULF"])
        center = cubestring[38]
    }

    for (let i = lastLayerCorners.length - 1; i >= 0; i--) {
        if (lastLayerCornersDone.includes(lastLayerCorners[i])) {
            lastLayerCorners.splice(i, 1)
        }
    }

    if (lastLayerCorners.length === 0) {
        while (cubestring[11] !== currentNotation["R"]) {
            solution.push("U")
            await move("U")
            currentNotation = getNotation()
            cubestring = getCubeString()
        }
        return
    }

    async function permuteCorners() {
        solution.push("R'")
        await move("R'")
        solution.push("F")
        await move("F")
        solution.push("R'")
        await move("R'")
        solution.push("B2")
        await move("B2")
        solution.push("R")
        await move("R")
        solution.push("F'")
        await move("F'")
        solution.push("R'")
        await move("R'")
        solution.push("B2")
        await move("B2")
        solution.push("R2")
        await move("R2")
        solution.push("U'")
        await move("U'")
    }

    if (lastLayerCornersDone.length === 2) {    
        while (currentNotation["B"] !== center) {
            solution.push("y")
            await move("y")
            currentNotation = getNotation()
        }

        while (!(lastLayerCornersDone.includes(currentNotation["UBL"]) && lastLayerCornersDone.includes(currentNotation["URB"]))) {
            solution.push("U")
            await move("U")
            currentNotation = getNotation()
        }

        await permuteCorners()
    }

    if (lastLayerCornersDone.length === 0) {
        await permuteCorners()
    }

    await permuteLastLayerCorners()
}

async function permuteLastLayerEdges() {
    let currentNotation = getNotation()
    let cubestring = getCubeString()
    if (currentNotation["D"] !== "U") {    
        solution.push("x2")
        await move("x2")
        currentNotation = getNotation()
    }

    let lastLayerEdges = Object.keys(currentNotation).filter(key => (key.length === 2 && key.charAt(0) === "D"))
    let lastLayerEdgesDone = []

    if (cubestring[47] === cubestring[46]) {
        lastLayerEdgesDone.push(currentNotation["UB"])
    }
    if (cubestring[20] === cubestring[19]) {
        lastLayerEdgesDone.push(currentNotation["UF"])
    }
    if (cubestring[11] === cubestring[10]) {
        lastLayerEdgesDone.push(currentNotation["UR"])
    }
    if (cubestring[38] === cubestring[37]) {
        lastLayerEdgesDone.push(currentNotation["UL"])
    }

    for (let i = lastLayerEdges.length - 1; i >= 0; i--) {
        if (lastLayerEdgesDone.includes(lastLayerEdges[i])) {
            lastLayerEdges.splice(i, 1)
        }
    }

    if (lastLayerEdges.length === 0) {
        return
    }

    async function permuteEdges(side) {
        let way;
        if (side === "left") {
            way = "U"
        } else {
            way = "U'"
        }
        solution.push("F2")
        await move("F2")
        solution.push(way)
        await move(way)
        solution.push("L")
        await move("L")
        solution.push("R'")
        await move("R'")
        solution.push("F2")
        await move("F2")
        solution.push("L'")
        await move("L'")
        solution.push("R")
        await move("R")
        solution.push(way)
        await move(way)
        solution.push("F2")
        await move("F2")
    }

    if (lastLayerEdgesDone.length === 1) {
        while (currentNotation["UB"] !== lastLayerEdgesDone[0]) {
            solution.push("y")
            await move("y")
            currentNotation = getNotation()
        }

        if (currentNotation["UF"].charAt(1) === currentNotation["L"]) {
            await permuteEdges("left")
        } else {
            await permuteEdges("right")
        }
    }

    if (lastLayerEdgesDone.length === 0) {
        await permuteEdges("left")
    }

    await permuteLastLayerEdges()
}
 
await solveDaisy()
await solveCross()
await solveFirstLayer()
await solveSecondLayer()
await solveYellowCross()
await solveYellowFace()
await permuteLastLayerCorners()
await permuteLastLayerEdges()
solution = shrinkMoveArray(solution)
console.log("solution:", solution.join(" "));

setAnimationSpeed(10000)
for (let i = solution.length-1; i >= 0; i--) {
    await move(reverseMove(solution[i]))
}

setAnimationSpeed()
// for (let index = 0; index < solution.length; index++) {
//     const element = solution[index];
//     await move(element)
// }

let playpause = document.querySelector("#playpause")
let next = document.querySelector("#next")
let previous = document.querySelector("#previous")
let moveName = document.querySelector("#move")

let playing = false
let moves = solution
let i = 0;

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