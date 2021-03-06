const simpleVertexShader = `
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

const simpleFragmentShader = `
  precision mediump float;
  
  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`;

const textureFragmentShader = `
  precision mediump float;
  
  varying vec2 v_texcoord;
 
  uniform sampler2D u_texture;
  // uniform vec4 u_color;

  void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;

const matrixVertexShader = `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;

  uniform mat3 u_matrix;
  uniform float u_depth;
  uniform float u_point_size;

  varying vec2 v_texcoord;

  void main() {
    // Multiply the position by the matrix
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, u_depth, 1);
    gl_PointSize = u_point_size;

    v_texcoord = a_texcoord;
  }
`;

export { simpleFragmentShader, simpleVertexShader, matrixVertexShader, textureFragmentShader};
