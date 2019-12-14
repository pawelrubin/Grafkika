import { simpleFragmentShader, simpleVertexShader } from "./Shaders.js";
import { resizeCanvas } from "../shared/Utils.js";

export class WebGL {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl");
    this.program = this.createWebGLProgram();
    this.locations = {
      attributes: {
        position: this.gl.getAttribLocation(this.program, "a_position")
      },
      uniforms: {
        resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
        color: this.gl.getUniformLocation(this.program, "u_color")
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
      simpleVertexShader
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

  draw(positions, primitiveType) {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Tell it to use our webGLprogram (pair of shaders)
    this.gl.useProgram(this.program);

    this.gl.enableVertexAttribArray(this.locations.attributes.position);

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

    // set the resolution
    this.gl.uniform2f(
      this.locations.uniforms.resolution,
      this.gl.canvas.width,
      this.gl.canvas.height
    );

    // set the color - randomly
    this.gl.uniform4f(
      this.locations.uniforms.color,
      Math.random(),
      Math.random(),
      Math.random(),
      1
    );

    this.gl.drawArrays(this.gl[primitiveType], 0, positions.length / size);
  }

  logActiveParameters() {
    const numAttribs = this.gl.getProgramParameter(
      this.program,
      this.gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < numAttribs; ++i) {
      const info = this.gl.getActiveAttrib(this.program, i);
      console.log("name:", info.name, "type:", info.type, "size:", info.size);
    }

    const numUniforms = this.gl.getProgramParameter(
      this.program,
      this.gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < numUniforms; ++i) {
      const info = this.gl.getActiveUniform(this.program, i);
      console.log("name:", info.name, "type:", info.type, "size:", info.size);
    }
  }
}
