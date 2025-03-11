import { Render } from "./render.js";

class System {
	static components = 5;

	constructor(count) {
		this.count = count;

		this.data = new Float32Array(System.components * Render.bytes * count);
	}

	// initialize particles

	init() {
		const { data, count } = this;

		for (let i = 0; i < count; i++) {
			const d = i * System.components;

			data[d + 0] = Math.random() * Render.canvas.width;
			data[d + 1] = Math.random() * Render.canvas.height;
			data[d + 2] = 0;
			data[d + 3] = 0;
			data[d + 4] = Math.random() * 10;
		}
	}

	// static methods

	draw(render) {
		const { gl, particleBuffer, vao } = render;

		// send data to buffer

		gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data);

		// draw particles

		gl.bindBuffer(gl.ARRAY_BUFFER, vao);
		gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, this.count);
	}
}

export { System };