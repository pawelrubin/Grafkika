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

// export const hilbertTurtle = (degree) => {
//     const size = 2 ** degree;
//     let rotation = 90;

//     let previuos = {
//         x: 0, y: 0
//     };

//     let result = '';
//     for (let i = 1; i < size ** 2; i++) {
//         let current = 
//     }
// } 

function hilbertDemo(canvas, size) {
  var ctx = canvas.getContext('2d');

  var N = 32;

  var prev = {x: 0, y: 0}, curr;

  var blockSize = Math.floor(size / N);
  var offset = blockSize/2;

  for (var i = 0; i < N*N; i += 1) {
    curr = hindex2xy(i, N);

    line(prev, curr);

    prev = curr;
  }

  function line(from, to) {
    var off = offset;

    ctx.beginPath();
    ctx.moveTo(from.x * blockSize + off, from.y * blockSize + off);
    ctx.lineTo(to.x * blockSize + off, to.y * blockSize + off);
    ctx.stroke();
  }
}

window.addEventListener('load', () => {
  let canvas = document.getElementById('logoCanvas')
  hilbertDemo(canvas, canvas.width)
})