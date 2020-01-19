const vsSource = `
  attribute vec4 a_position;
  attribute vec3 a_normal;
  
  uniform mat4 u_matrix;
  uniform mat4 u_perspective;
  
  varying float v_fog_depth;
  varying vec3 v_normal;

  void main() {
    gl_Position = u_perspective * u_matrix * a_position;
    gl_PointSize = 4.0;
    v_fog_depth = -(u_matrix * a_position).z;
    v_normal = a_normal;
  }
`;

const fsSource = `
  precision mediump float;
  
  uniform vec3 u_reverse_light_direction;
  uniform float u_ambient;
  
  varying float v_fog_depth;
  varying vec3 v_normal;

  void main() {
    float fog_amount = smoothstep(1000.0, 5000.0, v_fog_depth);
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_reverse_light_direction);
    
    gl_FragColor = vec4(0.13, 0.22, 0.42, 1);
    gl_FragColor.rgb *= max(min(light + u_ambient, 1.5), u_ambient);
    gl_FragColor = mix(gl_FragColor, vec4(1, 1, 1, 1), fog_amount);
  }
`;