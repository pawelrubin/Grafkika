import { calculateHilbertCurvePoints } from "./WebGLHilbert.js";
import { MatrixWebGL, DrawableObject } from "../WebGL/MatrixWebGL.js";

window.addEventListener("load", () => {
  const webGL = new MatrixWebGL(canvas);

  let hilberts = [];
  let currentHilbert = hilberts[hilberts.length - 1];
  let currentHilbertIndex = 0;

  const updateDegree = () => {
    degreeLabel.textContent = `Degree: ${degreeSlider.value}`;
  };

  newHilbertButton.addEventListener("click", () => {
    const degree = degreeSlider.value;
    const hilbert = new DrawableObject(
      calculateHilbertCurvePoints(degree, webGL.gl.canvas),
      "LINE_STRIP"
    );
    hilbert.depth = (degree - 1) / 8;
    hilberts.push(hilbert);
    updateDegree();
    webGL.draw(hilberts);
  });

  degreeSlider.addEventListener("input", updateDegree);
  degreeSlider.dispatchEvent(new Event("input"));

  window.addEventListener("keydown", event => {
    currentHilbert = hilberts[currentHilbertIndex];
    if (!currentHilbert || event.isComposing || event.keyCode === 229 ) {
      return;
    }

    if (event.key == "j") {
      if (currentHilbertIndex - 1 >= 0)
        currentHilbertIndex--;      
    }

    if (event.key == "l") {
      if (currentHilbertIndex + 1 < hilberts.length)
        currentHilbertIndex++;      
    }

    if (event.key == "w") {
      if (currentHilbert.depth + 0.1 < 1) {
        currentHilbert.depth += 0.1;
        webGL.draw(hilberts);
      }
    }

    if (event.key == "s") {
      if (currentHilbert.depth - 0.1 > 0) {
        currentHilbert.depth -= 0.1;
        webGL.draw(hilberts);
      }
    }

    if (event.key == "ArrowUp") {
      currentHilbert.translation[1] -= 10;
      webGL.draw(hilberts)
    }

    if (event.key == "ArrowDown") {
      currentHilbert.translation[1] += 10;
      webGL.draw(hilberts)
    }

    if (event.key == "ArrowLeft") {
      currentHilbert.translation[0] -= 10;
      webGL.draw(hilberts)
    }

    if (event.key == "ArrowRight") {
      currentHilbert.translation[0] += 10;
      webGL.draw(hilberts)
    }

    if (event.key == "q") {
      currentHilbert.angleInRadians += 0.1;
      webGL.draw(hilberts);
    }

    if (event.key == "e") {
      currentHilbert.angleInRadians -= 0.1;
      webGL.draw(hilberts);
    }

    if (event.key == "+") {
      currentHilbert.scale[0] += 0.1;
      currentHilbert.scale[1] += 0.1;
      webGL.draw(hilberts);
    }

    if (event.key == "-") {
      currentHilbert.scale[0] -= 0.1;
      currentHilbert.scale[1] -= 0.1;
      webGL.draw(hilberts);
    }
  });
});
