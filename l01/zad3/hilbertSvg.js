import { hindex2xy } from "./../Hilbert.js";

window.addEventListener('load', () => {
    const svg = document.getElementById("svgForHilbert");
    const degreeSlider = document.getElementById("degreeSlider");
    const degreeLabel = document.getElementById("degreeLabel");

    const resizeCords = (x, y, max) => ({
        // (size - 2) + 1 for 1 px margin
        x: x / (max - 1) * (svg.width.baseVal.value - 2) + 1,
        y: y / (max - 1) * (svg.height.baseVal.value - 2) + 1
    });


    const drawHilbert = () => {
        const degree = degreeSlider.value;
        const size = 2 ** degree;
        
        let previous = {
            x: 0, y: 0
        };

        let points = `0,0 `;
        for (let i = 1; i < size ** 2; i++) {
            let result = hindex2xy(i, size);
            let current = resizeCords(result.x, result.y, size);
            points += `${current.x},${current.y} `;
            previous = current;
        }

        svg.innerHTML = `<polyline points = "${points}">`;
    }

    drawHilbert();

    degreeSlider.addEventListener('input', () => {
        drawHilbert();
        degreeLabel.textContent = `Degree: ${degreeSlider.value}`
    });
});