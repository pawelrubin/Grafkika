import { hindex2xy } from "../../Hilbert.js";

const resizeCords = (point, degree, width, height) => ({
  x: point.x / (degree - 1) * (width - 2) + 1,
  y: point.y / (degree - 1) * (height - 2) + 1
});

function calculateHilbertCurvePoints(degree, canvas) {
  const size = 2 ** degree;
  let points = [];

  for (let i = 0; i < size ** 2; i++) {
    const point = resizeCords(hindex2xy(i, size), size, canvas.width, canvas.height);
    points.push(point.x, point.y);
  }

  return points;
}

function drawHilbert(webGL, degree) {
  webGL.draw(
    calculateHilbertCurvePoints(degree, webGL.gl.canvas),
    "LINE_STRIP"
  );
}

export { drawHilbert };
