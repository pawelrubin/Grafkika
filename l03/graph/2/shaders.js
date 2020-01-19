const vsSource = `
  attribute vec4 a_position;
  
  uniform mat4 u_matrix;
  uniform mat4 u_perspective;
  
  varying float v_fog_depth;

void main() {
  gl_Position = u_perspective * u_matrix * a_position;
  gl_PointSize = 2.0;
  v_fog_depth = -(u_matrix * a_position).z;
}
`;

const fsSource = `
  precision mediump float;
  
  varying float v_fog_depth;

  void main() {
    float fog_amount = smoothstep(1000.0, 5000.0, v_fog_depth);
    gl_FragColor = vec4(0.13, 0.22, 0.42, 1);
    gl_FragColor = mix(gl_FragColor, vec4(1, 1, 1, 1), fog_amount);
  }
`;
