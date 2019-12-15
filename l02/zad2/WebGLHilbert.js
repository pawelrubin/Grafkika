import { hindex2xy } from "../../Hilbert.js";
import { DrawableObject } from "../WebGL/MatrixWebGL.js";

const resizeCords = (point, degree, width, height) => ({
  x: (point.x / (degree - 1)) * (width - 2) + 1,
  y: (point.y / (degree - 1)) * (height - 2) + 1
});

export function calculateHilbertCurvePoints(degree, canvas) {
  const size = 2 ** degree;
  let points = [];

  for (let i = 0; i < size ** 2; i++) {
    const point = resizeCords(hindex2xy(i, size), size, canvas.width, canvas.height);
    points.push(point.x, point.y);
  }

  return points;
}

export function drawHilbert(webGL, degree) {
  const hilbert = new DrawableObject(
    calculateHilbertCurvePoints(degree, webGL.gl.canvas)
  );

  webGL.draw([hilbert], "LINE_STRIP");
}
