import { Easing, Tween } from '@tweenjs/tween.js';
import { BoxGeometry, DoubleSide, Euler, Group, Mesh, MeshStandardMaterial, PlaneGeometry, Raycaster, Vector3 } from 'three';  
import { allowedMoves, color, getColor } from './Utils.js';

class Piece {
    constructor () {
        const geometry = new BoxGeometry(1,1,1)
        const material = new MeshStandardMaterial({
            color: 'black'
        })
        this.cube = new Mesh(geometry, material)

        this.faces = []
        for (let i = 0; i < 6; i++) {
            const geometry = new PlaneGeometry(0.9,0.9)
            const material = new MeshStandardMaterial({
                side: DoubleSide,
                color: color[i]
            })
        
            this.faces[i] = new Mesh(geometry, material);
            this.cube.add(this.faces[i])
        }
        this.faces[0].rotateX(Math.PI / 2).position.set(0,0.501,0)
        this.faces[1].position.set(0,0,0.501)
        this.faces[2].rotateY(Math.PI / 2).position.set(0.501,0,0)
        this.faces[3].position.set(0,0,-0.501)
        this.faces[4].rotateY(Math.PI / 2).position.set(-0.501,0,0)
        this.faces[5].rotateX(Math.PI / 2).position.set(0,-0.501,0)
    }
}

class Rubikscube {
    constructor() {
        // Cube creation
        this.core = new Group()
        this.pieces = []
        this.indices = []
        for (let i = 0; i < 3; i++) {
            this.pieces[i] = []
            this.indices[i] = []
            for (let j = 0; j < 3; j++) {
                this.pieces[i][j] = []
                this.indices[i][j] = []
                for (let k = 0; k < 3; k++) {
                    this.pieces[i][j][k] = new Piece(i, j, k)
                    this.pieces[i][j][k].cube.position.set(i-1,j-1,k-1) 
                    this.indices[i][j][k] = [i,j,k]  
                    this.core.add(this.pieces[i][j][k].cube)  
                }
            }
        }

        

        this.currentlyAnimating = false;
        this.defaultSpeed = 1;
        this.moveAnimationSpeed = this.defaultSpeed; // changeable via setMoveAnimationSpeed
    }

    addToWorld(world) {
        world.scene.add(this.core)
    }

    setMoveAnimationSpeed(speed) {
        if (!speed) {
            this.moveAnimationSpeed = this.defaultSpeed
            return
        } 
        this.moveAnimationSpeed = speed;
    }

    // this function does a move on the rubiks cube when called, it sets up the work to call doMove() function for the animation and changes the memory cube around as necessary.
    move(move) {

        // using a promise to ensure that we will wait for the whole animation to finish and then move on to other moves
        return new Promise(async resolve => {
            
            // this variable will let us know whenever we are animating so we can stop other controls which may cause issues with the animation
            this.currentlyAnimating = true
            if (!allowedMoves.includes(move)) {
                resolve()
                return
            }
            const [x, y, z, dir, rotatingAround] = this.getMoveInfo(move)
    
            // i_, j_ and k_ will be the position of the center piece which will actually rotate and the other pieces on the face or cube will be attached to the centerpiece and move together
            let i_ = 1
            let j_ = 1
            let k_ = 1
            // we are holding the indices of the piece actually at any position in an indices array so a, b, c will hold that index and eventually i_, j_, k_ will be assigned that value
            let a = 1, b = 1, c = 1
            if (rotatingAround === "x" && x.length === 1) {
                [a,b,c] = this.indices[x[0]][1][1]
            }
            else if (rotatingAround === "y" && y.length === 1) {
                [a,b,c] = this.indices[1][y[0]][1]
            }
            else if (rotatingAround === "z" && z.length === 1) {
                [a,b,c] = this.indices[1][1][z[0]]
            }
            i_ = a
            j_ = b
            k_ = c
    
            // attaching the actual pieces to the center piece in the scene
            for (const i of x) {
                for (const j of y) {
                    for (const k of z) {
                        [a,b,c] = this.indices[i][j][k]
                        if (a === i_ && b === j_ && c === k_) continue;
                        this.pieces[i_][j_][k_].cube.attach(this.pieces[a][b][c].cube)
                    }
                }
            }
            
            let axis = this.getMoveAxisVector(move);

            await this.doMove(this.pieces[i_][j_][k_].cube, dir, axis, this.moveAnimationSpeed);

            this.currentlyAnimating = false
            
            // finally we can change the indices array to hold the new values after the move finishes
            let new_i, new_j, new_k
            let previous = []
            for (let i = 0; i < 3; i++) {
                previous[i] = []
                for (let j = 0; j < 3; j++) {
                    previous[i][j] = []
                    for (let k = 0; k < 3; k++) {
                        previous[i][j][k] = []
                        previous[i][j][k] = this.indices[i][j][k]
                        // also using this loop to remove the piece from being attached to the core
                        this.core.attach(this.pieces[i][j][k].cube)
                    }
                }
            }
            for (const i of x) {
                for (const j of y) {
                    for (const k of z) {
                        let indicesVector = new Vector3(i-1,j-1,k-1)
                        indicesVector.applyAxisAngle(axis, dir * Math.PI / 2).round()
                        new_i = indicesVector.getComponent(0) + 1
                        new_j = indicesVector.getComponent(1) + 1
                        new_k = indicesVector.getComponent(2) + 1
                        this.indices[new_i][new_j][new_k] = previous[i][j][k]
                    }
                }
            }

            resolve();
        })
    }

