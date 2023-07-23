import { createCube } from './cube';

class Rubikscube {
    constructor() {
        this.pieces = []
        for (let i = 0; i < 3; i++) {
            this.pieces[i] = []
            for (let j = 0; j < 3; j++) {
                this.pieces[i][j] = []
                for (let k = 0; k < 3; k++) {
                    this.pieces[i][j][k] = createCube()
                    this.pieces[i][j][k].position.set((i-1)*0.2, (j-1)*0.2, (k-1)*0.2)    
                }
            }
        }
    }
}


export { Rubikscube }