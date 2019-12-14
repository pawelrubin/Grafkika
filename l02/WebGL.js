import { resizeCanvas } from "./Utils.js";

const vertexShaderSource = `
  attribute vec4 a_position;
  uniform vec2 u_resolution;

  void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position.xy / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    gl_PointSize = 3.0;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`;

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createWebGLProgram(gl) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const webGLprogram = gl.createProgram();
  gl.attachShader(webGLprogram, vertexShader);
  gl.attachShader(webGLprogram, fragmentShader);
  gl.linkProgram(webGLprogram);

  if (!gl.getProgramParameter(webGLprogram, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(webGLprogram));
    gl.deleteProgram(webGLprogram);
    return null;
  }

  return webGLprogram;
}

function createBuffer(gl, positions) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  return positionBuffer;
}

function draw(gl, webGLprogram, locations, positions, primitiveType) {
  const positionBuffer = createBuffer(gl, positions);
  resizeCanvas(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our webGLprogram (pair of shaders)
  gl.useProgram(webGLprogram);

  gl.enableVertexAttribArray(locations.attributes.position);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let size = 2; // 2 components per iteration
  let type = gl.FLOAT; // the data is 32bit floats
  let normalize = false; // don't normalize the data
  let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    locations.attributes.position,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // set the resolution
  gl.uniform2f(locations.uniforms.resolution, gl.canvas.width, gl.canvas.height);

  // set the color - randomly
  gl.uniform4f(
    locations.uniforms.color,
    Math.random(),
    Math.random(),
    Math.random(),
    1
  );

  gl.drawArrays(primitiveType, 0, positions.length / size);
}

function logActiveParameters(gl, webGLprogram) {
  const numAttribs = gl.getProgramParameter(webGLprogram, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < numAttribs; ++i) {
    const info = gl.getActiveAttrib(webGLprogram, i);
    console.log("name:", info.name, "type:", info.type, "size:", info.size);
  }

  const numUniforms = gl.getProgramParameter(webGLprogram, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numUniforms; ++i) {
    const info = gl.getActiveUniform(webGLprogram, i);
    console.log("name:", info.name, "type:", info.type, "size:", info.size);
  }
}

export { createWebGLProgram, createBuffer, draw, logActiveParameters };
