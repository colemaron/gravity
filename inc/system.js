import { Render } from "./render.js";

class System {
	static threads = navigator.hardwareConcurrency;
	static components = 5;
	static g = 100;

	constructor(count, canvas) {
		// particle info

		this.count = count;
		this.data = new Float32Array(System.components * Render.bytes * count);

		// worker info

		this.completed = 0;
		this.workers = [];

		for (let i = 0; i < System.threads; i++) {
			this.workers.push(new Worker("./thread.js"));
		}

		// render info

		const render = this.render = new Render(canvas);

		render.init();
	}

	// initialize particles

	init() {
		const { canvas } = this.render;
		const { data, count } = this;

		const canvasMin = Math.min(canvas.width, canvas.height) / 2;

		for (let i = 0; i < count; i++) {
			const d = i * System.components;

			// 0 - xPos
			// 1 - yPos
			// 2 - xVel
			// 3 - yVel
			// 4 - mass

			const r = Math.random();
			const theta = Math.random() * 2 * Math.PI;

			const x = r * Math.cos(theta) * canvasMin;
			const y = r * Math.sin(theta) * canvasMin;

			data[d + 0] = x + canvas.width / 2;
			data[d + 1] = y + canvas.height / 2;

			data[d + 2] = -y * 0.5;
			data[d + 3] = x  * 0.5;

			data[d + 4] = Math.random() * 5 + 5;
		}
	}

	// update all particles

	physics(dt) {
		const { data, count, components, threads, g } = this;

		const size = Math.ceil(count / System.threads);

		this.workers.forEach((worker, i) => {
			const start = i * size;
			const end = Math.min(start + size, count);
			const slice = data.slice(start * components, end * components);

			console.log(end - start);

			worker.postMessage({
				data: slice,
				count: end - start,
				components,
				dt,
				g
			});

			worker.onmessage = event => {
				data.set(event.data, start * components);

				this.completed++;

				if (this.completed === threads) {
					this.workers.forEach(worker => worker.terminate());
					this.completed = 0;
				}
			}
		})
	}

	// draw all particles

	draw() {
		const { gl, particleBuffer, vao } = this.render;

		// send data to buffer

		gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data);

		// draw particles

		gl.bindBuffer(gl.ARRAY_BUFFER, vao);
		gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, this.count);
	}
}

export { System };