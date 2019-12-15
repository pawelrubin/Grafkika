import { MatrixWebGL, DrawableObject } from "../WebGL/MatrixWebGL.js";
import { clone } from "../shared/Utils.js";
window.addEventListener("load", () => {
  const webGL = new MatrixWebGL(canvas);

  // const stars = generateStars(canvas)
  const spaceShip = new DrawableObject(
    [
      canvas.width / 2 - 50,
      canvas.height - 10,
      canvas.width / 2 + 50,
      canvas.height - 10,
      canvas.width / 2,
      canvas.height - 50
    ],
    "TRIANGLES"
  );
  spaceShip.color = [33 / 255, 55 / 255, 105 / 255, 1];
  spaceShip.depth = 1/4;

  const stars = generateStars(canvas);
  const objects = [spaceShip].concat(stars);

  requestAnimationFrame(render);

  function render() {
    stars.forEach(s => {
      if (s.translation[1] > canvas.height) {
        s.translation[1] = 0;
      } 
      s.translation[1] += 1 - (s.depth);
    })
    webGL.draw(objects);
    requestAnimationFrame(render);
  }

  window.addEventListener("keydown", event => {
    if (event.key == "ArrowLeft") {
      spaceShip.translation[0] -= 10;
    }

    if (event.key == "ArrowRight") {
      spaceShip.translation[0] += 10;
    }
  });
});

function generateRandomPoints(canvas, n) {
  let points = [];
  const maxX = canvas.width;
  const maxY = canvas.height;

  for (let i = 0; i < n; i++) {
    points.push(Math.random() * maxX, Math.random() * maxY);
  }

  return points;
}

function generateStars(canvas) {
  let stars = [];
  for (let i = 0; i < 4; i++) {
    let s = new DrawableObject(generateRandomPoints(canvas, 10 ** i), "POINTS");
    s.color = [1, 1, 1, 1];
    s.depth = i / 4;
    s.pointSize = 1.0 + (1 - i / 4) * 4;
    let sCopy = clone(s);
    sCopy.translation[1] = -canvas.height;
    stars.push(s);
    stars.push(sCopy)
  }
  return stars;
}
