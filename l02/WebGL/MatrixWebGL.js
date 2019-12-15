import { simpleFragmentShader, matrixVertexShader } from "./Shaders.js";
import { resizeCanvas } from "../shared/Utils.js";
import { m3 } from "../WebGL/Matrix.js";

const randomColor = () => [Math.random(), Math.random(), Math.random(), 1];

export class DrawableObject {
  constructor(positions, primitiveType) {
    this.positions = positions;
    this.primitiveType = primitiveType;
    this.color = randomColor();
    this.translation = [0, 0];
    this.angleInRadians = 0;
    this.scale = [1, 1];
    this.depth = 0;
    this.pointSize = 1;
  }
}

export class MatrixWebGL {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl");
    this.program = this.createWebGLProgram();
    this.locations = {
      attributes: {
        position: this.gl.getAttribLocation(this.program, "a_position")
      },
      uniforms: {
        color: this.gl.getUniformLocation(this.program, "u_color"),
        matrix: this.gl.getUniformLocation(this.program, "u_matrix"),
        depth: this.gl.getUniformLocation(this.program, "u_depth"),
        pointSize: this.gl.getUniformLocation(this.program, "u_point_size")
      }
    };
    resizeCanvas(this.gl.canvas);
  }

  createWebGLProgram() {
    const createShader = (gl, type, source) => {
      let shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = createShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      matrixVertexShader
    );
    const fragmentShader = createShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      simpleFragmentShader
    );

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.log(this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  draw(objects) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.locations.attributes.position);
    this.gl.lineWidth(4);
    resizeCanvas(this.gl.canvas)
    objects.forEach(object => {
      this.gl.enableVertexAttribArray(this.locations.attributes.position);
      const positionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(object.positions),
        this.gl.STATIC_DRAW
      );

      // Bind the position buffer.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

      let size = 2; // 2 components per iteration
      let type = this.gl.FLOAT; // the data is 32bit floats
      let normalize = false; // don't normalize the data
      let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      let offset = 0; // start at the beginning of the buffer
      this.gl.vertexAttribPointer(
        this.locations.attributes.position,
        size,
        type,
        normalize,
        stride,
        offset
      );

      // Compute the matrices
      let matrix = m3.projection(
        this.gl.canvas.clientWidth,
        this.gl.canvas.clientHeight
      );
      matrix = m3.translate(matrix, object.translation[0], object.translation[1]);
      matrix = m3.rotate(matrix, object.angleInRadians);
      matrix = m3.scale(matrix, object.scale[0], object.scale[1]);

      this.gl.uniformMatrix3fv(this.locations.uniforms.matrix, false, matrix);
      this.gl.uniform4fv(this.locations.uniforms.color, object.color);
      this.gl.uniform1f(this.locations.uniforms.depth, object.depth);
      this.gl.uniform1f(this.locations.uniforms.pointSize, object.pointSize);
      this.gl.drawArrays(this.gl[object.primitiveType], 0, object.positions.length / size);
    });
  }
}
