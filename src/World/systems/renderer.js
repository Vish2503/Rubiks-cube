import { WebGLRenderer } from "three";

function createRenderer() {
    const renderer = new WebGLRenderer()

    renderer.useLegacyLights = false
    return renderer
}

export { createRenderer }