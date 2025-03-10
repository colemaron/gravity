const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl2", {depth: true});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gl.viewport(0, 0, canvas.width, canvas.height);

// Vertex Shader
const vertexShaderSource =
	`#version 300 es
	precision mediump float;

	in vec2 vertexPosition;
	in vec2 circlePosition;
	in float radius;

	out vec2 io_vertexPosition;

	uniform vec2 resolution;

	void main() {
		vec2 scaled = (vertexPosition * radius) + circlePosition;
		vec2 clip = scaled / resolution * 2.0 - 1.0;

		gl_Position = vec4(clip, 0.0, 1.0);

		io_vertexPosition = vertexPosition;
	}
`;

// Fragment Shader
const fragmentShaderSource = 
	`#version 300 es
	precision mediump float;

	uniform vec4 color;

	in vec2 io_vertexPosition;

	out vec4 fragColor;

	void main() {
		float distance = length(io_vertexPosition);

		if (distance > 0.5) {
			discard;
		}

		fragColor = color;
	}
`;

// Compile Shaders and Create Program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

// Define Triangle Geometry
const verticies = [
	 0.0,    1.0,
	-0.866, -0.5,
	 0.866, -0.5,
];

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

// Define Circle Positions
const circleData = [
	0,   0,   10,
	100, 100, 20,
	200, 200, 30,
];

const circleBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleData), gl.STATIC_DRAW);

const circleElements = 3;
const stride = circleElements * Float32Array.BYTES_PER_ELEMENT;

// vertex positions

const positionAttributeLocation = gl.getAttribLocation(program, "vertexPosition");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// circle positions

const circlePositionAttributeLocation = gl.getAttribLocation(program, "circlePosition");
gl.enableVertexAttribArray(circlePositionAttributeLocation);
gl.vertexAttribPointer(circlePositionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.vertexAttribDivisor(circlePositionAttributeLocation, 1);

// Set Uniforms
const resolutionUniformLocation = gl.getUniformLocation(program, "resolution");
const colorUniformLocation = gl.getUniformLocation(program, "color");

gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
gl.uniform4f(colorUniformLocation, 1, 0, 0, 1); // Red color

// Draw Instanced Triangles
const numCircles = circleData.length / circleElements;
gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, numCircles);

// Helper Functions
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

