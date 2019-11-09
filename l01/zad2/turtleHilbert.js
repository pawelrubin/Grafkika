// import { Turtle } from "../Turtle";

function last2bits(x) { return (x & 3); }

function hindex2xy(hindex, N) {
    // 1. compute position of node in N=2 curve
    var positions = [
    /* 0: */ [0, 0],
    /* 1: */ [0, 1],
    /* 2: */ [1, 1],
    /* 3: */ [1, 0]
    ];

    var tmp = positions[last2bits(hindex)];
    hindex = (hindex >>> 2);

    // 2. iteratively compute coords
    var x = tmp[0];
    var y = tmp[1];
  
    for (var n = 4; n <= N; n *= 2) {
        var n2 = n / 2;

        switch (last2bits(hindex)) {
        case 0: /* case A: left-bottom */
            tmp = x; x = y; y = tmp;
            break;

        case 1: /* case B: left-upper */
            x = x;
            y = y + n2;
            break;

        case 2: /* case C: right-upper */
            x = x + n2;
            y = y + n2;
            break;

        case 3: /* case D: right-bottom */
            tmp = y;
            y = (n2-1) - x;
            x = (n2-1) - tmp;
            x = x + n2;
            break;
        }
        
        hindex = (hindex >>> 2);
    }
    return {x: x, y: y};
}

export const hilbertTurtle = (degree, baseLength) => {
    const size = 2 ** degree;
    let rotation = 90;

    let previous = {
        x: 0, y: 0
    };

    let result = '';
    for (let i = 1; i < size ** 2; i++) {
        let current = hindex2xy(i, size);

        if (current.x > previous.x) { //y can't change, go right, rot = 0
            result += `right ${rotation}; forward ${baseLength}; `;
            rotation = 0;
        } else if (current.x === previous.x) { // y must change
            if (current.y > previous.y) { // go up, rot = 90
                result += `right ${rotation - 90}; forward ${baseLength}; `;
                rotation = 90;
            } else { //go down, rot = 270
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
