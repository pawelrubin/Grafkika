import { drawHilbert } from "./WebGLHilbert.js";
import { WebGL } from "../WebGL/WebGL.js";

window.addEventListener("load", () => {
  const webGL = new WebGL(canvas);

  degreeSlider.addEventListener("input", () => {
    degreeLabel.textContent = `Degree: ${degreeSlider.value}`;
    drawHilbert(webGL, degreeSlider.value);
  });

  degreeSlider.dispatchEvent(new Event("input"));
});
