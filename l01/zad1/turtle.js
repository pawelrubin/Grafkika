import { Turtle } from "./../Turtle.js"

window.addEventListener('load', () => {
    const logoCanvas = document.getElementById("logoCanvas");
    const controlInput = document.getElementById("controlInput");
    const execButton = document.getElementById("execButton");
    const turtle = new Turtle(logoCanvas);
    const coords = document.getElementById("coords");
    const updateCoords = () => {
        coords.textContent = `x: ${turtle.x_pos.toFixed(2)} y: ${turtle.y_pos.toFixed(2)} r: ${turtle.rotation.toFixed(2)}`;
    };
    const exec = () => {
        turtle.parseInput(controlInput.value);
        controlInput.value = '';
        updateCoords();
    };

    updateCoords();

    execButton.addEventListener('click', exec);

    controlInput.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            exec();
        }
    });
})
