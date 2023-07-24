import { createPiece } from './piece';

class Rubikscube {
    constructor() {
        this.pieces = []
        for (let i = 0; i < 3; i++) {
            this.pieces[i] = []
            for (let j = 0; j < 3; j++) {
                this.pieces[i][j] = []
                for (let k = 0; k < 3; k++) {
                    this.pieces[i][j][k] = createPiece()
                    this.pieces[i][j][k].position.set((i-1), (j-1), (k-1))    
                }
            }
        }
    }
}


export { Rubikscube }