    // this function animates the move
    doMove(center, dir, axis, speed) {
        return new Promise(resolve => {
            let completed = false;
            const oldRotation = new Euler().copy(center.rotation)
        
            let startRotation = { theta: 0 };
            let previousRotation = { theta: 0 };
            let finalRotation = { theta: dir * Math.PI / 2 }; 
            const tween = new Tween(startRotation)
                    .to(finalRotation, 500 / speed)
                    .easing(Easing.Sinusoidal.InOut)
                    .onUpdate(function({ theta }) {
                        // animating the rotation
                        center.rotateOnWorldAxis(axis, theta - previousRotation.theta);

                        previousRotation.theta = theta;       
                    })
                    .onComplete(() => { 
                        completed = true;

                        // revert the rotation done while animating
                        center.setRotationFromEuler(oldRotation)
                        // rotate the pieces to their final positions in one go
                        center.rotateOnWorldAxis(axis, finalRotation.theta)
                        
                        // we can now resolve the promise as we have completed everything for this move
                        resolve();
                    })
                    .start()

            function animate() {
                if (completed)
                    return;
                tween.update()
                requestAnimationFrame(animate)
            }

            animate(this);
        });
    }

    // returns access of rotation for the given move, used multiple times in move function.
    getMoveAxisVector(move) {
        switch (move.charAt(0)) {
            case "R":
            case "r":
            case "x":
                return new Vector3(1,0,0);
            case "L":
            case "l":
            case "M":
                return new Vector3(-1,0,0);
            case "U":
            case "u":
            case "y":
                return new Vector3(0,1,0);
            case "D":
            case "d":
            case "E":
                return new Vector3(0,-1,0);
            case "F":
            case "f":
            case "z":
            case "S":
                return new Vector3(0,0,1);
            case "B":
            case "b":
                return new Vector3(0,0,-1);
        }
    }

