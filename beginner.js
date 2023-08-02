import { createWorld, getFaces, move, rubiksCube, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

let pieces = [[1,0,1].join(), [0,-1,0].join()]
document.addEventListener("keyup", async () => {
    highlightPiece(pieces)
    let faces = getFaces()
    console.log(faces.indexOf("F"));
})

function highlightPiece(pieces) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (pieces.includes([i-1,j-1,k-1].join())) {
                    console.log(i,j,k);
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