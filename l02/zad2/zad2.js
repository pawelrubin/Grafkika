import { createWebGLProgram, draw } from "../WebGL.js";
import { calculateHilbertCurvePoints } from "./WebGLHilbert.js";
import { resizeCanvas } from "../Utils.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const degreeSlider = document.getElementById("degreeSlider");
  const degreeLabel = document.getElementById("degreeLabel");

  const gl = canvas.getContext("webgl");
  const webGLprogram = createWebGLProgram(gl);
  const locations = {
    attributes: {
      position: gl.getAttribLocation(webGLprogram, "a_position")
    },
    uniforms: {
      resolution: gl.getUniformLocation(webGLprogram, "u_resolution"),
      color: gl.getUniformLocation(webGLprogram, "u_color")
    }
  };
  resizeCanvas(gl.canvas);
  const drawHilbert = () => {
    const degreeSlider = document.getElementById("degreeSlider");
    const degreeLabel = document.getElementById("degreeLabel");
    degreeLabel.textContent = `Degree: ${degreeSlider.value}`;
    const positions = calculateHilbertCurvePoints(degreeSlider.value, gl.canvas);
    draw(gl, webGLprogram, locations, positions, gl.LINE_STRIP);
  }

  drawHilbert();
  
  degreeSlider.addEventListener("input", () => {
    drawHilbert();
  });
});