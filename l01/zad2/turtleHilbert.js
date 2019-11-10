import { hindex2xy } from "./../Hilbert.js";


export const hilbertTurtle = (degree, baseLength) => {
    const size = 2 ** degree;
    let rotation = 90;

    let previous = {
        x: 0, y: 0
    };

    let result = '';
    for (let i = 1; i < size ** 2; i++) {
        let current = hindex2xy(i, size);

        if (current.x > previous.x) { // y can't change, go right, rot = 0
            result += `right ${rotation}; forward ${baseLength}; `;
            rotation = 0;
        } else if (current.x === previous.x) { // y must change
            if (current.y > previous.y) { // go up, rot = 90
                result += `right ${rotation - 90}; forward ${baseLength}; `;
                rotation = 90;
            } else { // go down, rot = 270
                result += `right ${rotation - 270}; forward ${baseLength};`;
                rotation = 270;
            }
        } else { // y can't change, go left, rot = 180
            result += `right ${rotation - 180}; forward ${baseLength}; `;
            rotation = 180;
        }

        previous = current;
    }
    return result;
}
