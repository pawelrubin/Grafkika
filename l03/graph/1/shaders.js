const vsSource = `
  attribute vec4 a_position;
    
  uniform mat4 u_matrix;
  
  varying vec4 v_color;
  
  void main() {
    gl_Position = u_matrix * a_position;
    gl_PointSize = 2.0;
    v_color = vec4(0.13, 0.22, 0.42, 1);
  }
`;

const fsSource = `
  precision mediump float;
  varying vec4 v_color;
  
  void main() {
    gl_FragColor = v_color;
  }
`;
