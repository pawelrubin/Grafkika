import { createWebGLProgram, createBuffer, draw, logActiveParameters } from "../WebGL.js";
import { sleep } from "../Utils.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");
  const webGLprogram = createWebGLProgram(gl);
  const typeInfo = document.getElementById("typeInfo");

  const locations = {
    attributes: {
      position: gl.getAttribLocation(webGLprogram, "a_position")
    },
    uniforms: {
      resolution: gl.getUniformLocation(webGLprogram, "u_resolution"),
      color: gl.getUniformLocation(webGLprogram, "u_color")
    }
  };

  const positions = [10, 50, 10, 10, 300, 10, 300, 590, 590, 590, 590, 550];

  const positionBuffer = createBuffer(gl, positions);

  const primitiveTypes = [
    "POINTS",
    "LINES",
    "LINE_STRIP",
    "LINE_LOOP",
    "TRIANGLES",
    "TRIANGLE_STRIP",
    "TRIANGLE_FAN"
  ];

  async function demo() {
    while (true) {
      for (let primitiveType of primitiveTypes) {
        draw(gl, webGLprogram, locations, positionBuffer, gl[primitiveType]);
        typeInfo.textContent = "primitive type: " + primitiveType;
        await sleep(2000);
      }
    }
  }

  logActiveParameters(gl, webGLprogram);

  demo();
});
