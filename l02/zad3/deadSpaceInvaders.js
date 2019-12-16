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
  webGL.bindTextureToObject(spaceShip, "../textures/metal.png");
  spaceShip.color = [33 / 255, 55 / 255, 105 / 255, 1];
  spaceShip.depth = BASIC_DEPTH;

  const stars = generateStars(canvas);

  let objects = stars;

  requestAnimationFrame(render);

  function render() {
    if (Math.random() > 0.995) {
      let enemy = generateEnemy(canvas);
      webGL.bindTextureToObject(enemy, "../textures/trak.jpg")
      objects.push(enemy);
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

  // Events
  let mousedown = false;
  let mx = 0;

  function initMove(evt) {
    mousedown = true;
    mx = evt.clientX;
  }

  function move(evt) {
    if (mousedown) {
      spaceShip.translation[0] += evt.clientX - mx;
      mx = evt.clientX;
    }
  }

  function stopMove() {
    mousedown = false;
  }

  canvas.addEventListener("touchstart", event => {
    event.preventDefault();
    initMove(event.touches[event.touches.length - 1]);
  });
  canvas.addEventListener("touchmove", event => {
    event.preventDefault();
    move(event.touches[event.touches.length - 1]);
  });
  canvas.addEventListener("touchcancel", event => {
    event.preventDefault();
    stopMove(event.touches[event.touches.length - 1]);
  });

  canvas.addEventListener("mousedown", initMove);
  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", stopMove);
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
  const size = 30 + Math.random() * 20;
  const offset = 100;

  const enemy = new DrawableObject(
    [startX, -offset, startX + size, -offset, startX + size / 2, size - offset],
    "TRIANGLES"
  );
  enemy.depth = BASIC_DEPTH;
  enemy.type = "enemy";

  return enemy;
}
