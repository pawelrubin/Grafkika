import { calculateHilbertCurvePoints } from "./WebGLHilbert.js";
import { MatrixWebGL, DrawableObject } from "../WebGL/MatrixWebGL.js";

window.addEventListener("load", () => {
  const webGL = new MatrixWebGL(canvas);

  let hilberts = [];

  const updateDegree = () => {
    degreeLabel.textContent = `Degree: ${degreeSlider.value}`;
  };

  newHilbertButton.addEventListener("click", () => {
    const degree = degreeSlider.value;
    const hilbert = new DrawableObject(
      calculateHilbertCurvePoints(degree, webGL.gl.canvas)
    );
    hilbert.depth = (degree - 1) / 7;
    hilberts.push(hilbert);
    updateDegree();
    webGL.draw(hilberts, "LINE_STRIP");
  });

  degreeSlider.addEventListener("input", updateDegree);
  degreeSlider.dispatchEvent(new Event("input"));
});
