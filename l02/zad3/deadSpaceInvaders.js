import { MatrixWebGL, DrawableObject } from "../WebGL/MatrixWebGL.js";
import { clone } from "../shared/Utils.js";

const BASIC_DEPTH = 1 / 4;
const SPEED = 3;

window.addEventListener("load", () => {
  const webGL = new MatrixWebGL(canvas);
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
  spaceShip.depth = BASIC_DEPTH;

  const stars = generateStars(canvas);
  const enemies = [generateEnemy(canvas)];
  let objects = stars.concat(enemies);
  requestAnimationFrame(render);

  function render() {
    if (Math.random() > 0.995) {
      objects.push(generateEnemy(canvas));
    }

    // loop stars animation
    stars.forEach(s => {
      if (s.translation[1] > canvas.height) {
        s.translation[1] = -canvas.height;
      }
    });

    // move enemies and stars
    objects.forEach(o => {
      o.translation[1] += (1.01 - o.depth) * SPEED;
    });

    // delete enemies under canvas
    objects = objects.filter(
      o => !(o.type == "enemy" && o.translation[1] > canvas.height)
    );

    webGL.draw(objects.concat(spaceShip));
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
  const STARS_LEVELS = 5;
  for (let i = 0; i < STARS_LEVELS; i++) {
    let s = new DrawableObject(generateRandomPoints(canvas, 5 ** i), "POINTS");
    s.color = [1, 1, 1, 1];
    s.depth = i / (STARS_LEVELS - 1);
    s.pointSize = 1.0 + (1 - i / (STARS_LEVELS - 1)) * 4;
    let sCopy = clone(s);
    sCopy.translation[1] = -canvas.height;
    stars.push(s);
    stars.push(sCopy);
  }
  return stars;
}

function generateEnemy(canvas) {
  const startX = Math.random() * canvas.width;

  const enemy = new DrawableObject(
    [startX, 0, startX + 50, 0, startX + 25, 50],
    "TRIANGLES"
  );
  enemy.depth = BASIC_DEPTH;
  enemy.type = "enemy";

  return enemy;
}