    // this function just gives us information about the pieces to be moved, which way to move the pieces and on which axis the pieces need to be moved, it is a helper function for move
    getMoveInfo(move) {
        let x = [0,1,2]
        let y = [0,1,2]
        let z = [0,1,2]
        let dir = -1
        let rotatingAround
        if (!move.charAt(1)) {
            dir = -1
        } else if (move.charAt(1) === "2") {
            dir = -2
        }
        else if (move.charAt(1) === "3") {
            dir = -3
        }

        if (move.charAt(move.length - 1) === "'") {
            dir *= -1
        } 
        
        switch (move.charAt(0)) {
            case "R":
                x = [2]
                rotatingAround = "x"
                break;
            case "r":
                x = [1,2]
                rotatingAround = "x"
                break;
            case "L":
                x = [0]
                rotatingAround = "x"
                break;
            case "l":
                x = [0,1]
                rotatingAround = "x"
                break;
            case "M":
                x = [1]
                rotatingAround = "x"
                break;
            case "U":
                y = [2]
                rotatingAround = "y"
                break;
            case "u":
                y = [1,2]
                rotatingAround = "y"
                break;
            case "D":
                y = [0]
                rotatingAround = "y"
                break;
            case "d":
                y = [0,1]
                rotatingAround = "y"
                break;
            case "E":
                y = [1]
                rotatingAround = "y"
                break;
            case "F":
                z = [2]
                rotatingAround = "z"
                break;
            case "f":
                z = [1,2]
                rotatingAround = "z"
                break;
            case "S":
                z = [1]
                rotatingAround = "z"
                break;
            case "B":
                z = [0]
                rotatingAround = "z"
                break;
            case "b":
                z = [0,1]
                rotatingAround = "z"
                break;
            case "x":
                rotatingAround = "x"
                break;
            case "y":
                rotatingAround = "y"
                break;
            case "z":
                rotatingAround = "z"
                break;
            default:
                break;
        }
        return [x, y, z, dir, rotatingAround]
    }

    // this function returns all 6 faces in a string following the representation expected by the kociemba two phase solver. this was chosen simply for convention.
    /*
    - https://github.com/hkociemba/RubiksCube-TwophaseSolver
    A solved string is of the form: 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
    The names of the facelet positions of the cube
                |************|
                |*U1**U2**U3*|
                |************|
                |*U4**U5**U6*|
                |************|
                |*U7**U8**U9*|
                |************|
    |************|************|************|************|
    |*L1**L2**L3*|*F1**F2**F3*|*R1**R2**R3*|*B1**B2**B3*|
    |************|************|************|************|
    |*L4**L5**L6*|*F4**F5**F6*|*R4**R5**R6*|*B4**B5**B6*|
    |************|************|************|************|
    |*L7**L8**L9*|*F7**F8**F9*|*R7**R8**R9*|*B7**B8**B9*|
    |************|************|************|************|
                |************|
                |*D1**D2**D3*|
                |************|
                |*D4**D5**D6*|
                |************|
                |*D7**D8**D9*|
                |************|
    A cube definition string "UBL..." means for example: In position U1 we have the U-color, in position U2 we have the
    B-color, in position U3 we have the L color etc.
    */
    getCubeString() {
        let faces = ""
        let intersects
        const raycaster = new Raycaster()
        let i, j, k, a, b, c

        // U face
        j = 1
        for (k = -1; k <= 1; k++) {
            for (i = -1; i <= 1; i++) {
                [a,b,c] = this.indices[i+1][j+1][k+1]
                raycaster.set(new Vector3(i,j,k), new Vector3(0,1,0))
                intersects = raycaster.intersectObjects(this.pieces[a][b][c].faces)
                faces += getColor(intersects[0].object.material.color.getHex())
            }
        }

        // R face
        i = 1
        for (j = 1; j >= -1; j--) {
            for (k = 1; k >= -1; k--) {
                [a,b,c] = this.indices[i+1][j+1][k+1]
                raycaster.set(new Vector3(i,j,k), new Vector3(1,0,0))
                intersects = raycaster.intersectObjects(this.pieces[a][b][c].faces)
                faces += getColor(intersects[0].object.material.color.getHex())
            }
        }

        // F face
        k = 1
        for (j = 1; j >= -1; j--) {
            for (i = -1; i <= 1; i++) {
                [a,b,c] = this.indices[i+1][j+1][k+1]
                raycaster.set(new Vector3(i,j,k), new Vector3(0,0,1))
                intersects = raycaster.intersectObjects(this.pieces[a][b][c].faces)
                faces += getColor(intersects[0].object.material.color.getHex())
            }
        }

        // D face
        j = -1
        for (k = 1; k >= -1; k--) {
            for (i = -1; i <= 1; i++) {
                [a,b,c] = this.indices[i+1][j+1][k+1]
                raycaster.set(new Vector3(i,j,k), new Vector3(0,-1,0))
                intersects = raycaster.intersectObjects(this.pieces[a][b][c].faces)
                faces += getColor(intersects[0].object.material.color.getHex())
            }
        }

        // L face
        i = -1
        for (j = 1; j >= -1; j--) {
            for (k = -1; k <= 1; k++) {
                [a,b,c] = this.indices[i+1][j+1][k+1]
                raycaster.set(new Vector3(i,j,k), new Vector3(-1,0,0))
                intersects = raycaster.intersectObjects(this.pieces[a][b][c].faces)
                faces += getColor(intersects[0].object.material.color.getHex())
            }
        }

        // B-face
        k = -1
        for (j = 1; j >= -1; j--) {
            for (i = 1; i >= -1; i--) {
                [a,b,c] = this.indices[i+1][j+1][k+1]
                raycaster.set(new Vector3(i,j,k), new Vector3(0,0,-1))
                intersects = raycaster.intersectObjects(this.pieces[a][b][c].faces)
                faces += getColor(intersects[0].object.material.color.getHex())
            }
        }

        return faces;
    }

