const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl2", {depth: true});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gl.viewport(0, 0, canvas.width, canvas.height);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// Vertex Shader
const vertexShaderSource =
	`#version 300 es
	precision lowp float;

	in vec2 vertexPosition;
	in vec2 circlePosition;
	in float radius;

	out vec2 io_vertexPosition;
	out float io_radius;
	out float io_halfRadius;

	uniform vec2 resolution;

	void main() {
		vec2 scaled = (vertexPosition * radius * 2.0) + circlePosition;
		vec2 clip = scaled / resolution * 2.0 - 1.0;

		gl_Position = vec4(clip, 0.0, 1.0);

		io_vertexPosition = vertexPosition;
		io_radius = radius;
		io_halfRadius = radius / 2.0;
	}`;

// Fragment Shader
const fragmentShaderSource = 
	`#version 300 es
	precision lowp float;

	in vec2 io_vertexPosition;
	in float io_radius;
	in float io_halfRadius;

	out vec4 fragColor;

	void main() {
		float distance = length(io_vertexPosition * io_radius);

		float alpha = 1.0 - smoothstep(io_halfRadius - 1.0, io_halfRadius, distance);
	
		fragColor = vec4(vec3(1.0), alpha);
	}`;

// Compile Shaders and Create Program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

// create vertex buffer

const verticies = [
	0.0,    1.0,
   -0.866, -0.5,
	0.866, -0.5,
];

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, "vertexPosition");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// create circle data buffer

// xPos, yPos, xVel, yVel, radius

const circleData = Array.from({ length: 10000 }, () => [
	Math.random() * canvas.width,
	Math.random() * canvas.height,
	0,
	0,
	Math.random() * 3 + 2
]).flat();

const circleBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleData), gl.DYNAMIC_DRAW);

const circleElements = 5;
const circleCount = circleData.length / circleElements;

const bytes = Float32Array.BYTES_PER_ELEMENT;
const stride = circleElements * bytes;

// circle data elements

const circlePositionAttributeLocation = gl.getAttribLocation(program, "circlePosition");
gl.enableVertexAttribArray(circlePositionAttributeLocation);
gl.vertexAttribPointer(circlePositionAttributeLocation, 2, gl.FLOAT, false, stride, 0);
gl.vertexAttribDivisor(circlePositionAttributeLocation, 1);

const circleRadiusAttributeLocation = gl.getAttribLocation(program, "radius");
gl.enableVertexAttribArray(circleRadiusAttributeLocation);
gl.vertexAttribPointer(circleRadiusAttributeLocation, 1, gl.FLOAT, false, stride, 4 * bytes); // skip xPos and yPos
gl.vertexAttribDivisor(circleRadiusAttributeLocation, 1);

// Set Uniforms
const resolutionUniformLocation = gl.getUniformLocation(program, "resolution");
gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

function drawCircles() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	// send array to buffer

	gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(circleData));

	// draw circles

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, circleCount);
}

setInterval(drawCircles, 0);

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

