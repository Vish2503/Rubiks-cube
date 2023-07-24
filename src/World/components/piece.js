import { Color } from 'three';
import { createCube } from './cube';
import { createFace } from './face';

const color = [
    new Color(0xffffff),
    new Color(0x00ff00),
    new Color(0xff0000),
    new Color(0x0000ff),
    new Color(0xffa500),
    new Color(0xffff00)
]

function createPiece() {
    const piece = createCube()
    const faces = []
    for (let i = 0; i < 6; i++) {
        faces[i] = createFace()
        faces[i].material.color.set(color[i])
        piece.add(faces[i])
        // faces[i].material.transparent = true
        // if (i > 0 && i < 5) faces[i].material.opacity = 0.0;
    }
    faces[0].rotateX(Math.PI / 2).position.set(0,0.501,0)
    faces[1].position.set(0,0,0.501)
    faces[2].rotateY(Math.PI / 2).position.set(0.501,0,0)
    faces[3].position.set(0,0,-0.501)
    faces[4].rotateY(Math.PI / 2).position.set(-0.501,0,0)
    faces[5].rotateX(Math.PI / 2).position.set(0,-0.501,0)

    return piece
}

export { createPiece }