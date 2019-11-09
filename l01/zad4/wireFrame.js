import { Engine, Cube, Vertex3D, Camera, OrthographicProjection, PerspectiveProjection } from "./../3DEngine.js";


window.addEventListener('load', () => {
    const canvas = document.getElementById("wireFrameCanvas");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var dx = canvas.width / 2;
	var dy = canvas.height / 2;
    const engine = new Engine(canvas)
    const camera = new Camera(new Vertex3D(0,0,0), 200, new PerspectiveProjection())

    const cubeCenter = new Vertex3D(0, 11*dy/10, 0);
    const cube = new Cube(cubeCenter, dy);
    const objects = [cube];

    // Initialize the movement

	canvas.addEventListener('mousedown', initMove);
	canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stopMove);
    
    
	canvas.addEventListener('touchstart', (event) => {
        initMove(event.touches[event.touches.length - 1])
    }, { passive: false });
	canvas.addEventListener('touchmove',  (event) => {
        move(event.touches[event.touches.length - 1])
    }, { passive: false });
    canvas.addEventListener('touchcancel',  (event) => {
        stopMove(event.touches[event.touches.length - 1])
    }, { passive: false });
    
    // Events
	var mousedown = false;
	var mx = 0;
    var my = 0;
    
    function initMove(evt) {
        mousedown = true;
        mx = evt.clientX;
        my = evt.clientY;
    }

    function move(evt) {
        if (mousedown) {
            var theta = (evt.clientX - mx) * Math.PI / 360;
            var phi = (evt.clientY - my) * Math.PI / 180;

            for (var i = 0; i < 8; ++i)
                rotate(cube.vertices[i], cubeCenter, theta, phi);

            mx = evt.clientX;
            my = evt.clientY;

            engine.render(objects, camera);
        }
    }

    function stopMove() {
        mousedown = false;
    }

    // Rotate a vertice
    function rotate(vertex, center, theta, phi) {
        // Rotation matrix coefficients
        var ct = Math.cos(theta);
        var st = Math.sin(theta);
        var cp = Math.cos(phi);
        var sp = Math.sin(phi);

        // Rotation
        var x = vertex.x - center.x;
        var y = vertex.y - center.y;
        var z = vertex.z - center.z;

        vertex.x = ct * x - st * cp * y + st * sp * z + center.x;
        vertex.y = st * x + ct * cp * y - ct * sp * z + center.y;
        vertex.z = sp * y + cp * z + center.z;
    }

    document.getElementById("perspectiveButton").addEventListener('click', () => {
        camera.projection = new PerspectiveProjection;
        engine.render(objects, camera);
    })
    document.getElementById("orthographicButton").addEventListener('click', () => {
        camera.projection = new OrthographicProjection;
        engine.render(objects, camera);
    })


    engine.render(objects, camera);
})