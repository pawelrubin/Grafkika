import { Turtle } from "./../Turtle.js"

window.addEventListener('load', () => {
    const logoCanvas = document.getElementById("logoCanvas");
    const controlInput = document.getElementById("controlInput");
    const turtle = new Turtle(logoCanvas)
    
    controlInput.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            turtle.parseInput(controlInput.value);
            controlInput.value = '';
        }
    })
})
