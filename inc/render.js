import { System } from "./system.js";

class Render {
	static bytes = Float32Array.BYTES_PER_ELEMENT;

	static verticies = [
		 0.0  ,  1.0,
		-0.866, -0.5,
		 0.866, -0.5,
	]

	constructor(canvas) {
		this.canvas = canvas;
		
		const gl = this.gl = canvas.getContext("webgl2");

		// init gl

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// init program

		const program = this.program = this.createProgram("vert.glsl", "frag.glsl");
		gl.useProgram(program);

		// init vao

		const vao = this.vao = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vao);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Render.verticies), gl.STATIC_DRAW);

		const vertexLocation = gl.getAttribLocation(program, "vertexPosition");
		gl.enableVertexAttribArray(vertexLocation);
		gl.vertexAttribPointer(vertexLocation, 2, gl.FLOAT, false, 0, 0);

		// init particle data

		const particleBuffer = this.particleBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

		const stride = System.components * Render.bytes;

		// init particle data

		const particlePositionIndex = 0; // xPos, yPos
		const particleLocation = gl.getAttribLocation(program, "particlePosition");
		gl.enableVertexAttribArray(particleLocation);
		gl.vertexAttribPointer(particleLocation, 2, gl.FLOAT, false, stride, particlePositionIndex * Render.bytes);
		gl.vertexAttribDivisor(particleLocation, 1);

		// const particleVelocityIndex = 2; // xVel, yVel
		// const particleVelocityLocation = gl.getAttribLocation(program, "particleVelocity");
		// gl.enableVertexAttribArray(particleVelocityLocation);
		// gl.vertexAttribPointer(particleVelocityLocation, 2, gl.FLOAT, false, stride, particleVelocityIndex * Render.bytes);
		// gl.vertexAttribDivisor(particleVelocityLocation, 1);

		const particleRadiusIndex = 4; // radius
		const particleRadiusAttributeLocation = gl.getAttribLocation(program, "radius");
		gl.enableVertexAttribArray(particleRadiusAttributeLocation);
		gl.vertexAttribPointer(particleRadiusAttributeLocation, 1, gl.FLOAT, false, stride, particleRadiusIndex * Render.bytes);
		gl.vertexAttribDivisor(particleRadiusAttributeLocation, 1);

		// init uniforms

		const resolutionLocation = gl.getUniformLocation(program, "resolution");
		gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
	}

	// gl helper methods

	loadShaderFile(name) {
		const response = new XMLHttpRequest();
		response.open("GET", `../shaders/${name}`, false);
		response.send(null);
	
		return response.responseText;
	}	

	createShader(type, source) {
		const { gl } = this;

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

	createProgram(vertexName, fragmentName) {
		const { gl } = this;

		const vertexSource = this.loadShaderFile(vertexName);
		const fragmentSource = this.loadShaderFile(fragmentName);

		const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
		const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);

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
}

export { Render };