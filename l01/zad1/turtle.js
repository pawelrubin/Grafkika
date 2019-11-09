import { Turtle } from "./../Turtle.js"
import { hilbertTurtle } from "../zad2/turtleHilbert.js"

window.addEventListener('load', () => {
    const logoCanvas = document.getElementById("logoCanvas");
    const controlInput = document.getElementById("controlInput");
    const execButton = document.getElementById("execButton");
    const turtle = new Turtle(logoCanvas);
    const coords = document.getElementById("coords");
    const hilbertButton = document.getElementById('hilbertButton');

    const updateCoords = (x, y, r) => {
        coords.textContent = `x: ${x.toFixed(2)} y: ${y.toFixed(2)} r: ${r.toFixed(2)}`;
    };
    const exec = () => {
        console.log(controlInput.value)
        turtle.parseInput(controlInput.value);
        controlInput.value = '';
        updateCoords(turtle.x_pos, turtle.y_pos, turtle.rotation);
    };

    updateCoords(turtle.x_pos, turtle.y_pos, turtle.rotation);

    execButton.addEventListener('click', exec);

    controlInput.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            exec();
        }
    });

    hilbertButton.addEventListener('click', () => {
        const ctx = logoCanvas.getContext('2d');
        ctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
        turtle.x_pos = 0
        turtle.y_pos = logoCanvas.height
        turtle.rotation = 90;
        const degree = document.getElementById('degreeSlider').value;
        const hilbert = hilbertTurtle(degree, logoCanvas.width/(2**(degree) - 1));
        turtle.parseInput(hilbert)
        updateCoords(turtle.x_pos, turtle.y_pos, turtle.rotation);
    })
})
