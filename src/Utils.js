import { Color } from "three";
import { World } from "./World";
import { Rubikscube } from "./RubiksCube";

function createWorld(container) {
    let world = new World(container)

    let rubikscube = new Rubikscube()
    rubikscube.addToWorld(world)
    
    if (!matchMedia("screen and (min-width: 600px)").matches) {
        world.camera.fov = 50
        world.camera.updateProjectionMatrix();
    }

    return [world, rubikscube]
}

const color = [
    new Color(0xFFFFFF), // White
    new Color(0x00FF00), // Green
    new Color(0xFF0000), // Red
    new Color(0x0000FF), // Blue
    new Color(0xFFA500), // Orange
    new Color(0xFFFF00)  // Yellow
]

// simply returns the string representation of the color, the string is the face on which this color is the center of
/*
    White => U
    Green => F
    Red => R
    Blue => B
    Orange => L
    Yellow => D
*/
function getColor(color) {
    switch (color) {
        case 0xFFFFFF:
            return "U"
        case 0x00FF00:
            return "F"
        case 0xFF0000:
            return "R"
        case 0x0000FF:
            return "B"
        case 0xFFA500:
            return "L"
        case 0xFFFF00:
            return "D"
        default:
            return "E";
    }
}

const allowedMoves = [
    "R", "L", "U", "D", "F", "B", "M", "E", "S", "x", "y", "z", "r", "l", "u", "d", "f", "b", 
    "R2", "L2", "U2", "D2", "F2", "B2", "M2", "E2", "S2", "x2", "y2", "z2", "r2", "l2", "u2", "d2", "f2", "b2", 
    "R3", "L3", "U3", "D3", "F3", "B3", "M3", "E3", "S3", "x3", "y3", "z3", "r3", "l3", "u3", "d3", "f3", "b3", 
    "R'", "L'", "U'", "D'", "F'", "B'", "M'", "E'", "S'", "x'", "y'", "z'", "r'", "l'", "u'", "d'", "f'", "b'", 
    "R2'", "L2'", "U2'", "D2'", "F2'", "B2'", "M2'", "E2'", "S2'", "x2'", "y2'", "z2'", "r2'", "l2'", "u2'", "d2'", "f2'", "b2'", 
    "R3'", "L3'", "U3'", "D3'", "F3'", "B3'", "M3'", "E3'", "S3'", "x3'", "y3'", "z3'", "r3'", "l3'", "u3'", "d3'", "f3'", "b3'"
    ]

const notationPositions = {
    "UBL": "-1,1,-1",
    "UB": "0,1,-1",
    "URB": "1,1,-1",
    "UL": "-1,1,0",
    "U": "0,1,0",
    "UR": "1,1,0",
    "ULF": "-1,1,1",
    "UF": "0,1,1",
    "UFR": "1,1,1",
    "RUF": "1,1,1",
    "RU": "1,1,0",
    "RBU": "1,1,-1",
    "RF": "1,0,1",
    "R": "1,0,0",
    "RB": "1,0,-1",
    "RFD": "1,-1,1",
    "RD": "1,-1,0",
    "RDB": "1,-1,-1",
    "FUL": "-1,1,1",
    "FU": "0,1,1",
    "FRU": "1,1,1",
    "FL": "-1,0,1",
    "F": "0,0,1",
    "FR": "1,0,1",
    "FLD": "-1,-1,1",
    "FD": "0,-1,1",
    "FDR": "1,-1,1",
    "DFL": "-1,-1,1",
    "DF": "0,-1,1",
    "DRF": "1,-1,1",
    "DL": "-1,-1,0",
    "D": "0,-1,0",
    "DR": "1,-1,0",
    "DLB": "-1,-1,-1",
    "DB": "0,-1,-1",
    "DBR": "1,-1,-1",
    "LUB": "-1,1,-1",
    "LU": "-1,1,0",
    "LFU": "-1,1,1",
    "LB": "-1,0,-1",
    "L": "-1,0,0",
    "LF": "-1,0,1",
    "LBD": "-1,-1,-1",
    "LD": "-1,-1,0",
    "LDF": "-1,-1,1",
    "BUR": "1,1,-1",
    "BU": "0,1,-1",
    "BLU": "-1,1,-1",
    "BR": "1,0,-1",
    "B": "0,0,-1",
    "BL": "-1,0,-1",
    "BRD": "1,-1,-1",
    "BD": "0,-1,-1",
    "BDL": "-1,-1,-1"
}

const scrambleMoves = ["R", "L", "U", "D", "F", "B"]
const scrambleDirs = ["", "'", "2"]
// generates a random 25 move scramble using moves in scrambleMoves and directions in scrambleDirs such that no three consecutive moves have any moves in common (so as to not have something like R, R' or R L R', etc)
function generateScramble() {

    function getRandomMove() {
        return scrambleMoves[Math.floor(Math.random() * scrambleMoves.length)] + scrambleDirs[Math.floor(Math.random() * scrambleDirs.length)]
    }
    let scramble = []
    // generating the first two moves so that the second move is not the same as first move
    scramble.push(getRandomMove())
    scramble.push(getRandomMove())
    while (scramble[0].charAt(0) === scramble[1].charAt(0)) {
        scramble[1] = getRandomMove()
    }

    for (let i = 2; i < 25; i++) {
        let move = getRandomMove()
        while (scramble[i - 1].charAt(0) === move.charAt(0) || scramble[i - 2].charAt(0) === move.charAt(0)) {
            move = getRandomMove()
        }
        scramble.push(move)
    }

    return scramble
}

function reverseMove(move) {
    if (move.charAt(move.length - 1) === "'") {
        return move.slice(0,-1)
    } else {
        return move += "'"
    }
}

function shrinkMoveArray(moveArray, keepNonMovesFlag = false) {
    let resultArray = []
    let count = null
    let totalCount = 0
    while (true) {
        for (let i = 0; i < moveArray.length; i++) {
            if (!allowedMoves.includes(moveArray[i])) {
                if (keepNonMovesFlag) {
                    resultArray.push(moveArray[i])
                }
                continue
            }
            if (count === null) {
                switch (moveArray[i].charAt(1)) {
                    case "":
                        count = 1
                        break;
                    case "'":
                        count = -1
                        break;
                    case "2":
                        count = 2
                        break;
                    default:
                        break;
                }
            }
            if (moveArray[i+1] && (moveArray[i].charAt(0) === moveArray[i+1].charAt(0))) {
                totalCount++
                switch (moveArray[i+1].charAt(1)) {
                    case "":
                        count++
                        break;
                    case "'":
                        count--
                        break;
                    case "2":
                        count += 2
                        break;
                    default:
                        break;
                }
            } else {
                let newMove = moveArray[i].charAt(0)
                switch (((count % 4) + 4) % 4) {
                    case 0:
                        newMove = ""
                        break;
                    case 1:
                        break;
                    case 2:
                        newMove += "2"
                        break;
                    case 3:
                        newMove += "'"
                        break;
                    default:
                        break;
                }
                if (newMove) {
                    resultArray.push(newMove)
                }
                count = null
            }
        }
        moveArray = resultArray.slice()
        resultArray = []

        if (totalCount === 0) {
            return moveArray
        }
        totalCount = 0;
    }

}

export { color, allowedMoves, createWorld, getColor, notationPositions, generateScramble, reverseMove, shrinkMoveArray }