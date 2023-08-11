import { Raycaster, Vector2, Vector3 } from "three";
import { createWorld, move, rubiksCube, setAnimationSpeed, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

world.controls.enableRotate = false;
world.camera.position.set(5,4,5)

const pointer = new Vector2()
const raycaster = new Raycaster()
let selectedFace
let allFaces = []
rubiksCube.pieces.flat(2).forEach(element => {
    allFaces.push(...element.cube.children)
})

// window.addEventListener( 'click', (event) => {
//     pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//     raycaster.setFromCamera( pointer, world.camera );

//     const intersects = raycaster.intersectObjects(allPieces);
//     if (intersects.length) {
//         selectedPiece = intersects[0].object
//     }
//     console.log(selectedPiece);
// });

let xStart = null
let yStart = null
let xEnd = null
let yEnd = null
let xDistance = null
let yDistance = null
let faceDirection = new Vector3()
let piecePosition = new Vector3()

// document.addEventListener("DOMContentLoaded", async () => {
//     setAnimationSpeed(1000)
//     await move("L")
//     await move("R")
//     await move("U")
//     await move("M")
//     await move("x")
//     await move("z")
//     setAnimationSpeed()
// })

function moveStart(event) {
    console.log(event.type);
    if (event.type === "mousedown") {
        pointer.x = -1 + 2 * (event.offsetX) / world.renderer.domElement.clientWidth;
        pointer.y = 1 - 2 * (event.offsetY) / world.renderer.domElement.clientHeight;
        xStart = event.clientX
        yStart = event.clientY
    } else if (event.type === "touchstart") {
        const {top, left, width, height} = world.renderer.domElement.getBoundingClientRect();
        pointer.x = -1 + 2 * (event.touches[0].clientX - left) / width;
        pointer.y = 1 - 2 * (event.touches[0].clientY - top) / height;
        xStart = event.touches[0].clientX
        yStart = event.touches[0].clientY
    }
    raycaster.setFromCamera( pointer, world.camera );
    try {
        const intersects = raycaster.intersectObjects(allFaces);
        selectedFace = intersects[0].object
        piecePosition.copy(selectedFace.parent.position.round())
        selectedFace.getWorldDirection(faceDirection)
        faceDirection.round()
        console.log(faceDirection);
        console.log(piecePosition);
    } catch (error) {}
}
function moveOngoing(event) {
    if (!xStart || !yStart) {
        return
    }

    if (event.type === "mousemove") {
        xEnd = event.clientX
        yEnd = event.clientY
    } else if (event.type === "touchmove") {
        xEnd = event.touches[0].clientX
        yEnd = event.touches[0].clientY
    }

    xDistance = xEnd - xStart
    yDistance = - (yEnd - yStart)
    console.log(event.type);
}
async function moveEnd(event) {
    removeListeners()
    console.log(event.type);
    console.log(xStart, xEnd, xDistance, yStart, yEnd, yDistance);
    // console.log(xDistance, yDistance);
    
    let angle = (Math.atan(yDistance/xDistance) * 180) / Math.PI
    console.log(angle);
    function getSide(faceDirection) {
        if (faceDirection.x) {
            return "Right"
        } else if (faceDirection.y) {
            return "Up"
        } else if (faceDirection.z) {
            return "Front"
        }
    }
    let side = getSide(faceDirection)
    if (side === "Right") {
        if (Math.abs(angle) <= 90 && Math.abs(angle) >= 60) {
            if (yDistance > 0) {
                switch (piecePosition.z) {
                    case 1:
                        await move("F'")
                        break
                    case 0:
                        await move("S'")
                        break
                    case -1:
                        await move("B")
                        break
                    default:
                        break
                }
            } else if (yDistance < 0) {
                switch (piecePosition.z) {
                    case 1:
                        await move("F")
                        break
                    case 0:
                        await move("S")
                        break
                    case -1:
                        await move("B'")
                        break
                    default:
                        break
                }
            }
        } else if (angle <= 45 && angle >= 0) {
            if (xDistance > 0) {
                switch (piecePosition.y) {
                    case 1:
                        await move("U'")
                        break
                    case 0:
                        await move("E")
                        break
                    case -1:
                        await move("D")
                        break
                    default:
                        break
                }
            } else if (xDistance < 0) {
                switch (piecePosition.y) {
                    case 1:
                        await move("U")
                        break
                    case 0:
                        await move("E'")
                        break
                    case -1:
                        await move("D'")
                        break
                    default:
                        break
                }
            }
        }
    } else if (side === "Front") {
        if (Math.abs(angle) <= 90 && Math.abs(angle) >= 60) {
            if (yDistance > 0) {
                switch (piecePosition.x) {
                    case 1:
                        await move("R")
                        break
                    case 0:
                        await move("M'")
                        break
                    case -1:
                        await move("L'")
                        break
                    default:
                        break
                }
            } else if (yDistance < 0) {
                switch (piecePosition.x) {
                    case 1:
                        await move("R'")
                        break
                    case 0:
                        await move("M")
                        break
                    case -1:
                        await move("L")
                        break
                    default:
                        break
                }
            }
        } else if (angle >= -45 && angle <= 0) {
            if (xDistance > 0) {
                switch (piecePosition.y) {
                    case 1:
                        await move("U'")
                        break
                    case 0:
                        await move("E")
                        break
                    case -1:
                        await move("D")
                        break
                    default:
                        break
                }
            } else if (xDistance < 0) {
                switch (piecePosition.y) {
                    case 1:
                        await move("U")
                        break
                    case 0:
                        await move("E'")
                        break
                    case -1:
                        await move("D'")
                        break
                    default:
                        break
                }
            }
        }
    } else if (side === "Up") {
        if (angle <= 45 && angle >= 0) {
            if (yDistance > 0) {
                switch (piecePosition.x) {
                    case 1:
                        await move("R")
                        break
                    case 0:
                        await move("M'")
                        break
                    case -1:
                        await move("L'")
                        break
                    default:
                        break
                }
            } else if (yDistance < 0) {
                switch (piecePosition.x) {
                    case 1:
                        await move("R'")
                        break
                    case 0:
                        await move("M")
                        break
                    case -1:
                        await move("L")
                        break
                    default:
                        break
                }
            }
        } else if (angle >= -45 && angle <= 0) {
            if (yDistance > 0) {
                switch (piecePosition.z) {
                    case 1:
                        await move("F'")
                        break
                    case 0:
                        await move("S'")
                        break
                    case -1:
                        await move("B")
                        break
                    default:
                        break
                }
            } else if (yDistance < 0) {
                switch (piecePosition.z) {
                    case 1:
                        await move("F")
                        break
                    case 0:
                        await move("S")
                        break
                    case -1:
                        await move("B'")
                        break
                    default:
                        break
                }
            }
        }
    }

    xStart = null
    yStart = null
    xEnd = null
    xEnd = null
    xDistance = 0
    yDistance = 0
    faceDirection.set(0,0,0)
    piecePosition.set(0,0,0)
    addListeners()
}

function addListeners(){
    window.addEventListener('touchstart', moveStart)
    window.addEventListener('mousedown', moveStart)
    window.addEventListener('touchmove', moveOngoing)
    window.addEventListener('mousemove', moveOngoing)
    window.addEventListener('touchend', moveEnd)
    window.addEventListener('mouseup', moveEnd)
}
function removeListeners(){
    window.removeEventListener('touchstart', moveStart)
    window.removeEventListener('mousedown', moveStart)
    window.removeEventListener('touchmove', moveOngoing)
    window.removeEventListener('mousemove', moveOngoing)
    window.removeEventListener('touchend', moveEnd)
    window.removeEventListener('mouseup', moveEnd)
}

addListeners()