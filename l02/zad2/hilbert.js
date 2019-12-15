import { drawHilbert, calculateHilbertCurvePoints } from "./WebGLHilbert.js";
import { WebGL } from "../WebGL/WebGL.js";
import { MatrixWebGL, DrawableObject } from "../WebGL/MatrixWebGL.js";

window.addEventListener("load", () => {
  const webGL = new MatrixWebGL(canvas);

  let hilberts = [];

  newHilbertButton.addEventListener("click", () => {
    hilberts.push(new DrawableObject(calculateHilbertCurvePoints(degreeSlider.value, webGL.gl.canvas)))
    degreeLabel.textContent = `Degree: ${degreeSlider.value}`;
    webGL.draw(hilberts, "LINE_STRIP");
  });

  newHilbertButton.dispatchEvent(new Event("click"));
});
