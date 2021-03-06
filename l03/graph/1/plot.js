class Plot {
  constructor(gl, triangles) {
    this.size = 1000;
    this.precision = 400;
    this.positions = this.generatePlot(
      [-5, 5],
      [-5, 5],
      (x, y) => Math.sin(x**3 + y**3) ,
      triangles
    );
    this.positionBuffer = initBuffers(gl, this.positions);
    this.color = [1, 0, 0, 1];
    this.translation = [0, 0, -2000];
    this.rotation = [0, 0, 0];

    console.log(this.positions);
  }

  generatePlot(xRange, yRange, func, triangles) {
    let plot = [];
    for (let x = 0; x < this.precision; x++) {
      for (let y = 0; y < this.precision; y++) {
        let value = func(
          xRange[0] + (x * (xRange[1] - xRange[0])) / this.precision,
          yRange[0] + (y * (yRange[1] - yRange[0])) / this.precision
        );

        if (triangles) {
          let nextY = null;
          let nextX = null;
          let nextYX = null;
          if (y !== this.precision - 1) {
            nextY = func(
              xRange[0] + (x * (xRange[1] - xRange[0])) / this.precision,
              yRange[0] + ((y + 1) * (yRange[1] - yRange[0])) / this.precision
            );
          }
          if (x !== this.precision - 1) {
            nextX = func(
              xRange[0] + ((x + 1) * (xRange[1] - xRange[0])) / this.precision,
              yRange[0] + (y * (yRange[1] - yRange[0])) / this.precision
            );
          }
          if (x !== this.precision - 1 && y !== this.precision - 1) {
            nextYX = func(
              xRange[0] + ((x + 1) * (xRange[1] - xRange[0])) / this.precision,
              yRange[0] + ((y + 1) * (yRange[1] - yRange[0])) / this.precision
            );
          }

          if (nextX !== null && nextY !== null && nextYX !== null) {
            plot.push(
              (x * this.size) / this.precision - this.size / 2,
              (y * this.size) / this.precision - this.size / 2,
              value,
              ((x + 1) * this.size) / this.precision - this.size / 2,
              (y * this.size) / this.precision - this.size / 2,
              nextX,
              (x * this.size) / this.precision - this.size / 2,
              ((y + 1) * this.size) / this.precision - this.size / 2,
              nextY,
              ((x + 1) * this.size) / this.precision - this.size / 2,
              ((y + 1) * this.size) / this.precision - this.size / 2,
              nextYX,
              ((x + 1) * this.size) / this.precision - this.size / 2,
              (y * this.size) / this.precision - this.size / 2,
              nextX,
              (x * this.size) / this.precision - this.size / 2,
              ((y + 1) * this.size) / this.precision - this.size / 2,
              nextY
            );
          }
        } else {
          plot.push(
            (x * this.size) / this.precision - this.size / 2,
            (y * this.size) / this.precision - this.size / 2,
            value
          );
        }
      }
    }

    const scaleFactor = this.size / Math.abs(xRange[1] - xRange[0]);
    plot = plot.map((p, i) => (i % 3 === 2 ? p * scaleFactor : p));

    return plot;
  }
}

class Engine {
  constructor(gl, triangles) {
    this.gl = gl;

    this.triangles = triangles;

    this.program = initShaderProgram(this.gl, vsSource, fsSource);

    this.uniforms = {
      uMatrix: gl.getUniformLocation(this.program, "u_matrix")
    };
    this.attribs = {
      aPosition: gl.getAttribLocation(this.program, "a_position")
    };

    this.plot = new Plot(this.gl, triangles);
    this.objectsToDraw = [this.plot];
  }

  drawScene() {
    resizeCanvas(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.DEPTH_TEST);

    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.program);

    this.objectsToDraw.forEach(object => {
      this.gl.enableVertexAttribArray(this.attribs.aPosition);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.positionBuffer);

      let size = 3;
      let type = this.gl.FLOAT;
      let normalize = false;
      let stride = 0;
      let offset = 0;
      this.gl.vertexAttribPointer(
        this.attribs.aPosition,
        size,
        type,
        normalize,
        stride,
        offset
      );

      let aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
      let fov = Math.PI / 4;

      let matrix = m4.perspective(fov, aspect, 1, 10000);
      matrix = m4.xRotate(matrix, object.rotation[0]);
      matrix = m4.yRotate(matrix, object.rotation[1]);
      matrix = m4.translate(
        matrix,
        object.translation[0],
        object.translation[1],
        object.translation[2]
      );

      this.gl.uniformMatrix4fv(this.uniforms.uMatrix, false, matrix);

      if (this.triangles) {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, object.positions.length / 3);
      } else {
        this.gl.drawArrays(this.gl.POINTS, 0, object.positions.length / 3);
      }
    });
  }
}

function initBuffers(gl, positions) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}
