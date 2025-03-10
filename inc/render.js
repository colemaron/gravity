import { GL } from "./gl.js";

class Render {
	constructor(canvas) {
		this.canvas = canvas;
		
		const gl = this.gl = new GL(canvas);

		// init gl

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		this.resize(canvas.width, canvas.height);
		this.clear();

		// init render

		const program = this.program = GL.createProgram()
	}

	// methods

	resize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.gl.viewport(0, 0, width, height);
	}

	clear() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);	
	}

	// drawing

	draw() {

	}
}

export { Render };