import { createPiece } from './piece';

class Rubikscube {
    constructor() {
        this.pieces = []
        this.indices = []
        for (let i = 0; i < 3; i++) {
            this.pieces[i] = []
            this.indices[i] = []
            for (let j = 0; j < 3; j++) {
                this.pieces[i][j] = []
                this.indices[i][j] = []
                for (let k = 0; k < 3; k++) {
                    this.pieces[i][j][k] = createPiece()
                    this.pieces[i][j][k].position.set((i-1), (j-1), (k-1)) 
                    this.indices[i][j][k] = [i,j,k]    
                }
            }
        }
    }

    rotateMatrixClockwise () {
        let temp = []
        temp = this.indices[2][2][2]
        this.indices[2][2][2] = this.indices[2][0][2]
        this.indices[2][0][2] = this.indices[2][0][0]
        this.indices[2][0][0] = this.indices[2][2][0]
        this.indices[2][2][0] = temp
    }
}


export { Rubikscube }