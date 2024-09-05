import { Tween } from "@tweenjs/tween.js";
import { allowedMoves, createWorld } from "./src/Utils";

const container = document.querySelector("#scene-container");
const [world, rubikscube] = createWorld(container);

// Max Park 3x3 World Record (3.13s) Reconstruction
const scramble = `D U F2' L2 U' B2 F2 D L2 U R' F' D R' F' U L D' F' D R2`;
const scrambleArray = scramble.split(" ");
const solution = `x2 // inspection
                  R' D D R' D L' U L D R' U' R D // xxcross
                  L U' L' // 3rd pair
                  U' R U R' d R' U' R // 4th pair
                  r' U' R U' R' U U r // OLL(CP)
                  U x2 // AUF`;
const solutionArray = solution
    .split(" ")
    .join(",")
    .split("\n")
    .join(",")
    .split(",")
    .filter((el) => allowedMoves.includes(el));

document.addEventListener("DOMContentLoaded", async () => {
    world.updatables.push(rubikscube.core);
    rubikscube.core.tick = (delta) => {
        rubikscube.core.rotation.y += -delta;
        rubikscube.core.position.y = Math.sin(rubikscube.core.rotation.y) / 2;
    };

    rubikscube.setMoveAnimationSpeed();
    for (let times = 0; times < 5; times++) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        for (let i = 0, n = scrambleArray.length; i < n; i++) {
            await rubikscube.move(scrambleArray[i]);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        for (let i = 0, n = solutionArray.length; i < n; i++) {
            await rubikscube.move(solutionArray[i]);
        }
    }
});