    // this function stores the orientation of the pieces in an object from a given cubestring, basically manually done, couldn't come up with anything better
    getNotation(cubestring = this.getCubeString()) {
        let notation = {
            UBL: cubestring[0] + cubestring[47] + cubestring[36],
            UB: cubestring[1] + cubestring[46],
            URB: cubestring[2]  + cubestring[11] + cubestring[45],
            UL: cubestring[3] + cubestring[37],
            U: cubestring[4],
            UR: cubestring[5] + cubestring[10],
            ULF: cubestring[6] + cubestring[38] + cubestring[18],
            UF: cubestring[7] + cubestring[19],
            UFR: cubestring[8] + cubestring[20] + cubestring[9],
            RUF: cubestring[9] + cubestring[8] + cubestring[20],
            RU: cubestring[10] + cubestring[5],
            RBU: cubestring[11] + cubestring[45] + cubestring[2],
            RF: cubestring[12] + cubestring[23],
            R: cubestring[13],
            RB: cubestring[14] + cubestring[48],
            RFD: cubestring[15] + cubestring[26] + cubestring[29],
            RD: cubestring[16] + cubestring[32], 
            RDB: cubestring[17] + cubestring[35] + cubestring[51],
            FUL: cubestring[18] + cubestring[6] + cubestring[38],
            FU: cubestring[19] + cubestring[7],
            FRU: cubestring[20] + cubestring[9] + cubestring[8],
            FL: cubestring[21] + cubestring[41],
            F: cubestring[22],
            FR: cubestring[23] + cubestring[12],
            FLD: cubestring[24] + cubestring[44] + cubestring[27],
            FD: cubestring[25] + cubestring[28],
            FDR: cubestring[26] + cubestring[29] + cubestring[15],
            DFL: cubestring[27] + cubestring[24] + cubestring[44],
            DF: cubestring[28] + cubestring[25],
            DRF: cubestring[29] + cubestring[15] + cubestring[26],
            DL: cubestring[30] + cubestring[43],
            D: cubestring[31],
            DR: cubestring[32] + cubestring[16],
            DLB: cubestring[33] + cubestring[42] + cubestring[53],
            DB: cubestring[34] + cubestring[52],
            DBR: cubestring[35] + cubestring[51] + cubestring[17],
            LUB: cubestring[36] + cubestring[0] + cubestring[47],
            LU: cubestring[37] + cubestring[3],
            LFU: cubestring[38] + cubestring[18] + cubestring[6],
            LB: cubestring[39] + cubestring[50],
            L: cubestring[40],
            LF: cubestring[41] + cubestring[21],
            LBD: cubestring[42] + cubestring[53] + cubestring[33],
            LD: cubestring[43] + cubestring[30],
            LDF: cubestring[44] + cubestring[27] + cubestring[24],
            BUR: cubestring[45] + cubestring[2] + cubestring[11],
            BU: cubestring[46] + cubestring[1],
            BLU: cubestring[47] + cubestring[36] + cubestring[0],
            BR: cubestring[48] + cubestring[14],
            B: cubestring[49],
            BL: cubestring[50] + cubestring[39],
            BRD: cubestring[51] + cubestring[17] + cubestring[35],
            BD: cubestring[52] + cubestring[34],
            BDL: cubestring[53] + cubestring[33] + cubestring[42]
        }

        return notation
    }
}

export { Rubikscube }