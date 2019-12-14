import { WebGL } from "../WebGL/WebGL.js";
import { sleep } from "../shared/Utils.js";

window.addEventListener("load", () => {
  const webGL = new WebGL(canvas);

  const positions = [10, 50, 10, 10, 300, 10, 300, 590, 590, 590, 590, 550];

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
        webGL.draw(positions, primitiveType);
        typeInfo.textContent = "primitive type: " + primitiveType;
        await sleep(2000);
      }
    }
  }

  webGL.logActiveParameters();

  demo();
});
