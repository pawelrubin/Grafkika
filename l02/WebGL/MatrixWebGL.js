import {
  simpleFragmentShader,
  matrixVertexShader,
  textureFragmentShader,
  simpleVertexShader
} from "./Shaders.js";
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
    this.textured = false;
  }
}

export class MatrixWebGL {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl");
    this.program = this.createWebGLProgram(matrixVertexShader, simpleFragmentShader);
    this.textureProgram = this.createWebGLProgram(
      matrixVertexShader,
      textureFragmentShader
    );
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
    this.texturedLocations = {
      attributes: {
        position: this.gl.getAttribLocation(this.textureProgram, "a_position"),
        texcoord: this.gl.getAttribLocation(this.textureProgram, "a_texcoord")
      },
      uniforms: {
        matrix: this.gl.getUniformLocation(this.textureProgram, "u_matrix"),
        texture: this.gl.getUniformLocation(this.textureProgram, "u_texture")
      }
    };
    resizeCanvas(this.gl.canvas);
  }

  bindTextureToObject(object, textureSrc) {
    object.textured = true;
    object.texcoords = [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0];
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      new Uint8Array([0, 255, 0, 255])
    );

    const image = new Image();
    image.src = textureSrc;
    image.addEventListener("load", () => {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        image
      );
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    });

    object.texture = texture;
  }
  createWebGLProgram(vertexShaderSrc, fragmentShaderSrc) {
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

    const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader = createShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSrc
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
    resizeCanvas(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.lineWidth(4);

    this.gl.useProgram(this.program);

    objects.forEach(object => {
      const locations = object.textured ? this.texturedLocations : this.locations;

      this.gl.enableVertexAttribArray(locations.attributes.position);

      const positionBuffer = createPositionBuffer(this.gl, object);
      // Bind the position buffer.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

      let size = 2; // 2 components per iteration
      let type = this.gl.FLOAT; // the data is 32bit floats
      let normalize = false; // don't normalize the data
      let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      let offset = 0; // start at the beginning of the buffer
      this.gl.vertexAttribPointer(
        locations.attributes.position,
        size,
        type,
        normalize,
        stride,
        offset
      );

      // handle textures
      if (object.textured) {
        this.gl.useProgram(this.textureProgram);
        this.gl.enableVertexAttribArray(locations.attributes.texcoord);

        const texcoordBuffer = initTextureBuffer(this.gl, object);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);

        this.gl.vertexAttribPointer(
          locations.attributes.texcoord,
          size,
          type,
          normalize,
          stride,
          offset
        );

        this.gl.bindTexture(this.gl.TEXTURE_2D, object.texture);
        this.gl.uniform1i(locations.uniforms.texture, 0);
      } else {
        this.gl.uniform1f(locations.uniforms.pointSize, object.pointSize);
        this.gl.uniform4fv(locations.uniforms.color, object.color);
      }

      // Compute the matrices
      let matrix = m3.projection(
        this.gl.canvas.clientWidth,
        this.gl.canvas.clientHeight
      );
      matrix = m3.translate(matrix, object.translation[0], object.translation[1]);
      matrix = m3.rotate(matrix, object.angleInRadians);
      matrix = m3.scale(matrix, object.scale[0], object.scale[1]);

      // positionMatrix
      this.gl.uniformMatrix3fv(locations.uniforms.matrix, false, matrix);

      // depth
      this.gl.uniform1f(locations.uniforms.depth, object.depth);

      this.gl.drawArrays(
        this.gl[object.primitiveType],
        0,
        object.positions.length / size
      );
    });
  }
}

function createPositionBuffer(gl, object) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.positions), gl.STATIC_DRAW);
  return positionBuffer;
}

function initTextureBuffer(gl, object) {
  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.texcoords), gl.STATIC_DRAW);

  return texcoordBuffer;
}
