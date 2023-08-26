const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight
    if (window.innerWidth / window.innerHeight < 1) {
        camera.fov = 50
    } else {
        camera.fov = 75
    }
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio);
}


class Resizer {
    constructor(container, camera, renderer) {
        setSize(container, camera, renderer)

        window.addEventListener('resize', () => {
            setSize(container, camera, renderer)
        })
    }
}

export { Resizer }